import Hero from "@/sections/Hero";
import MobileNav from "@/components/Navbar";
import Testimonials from "@/sections/Testimonials";

export default function Home() {
  return (
    <main>
      <MobileNav />
      <Hero />
      <Testimonials />
    </main>
  );
}
