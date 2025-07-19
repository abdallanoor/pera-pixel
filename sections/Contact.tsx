"use client";

import SectionHeader from "@/components/SectionHeader";
import React, { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleX, Instagram, Loader2, Mail } from "lucide-react";
import { submitContactForm } from "@/actions";
import { motion } from "framer-motion";

export default function Contact() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null
  );

  return (
    <section id="contact" className="container py-12">
      <SectionHeader
        tag="Contact"
        title="Get in Touch"
        discription="Looking for standout video content that gets results? Drop us a
        message and let’s make it happen."
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mx-auto w-full max-w-2xl"
      >
        <form className="my-8" action={formAction}>
          <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                type="text"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="name@email.com"
                required
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              name="message"
              placeholder="Your message"
              type="text"
            />
          </LabelInputContainer>
          <button
            className="group/btn relative flex items-center justify-center gap-2 h-11 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:pointer-events-none disabled:opacity-50"
            type="submit"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : ""}
            <span>Send Message</span>
            <BottomGradient />
          </button>
          {state && (
            <div
              className={`mt-4 flex gap-2 items-center ${state.success ? "text-green-400" : "text-destructive"}`}
            >
              <div>
                {state.success ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <CircleX size={20} />
                )}
              </div>
              <p>{state.message}</p>
            </div>
          )}

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </form>

        <div className="flex gap-4 flex-col md:flex-row">
          <a
            href="https://www.instagram.com/perapixel"
            className="group/btn shadow-input relative flex w-full items-center gap-2 rounded-md p-2 font-medium bg-muted dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            target="_blank"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-md flex items-center justify-center">
                <Instagram className="w-6 h-6 text-foreground" />
              </div>
            </div>
            <div className="text-sm">
              <h4 className="text-foreground font-medium">Instagram</h4>
              <p className="text-muted-foreground">@perapixel</p>
            </div>
            <BottomGradient />
          </a>
          <a
            href="mailto:info@perapixel.com"
            className="group/btn shadow-input relative flex w-full items-center gap-2 rounded-md p-2 font-medium bg-muted dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            target="_blank"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-md flex items-center justify-center">
                <Mail className="w-6 h-6 text-foreground" />
              </div>
            </div>
            <div className="text-sm">
              <h4 className="text-foreground font-medium">Email</h4>
              <p className="text-muted-foreground">info@perapixel.com</p>
            </div>
            <BottomGradient />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
