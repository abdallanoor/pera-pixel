import MobileNav from "@/components/Navbar";
import Testimonials from "@/sections/Testimonials";
import Contact from "@/sections/Contact";
import Footer from "@/components/Footer";
import Services from "@/sections/Services";
import Portfolio from "@/sections/Portfolio";
import Companies from "@/components/Companies";
import Hero from "@/sections/Hero";

export default function Home() {
  return (
    <>
      <MobileNav />
      <main>
        <Hero />
        <Companies />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
