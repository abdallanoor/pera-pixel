import MobileNav from "@/components/Navbar";
import Testimonials from "@/sections/Testimonials";
import Contact from "@/sections/Contact";
import Footer from "@/components/Footer";
import Services from "@/sections/Services";
import Hero from "@/sections/Hero";
import Portfolio from "@/sections/Portfolio";

export default function Home() {
  return (
    <main>
      <MobileNav />
      <Hero />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
