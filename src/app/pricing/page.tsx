import Link from "next/link";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Pricing | DearMate",
  description: "Simple, transparent pricing for DearMate AI companion.",
};

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-[#C8553D]"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const FREE_FEATURES = [
  "30 messages per day",
  "Text chat with all 4 characters",
  "Basic conversation memory",
  "Google account login",
];

const PRO_FEATURES = [
  "Unlimited messages",
  "Text chat with all 4 characters",
  "Full conversation memory",
  "AI voice messages",
  "AI-generated selfie photos",
  "Priority support",
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F3EADF] text-[#241C18]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#8A7168] transition hover:text-[#C8553D]"
        >
          ← Back to DearMate
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple, honest pricing
          </h1>
          <p className="mt-4 text-lg text-[#6F5A52]">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {/* Free plan */}
          <div className="flex flex-col rounded-[28px] border border-[#D8C4B8] bg-white/60 p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8A7168]">
                Free
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-semibold">$0</span>
                <span className="text-[#8A7168]">/month</span>
              </div>
              <p className="mt-2 text-sm text-[#8A7168]">No credit card required.</p>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-[#C8553D]/40 px-7 text-sm font-semibold text-[#C8553D] transition hover:border-[#C8553D] hover:bg-[#C8553D]/5"
            >
              Get started free
            </Link>
          </div>

          {/* Pro plan */}
          <div className="flex flex-col rounded-[28px] bg-[#241C18] p-8 text-white shadow-[0_24px_70px_rgba(36,28,24,0.22)]">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
                  Pro
                </p>
                <span className="rounded-full bg-[#C8553D] px-2.5 py-0.5 text-xs font-semibold text-white">
                  Most popular
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-semibold">$9.99</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="mt-2 text-sm text-white/50">
                Or <strong className="text-white/80">$79.99/year</strong> — save 33%
              </p>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
                  <svg
                    className="h-5 w-5 shrink-0 text-[#C8553D]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#C8553D] px-7 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(200,85,61,0.35)] transition hover:bg-[#B94C37]"
            >
              Start Pro — $9.99/mo
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
          <div className="mt-8 space-y-6 divide-y divide-[#D8C4B8]">
            {[
              {
                q: "Is DearMate appropriate for all audiences?",
                a: "DearMate is designed for users aged 18 and over. All content is suitable for adults and the platform strictly prohibits any explicit or sexually suggestive material.",
              },
              {
                q: "Can I cancel my subscription at any time?",
                a: "Yes. You can cancel your Pro subscription at any time from your account settings. You will continue to have access until the end of the billing period.",
              },
              {
                q: "Is my conversation data private?",
                a: "Yes. We do not sell your data or use conversations for advertising. Message content is processed by AI providers solely to generate responses. See our Privacy Policy for full details.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept all major credit and debit cards, as well as SEPA bank transfers and popular digital wallets, via our payment processor Creem.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a full refund within 7 days of your first Pro subscription charge if you are not satisfied. Contact support@dearmate.mom.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="pt-6">
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-2 text-sm leading-7 text-[#6F5A52]">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-sm text-[#8A7168]">
          Questions?{" "}
          <a
            href="mailto:support@dearmate.mom"
            className="text-[#C8553D] underline underline-offset-2"
          >
            support@dearmate.mom
          </a>
        </p>
      </div>
    </main>
  );
}
