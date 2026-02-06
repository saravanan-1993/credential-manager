"use client";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0a0a0a] border-t border-[#1f1f1f] mt-auto">
            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-center text-sm text-gray-500">
                    <span>© {currentYear} Magizh NexGen Technologies</span>
                </div>
            </div>
        </footer>
    );
}
