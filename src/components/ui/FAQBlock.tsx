"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { clsx } from "clsx";

export type FaqItem = { question: string; answer: string };

/**
 * Accordion FAQ. One question expanded at a time; plus icon rotates to an X
 * (reads as minus-adjacent) on expand. FAQPage JSON-LD is emitted at the page
 * level, not here.
 */
export function FAQBlock({
  items,
  dark = false,
}: {
  items: FaqItem[];
  dark?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className={clsx(
        "divide-y rounded-xl border",
        dark
          ? "divide-viz-border border-viz-border bg-viz-ink-raised/50"
          : "divide-ink/8 border-ink/8 bg-papyrus",
      )}
    >
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className={clsx(
                "flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-foil",
                dark ? "text-papyrus" : "text-ink",
              )}
            >
              <span className="text-h4">{item.question}</span>
              <Plus
                size={18}
                className={clsx(
                  "shrink-0 text-foil-dark transition-transform duration-200",
                  open && "rotate-45",
                )}
                aria-hidden
              />
            </button>
            <div
              className={clsx(
                "grid transition-all duration-200",
                open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden px-5">
                <p
                  className={clsx(
                    "text-body-sm",
                    dark ? "text-fog" : "text-slate",
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
