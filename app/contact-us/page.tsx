import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function ContactUsPage() {
  const socialCards = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/kdeck_professional",
      img: "/images/instagram.png",
      handle: "@kdeck_professional",
      color: "border-pink-200 text-pink-600 bg-pink-50/50 hover:bg-pink-50",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61577751322984",
      img: "/images/facebook.png",
      handle: "K-DECK Professional Services",
      color: "border-blue-200 text-blue-800 bg-blue-50/50 hover:bg-blue-50",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@KDeckProfessionalServices",
      img: "/images/youtub.png",
      handle: "K-DECK Professional Services",
      color: "border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-white h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/bg5.jpg"
            alt="Contact K-Deck"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-xs flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
                Connect With Our Team
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Contact Us
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
                Let&apos;s connect! Reach out directly for business advisory,
                statutory audits, tax consultations, or ATS training support.
              </p>
            </div>
          </div>
        </section>

        {/* Social Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Official Channels
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Follow & Engage with K-DECK
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialCards.map((card, idx) => (
                <a
                  key={idx}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-5 p-6 rounded-2xl border shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${card.color}`}
                >
                  <div className="relative w-14 h-14 shrink-0 bg-white p-2 rounded-xl border border-gray-100 shadow-xs">
                    <Image
                      src={card.img}
                      alt={card.name}
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">
                      {card.name}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {card.handle}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Location & Info Grid */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Headquarters & Communication
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Our Office & Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Office Location */}
              <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Lagos Corporate Office
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  21 Road, F1 Close,
                  <br />
                  FESTAC Town, Lagos State, Nigeria
                </p>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 mt-auto">
                  Physical Location
                </span>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center mb-4">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Business Hours
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed mb-4">
                  <p>Mon - Fri: 9:00am - 6:00pm</p>
                  <p>Sat: 10:00am - 2:00pm</p>
                  <p className="text-red-500 font-semibold">Sun: Closed</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 mt-auto">
                  Official Hours
                </span>
              </div>

              {/* WhatsApp */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  WhatsApp Direct Desk
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Fastest response for inquiries & training:
                </p>
                <a
                  href="https://wa.me/2349070573104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-emerald-700 hover:text-emerald-800 underline mb-4"
                >
                  +234 907 057 3104
                </a>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 mt-auto">
                  Instant Chat
                </span>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Email Correspondence
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Official inquiries & formal documents:
                </p>
                <a
                  href="mailto:Info@kdeckprofessionalservices.com"
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900 underline mb-4 break-all"
                >
                  Info@kdeckprofessionalservices.com
                </a>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 mt-auto">
                  Official Mail
                </span>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Telephone Line
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Call our customer advisory desk:
                </p>
                <a
                  href="tel:09070573104"
                  className="text-base font-bold text-purple-900 hover:text-purple-700 underline mb-4"
                >
                  0907 057 3104
                </a>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 mt-auto">
                  Direct Line
                </span>
              </div>

              {/* Tagline */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8 flex flex-col items-center text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <CheckBadgeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Our Brand Commitment
                </h3>
                <p className="text-xl font-extrabold text-amber-800 italic mb-4">
                  &ldquo;...Beyond the usual&rdquo;
                </p>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mt-auto">
                  Why K-Deck
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: Interactive Google Map Showing Actual Physical Location */}
        <section className="py-20 bg-slate-50 border-t border-gray-200" id="office-location">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                Interactive Map &amp; Navigation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
                Visit Our Lagos Corporate Headquarters
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                Located in the commercial district of FESTAC Town, Lagos, our corporate office provides a discreet, fully equipped environment for client meetings and executive consultations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Google Map Embed Iframe */}
              <div className="lg:col-span-8 bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-md min-h-[440px] flex flex-col">
                <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-semibold tracking-wide">Live GPS Position: 21 Road, F1 Close, FESTAC Town</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=21+Road+F1+Close+FESTAC+Town+Lagos+Nigeria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <span>Open in Maps App</span>
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="relative flex-1 w-full min-h-[380px]">
                  <iframe
                    src="https://maps.google.com/maps?q=21%20Road,%20F1%20Close,%20FESTAC%20Town,%20Lagos,%20Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full min-h-[380px]"
                    title="K-DECK Professional Services Location Map"
                  />
                </div>
              </div>

              {/* Landmark & Access Details Card */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-7 border border-gray-200/90 shadow-md flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        Directions &amp; Landmarks
                      </h3>
                      <span className="text-xs text-blue-600 font-semibold">
                        FESTAC Town Axis
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs text-gray-600">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <strong className="text-gray-900 block text-xs">Official Address:</strong>
                      <p className="leading-relaxed">
                        21 Road, F1 Close, FESTAC Town, Lagos State, Nigeria.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <strong className="text-gray-900 block text-xs">Major Access Routes:</strong>
                      <p className="leading-relaxed">
                        Accessible via 2nd Avenue, Apple Junction, or through the Mile 2 / Badagry Expressway Festac 1st Gate entrance.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <strong className="text-gray-900 block text-xs">Security &amp; Parking:</strong>
                      <p className="leading-relaxed">
                        Dedicated visitor parking available within gated, guarded close. Please advise security at the gate you are visiting K-DECK.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=21+Road+F1+Close+FESTAC+Town+Lagos+Nigeria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>Get GPS Driving Directions</span>
                  </a>

                  <a
                    href="tel:09070573104"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>Call Reception: 0907 057 3104</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Office Appointment & Consultation Booking Protocol */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                Client Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
                Appointment &amp; Consultation Booking Protocol
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                To guarantee our senior engagement partners provide undivided focus and review preliminary documentation, we encourage clients to schedule appointments prior to arriving.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Protocol 1 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                    <CalendarDaysIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    In-Person Partner Meeting
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    Face-to-face statutory audit reviews, board advisory briefings, and confidential forensic diagnostics scheduled at our Lagos headquarters.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/60 text-xs text-blue-700 font-semibold">
                  Advance booking required: Mon–Fri, 10am–4pm
                </div>
              </div>

              {/* Protocol 2 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                    <DocumentCheckIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Documentation to Prepare
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    For tax or audit consultations, please have your CAC incorporation pack, prior year management accounts, and any recent revenue service notices accessible.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/60 text-xs text-purple-700 font-semibold">
                  Guarantees immediate diagnostic appraisal
                </div>
              </div>

              {/* Protocol 3 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Virtual Video Consultation
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                    Unable to visit our physical office? We conduct high-definition Zoom and Google Meet sessions with screen sharing for financial model reviews and tax consultations.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/60 text-xs text-emerald-700 font-semibold">
                  Available nationwide and for diaspora clients
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/request"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
              >
                <span>Request a Confidential Consultation Session</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
