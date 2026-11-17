import { ApproachSection } from './components/ApproachSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { PartnerSection } from './components/PartnerSection';
import { ProblemSection } from './components/ProblemSection';
import { WorkflowSection } from './components/WorkflowSection';

export default function App() {
  const scrollToSection = (id: string, focusSelector?: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (focusSelector) {
        window.setTimeout(() => {
          const input = document.querySelector<HTMLElement>(focusSelector);
          input?.focus({ preventScroll: true });
        }, 450);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F0] text-[#202722]">
      <Navbar onPartnerClick={() => scrollToSection('partner', '#partner-name')} />

      <main className="flex-1">
        <HeroSection
          onExploreClick={() => scrollToSection('approach')}
          onPartnerClick={() => scrollToSection('partner', '#partner-name')}
        />
        <ProblemSection />
        <ApproachSection />
        <WorkflowSection />
        <PartnerSection />
      </main>

      <Footer />
    </div>
  );
}
