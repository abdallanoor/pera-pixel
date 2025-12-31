"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/videos";

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError("");

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="admin"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          autoComplete="username"
          className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary transition-all duration-300"
        />
        <AnimatePresence>
          {errors.username && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-destructive"
            >
              {errors.username}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="current-password"
            className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary transition-all duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-destructive"
            >
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3 rounded-md bg-destructive/10 border border-destructive/20"
          >
            <p className="text-sm text-destructive">{serverError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-primary hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </motion.div>
    </motion.form>
  );
}

function LoginFormFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
      </div>
      <div className="h-10 w-full bg-muted rounded animate-pulse" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background dark:bg-[#020617] overflow-hidden p-6 text-foreground dark:text-white transition-colors duration-300">
      {/* Mesh Gradient Background Glows */}
      <motion.div
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 dark:bg-primary/30 rounded-full blur-[120px] pointer-events-none dark:mix-blend-screen opacity-50 transition-all duration-500"
      />

      <motion.div
        animate={{
          x: [100, -100, 100],
          y: [50, -50, 50],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 dark:bg-blue-600/30 rounded-full blur-[120px] pointer-events-none dark:mix-blend-screen opacity-50 transition-all duration-500"
      />

      <motion.div
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none dark:mix-blend-overlay transition-all duration-500"
      />

      {/* Precise Tech Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none [--grid-color:rgba(0,0,0,1)] dark:[--grid-color:rgba(255,255,255,0.1)]"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Card Container with Advanced Glassmorphism */}
        <div className="bg-background/40 backdrop-blur-[32px] border border-border/50 dark:border-primary/20 rounded-[32px] p-10 md:p-12 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] relative overflow-hidden transition-colors duration-300">
          {/* Internal Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 dark:bg-primary/20 blur-[60px] pointer-events-none" />

          {/* Subtle Border Gradient */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 pointer-events-none opacity-40" />

          <div className="text-center relative mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 120,
                damping: 12,
              }}
              className="flex justify-center mb-8"
            >
              <Link href="/">
                <div className="relative group p-1">
                  <div className="absolute -inset-4 bg-primary/15 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
                  <Image
                    src="/perapixel-logo.png"
                    alt="Perapixel Logo"
                    width={140}
                    height={42}
                    className="h-auto w-[140px] relative transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    priority
                  />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Admin Login
              </h1>
              <p className="text-muted-foreground text-sm">
                Secure access to PeraPixel dashboard
              </p>
            </motion.div>
          </div>

          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Floating Credit Text (Subtle) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground pointer-events-none"
        >
          Secure Admin Environment
        </motion.p>
      </motion.div>
    </div>
  );
}
