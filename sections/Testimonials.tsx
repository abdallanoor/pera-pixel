"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import Image from "next/image";
import { DATA } from "@/data/content";
import SectionHeader from "@/components/SectionHeader";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = memo(({ testimonial }: TestimonialCardProps) => (
  <motion.figure
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-6"
  >
    <div className="flex flex-col items-start">
      <div className="flex gap-3 items-center">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image
            src="user.svg"
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium">{testimonial.name}</h3>
          <p className="text-sm font-normal text-muted-foreground">
            {testimonial.role}
          </p>
        </div>
      </div>
      <p className="text-base mt-4 leading-relaxed">{testimonial.content}</p>
    </div>
  </motion.figure>
));

TestimonialCard.displayName = "TestimonialCard";

interface MarqueeColumnProps {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}

const MarqueeColumn = memo(
  ({ testimonials, duration = 60, className = "" }: MarqueeColumnProps) => {
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
      <div className={`relative overflow-hidden ${className}`}>
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
          className="space-y-6 py-4"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </motion.div>
      </div>
    );
  }
);

MarqueeColumn.displayName = "MarqueeColumn";

const testimonials: Testimonial[] = DATA.testimonials;

export default function Testimonials() {
  const column1 = testimonials.slice(0, 3);
  const column2 = testimonials.slice(3, 6);
  const column3 = testimonials.slice(6, 9);

  return (
    <section className="container relative py-12">
      <SectionHeader
        title="What our clients say"
        tag="Testimonials"
        discription="Real feedback from people we’ve worked with. Honest thoughts on how the videos helped them show their properties better."
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative mt-14 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-6 overflow-hidden sm:mt-16 md:grid-cols-2 lg:grid-cols-3"
      >
        <MarqueeColumn testimonials={column1} duration={20} />
        <MarqueeColumn
          testimonials={column2}
          duration={25}
          className="hidden md:block"
        />
        <MarqueeColumn
          testimonials={column3}
          duration={20}
          className="hidden lg:block"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      </motion.div>
    </section>
  );
}
