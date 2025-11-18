"use client";

import { useCallback, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

type CardDetail = {
  label: string;
  value: ReactNode;
};

const details: CardDetail[] = [
  { label: "First Name", value: "Scott" },
  { label: "Last Name", value: "Zaleski" },
];

const formatDateForICalendar = (date: Date) =>
  date.toISOString().split("T")[0]?.replace(/-/g, "");

const formatDateTimeForICalendar = (date: Date) =>
  date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const buildCalendarInvite = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ScottZ//ContactCard//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${formatDateTimeForICalendar(now)}@scottzaleski.com`,
    `DTSTAMP:${formatDateTimeForICalendar(now)}`,
    `DTSTART;VALUE=DATE:${formatDateForICalendar(start)}`,
    `DTEND;VALUE=DATE:${formatDateForICalendar(end)}`,
    "SUMMARY:Follow up with Scott Zaleski",
    "DESCRIPTION:Reserve time to connect with Scott about marketing with energy mastery.",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
};

const initiateDownload = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Home() {
  const handleSaveContactAndEvent = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      initiateDownload("/scott-zaleski.vcf", "scott-zaleski.vcf");

      const calendarUrl = URL.createObjectURL(
        new Blob([buildCalendarInvite()], { type: "text/calendar" })
      );

      initiateDownload(calendarUrl, "follow-up-with-scott.ics");
      setTimeout(() => URL.revokeObjectURL(calendarUrl), 0);
    },
    []
  );

  return (
    <div className="stage flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="card-glow" />
      <main className="glass-card relative z-10 w-full max-w-sm px-7 py-8 text-white sm:max-w-md">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--muted)]">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 accent-text-gradient">
            Powered by <span className="font-semibold text-white">Earth</span>
          </span>
        </div>

        <header className="mb-6 flex flex-col gap-1">
          <h1 className="text-[2.3rem] font-semibold leading-tight text-white">
            Scott <span className="accent-text-gradient">Zaleski</span>
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
          className="animate-jiggle mt-6 block w-full rounded-lg bg-[linear-gradient(120deg,var(--accent),var(--accent-lime),var(--accent-gold))] px-6 py-3 text-center text-base font-semibold text-[#1c1f00] shadow-[0_15px_35px_rgba(255,210,76,0.45)] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          href="/scott-zaleski.vcf"
          download
          onClick={handleSaveContactAndEvent}
        >
          Save Contact + Calendar Reminder
        </a>

        <footer className="mt-4 space-y-1 text-center text-[0.72rem] uppercase tracking-[0.35em] text-[var(--muted)]">
          <p>
            Business powered by <span className="accent-text-gradient">Earth</span>
          </p>
          <p>Relationships built to last, the American Way.</p>
        </footer>
      </main>
    </div>
  );
}
