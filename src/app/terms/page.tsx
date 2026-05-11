import Link from "next/link";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Terms of Service | DearMate",
  description: "Terms of Service for DearMate — AI companion app.",
};

const EFFECTIVE_DATE = "May 10, 2025";
const CONTACT_EMAIL = "support@dearmate.mom";

export default function TermsPage() {
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

        <h1 className="text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-[#8A7168]">Effective date: {EFFECTIVE_DATE}</p>

        <div className="mt-10 space-y-8 leading-7 text-[#4A3A34]">

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using DearMate ("the Service"), you agree to be bound by these Terms
              of Service. If you do not agree, do not use the Service. DearMate is operated by
              DearMate (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">2. Description of Service</h2>
            <p>
              DearMate provides an AI-powered companion chat experience featuring fictional
              characters. The Service uses third-party AI models to generate text, synthesised
              voice, and stylised images. All characters and interactions are entirely fictional and
              for entertainment purposes only. DearMate does not provide real human companionship,
              psychological counselling, or any regulated service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">3. Eligibility</h2>
            <p>
              You must be at least <strong>18 years old</strong> to use the Service. By creating an
              account you represent and warrant that you meet this age requirement. We reserve the
              right to terminate accounts where we have reason to believe this requirement is not
              met.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">
              4. Acceptable Use Policy
            </h2>
            <p className="mb-3">
              You agree to use the Service only for lawful, personal, and non-commercial purposes.
              The following are <strong>strictly prohibited</strong>:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Generating, requesting, or attempting to elicit any sexually explicit, pornographic,
                or adult (NSFW) content of any kind — including text, images, or voice.
              </li>
              <li>
                Attempting to circumvent, bypass, or manipulate the content-moderation systems of
                the Service or any underlying AI provider.
              </li>
              <li>
                Using the Service to harass, threaten, or harm any real person.
              </li>
              <li>
                Impersonating any person or entity, or creating accounts under false pretences.
              </li>
              <li>
                Scraping, reverse-engineering, or reproducing the Service&apos;s content or models
                without written permission.
              </li>
              <li>
                Using the Service for any commercial purpose, including reselling, sublicensing, or
                building derivative products, without our prior written consent.
              </li>
              <li>
                Uploading or transmitting malicious code, viruses, or harmful data.
              </li>
            </ul>
            <p className="mt-3">
              Violations may result in immediate account suspension without refund and, where
              applicable, reporting to law enforcement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">5. AI-Generated Content</h2>
            <p className="mb-3">
              The Service relies on third-party large language models, image-generation models, and
              text-to-speech models. While we apply content filtering and moderation measures, AI
              outputs may occasionally be unexpected, inaccurate, or inconsistent. You acknowledge
              that:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>All generated content is fictional and does not reflect real persons or facts.</li>
              <li>
                We do not guarantee the accuracy, completeness, or appropriateness of any
                AI-generated response.
              </li>
              <li>
                You should not rely on the Service for medical, legal, financial, or other
                professional advice.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">
              6. Payments and Subscriptions
            </h2>
            <p>
              Paid plans are billed in advance on a monthly or annual basis through our payment
              processor, Creem. Subscriptions automatically renew unless cancelled before the
              renewal date. Prices are shown in USD and may be subject to applicable taxes. We
              reserve the right to change pricing with reasonable prior notice. Refunds are handled
              in accordance with our refund policy available on request at {CONTACT_EMAIL}.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">
              7. Intellectual Property
            </h2>
            <p>
              All original content on the Service — including character designs, names, UI, and
              branding — is owned by or licensed to DearMate. You are granted a limited,
              non-exclusive, non-transferable licence to use the Service for personal, non-commercial
              purposes only. Nothing in these Terms transfers any intellectual property rights to
              you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">
              8. Disclaimers and Limitation of Liability
            </h2>
            <p className="mb-3">
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or
              implied. To the maximum extent permitted by applicable law, DearMate shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages,
              including loss of profits or data, arising out of or in connection with your use of
              the Service.
            </p>
            <p>
              Our total aggregate liability to you for any claim arising under these Terms shall not
              exceed the amount you paid us in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">9. Termination</h2>
            <p>
              We may suspend or terminate your account at any time for breach of these Terms or for
              any other reason with reasonable notice. You may close your account at any time by
              contacting us. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">10. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of Singapore,
              without regard to its conflict-of-law principles. Any disputes shall be subject to the
              exclusive jurisdiction of the courts of Singapore.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">11. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Material changes will be communicated via
              email or an in-app notice at least 14 days before taking effect. Continued use of the
              Service after the effective date constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#241C18]">12. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
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
