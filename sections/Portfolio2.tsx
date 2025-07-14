import SectionHeader from "@/components/SectionHeader";
import { DATA } from "@/data/content";

export default function Portfolio2() {
  const Info = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    return (
      <div className="text-center max-w-2xl mx-auto py-6">
        <h3 className="text-2xl lg:text-4xl tracking-tighter font-medium mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground md:text-lg max-lg:max-w-lg max-lg:mx-auto lg:max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    );
  };
  return (
    <section className="container py-16">
      <SectionHeader tag="Portfolio" title="Cinematic Visual Experiences" />
      <div>
        <Info
          title="Horizontal Videos"
          description="Craft an immersive journey, inviting your audience to authentically connect with your brand, captivating them with the distinctive style it exudes."
        />
        <div className="flex flex-col gap-8 mt-2">
          {DATA.portfolio.horizontalVideos.map((video, index) => (
            <div key={index} className="aspect-video w-full">
              <iframe
                src={`${video.src}?autoplay=0&loop=0&muted=0&controls=1&portrait=0&title=0&byline=0&background=0&responsive=1&quality=360p&playsinline=1&fullscreen=1`}
                className="w-full h-full border-0 rounded-lg"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Info
          title="Vertical reels"
          description="Elevate your brand with captivating short-form video content tailored for discerning clients, reflecting your distinctive personality and style."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {DATA.portfolio.verticalVideos.map((video, index) => (
            <div key={index} className="aspect-[9/16] w-full">
              <iframe
                src={`${video.src}?autoplay=0&loop=0&muted=0&controls=1&portrait=0&title=0&byline=0&background=0&responsive=1&quality=360p&playsinline=1&fullscreen=1`}
                className="w-full h-full border-0 rounded-lg"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
