"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MailCheck,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  TimerReset,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const signals = [
  {
    label: "Faster checkout",
    value: "Save your details",
    icon: ShoppingBag,
  },
  {
    label: "Order updates",
    value: "Track every purchase",
    icon: PackageCheck,
  },
  {
    label: "Account safety",
    value: "Verify before access",
    icon: ShieldCheck,
  },
];

const highlights = [
  "Join flash sales with your saved account.",
  "Review orders without searching your email.",
  "Recover access when you forget your password.",
];

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  mode: "sign-in" | "sign-up" | "recover" | "verify";
  children: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  mode,
  children,
}: AuthShellProps) {
  return (
    <section className="relative isolate min-h-dvh overflow-hidden bg-background pt-20">
      <div className="absolute inset-x-0 top-14 h-px bg-border" />
      <div className="absolute left-0 top-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-destructive/10 blur-3xl" />

      <div className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="size-4" />
            </span>
            Go FlashArch
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link href="/sign-up" className="font-medium text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_31rem] lg:items-center lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.65, ease: smoothEase }}
          className="max-w-2xl"
        >
          <Badge variant="outline" className="mb-5 rounded-full">
            {eyebrow}
          </Badge>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[68ch] text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {signals.map((signal, index) => {
              const Icon = signal.icon;

              return (
                <motion.div
                  key={signal.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.5,
                    ease: smoothEase,
                  }}
                  className="rounded-lg border border-border bg-card/80 p-4"
                >
                  <Icon className="mb-4 size-4 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    {signal.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{signal.value}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card/70 p-4">
            <p className="text-sm font-semibold">Why create an account?</p>
            <div className="mt-4 grid gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.65, ease: smoothEase }}
          className="relative"
        >
          <div className="rounded-lg border border-border bg-card p-5 shadow-2xl shadow-primary/10 md:p-6">
            {children}
          </div>
          <AuthModeHint mode={mode} />
        </motion.div>
      </div>
    </section>
  );
}

function AuthModeHint({ mode }: { mode: AuthShellProps["mode"] }) {
  const content = {
    "sign-in": {
      icon: ShieldCheck,
      label: "Use the email and password you created for your account.",
    },
    "sign-up": {
      icon: MailCheck,
      label: "After sign up, check your email to finish verification.",
    },
    recover: {
      icon: TimerReset,
      label: "A reset code will help you get back into your account.",
    },
    verify: {
      icon: CheckCircle2,
      label: "Verification keeps your account ready for safe checkout.",
    },
  }[mode];
  const Icon = content.icon;

  return (
    <div className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-background/80 p-4 text-sm text-muted-foreground">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        {content.label}{" "}
        <Link href="/sign-in" className="font-medium text-primary">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
