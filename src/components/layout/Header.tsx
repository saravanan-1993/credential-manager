"use client";

import { Bell, Search, User, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const getPageTitle = (pathname: string) => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/clients")) return "Clients";
    if (pathname.includes("/assets")) return "Asset Vault";
    if (pathname.includes("/expiry")) return "Expiry Tracker";
    if (pathname.includes("/reports")) return "Reports";
    if (pathname.includes("/settings")) return "Settings";
    return "Dashboard";
};

export default function Header() {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="h-16 bg-[#0a0a0a] border-b border-[#1f1f1f] flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Page Title */}
            <div>
                <h1 className="text-xl font-semibold text-white">
                    {getPageTitle(pathname)}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Welcome back, Admin
                </p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-white">
                    <Search size={20} />
                </button>

                {/* Notifications */}
                <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-white relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            A
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-medium text-white">
                                Admin
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                admin
                            </p>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-20 py-2">
                                <div className="px-4 py-2 border-b border-[#2a2a2a]">
                                    <p className="text-sm font-medium text-white">
                                        Admin
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        admin@magizh.com
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#252525] transition-colors flex items-center gap-2"
                                >
                                    <User size={16} />
                                    Profile Settings
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
