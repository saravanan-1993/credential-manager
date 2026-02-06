"use client";

import { Heart, Shield, Clock } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0a0a0a] border-t border-[#1f1f1f] mt-auto">
            <div className="max-w-420 mx-auto px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>© {currentYear} Magizh NexGen Technologies</span>
                        <span className="hidden md:inline">•</span>
                        <span className="flex items-center gap-1">
                            Made with <Heart size={14} className="text-red-500 fill-red-500" /> in India
                        </span>
                    </div>

                    {/* Center Section - Status */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-green-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>All Systems Operational</span>
                        </div>
                    </div>

                    {/* Right Section - Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <Link
                            href="/dashboard/settings"
                            className="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <Shield size={14} />
                            Security
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <Clock size={14} />
                            Activity Log
                        </Link>
                        <a
                            href="https://magizh.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            Help
                        </a>
                    </div>
                </div>

                {/* Bottom Section - Version & Info */}
                <div className="mt-4 pt-4 border-t border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-4">
                        <span>Version 1.0.0</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">Last Updated: Feb 2026</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="hover:text-gray-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <Link href="#" className="hover:text-gray-400 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
