"use client";

import { User, ChevronDown, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const getPageTitle = (pathname: string) => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/clients")) return "Clients";
    if (pathname.includes("/projects")) return "Projects";
    if (pathname.includes("/assets")) return "Asset Vault";
    if (pathname.includes("/expiry")) return "Expiry Tracker";
    if (pathname.includes("/reports")) return "Reports";
    if (pathname.includes("/settings")) return "Settings";
    return "Dashboard";
};

export default function Header() {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { data: session } = useSession();

    const userName = session?.user?.name || "Admin";
    const userEmail = session?.user?.email || "admin@magizh.com";
    const userInitial = userName.charAt(0).toUpperCase();

    const handleLogout = () => {
        setShowUserMenu(false);
        signOut({ callbackUrl: "/login" });
    };

    return (
        <header className="h-16 bg-[#0a0a0a] border-b border-[#1f1f1f] flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Page Title */}
            <div>
                <h1 className="text-xl font-semibold text-white">
                    {getPageTitle(pathname)}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Welcome back, {userName}
                </p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            {userInitial}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-medium text-white">
                                {userName}
                            </p>
                            <p className="text-xs text-gray-500">
                                {session?.user?.role || "admin"}
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
                            <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl z-20 py-2 overflow-hidden">
                                <div className="px-4 py-3 border-b border-[#2a2a2a]">
                                    <p className="text-sm font-medium text-white">
                                        {userName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {userEmail}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-[#252525] transition-colors flex items-center gap-3"
                                >
                                    <User size={16} />
                                    Profile Settings
                                </button>
                                <div className="border-t border-[#2a2a2a] mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
