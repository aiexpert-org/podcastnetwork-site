import Link from "next/link";
import { clsx } from "clsx";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "dark-primary" | "dark-ghost";
  size?: "md" | "lg";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-solar text-ink font-semibold hover:bg-ink hover:text-white transition-colors",
  secondary:
    "border border-signal text-signal font-semibold hover:bg-signal hover:text-papyrus transition-colors",
  ghost:
    "text-slate font-medium hover:text-ink underline-offset-4 hover:underline decoration-solar",
  "dark-primary":
    "bg-solar text-ink font-semibold hover:bg-white transition-colors",
  "dark-ghost":
    "text-fog font-medium hover:text-papyrus underline-offset-4 hover:underline decoration-foil",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "px-5 py-3 text-[1.0625rem]",
  lg: "px-7 py-3.5 text-lg",
};

export function Button({
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  className,
  children,
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foil disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
