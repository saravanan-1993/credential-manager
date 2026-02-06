import { Search } from "lucide-react";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ className, onSearch, ...props }: SearchInputProps) {
  return (
    <div className="relative group">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" 
        size={18} 
      />
      <input
        type="text"
        className={cn(
          "bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2.5 rounded-xl",
          "focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
          "w-full md:w-64 transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}
