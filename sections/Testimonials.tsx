"use client";
import { SectionTag } from "@/components/SectionTag";
import { DATA } from "@/data/content";
import Image from "next/image";
import { Fragment, useRef } from "react";
import { motion, useInView } from "motion/react";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const firstColumn = DATA.testimonials.slice(0, 3);
  const secondColumn = DATA.testimonials.slice(3, 6);
  const thirdColumn = DATA.testimonials.slice(6, 9);

  const TestimonialsColumn = (props: {
    testimonials: typeof DATA.testimonials;
    duration?: number;
  }) => (
    <motion.div
      animate={{
        translateY: "-50%",
      }}
      transition={{
        duration: props.duration || 10,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[...new Array(2)].map((_, index) => (
        <Fragment key={index}>
          {props.testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-3xl p-8 dark:bg-neutral-900">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Image
                    src={testimonial.imageSrc}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-medium tracking-tight leading-5">
                      {testimonial.name}
                    </h3>
                    <p className="tracking-tight leading-5 text-sm">
                      {testimonial.job}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-neutral-700 dark:text-neutral-300">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </Fragment>
      ))}
    </motion.div>
  );

  return (
    <section ref={ref} className="container mx-auto my-14 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex justify-center flex-col items-center gap-5"
      >
        <SectionTag
          containerClassName="rounded-full"
          as="button"
          className="flex items-center space-x-2 text-sm"
        >
          <span>Testimonials</span>
        </SectionTag>
        <h2 className="section-title">What our clients say</h2>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-h-screen overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_75%,transparent)]"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} duration={17} />
        </motion.div>
      </motion.div>
    </section>
  );
}
