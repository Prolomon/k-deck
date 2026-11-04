import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { TrendingInsights } from "@/components/home/trending-insights";
import { ContactSection } from "@/components/home/contact-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <TrendingInsights />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
