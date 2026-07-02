import Link from "next/link";
import foundersData from "../../../data/founders.json";
import { AiOrDieMetrics } from "@/components/case-studies/AiOrDieMetrics";

type Founder = {
  id: string;
  name: string;
  role: string;
  coRole: string;
  bio: string;
  photoUrl: string;
  linkedIn: string;
  x: string;
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export function FounderProfile({
  founder,
  dark = false,
}: {
  founder: Founder;
  dark?: boolean;
}) {
  return (
    <article className="flex items-start gap-5">
      {/* Monogram avatar until portrait assets land (NEXT-STEPS.md). */}
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #e5c88e, #c4a365 75%)",
          color: "#0f172a",
        }}
        aria-hidden
      >
        {initials(founder.name)}
      </div>
      <div>
        <h3
          className={`text-h3 font-(family-name:--font-display) font-bold ${dark ? "text-papyrus" : "text-ink"}`}
        >
          {founder.name}
        </h3>
        <p className={`text-body-sm mt-0.5 ${dark ? "text-fog" : "text-slate"}`}>
          {founder.role} · {founder.coRole}
        </p>
        <p className={`text-body-sm mt-2 ${dark ? "text-fog" : "text-slate"}`}>
          {founder.bio}
        </p>
        <p className="mt-2 flex gap-4">
          <a
            href={founder.linkedIn}
            rel="me noopener noreferrer"
            target="_blank"
            className="text-caption text-signal underline underline-offset-2 hover:decoration-foil"
          >
            LinkedIn
            <span className="sr-only">{founder.name} on LinkedIn</span>
          </a>
          <a
            href={founder.x}
            rel="me noopener noreferrer"
            target="_blank"
            className="text-caption text-signal underline underline-offset-2 hover:decoration-foil"
          >
            X<span className="sr-only">{founder.name} on X</span>
          </a>
        </p>
      </div>
    </article>
  );
}

/**
 * Founder anchor: Brett + Mike profiles beside the AI or Die live metrics
 * module. Light section; the metrics chart inside is the dark surface.
 */
export function FounderAnchorLive({
  showCta = true,
}: {
  showCta?: boolean;
}) {
  const founders = Object.values(
    foundersData as unknown as Record<string, Founder | string>,
  ).filter(
    (f): f is Founder => typeof f === "object" && f !== null && "name" in f,
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-8">
        {founders.map((f) => (
          <FounderProfile key={f.id} founder={f} />
        ))}
        <blockquote className="border-l-2 border-foil pl-5">
          <p className="text-pullquote text-ink">
            We ran the method on ourselves before selling it to anyone.
          </p>
          <cite className="text-caption mt-2 block text-slate not-italic">
            Brett + Mike
          </cite>
        </blockquote>
        {showCta && (
          <Link
            href="/founders/"
            className="inline-block font-semibold text-signal underline decoration-foil underline-offset-4 hover:text-signal-dark"
          >
            See the founder graph →
          </Link>
        )}
      </div>
      <div>
        <AiOrDieMetrics variant="full" />
      </div>
    </div>
  );
}
