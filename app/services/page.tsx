"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  ScaleIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState("audit");

  const services = {
    audit: {
      id: "audit",
      title: "Audit & Assurance Services",
      shortTitle: "Audit Services",
      icon: ShieldCheckIcon,
      description:
        "Comprehensive statutory and internal audit services to safeguard financial transparency, enhance stakeholder confidence, and ensure adherence to local and international audit guidelines.",
      deliverables: [
        "Financial Statement Statutory Audits",
        "Internal Audit & Process Review",
        "Regulatory & Legal Compliance Audits",
        "Enterprise Risk Assessment & Controls",
        "Forensic Auditing & Investigation",
        "Financial & Operational Due Diligence",
      ],
    },
    tax: {
      id: "tax",
      title: "Tax Services & Transfer Pricing",
      shortTitle: "Tax Services",
      icon: CurrencyDollarIcon,
      description:
        "Proactive tax planning, compliance audits, and specialized transfer pricing documentation for corporate entities and high-net-worth individuals in Nigeria.",
      deliverables: [
        "Corporate Income Tax & Annual Returns",
        "Withholding Tax (WHT) Review & Optimization",
        "Transfer Pricing Policy & Local File Documentation",
        "Tax Dispute Resolution & FIRS Audit Defense",
        "Value Added Tax (VAT) Planning & Remittance",
        "Personal Income Tax & Expatriate Tax Advisory",
      ],
    },
    finance: {
      id: "finance",
      title: "Financial Reporting & IFRS Advisory",
      shortTitle: "Financial Reporting",
      icon: ChartBarIcon,
      description:
        "Accurate and timely accounting reports to drive executive decision-making, investor readiness, and compliance with IFRS for SMEs and large corporations.",
      deliverables: [
        "IFRS & GAAP Compliant Financial Statements",
        "Monthly & Quarterly Management Accounts",
        "Cash Flow Projections & Financial Modeling",
        "Budgeting, Variance Analysis & Cost Control",
        "Fixed Asset Register Reconciliations",
        "Financial Health Check & Key Ratio Diagnostics",
      ],
    },
    business: {
      id: "business",
      title: "Strategic Business Consultancy",
      shortTitle: "Business Consultancy",
      icon: BuildingOfficeIcon,
      description:
        "Expert advisory to optimize operations, implement effective corporate governance, and drive sustainable growth across challenging economic climates.",
      deliverables: [
        "Business Process Re-engineering & Workflows",
        "Market Entry Strategy & Commercial Viability",
        "Bankable Feasibility Studies & Business Plans",
        "Operational Efficiency & Cost Containment",
        "Organizational Restructuring & Change Management",
        "Board Advisory & Performance Metrics Setup",
      ],
    },
  };

  const current = services[selectedService as keyof typeof services] || services.audit;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349070573104";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/bg1.jpg"
            alt="K-Deck Services"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-xs flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
                World-Class Advisory
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Our Professional Services
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
                Comprehensive, compliant, and data-driven solutions tailored
                specifically to your organization&apos;s strategic objectives.
              </p>
            </div>
          </div>
        </section>

        {/* Services Tabs & Details */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-16 border-b border-gray-200 pb-4">
              {Object.values(services).map((service) => {
                const isSelected = selectedService === service.id;
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{service.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Service Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  Specialized Offering
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  {current.title}
                </h2>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {current.description}
                </p>

                <div className="pt-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                    Key Deliverables & Scopes:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {current.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-gray-800 text-sm font-medium"
                      >
                        <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hello K-Deck, I would like to make an inquiry regarding your ${current.title}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md text-sm"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    <span>Inquire About This Service</span>
                  </a>
                  <Link
                    href="/request"
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-500 px-6 py-3.5 rounded-xl font-semibold transition-all text-sm"
                  >
                    <span>Submit RFP</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-50">
                  <div className="relative h-96 sm:h-112 w-full">
                    <Image
                      src="/images/service.jpeg"
                      alt={current.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                    <div className="text-white">
                      <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-1">
                        Professional Standard
                      </div>
                      <div className="text-lg font-bold">
                        Unmatched rigor and industry-proven results.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: Our 4-Stage Precision Engagement Methodology */}
        <section className="py-20 bg-slate-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                Disciplined Execution
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
                Our 4-Stage Precision Engagement Methodology
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                Whether executing a statutory audit, defending a tax audit, or delivering financial reporting, every client engagement follows our institutional four-phase quality control framework.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stage 1 */}
              <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-mono">
                      PHASE 01
                    </span>
                    <DocumentMagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Diagnostic &amp; Scoping
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Preliminary walkthrough of entity records, accounting policies, enterprise risk profiles, and regulatory remittance history to define engagement parameters and timelines.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Deliverable: Engagement Charter &amp; Risk Map
                </div>
              </div>

              {/* Stage 2 */}
              <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md font-mono">
                      PHASE 02
                    </span>
                    <ScaleIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Rigor Fieldwork &amp; Testing
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Deep-dive transactional verification, ledger sampling, payroll audits, VAT reconciliation, and third-party bank confirmations executed by chartered professionals.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Deliverable: Audit Working Papers &amp; Reconciliation
                </div>
              </div>

              {/* Stage 3 */}
              <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md font-mono">
                      PHASE 03
                    </span>
                    <SparklesIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Reporting &amp; Governance
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Formulation of audit opinions, Management Letters (internal control deficiencies), IFRS disclosure notes, and tax computation exhibits reviewed by senior partners.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Deliverable: Certified Audit Report &amp; Board Brief
                </div>
              </div>

              {/* Stage 4 */}
              <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md font-mono">
                      PHASE 04
                    </span>
                    <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Defense &amp; Continuous Advisory
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Proactive post-audit defense during FIRS or State tax visits, monitoring implementation of remediation strategies, and quarterly executive check-ins.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Deliverable: Ongoing Defense &amp; Advisory Retainer
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Frequently Asked Questions & Client Guarantees */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  Advisory Clarity
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                  Frequently Asked Questions About Our Advisory Engagements
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Have questions regarding timelines, statutory certifications, regulatory compliance, or confidentiality? Explore our standard policies or reach out for custom engagement scopes.
                </p>

                <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3">
                  <div className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-blue-600" />
                    <span>Need a custom RFP proposal?</span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    We prepare detailed terms of reference, staffing profiles, and transparent milestone fee structures tailored to your corporate charter.
                  </p>
                  <Link
                    href="/request"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors pt-1"
                  >
                    <span>Request Custom Scope Document</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                {[
                  {
                    q: "What certifications and regulatory licenses back K-DECK's audits?",
                    a: "Our firm operates with qualified Fellows and Associates of the Institute of Chartered Accountants of Nigeria (ICAN) and the Chartered Institute of Taxation of Nigeria (CITN). All financial statement reports adhere strictly to Financial Reporting Council of Nigeria (FRC) guidelines and international IFRS standards.",
                  },
                  {
                    q: "How does K-DECK assist during aggressive FIRS or State IRS tax audits?",
                    a: "We act as your accredited tax representatives. Our tax partners lead all correspondence, attend reconciliation meetings, review assessment notices, establish valid objection letters, and reconcile WHT, VAT, and CIT ledgers to eliminate unjust penalties.",
                  },
                  {
                    q: "What is the typical timeline for completing a statutory company audit?",
                    a: "Standard SME statutory audits typically span 2 to 4 weeks depending on the availability of accounting records and third-party confirmations. For corporate groups, an initial diagnostic timetable is mutually agreed upon with the Board of Directors.",
                  },
                  {
                    q: "Can K-DECK help establish internal accounting controls for fast-scaling businesses?",
                    a: "Yes. We design standard operating procedures (SOPs), implement separation of duties, optimize accounting software (Sage, QuickBooks, Zoho Books), and provide monthly financial oversight so management maintains absolute control over cash flow.",
                  },
                  {
                    q: "How are client data confidentiality and security handled?",
                    a: "Client financial information is guarded under strict professional non-disclosure agreements (NDAs) and stored in encrypted corporate environments. Only designated engagement personnel have clearance to review your books.",
                  },
                ].map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-6 rounded-2xl bg-slate-50 border border-gray-200/80 hover:border-blue-200 transition-colors"
                  >
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
