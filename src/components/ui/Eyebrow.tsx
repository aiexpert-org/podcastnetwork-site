import { clsx } from "clsx";

/**
 * Section eyebrow: uppercase, tracked wide, Foil. On dark viz surfaces pass
 * className to keep Foil (it passes AA on Ink); on light ground Foil is
 * reserved for eyebrow-size display accents per the palette lock.
 */
export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag className={clsx("text-eyebrow text-foil-dark", className)}>
      {children}
    </Tag>
  );
}
