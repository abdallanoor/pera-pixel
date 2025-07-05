import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import MobileNav from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <main className="container mx-auto px-4">
        <MobileNav />
        <Hero />
        <About />
        <Portfolio />
        <Services />
        <Contact />
      </main>
    </>
  );
}
