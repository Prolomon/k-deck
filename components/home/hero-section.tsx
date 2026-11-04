import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/50 border border-blue-700/50 text-blue-200 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Multi-Disciplinary Professional Firm
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Elevating every transaction to its{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200 bg-clip-text text-transparent">
                full potential
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
              We empower startups, SMEs, and corporate entities through bespoke
              financial reporting, statutory audit, strategic tax advisory, and
              accredited ATS professional accounting training.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.02]"
              >
                <span>Discover Our Expertise</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/2349070573104"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-slate-600 bg-white/5 hover:bg-white/10 text-white px-7 py-3.5 rounded-xl font-semibold backdrop-blur-xs transition-all hover:border-slate-400"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-emerald-400" />
                <span>Schedule a Consultation</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-sky-400 to-orange-400 rounded-full opacity-30 blur-2xl animate-pulse"></div>
              <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-tr from-blue-500/30 to-white/10 backdrop-blur-xs border-2 border-white/20 shadow-2xl">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src="/images/showcase.jpeg"
                    alt="Professional consultation"
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-2 right-4 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md">
                <span className="text-xs font-semibold text-emerald-400">99.9% Accuracy</span>
                <p className="text-[10px] text-slate-300">Audits & Reports</p>
              </div>

              <div className="absolute -bottom-3 left-4 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md">
                <span className="text-xs font-semibold text-blue-400">ATS Training</span>
                <p className="text-[10px] text-slate-300">Levels 1, 2 & 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
