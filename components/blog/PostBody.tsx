import Link from "next/link";
import { parseBody, parseInline } from "@/lib/blog";

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((part, i) => {
        if (part.type === "text") return part.text;
        const className = "font-semibold text-hf-red underline underline-offset-2 hover:text-hf-ink";
        return part.href.startsWith("/") ? (
          <Link key={i} href={part.href} className={className}>
            {part.text}
          </Link>
        ) : (
          <a key={i} href={part.href} className={className} rel="noopener">
            {part.text}
          </a>
        );
      })}
    </>
  );
}

export default function PostBody({ body }: { body: string }) {
  return (
    <div className="space-y-5 text-lg leading-relaxed text-hf-body">
      {parseBody(body).map((block, i) => {
        if (block.type === "h2") {
          return (
            <h2 key={i} className="pt-4 font-hf-heading text-2xl font-semibold text-hf-ink sm:text-3xl">
              {block.text}
            </h2>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-disc space-y-2 pl-6">
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
