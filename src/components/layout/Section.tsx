import { clsx } from "clsx";
import { Container } from "./Container";

/**
 * Standard page section. Dark sections render full-bleed on Ink ground per
 * the hybrid palette rule (dark panels are always full-bleed, never floating
 * cards), separated by a solid border + generous vertical padding.
 */
export function Section({
  children,
  className,
  dark = false,
  wide = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  wide?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={clsx(
        "py-20 md:py-24",
        dark
          ? "bg-viz-ink text-papyrus border-y border-viz-border"
          : "bg-vellum text-ink",
        className,
      )}
    >
      <Container wide={wide}>{children}</Container>
    </section>
  );
}
