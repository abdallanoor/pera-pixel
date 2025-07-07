// import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Hero from "@/sections/Hero";
import MobileNav from "@/components/Navbar";
import Portfolio from "@/sections/Portfolio";
import Services from "@/sections/Services";

export default function Home() {
  return (
    <>
      <main>
        <MobileNav />
        <Hero />
        {/* <About /> */}
        <Portfolio />
        <Services />
        <Contact />
      </main>
    </>
  );
}
