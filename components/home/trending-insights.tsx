import React from "react";
import Link from "next/link";
import { FireIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";

export const TrendingInsights = () => {
  const insights = [
    {
      number: "01",
      title:
        "Comprehensive Review: Deduction of Tax at Source (Withholding) Regulations in Nigeria.",
      category: "Tax & Compliance",
      readTime: "5 min read",
    },
    {
      number: "02",
      title:
        "The Legal Propriety of Ungazetted Acts or Directives in Corporate Financial Practice.",
      category: "Legal & Regulatory",
      readTime: "7 min read",
    },
    {
      number: "03",
      title:
        "Balancing Energy Demands and Environmental Accounting Governance in Modern Enterprises.",
      category: "ESG & Energy",
      readTime: "6 min read",
    },
    {
      number: "04",
      title:
        "Financial Management and Working Capital Strategies for Sustainable SME Growth.",
      category: "Finance & Advisory",
      readTime: "4 min read",
    },
  ];

  return (
    <section className="bg-white py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wide uppercase mb-3">
              <FireIcon className="w-4 h-4 text-orange-500" />
              <span>Trending Insights</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Game-Changing Perspectives & Thought Leadership
            </h2>
          </div>
          <Link
            href="/events"
            className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
          >
            <span>Explore all events & articles</span>
            <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="group bg-slate-50 hover:bg-blue-50/60 p-6 rounded-2xl border border-gray-200/70 hover:border-blue-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-blue-600/40 group-hover:text-blue-600 transition-colors font-mono">
                    {insight.number}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600">
                    {insight.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-900 leading-snug transition-colors mb-4">
                  {insight.title}
                </h3>
              </div>

              <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500">
                <span>{insight.readTime}</span>
                <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  Read article &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
