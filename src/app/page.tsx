import LandingHeader from './components/landing/LandingHeader';
import HeroSection from './components/landing/HeroSection';
import HowItWorks from './components/landing/HowItWorks';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f8ff] text-[#20243a]">
      <LandingHeader/>

      <HeroSection/>

      <HowItWorks/>
    </main>
  );
}