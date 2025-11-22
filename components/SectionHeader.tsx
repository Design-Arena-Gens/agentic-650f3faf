import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, subtitle, icon, className }: Props) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {icon && <div className="text-accent">{icon}</div>}
      <div>
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-400 leading-snug">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
