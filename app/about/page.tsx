import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  TrophyIcon,
  SparklesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  const companyOfferings = [
    "Financial Reporting & IFRS Compliance",
    "Tax Advisory & Transfer Pricing",
    "Auditing & Assurance Services",
    "Strategic Business Consultancy",
    "ATS Professional Accounting Training",
    "Corporate Governance & Internal Controls",
  ];

  const coreValues = [
    {
      title: "Integrity & Ethics",
      desc: "Uncompromising adherence to professional standards, regulatory transparency, and strict confidentiality.",
    },
    {
      title: "Technical Excellence",
      desc: "Deep knowledge and rigorous methodology across audit, tax computations, and advisory deliverables.",
    },
    {
      title: "Client-Centric Value",
      desc: "Tailoring every solution to the operational realities and scale of individuals, startups, and SMEs.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/bg3.jpg"
            alt="About K-Deck"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-xs flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
                Who We Are
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                About K-DECK Professional Services
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
                Empowering businesses and future professionals through expert
                audit, tax advisory, financial consulting, and accredited ATS training.
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm tracking-wide uppercase">
                  <span className="w-2.5 h-6 bg-blue-600 rounded-sm"></span>
                  Our Company Profile
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  A multi-disciplinary firm built on trust and precision
                </h2>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  <strong className="text-blue-900">K-Deck Professional Services</strong>{" "}
                  is a premier Nigerian multidisciplinary professional services
                  firm. We partner with individual entrepreneurs, growing SMEs, and
                  established commercial organizations by delivering{" "}
                  <span className="text-blue-700 font-medium">
                    tailored, compliant, and data-driven
                  </span>{" "}
                  financial, advisory, and accounting education services.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {companyOfferings.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-gray-700 text-sm font-medium">
                      <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    href="/staff"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm text-sm"
                  >
                    <span>Meet Our Leadership Team</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/classes"
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-500 px-6 py-3 rounded-xl font-semibold transition-all text-sm"
                  >
                    <span>Explore ATS Classes</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-50">
                  <div className="relative h-96 sm:h-112 w-full">
                    <Image
                      src="/images/meeting.jpeg"
                      alt="Professional team meeting"
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                    <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
                      Lagos, Nigeria
                    </span>
                    <p className="text-sm font-semibold mt-1">
                      Committed to transforming business compliance into competitive advantage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance, Excellence & Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-blue-50/80 border-t-4 border-blue-600 p-8 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <ChartBarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Our Performance
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We are confident in our expertise and proven track record. Over
                  the years, we have consistently delivered value-driven
                  solutions across diverse sectors, establishing our firm as a
                  dependable growth partner.
                </p>
              </div>

              <div className="bg-slate-50 border-t-4 border-slate-700 p-8 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Expertise & Excellence
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Our team comprises chartered accountants (FCAs, ACAs), chartered
                  tax practitioners (ACTIs), and management consultants with
                  hands-on industry experience ensuring accuracy and consistency.
                </p>
              </div>

              <div className="bg-emerald-50/80 border-t-4 border-emerald-600 p-8 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <CheckBadgeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-3">
                  Industry Impact & 99.9% Precision
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  99.9% of our projects result in measurable improvements:
                  enhanced operational efficiency, reduced tax penalties, and
                  streamlined accounting workflows.
                </p>
                <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/60 p-2.5 rounded-lg">
                  99.9% accuracy rate across all client documentation and audits.
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="mt-20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                What Guides Us
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1 mb-12">
                Our Foundational Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {coreValues.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl border border-gray-200 bg-white shadow-xs text-left hover:border-blue-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold mb-4 font-mono">
                      0{idx + 1}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {val.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: Institutional Accreditations, Affiliations & Certifications */}
        <section className="py-20 bg-slate-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                Institutional Credibility
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
                Accreditations, Affiliations &amp; Professional Standards
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                K-DECK Professional Services operates in full accordance with the statutory mandates and codes of conduct of the leading financial and professional accounting institutes across Nigeria.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ICAN */}
              <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-5">
                    <AcademicCapIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ICAN Accredited Practice
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Our lead partners are inducted Fellows (FCA) and Associates (ACA) of the Institute of Chartered Accountants of Nigeria, authorized for statutory audits and ATS training.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-semibold text-blue-600">
                  Chartered Accountants of Nigeria
                </div>
              </div>

              {/* CITN */}
              <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-5">
                    <ShieldCheckIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    CITN Licensed Practitioners
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Accredited with the Chartered Institute of Taxation of Nigeria (ACTI/FCTI) with full authority to represent corporate taxpayers before federal (FIRS) and state revenue services.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-semibold text-emerald-600">
                  Taxation Institute of Nigeria
                </div>
              </div>

              {/* FRC */}
              <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-5">
                    <CheckBadgeIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    FRC Compliant Auditing
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Strict adherence to the Financial Reporting Council of Nigeria guidelines, ensuring all audited financial statements comply with International Financial Reporting Standards (IFRS).
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-semibold text-purple-600">
                  Financial Reporting Council
                </div>
              </div>

              {/* CAC */}
              <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-5">
                    <BuildingOffice2Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    CAC Corporate Filing Agents
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Accredited Corporate Affairs Commission agents licensed to execute statutory corporate filings, CAMA 2020 annual returns, share capital restructuring, and director updates.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-semibold text-amber-700">
                  Corporate Affairs Commission
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Our Strategic Journey & Milestones */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                Growth &amp; Heritage
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
                Our Strategic Journey &amp; Milestones
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                From a dedicated practice in Lagos to a premier multidisciplinary advisory firm empowering enterprise leaders and accounting candidates nationwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  year: "2021",
                  title: "Foundation & Inception",
                  desc: "Established in Lagos, Nigeria with a specialized focus on statutory audit quality, financial forensics, and resolving contested corporate tax liabilities.",
                  tag: "Inception",
                },
                {
                  year: "2023",
                  title: "ICAN ATS Academy",
                  desc: "Accredited ATSWA training academy launched, introducing structured weekend coaching cohorts and dedicated tutor support for aspiring chartered accountants.",
                  tag: "Education",
                },
                {
                  year: "2024",
                  title: "Transfer Pricing & SME Scale",
                  desc: "Expanded practice into local transfer pricing documentation, IFRS fixed asset register compilation, and multi-branch healthcare & manufacturing audits.",
                  tag: "Expansion",
                },
                {
                  year: "2026",
                  title: "Digital Portal & 500+ Clients",
                  desc: "Deployment of K-DECK's digital event broadcasting hub, automated consultation portal, and milestone milestone of over 500+ commercial clients and students empowered.",
                  tag: "Modernization",
                },
              ].map((step, sIdx) => (
                <div
                  key={sIdx}
                  className="p-7 rounded-3xl bg-slate-50 border border-gray-200/80 shadow-xs relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-blue-700 font-mono tracking-tight">
                        {step.year}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100/60 text-blue-800">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                    <TrophyIcon className="w-4 h-4 text-amber-500" />
                    <span>Verified Firm Milestone</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
