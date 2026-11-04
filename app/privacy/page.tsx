import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Personal Data We Collect",
      content:
        "We may collect identifying contact details including your full name, email address, corporate entity name, telephone number, and payment references when you interact with our website, request RFPs, register for webinars, or enroll in ATS classes.",
    },
    {
      title: "Usage & Analytical Information",
      content:
        "When visiting our digital platforms, technical metadata such as browser types, referring pages, IP addresses, and device signatures are automatically logged to ensure platform integrity and performance monitoring.",
    },
    {
      title: "Cookies & Session Management",
      content:
        "We utilize secure HTTP-only session cookies to authenticate administrators and protect administrative routes against unauthorized access. Standard analytical cookies may be stored to improve user experience.",
    },
    {
      title: "Third-Party Payment Gateways",
      content:
        "Financial transactions for paid events and trainings are processed securely via Paystack. K-DECK Professional Services does not store sensitive card numbers or bank authorization PINs on our servers.",
    },
    {
      title: "Information Security Protocols",
      content:
        "We implement industry-standard encryption, strict database access controls, and TLS communication to prevent unauthorized disclosure, tampering, or loss of client data.",
    },
    {
      title: "Regulatory Compliance & Inquiries",
      content:
        "All data handling complies with the Nigeria Data Protection Act (NDPA). Inquiries regarding your personal records should be directed to info@kdeckprofessionalservices.com.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              Learn how K-DECK Professional Services collects, protects, and
              handles client and student data in accordance with Nigerian regulations.
            </p>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs"
                >
                  <h2 className="text-lg font-bold text-blue-900 mb-2.5">
                    {sec.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              Effective date: January 2026. Reviewed annually by K-Deck Compliance.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
