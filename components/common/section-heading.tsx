import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-[#FF6600]">
          {label}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-[#333333] md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
