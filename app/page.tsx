import Hero from "@/sections/Hero";
import MobileNav from "@/components/Navbar";
import Testimonials from "@/sections/Testimonials";
import Portfolio from "@/sections/Portfolio";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <main>
      <MobileNav />
      <Hero />
      <Portfolio />
      <Testimonials />
      <Contact />
    </main>
  );
}
