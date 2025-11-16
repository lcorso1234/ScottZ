import type { ReactNode } from "react";

type CardDetail = {
  label: string;
  value: ReactNode;
};

const details: CardDetail[] = [
  { label: "First Name", value: "Scott" },
  { label: "Last Name", value: "Zaleski" },
  { label: "AKA", value: "Z" },
  { label: "Company", value: "Steam Marketing" },
  {
    label: "Phone",
    value: (
      <a
        className="text-white transition-colors hover:text-[var(--accent)]"
        href="tel:+17732161427"
      >
        1.773.216.1427
      </a>
    ),
  },
];

export default function Home() {
  return (
    <div className="stage flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="card-glow" />
      <main className="glass-card relative z-10 w-full max-w-sm px-7 py-8 text-white sm:max-w-md">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--muted)]">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-[var(--accent)]">
            Powered by <span className="font-semibold text-white">Earth</span>
          </span>
        </div>

        <header className="mb-6 flex flex-col gap-1">
          <p className="text-[0.8rem] uppercase tracking-[0.4em] text-[var(--muted)]">
            Steam Marketing
          </p>
          <p className="text-[0.72rem] uppercase tracking-[0.4em] text-[var(--accent)]">
            aka Z
          </p>
          <h1 className="text-[2.3rem] font-semibold leading-tight text-white">
            Scott <span className="text-[var(--accent)]">Zaleski</span>
          </h1>
        </header>

        <section
          aria-label="Notes"
          className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/50"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[var(--muted)]">
            Note
          </p>
          <p className="mt-2 text-lg font-medium">Marketing with energy mastery</p>
          <p className="text-sm text-[var(--muted)]">Author of Low Pressure Sales</p>
        </section>

        <section aria-label="Contact details" className="space-y-4">
          <dl className="space-y-4">
            {details.map((detail) => (
              <div key={detail.label} className="border-b border-white/5 pb-3">
                <dt className="text-[0.68rem] uppercase tracking-[0.35em] text-[var(--muted)]">
                  {detail.label}
                </dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-white">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <a
          className="animate-jiggle mt-6 block w-full rounded-lg bg-[#39ff14] px-6 py-3 text-center text-base font-semibold text-[#0d2a0a] shadow-[0_15px_35px_rgba(57,255,20,0.5)] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff14]"
          href="/scott-zaleski.vcf"
          download
        >
          Save Contact
        </a>

        <footer className="mt-4 space-y-1 text-center text-[0.72rem] uppercase tracking-[0.35em] text-[var(--muted)]">
          <p>
            Business powered by <span className="text-[var(--accent)]">Earth</span>
          </p>
          <p>Relationships built to last, the American Way.</p>
        </footer>
      </main>
    </div>
  );
}
