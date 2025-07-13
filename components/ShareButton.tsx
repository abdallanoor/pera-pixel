import { ChevronRight } from "lucide-react";
import React from "react";

export default function ShareButton({
  icon,
  link,
  label,
}: {
  icon?: boolean;
  link: string;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="bg-slate-800 group cursor-pointer relative shadow-2xl rounded-full p-1 text-sm font-semibold text-white inline-block"
      onClick={(e) => {
        e.preventDefault();
        const element = document.querySelector(`#${link}`);
        element?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1 px-6 ring-1 ring-white/10">
        <span>{label}</span>
        {icon && <ChevronRight className="w-3 h-3" />}
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-500/0 via-blue-500/90 to-blue-500/0 transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  );
}
