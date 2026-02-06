import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  intent?: "neutral" | "success" | "danger" | "warning";
}

export function StatsCard({ title, value, icon: Icon, trend, intent = "neutral" }: StatsCardProps) {
  const intentColors = {
    neutral: "bg-blue-500/10 text-blue-500",
    success: "bg-green-500/10 text-green-500",
    danger: "bg-red-500/10 text-red-500",
    warning: "bg-yellow-500/10 text-yellow-500"
  };

  const trendColors = {
    neutral: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    success: "bg-green-500/10 border-green-500/20 text-green-400",
    danger: "bg-red-500/10 border-red-500/20 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
  };

  return (
    <div className="bg-[#111] border border-[#222] p-5 rounded-2xl hover:border-[#333] transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          intentColors[intent]
        )}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs px-2 py-1 rounded-full border",
            trendColors[intent]
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1 group-hover:scale-[1.02] origin-left transition-transform">
          {value}
        </h3>
      </div>
    </div>
  );
}
