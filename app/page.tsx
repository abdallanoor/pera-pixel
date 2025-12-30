import MobileNav from "@/components/Navbar";
import Testimonials from "@/sections/Testimonials";
import Contact from "@/sections/Contact";
import Footer from "@/components/Footer";
import Services from "@/sections/Services";
import Portfolio from "@/sections/Portfolio";
import Companies from "@/components/Companies";
import Hero from "@/sections/Hero";
import { DATA } from "@/data/content";

// Video type from types/video.ts
interface Video {
  src: string;
  title?: string;
}

interface PortfolioData {
  horizontalVideos: Video[];
  verticalVideos: Video[];
}

// Fetch videos from API with fallback to static data
async function getPortfolioVideos(): Promise<PortfolioData> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/videos`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    const data = await response.json();

    // If database has videos, use them
    if (data.horizontalVideos?.length > 0 || data.verticalVideos?.length > 0) {
      return {
        horizontalVideos: data.horizontalVideos || [],
        verticalVideos: data.verticalVideos || [],
      };
    }

    // Fallback to static data if no videos in database
    return DATA.portfolio;
  } catch (error) {
    console.error("Error fetching portfolio videos:", error);
    // Fallback to static data on error
    return DATA.portfolio;
  }
}

export default async function Home() {
  const { horizontalVideos, verticalVideos } = await getPortfolioVideos();

  return (
    <>
      <MobileNav />
      <main>
        <Hero />
        <Companies />
        <Services />
        <Portfolio
          horizontalVideos={horizontalVideos}
          verticalVideos={verticalVideos}
        />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
