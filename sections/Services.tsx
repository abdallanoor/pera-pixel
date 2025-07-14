"use client";
import SectionHeader from "@/components/SectionHeader";
import { useState } from "react";
import { Play, Smartphone, Monitor, Drone } from "lucide-react";
import { motion } from "framer-motion";

export default function Services() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="services" className="relative container py-16">
      <SectionHeader tag="Services" title="Tailored video production" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div
            className="bg-card border rounded-2xl p-4 lg:p-8 transition-all duration-300 hover:shadow-lg group cursor-pointer"
            onMouseEnter={() => setHoveredCard("drone")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-card-foreground mb-2">
                  Basic Drone Videos
                </h3>
                <p className="text-muted-foreground mb-4">
                  Stunning aerial footage from above
                </p>
              </div>
              <div
                className={`transition-transform duration-300 ${hoveredCard === "drone" ? "scale-110 -translate-y-2" : ""}`}
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Drone className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="h-36 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-2">
                  <Play className="w-6 h-6 text-foreground ml-1" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Aerial Preview
                </span>
              </div>
            </div>
          </div>

          <div
            className="bg-card border rounded-2xl p-4 lg:p-8 transition-all duration-300 hover:shadow-lg group cursor-pointer"
            onMouseEnter={() => setHoveredCard("reels")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-card-foreground mb-2">
                  Instagram Reels
                </h3>
                <p className="text-muted-foreground mb-4">
                  Viral-ready social content
                </p>
              </div>
              <div
                className={`transition-transform duration-300 ${hoveredCard === "reels" ? "scale-110 rotate-3" : ""}`}
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="h-36 bg-muted rounded-lg flex items-center justify-center">
              <div className="w-16 h-28 bg-background rounded-xl border-2 border-border flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-1">
                    <Play className="w-4 h-4 text-muted-foreground ml-0.5" />
                  </div>
                  <div className="w-12 h-1 bg-muted rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-card border rounded-2xl p-4 lg:p-8 transition-all duration-300 hover:shadow-lg group cursor-pointer"
          onMouseEnter={() => setHoveredCard("horizontal")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`transition-transform duration-300 ${hoveredCard === "horizontal" ? "scale-110" : ""}`}
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-semibold text-card-foreground mb-2">
                    Full Tour Videos
                  </h3>
                  <p className="text-muted-foreground">
                    Cinematic horizontal presentations
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`transition-transform duration-300 ${hoveredCard === "horizontal" ? "scale-105 -translate-y-2" : ""}`}
            >
              <div className="bg-muted rounded-lg p-3">
                {/* Mac-style header */}
                <div className="flex gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                {/* Video area */}
                <div className="bg-background rounded aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                      <Play className="w-8 h-8 text-muted-foreground ml-1" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Cinematic Preview
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
