"use client";

import { cn } from "@/lib/utils";

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export const BentoGrid = ({
  className,
  children,
}: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[240px] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

interface BentoGridItemProps {
  className?: string;
  title?: string;
  description?: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridItemProps) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition duration-200 hover:shadow-xl hover:shadow-zinc-800/20",
        className
      )}
    >
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="h-40 w-full overflow-hidden rounded-xl">
          {header}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-zinc-100 text-lg">{title}</h3>
          </div>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
  );
}; 