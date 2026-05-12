import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTAProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  href: string;
  variant?: "default" | "ops";
  className?: string;
}

export function CTA({
  title,
  subtitle,
  buttonText,
  href,
  variant = "default",
  className,
}: CTAProps) {
  const isOps = variant === "ops";

  return (
    <section
      className={cn(
        "w-full py-20 md:py-28",
        isOps ? "bg-[#1a1a1a] text-white" : "bg-background",
        className
      )}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        )}
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className={cn(
              "rounded-md px-8 text-base font-semibold",
              isOps
                ? "bg-[#FF6600] text-white hover:bg-[#e65c00]"
                : "bg-[#FF6600] text-white hover:bg-[#e65c00]"
            )}
          >
            <Link href={href}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
