/**
 * Public: upload a payment receipt for an order. Requires the order id and
 * its access token (from the invoice link). Stores the file in R2 and
 * records a pending payment_proofs row (optionally with a transaction
 * reference). A bare reference without a file is also accepted.
 */
import { json, type OrderRow } from "./_util";

interface Env {
  DB: D1Database;
  RECEIPTS: R2Bucket;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_PROOFS_PER_ORDER = 10;

// Magic-byte check so a renamed .exe can't pass as an image.
function sniff(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  )
    return "image/webp";
  return null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid upload." }, 400);
  }

  const orderId = String(form.get("orderId") ?? "");
  const token = String(form.get("token") ?? "");
  const txnRef = String(form.get("txnRef") ?? "").trim().slice(0, 100) || null;
  const file = form.get("file");

  const order = await env.DB.prepare(`SELECT id, access_token, status FROM orders WHERE id = ?`)
    .bind(orderId)
    .first<Pick<OrderRow, "id" | "access_token" | "status">>();
  if (!order || !token || order.access_token !== token) {
    return json({ ok: false, error: "Order not found." }, 404);
  }
  if (order.status === "declined" || order.status === "completed") {
    return json({ ok: false, error: "This order is closed." }, 400);
  }

  const hasFile = file instanceof File && file.size > 0;
  if (!hasFile && !txnRef) {
    return json({ ok: false, error: "Upload a receipt or enter the transaction reference." }, 400);
  }

  const count = await env.DB.prepare(`SELECT COUNT(*) AS c FROM payment_proofs WHERE order_id = ?`)
    .bind(orderId)
    .first<{ c: number }>();
  if ((count?.c ?? 0) >= MAX_PROOFS_PER_ORDER) {
    return json({ ok: false, error: "Too many submissions for this order. Please contact us." }, 429);
  }

  let key: string | null = null;
  if (hasFile) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return json({ ok: false, error: "Unsupported file type." }, 400);
    }
    if (file.size > MAX_FILE_BYTES) {
      return json({ ok: false, error: "File is too large (max 8MB)." }, 400);
    }
    const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const sniffed = sniff(head);
    if (!sniffed) return json({ ok: false, error: "File content isn't a valid image or PDF." }, 400);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
    key = `${orderId}/${crypto.randomUUID()}-${safeName}`;
    await env.RECEIPTS.put(key, file, { httpMetadata: { contentType: sniffed } });
  }

  await env.DB.prepare(
    `INSERT INTO payment_proofs (id, order_id, receipt_key, txn_ref) VALUES (?, ?, ?, ?)`,
  )
    .bind(crypto.randomUUID(), orderId, key, txnRef)
    .run();

  return json({ ok: true });
};
