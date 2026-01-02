"use client";

import {
  useCallback,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

type CardDetail = {
  label: string;
  value: ReactNode;
};

const details: CardDetail[] = [
  { label: "First Name", value: "Scott" },
  { label: "Last Name", value: "Zaleski" },
];

// Message template includes placeholders users can fill before sending
const messageTemplate = `Hey Scott - this is [Your Name] ([Your Email]). I would love to connect about marketing with energy mastery and see how we might work together.

Do you have 15 minutes this week for a quick call? Happy to work around your schedule.`;

const smsRecipient = "+17084917521";

const canUseSmsLinks = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const buildSmsUrl = (message: string) => {
  if (typeof navigator === "undefined") {
    return null;
  }

  const userAgent = navigator.userAgent || "";
  const isIos =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (userAgent.includes("Mac") && navigator.maxTouchPoints > 1);
  const separator = isIos ? "&" : "?";
  const encodedMessage = encodeURIComponent(message);

  return `sms:${smsRecipient}${separator}body=${encodedMessage}`;
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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [showSmsPrompt, setShowSmsPrompt] = useState(false);
  const [smsPrompting, setSmsPrompting] = useState(false);
  const [editableMessage, setEditableMessage] = useState<string>(messageTemplate);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [smsCopied, setSmsCopied] = useState<boolean>(false);

  const handleSaveContact = useCallback(
    async (event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      const downloadContactCardViaFetch = async () => {
        try {
          const res = await fetch("/scott-zaleski.vcf");
          if (!res.ok) {
            // Fallback to a simple link download if fetch fails
            initiateDownload("/scott-zaleski.vcf", "scott-zaleski.vcf");
            return;
          }

          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          initiateDownload(url, "scott-zaleski.vcf");
          // Revoke after a brief delay to ensure the download starts
          setTimeout(() => URL.revokeObjectURL(url), 3000);
        } catch (e) {
          initiateDownload("/scott-zaleski.vcf", "scott-zaleski.vcf");
        }
      };

      await downloadContactCardViaFetch();
      setSaveStatus("saved");

      // On mobile: try to open the SMS composer immediately (user gesture), with a short fallback to a manual prompt/modal
      if (canUseSmsLinks()) {
        setEditableMessage(messageTemplate);

        const finalMessage = messageTemplate;
        const encoded = encodeURIComponent(finalMessage);
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
        const isIos = /iPad|iPhone|iPod/.test(userAgent) || (userAgent.includes('Mac') && (navigator as any).maxTouchPoints > 1);
        const urls = [
          `sms:${smsRecipient}${isIos ? '&' : '?'}body=${encoded}`,
          `sms:${smsRecipient}?body=${encoded}`,
          `smsto:${smsRecipient}?body=${encoded}`,
        ];

        // Indicate we're attempting to open the messaging app
        setSmsPrompting(true);

        // Try each URL by creating an anchor and assigning location
        (async () => {
          let opened = false;
          for (const url of urls) {
            try {
              const a = document.createElement('a');
              a.href = url;
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);

              // Also try location assignment
              try {
                window.location.href = url;
              } catch (e) {
                // ignore
              }

              opened = true;
              break;
            } catch (e) {
              // ignore and try next
            }
          }

          // Wait briefly to see whether the messaging app opened; if it didn't, show the manual prompt
          setTimeout(() => {
            setSmsPrompting(false);
            // If the page is still visible, show the modal to let user edit/copy/send manually
            setShowSmsPrompt(true);
          }, 1200);
        })();
      }
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
          onClick={handleSaveContact}
        >
          Save Contact
        </a>

        {/* Status message: contact saved */}
        {saveStatus === "saved" && (
          <div>
            <p className="mt-3 text-center text-sm text-[var(--muted)]">
              Contact saved to your device.
            </p>
            {smsPrompting && (
              <p className="mt-2 text-center text-sm text-[var(--muted)]">
                Opening your messaging app with the template…
              </p>
            )}
            {smsCopied && (
              <p className="mt-2 text-center text-sm text-[var(--muted)]">
                Message copied to clipboard — open your messaging app and paste it into a new message.
              </p>
            )}
          </div>
        )}

        {/* SMS prompt modal for mobile devices - only shown after save */}
        {showSmsPrompt && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/50 p-4"
          >
            <div className="w-full max-w-sm rounded-xl bg-white/5 p-6 text-white">
              <h3 className="mb-3 text-lg font-semibold">Contact saved</h3>
              <p className="mb-3 text-sm text-[var(--muted)]">
                The contact was saved. Edit your message below and add your name and email, then open your messaging app.
              </p>

              <label className="block mb-2 text-sm text-[var(--muted)]">
                Your name
              </label>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="mb-3 w-full rounded-md bg-black/20 p-2 text-sm text-white"
              />

              <label className="block mb-2 text-sm text-[var(--muted)]">
                Your email
              </label>
              <input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@example.com"
                className="mb-3 w-full rounded-md bg-black/20 p-2 text-sm text-white"
              />

              <label className="sr-only" htmlFor="sms-template">
                Message template
              </label>
              <textarea
                id="sms-template"
                value={editableMessage}
                onChange={(e) => setEditableMessage(e.target.value)}
                className="mb-4 h-28 w-full resize-none rounded-md bg-black/20 p-3 text-sm text-white"
              />

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-[linear-gradient(120deg,var(--accent),var(--accent-lime))] px-4 py-2 font-semibold text-[#1c1f00]"
                  onClick={async () => {
                    // Replace placeholders with entered values (or leave placeholders if blank)
                    const finalMessage = editableMessage
                      .replace(/\[Your Name\]/g, userName || "[Your Name]")
                      .replace(/\[Your Email\]/g, userEmail || "[Your Email]");

                    // Build a few possible sms URL variations and try them
                    const encoded = encodeURIComponent(finalMessage);
                    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
                    const isIos = /iPad|iPhone|iPod/.test(userAgent) || (userAgent.includes('Mac') && (navigator as any).maxTouchPoints > 1);

                    const urls = [
                      // Preferred: platform-aware separator
                      `sms:${smsRecipient}${isIos ? '&' : '?'}body=${encoded}`,
                      // Common forms
                      `sms:${smsRecipient}?body=${encoded}`,
                      `smsto:${smsRecipient}?body=${encoded}`,
                    ];

                    console.debug('Attempting SMS URLs:', urls, 'message:', finalMessage);

                    // Try each URL (anchor click + href assignment)
                    let opened = false;
                    for (const url of urls) {
                      try {
                        const a = document.createElement('a');
                        a.href = url;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        // Also set location as a fallback
                        window.location.href = url;
                        opened = true;
                        break;
                      } catch (e) {
                        // ignore and try next
                      }
                    }

                    // If the phone did not open an SMS composer (or in some browsers), copy the message to the clipboard as a fallback
                    setShowSmsPrompt(false);
                    try {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        await navigator.clipboard.writeText(finalMessage);
                        // Show a small UI hint that message was copied
                        setSmsCopied(true);
                      } else {
                        setSmsCopied(true);
                      }
                    } catch (e) {
                      setSmsCopied(true);
                    }
                  }}
                >
                  Send Message
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-white/5 px-4 py-2 font-semibold text-[var(--muted)]"
                  onClick={() => setShowSmsPrompt(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
