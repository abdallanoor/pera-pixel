"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import Image from "next/image";
import { SectionTag } from "@/components/SectionTag";
import { DATA } from "@/data/content";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
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
    className="rounded-3xl bg-neutral-900 p-8 shadow-lg"
  >
    <div className="flex flex-col items-start">
      <div className="flex gap-3 items-center">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image
            src={testimonial.avatar || "placeholder-img.png"}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-300">
            {testimonial.name}
          </h3>
          <p className="text-sm font-normal text-neutral-400">
            {testimonial.role}
          </p>
        </div>
      </div>
      <p className="text-base text-neutral-300 mt-4 leading-relaxed">
        {testimonial.content}
      </p>
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
          className="space-y-8 py-4"
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
    <section className="relative my-14">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center flex flex-col gap-2 items-center justify-center"
        >
          <SectionTag
            containerClassName="rounded-full"
            as="button"
            className="section-teg"
          >
            <span>Testimonials</span>
          </SectionTag>
          <h2 className="section-title">What our clients say</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-14 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden sm:mt-16 md:grid-cols-2 lg:grid-cols-3"
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
      </div>
    </section>
  );
}
