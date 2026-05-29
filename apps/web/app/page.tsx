import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AboutSection } from "@/components/sections/about-section";
import { AiFeaturesSection } from "@/components/sections/ai-features-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectBowlSection } from "@/components/sections/projectbowl-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bowl-background text-bowl-text">
      <div className="pointer-events-none fixed left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-bowl-purple/25 blur-3xl" />
      <div className="pointer-events-none fixed right-[-12rem] top-24 h-[34rem] w-[34rem] rounded-full bg-bowl-cyan/20 blur-3xl" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />

      <div className="relative">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <FeaturedProjectsSection />
        <ProjectBowlSection />
        <AiFeaturesSection />
        <TechStackSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
