import Hero from "@/sections/Hero";
import MobileNav from "@/components/Navbar";
import Testimonials from "@/sections/Testimonials";
import Portfolio from "@/sections/Portfolio";

export default function Home() {
  return (
    <main>
      <MobileNav />
      <Hero />
      <Portfolio />
      <Testimonials />
    </main>
  );
}
