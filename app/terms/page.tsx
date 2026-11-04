import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function TermsOfUsePage() {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using the digital portals, registering for masterclasses, or submitting RFPs through K-DECK Professional Services, you acknowledge that you have read, understood, and agreed to be legally bound by these terms.",
    },
    {
      title: "2. Provision of Professional Services",
      content:
        "All advisory, auditing, and tax engagements are governed by separate, formal Letters of Engagement (LOE) issued under the Institute of Chartered Accountants of Nigeria (ICAN) and Chartered Institute of Taxation of Nigeria (CITN) guidelines.",
    },
    {
      title: "3. Payments & Transaction Integrity",
      content:
        "All event fees, training subscriptions, and seminar enrollments processed through Paystack are subject to authorization verification. Unauthorized card usage or dispute falsification will result in immediate disqualification and reporting.",
    },
    {
      title: "4. Intellectual Property & Training Materials",
      content:
        "All workshop slides, webinar recordings, ATS tutorial handouts, financial models, and white papers provided by K-Deck remain the exclusive intellectual property of K-DECK Professional Services and may not be redistributed without written consent.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "Information published across our website, articles, and public webinars is provided for professional education and general awareness. It does not replace formal statutory audits or certified tax opinions for specific corporate transactions.",
    },
    {
      title: "6. Governing Law & Jurisdiction",
      content:
        "These terms shall be interpreted, construed, and enforced exclusively in accordance with the laws of the Federal Republic of Nigeria, with jurisdiction in Lagos State.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              Please review these terms and professional regulations governing
              your interaction with K-DECK Professional Services.
            </p>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {terms.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs"
                >
                  <h2 className="text-lg font-bold text-blue-900 mb-2.5">
                    {t.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              Last updated: January 2026. K-DECK Professional Services.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
