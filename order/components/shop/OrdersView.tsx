"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STATUS_LABEL, fetchOrder, money, type OrderStatus } from "@/lib/api";
import { orderHref, readRecentOrders, type RecentOrder } from "@/lib/recentOrders";
import { Icon } from "./ui";

/** Orders tab: orders placed from this device, with their live status. */
export default function OrdersView() {
  const [orders, setOrders] = useState<RecentOrder[] | null>(null);
  const [status, setStatus] = useState<Record<string, OrderStatus>>({});

  useEffect(() => {
    const t = setTimeout(() => {
      const list = readRecentOrders();
      setOrders(list);
      list.forEach((o) =>
        fetchOrder(o.id, o.token).then((r) => {
          if (r.ok) setStatus((s) => ({ ...s, [o.id]: r.order.status }));
        }),
      );
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-dvh bg-white pb-28">
      <div className="mx-auto max-w-md px-5 pt-6 md:max-w-lg">
        <h1 className="text-[1.75rem] font-bold text-night">My Orders</h1>
        <p className="mt-1 text-sm text-muted">Orders placed on this device.</p>

        {orders && orders.length === 0 && (
          <div className="mt-16 text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-surface text-night/40">{Icon.receipt}</span>
            <p className="mt-5 font-semibold text-night">No orders yet</p>
            <p className="mt-1 text-sm text-muted">Your order links also arrive in your invoice email.</p>
          </div>
        )}

        <ul className="mt-6 space-y-3">
          {orders?.map((o) => {
            const s = status[o.id];
            return (
              <li key={o.id}>
                <Link href={orderHref(o)} className="flex items-center gap-4 rounded-3xl bg-surface p-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-night">{Icon.receipt}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-night">{o.id}</span>
                    <span className="block text-xs text-muted">
                      {new Date(o.placedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })} · {money(o.total)}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
                      s === "ready" || s === "completed" || s === "payment_received"
                        ? "bg-brand-soft text-brand-dark"
                        : s === "declined" || s === "payment_failed"
                          ? "bg-chilli/10 text-chilli"
                          : "bg-white text-night/70"
                    }`}
                  >
                    {s ? STATUS_LABEL[s].split(" — ")[0] : "…"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
