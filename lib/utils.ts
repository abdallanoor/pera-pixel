import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleNavClick = (
  href: string,
  isMobileNav: boolean = false,
  setIsOpen?: (value: boolean) => void
) => {
  const scrollToElement = () => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isMobileNav && setIsOpen) {
    setIsOpen(false);
    setTimeout(() => {
      scrollToElement();
    }, 300);
  } else {
    scrollToElement();
  }
};
