import Link from "next/link";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Privacy Policy | DearMate",
  description: "Privacy Policy for DearMate — how we collect, use, and protect your data.",
};

const EFFECTIVE_DATE = "May 10, 2025";
const CONTACT_EMAIL = "support@dearmate.mom";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F3EADF] text-[#241C18]">
      <Navbar />
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#8A7168] transition hover:text-[#C8553D]"
        >
          ← Back to DearMate
        </Link>

        <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[#8A7168]">Effective date: {EFFECTIVE_DATE}</p>

        <div className="mt-10 space-y-8 leading-7 text-[#4A3A34]">

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">1. Overview</h2>
            <p>
              DearMate (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your
              privacy. This Privacy Policy describes what personal data we collect, how we use it,
              and your rights regarding that data. It applies to all users of{" "}
              <strong>dearmate.mom</strong> and any associated applications.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">2. Data We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-[#241C18]">Account information</h3>
                <p>
                  When you sign in with Google OAuth, we receive your name, email address, and
                  profile picture URL from Google. We store your email and display name to identify
                  your account.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#241C18]">Conversation data</h3>
                <p>
                  Messages you send to AI characters are stored to provide conversation history and
                  personalised memory features. Message content is processed by third-party AI
                  providers (see Section 5).
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#241C18]">Usage data</h3>
                <p>
                  We may collect standard server logs including IP addresses, browser type, pages
                  visited, and timestamps. This data is used for security monitoring and service
                  improvement.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#241C18]">Payment data</h3>
                <p>
                  Payments are processed by Creem. We do not store your credit card number or full
                  payment details. We receive a transaction record and subscription status from
                  Creem.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">3. How We Use Your Data</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>To authenticate you and manage your account.</li>
              <li>To deliver the AI companion conversation experience.</li>
              <li>To maintain conversation memory and personalisation.</li>
              <li>To process payments and manage subscriptions.</li>
              <li>To detect and prevent abuse, fraud, or policy violations.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data to third parties. We do not use your conversation
              data for advertising.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">4. Legal Basis (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA) or United Kingdom, we process
              your data on the following legal bases:
            </p>
            <ul className="list-disc space-y-2 pl-5 mt-3">
              <li>
                <strong>Contract</strong> — processing necessary to provide the Service you have
                subscribed to.
              </li>
              <li>
                <strong>Legitimate interests</strong> — security monitoring, fraud prevention, and
                service improvement.
              </li>
              <li>
                <strong>Legal obligation</strong> — compliance with applicable laws.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">
              5. Third-Party AI Providers
            </h2>
            <p className="mb-3">
              To generate AI responses, voice, and images, your messages are sent to the following
              third-party providers. Each provider has its own privacy policy:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>DeepSeek</strong> — text generation (
                <a
                  href="https://www.deepseek.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C8553D] underline underline-offset-2"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong>MiniMax</strong> — voice synthesis and AI chat (
                <a
                  href="https://www.minimaxi.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C8553D] underline underline-offset-2"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong>Jina AI / Seedream</strong> — image generation
              </li>
            </ul>
            <p className="mt-3">
              We share only the minimum data necessary (your message text) with these providers.
              We do not share your name, email, or account identifiers with AI providers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">6. Data Retention</h2>
            <p>
              We retain your account data and conversation history for as long as your account is
              active. If you delete your account, we will delete your personal data within 30 days,
              except where retention is required by law. Anonymised usage statistics may be retained
              indefinitely.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">7. Your Rights</h2>
            <p className="mb-3">
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Access</strong> — request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong>Rectification</strong> — ask us to correct inaccurate data.
              </li>
              <li>
                <strong>Erasure</strong> — request deletion of your personal data (&ldquo;right to
                be forgotten&rdquo;).
              </li>
              <li>
                <strong>Portability</strong> — receive your data in a machine-readable format.
              </li>
              <li>
                <strong>Objection</strong> — object to processing based on legitimate interests.
              </li>
              <li>
                <strong>CCPA (California residents)</strong> — you have the right to know, delete,
                and opt out of the sale of your personal information. We do not sell personal
                information.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#C8553D] underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">8. Cookies</h2>
            <p>
              We use session cookies strictly necessary for authentication (to keep you logged in).
              We do not use tracking cookies or third-party advertising cookies. No cookie consent
              banner is required for strictly necessary cookies under the ePrivacy Directive.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">9. Security</h2>
            <p>
              We use industry-standard measures to protect your data, including encrypted
              connections (TLS), hashed session tokens, and access controls on our database. No
              method of transmission over the Internet is 100% secure; we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">
              10. International Transfers
            </h2>
            <p>
              Your data may be processed in countries outside your own, including the United States
              and China (where some AI providers operate). Where required, we rely on Standard
              Contractual Clauses or equivalent mechanisms to ensure adequate protection.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">11. Children</h2>
            <p>
              The Service is not directed at children under 18. We do not knowingly collect
              personal data from minors. If you believe a minor has provided us with personal data,
              please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">12. Changes to Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              communicated by email or in-app notice at least 14 days before taking effect. The
              updated policy will be available at{" "}
              <strong>dearmate.mom/privacy</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">13. Contact</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact our privacy team
              at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#C8553D] underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
