import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AboutSection } from "@/components/sections/about-section";
import { AiFeaturesSection } from "@/components/sections/ai-features-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { GithubSection } from "@/components/sections/github-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectBowlSection } from "@/components/sections/projectbowl-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-ink-bg text-ink-text">
      <div className="relative">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <FeaturedProjectsSection />
        <ProjectBowlSection />
        <AiFeaturesSection />
        <TechStackSection />
        <GithubSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
