import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DataStore } from "@/lib/data-store";
import {
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const staffMembers = await DataStore.getStaff();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/bg3.jpg"
            alt="Our Leadership & Staff"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-xs flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
                Our Human Capital
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Our Leadership & Specialist Team
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
                Meet the experienced chartered accountants, tax practitioners,
                and business consultants driving excellence at K-DECK Professional Services.
              </p>
            </div>
          </div>
        </section>

        {/* Staff Directory */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Dedicated Professionals
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Chartered Expertise Across All Domains
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Our team brings together decades of hands-on experience in
                statutory auditing, transfer pricing, financial accounting, and
                professional ATS tutoring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staffMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Photo header */}
                    <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={member.image || "/images/showcase.jpeg"}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 380px"
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-blue-800 shadow-sm border border-white">
                          {member.department}
                        </span>
                      </div>
                    </div>

                    {/* Member details */}
                    <div className="p-6">
                      <div className="flex items-center gap-1.5 mb-1 text-blue-600">
                        <CheckBadgeIcon className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {member.isAdmin || member.role.toLowerCase() === "admin"
                            ? "Platform Administrator"
                            : "Certified Specialist"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-semibold text-blue-700">
                          {member.role}
                        </span>
                        {(member.isAdmin || member.role.toLowerCase() === "admin") && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                            Admin
                          </span>
                        )}
                      </div>

                      {member.bio && (
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-4">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Footer */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:text-blue-600 transition-colors truncate"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <a
                          href={`tel:${member.phone}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Callout */}
            <div className="mt-16 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Ready to work with our specialists?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Schedule a direct appointment or submit your Request for Proposal (RFP).
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href="/contact-us"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm shadow-sm"
                >
                  Contact Our Office
                </Link>
                <Link
                  href="/request"
                  className="border border-gray-300 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl font-semibold transition-colors text-sm"
                >
                  Submit RFP
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
