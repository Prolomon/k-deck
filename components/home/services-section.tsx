import React from "react";
import Link from "next/link";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export const ServicesSection = () => {
  const services = [
    {
      title: "Financial Reporting",
      description:
        "Gain clear, actionable insights to enhance decision-making and ensure total compliance with IFRS and local regulatory frameworks.",
      Icon: ChartBarIcon,
      category: "Audit & Assurance",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      link: "/services#finance",
    },
    {
      title: "Tax Transfer Pricing",
      description:
        "Optimize compliance and reduce exposure with strategic corporate tax planning, transfer pricing filings, and tax dispute resolution.",
      Icon: CurrencyDollarIcon,
      category: "Tax Services",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      link: "/services#tax",
    },
    {
      title: "People & Culture",
      description:
        "Navigate complex labor and talent frameworks with specialist advisory, executive talent search, and workforce productivity planning.",
      Icon: UserGroupIcon,
      category: "Consulting",
      color: "bg-purple-50 text-purple-600 border-purple-100",
      link: "/services#business",
    },
    {
      title: "Digital Transformation",
      description:
        "Leverage smart financial software, cloud bookkeeping, and automated processes to accelerate sustainable business growth.",
      Icon: WrenchScrewdriverIcon,
      category: "Technology & Ops",
      color: "bg-amber-50 text-amber-600 border-amber-100",
      link: "/services#business",
    },
  ];

  return (
    <section className="bg-slate-50 py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">
            Our Core Competencies
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Comprehensive solutions for your business needs
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            We combine deep technical expertise with industry insights to help
            enterprises build financial resilience and navigate complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const { Icon } = service;
            return (
              <div
                key={index}
                className="bg-white p-7 rounded-2xl shadow-xs border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${service.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">
                    {service.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={service.link}
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors pt-2 border-t border-gray-50"
                >
                  <span>Learn more</span>
                  <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
