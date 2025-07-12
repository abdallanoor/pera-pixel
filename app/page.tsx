// import Hero from "@/sections/Hero";
import MobileNav from "@/components/Navbar";
import Testimonials from "@/sections/Testimonials";
import Portfolio from "@/sections/Portfolio";
import Contact from "@/sections/Contact";
import Footer from "@/components/Footer";
import Hero2 from "@/sections/Hero2";
import Companies from "@/components/Companies";

export default function Home() {
  return (
    <main>
      <MobileNav />
      <Hero2 />
      <Companies />
      {/* <Hero /> */}
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
