import MobileNav from "@/components/Navbar";
import Testimonials from "@/sections/Testimonials";
import Contact from "@/sections/Contact";
import Footer from "@/components/Footer";
import Services from "@/sections/Services";
import Portfolio from "@/sections/Portfolio";
import Hero2 from "@/sections/Hero2";

export default function Home() {
  return (
    <main>
      <MobileNav />
      <Hero2 />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
