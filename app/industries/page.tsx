import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function IndustriesPage() {
  const industries = [
    {
      name: "Audit & Assurance Sectors",
      description:
        "Ensuring complete regulatory compliance, risk management, and governance for companies across financial, commercial, and non-profit sectors.",
      Icon: ChartBarIcon,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      services: [
        "Financial Statement Statutory Audits",
        "Internal Audit & Control Systems",
        "Statutory Compliance Audits",
        "Risk Diagnostic Assessment",
        "Forensic Auditing & Investigation",
        "Transaction Due Diligence",
      ],
    },
    {
      name: "Corporate & SME Tax Services",
      description:
        "Delivering robust tax structuring, transfer pricing reports, and proactive dispute resolution across retail, tech, and manufacturing.",
      Icon: CurrencyDollarIcon,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      services: [
        "Corporate Income Tax Advisory",
        "Withholding Tax (WHT) Planning",
        "Transfer Pricing Local File Prep",
        "FIRS & SIRS Tax Audit Defense",
        "Value Added Tax (VAT) Structuring",
        "Executive Tax & Payroll Structuring",
      ],
    },
    {
      name: "Financial Reporting & Capital Markets",
      description:
        "Providing accurate, timely, and investor-grade reporting for fast-scaling startups, retail groups, and industrial conglomerates.",
      Icon: ArrowTrendingUpIcon,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      services: [
        "IFRS & GAAP Compliant Statements",
        "Board Management Accounts",
        "Financial Forecasting & Modeling",
        "Cash Flow Optimization Frameworks",
        "Regulatory Reporting (CAC/SEC/FRC)",
        "Financial Analysis & Ratio Diagnostics",
      ],
    },
    {
      name: "Commercial Business Consultancy",
      description:
        "Empowering businesses to navigate economic uncertainty, reorganize operations, and scale with sustainable profitability.",
      Icon: BuildingOffice2Icon,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      services: [
        "Business Process Optimization",
        "Market Entry Strategy & Commercialization",
        "Bankable Feasibility Studies",
        "Strategic Business Plans & Investor Decks",
        "Operational Cost Rationalization",
        "Organizational Structure & Governance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/bg2.jpg"
            alt="Industries We Serve"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-xs flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
                Sector Specialization
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Industries We Empower
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
                Deep vertical knowledge paired with multi-disciplinary financial,
                tax, and operational expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Industry Cards Grid */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {industries.map((ind, idx) => {
                const { Icon } = ind;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${ind.color}`}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {ind.name}
                          </h2>
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                            Verified Sector Solution
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                        {ind.description}
                      </p>

                      <div className="space-y-2.5 mb-8">
                        {ind.services.map((srv, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center gap-3 text-sm text-gray-700 font-medium"
                          >
                            <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0" />
                            <span>{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href="/services"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Explore full service matrix</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/request"
                        className="text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        Submit RFP
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 1: Cross-Sector Regulatory Frameworks & Compliance Matrix */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                Institutional Competency
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
                Cross-Sector Regulatory Compliance Matrix
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                Operating across Nigerian commerce requires seamless alignment with diverse federal and state oversight bodies. Here is how K-DECK guarantees full statutory insulation for your enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  code: "FIRS",
                  agency: "Federal Inland Revenue Service",
                  scope: "Corporate Income Tax (CIT), VAT, WHT & Transfer Pricing",
                  role: "Statutory tax computations, annual electronic filing, transfer pricing documentation, and aggressive tax audit defense.",
                  color: "border-blue-200 bg-blue-50/50 text-blue-700",
                },
                {
                  code: "SIRS / LIRS",
                  agency: "State Internal Revenue Services",
                  scope: "PAYE, Withholding Tax on Individuals, Development Levies",
                  role: "Monthly payroll tax remittances, annual employer returns (Form H1), staff tax clearance certificates, and back-duty audit defense.",
                  color: "border-emerald-200 bg-emerald-50/50 text-emerald-700",
                },
                {
                  code: "CAC",
                  agency: "Corporate Affairs Commission",
                  scope: "CAMA 2020 Compliance, Annual Returns & Corporate Registry",
                  role: "Statutory annual returns filing, post-incorporation share capital restructuring, PSC disclosures, and board resolution ratification.",
                  color: "border-purple-200 bg-purple-50/50 text-purple-700",
                },
                {
                  code: "FRC",
                  agency: "Financial Reporting Council of Nigeria",
                  scope: "IFRS Standards & Auditor Professional Accreditation",
                  role: "Ensuring corporate financial statements meet full IFRS/IPSAS guidelines with verified FRC number certification on all sign-offs.",
                  color: "border-amber-200 bg-amber-50/50 text-amber-700",
                },
                {
                  code: "CBN & SEC",
                  agency: "Central Bank & Securities Exchange Commission",
                  scope: "Fintech, Asset Management & Capital Markets Regulations",
                  role: "Prudential returns audit, AML/CFT risk assessments, capital adequacy computations, and external statutory audit verification.",
                  color: "border-indigo-200 bg-indigo-50/50 text-indigo-700",
                },
                {
                  code: "PENCOM & ITF",
                  agency: "Pensions & Industrial Training Fund",
                  scope: "Employee Welfare, Pension Remittances & ITF Compliance",
                  role: "Compliance audit certificates, employer contribution reconciliations, and penalty prevention for corporate procurement tenders.",
                  color: "border-rose-200 bg-rose-50/50 text-rose-700",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-7 rounded-3xl border ${item.color} shadow-xs flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black tracking-widest px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-900 font-mono">
                        {item.code}
                      </span>
                      <BuildingLibraryIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      {item.agency}
                    </h3>
                    <div className="text-xs font-semibold text-blue-600 mb-3">
                      {item.scope}
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {item.role}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                    <span>Certified Practice Scope</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Proven Sector Case Transformations & Impact */}
        <section className="py-20 bg-slate-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                Measurable Value
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
                Sector Case Studies &amp; Value Delivered
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                Examining how K-DECK transformed compliance bottlenecks into sustainable corporate value across fast-growing commercial clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Case 1 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono">
                      LOGISTICS &amp; SUPPLY CHAIN
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    ₦38.5M Tax Credit Recovery &amp; Audit Defense
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    A multi-state haulage and freight group faced an arbitrary ₦55M FIRS back-duty assessment. K-DECK reconciled 3 years of withholding tax deduction receipts, substantiated eligible capital allowances on fleet vehicles, and successfully reduced the net liability to zero.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    &bull; Outcome: 100% penalty waiver &amp; clean Tax Clearance Certificate (TCC).
                  </div>
                </div>
              </div>

              {/* Case 2 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold font-mono">
                      FMCG &amp; MANUFACTURING
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Inventory Valuation &amp; Fast-Track Audit
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    A consumer goods manufacturing facility struggled with chronic inventory shrinkages and delayed annual audits spanning over 90 days. We implemented automated barcode asset tagging, updated IFRS valuation schedules, and reduced statutory audit completion to 21 days.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                  <div className="text-xs font-semibold text-purple-700 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                    &bull; Outcome: Unqualified audit opinion and bank financing approval secured.
                  </div>
                </div>
              </div>

              {/* Case 3 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold font-mono">
                      HEALTHCARE &amp; CLINICAL
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Multi-Branch Payroll Restructuring
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    A regional private healthcare consortium operating 4 hospital branches required consolidated management reporting and standardized PAYE withholding across medical and consulting staff. K-DECK built a unified payroll matrix and governance guidelines.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                  <div className="text-xs font-semibold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    &bull; Outcome: Seamless state IRS compliance and board monthly dashboard reporting.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
