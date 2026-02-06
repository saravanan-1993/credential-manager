"use client";

import { Home, Users, Database, Shield, FileText, Settings, LogOut, Command } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Clients", icon: Users, href: "/dashboard/clients" },
    { name: "Asset Vault", icon: Database, href: "/dashboard/assets" },
    { name: "Expiry Tracker", icon: Shield, href: "/dashboard/expiry" },
    { name: "Reports", icon: FileText, href: "/dashboard/reports" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-[#0a0a0a] border-r border-[#1f1f1f] flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    M
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Magizh Vault</span>
            </div>

            <div className="px-4 mb-6">
                <button className="w-full flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-gray-400 px-3 py-2 rounded-lg text-sm transition-colors">
                    <Command size={14} />
                    <span>Search assets...</span>
                    <span className="ml-auto text-xs bg-[#333] px-1.5 py-0.5 rounded text-gray-500">⌘K</span>
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-500"
                                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                            )}
                        >
                            <Icon size={18} className={cn("transition-colors", isActive ? "text-blue-500" : "text-gray-500 group-hover:text-white")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#1f1f1f]">
                <div className="bg-[#1a1a1a] rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Storage Used</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                            <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-400">65%</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
