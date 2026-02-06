"use client";

import { Save, User, Shield, Bell, Lock } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState({ first: "Saravanan", last: "MNT", email: "owner@magizh.com" });

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your account and application preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Settings Sidebar */}
                <div className="space-y-1">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <User size={18} /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'security' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Shield size={18} /> Security
                    </button>
                    <button
                        onClick={() => setActiveTab("notifications")}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'notifications' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab("api")}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'api' ? 'bg-blue-600/10 text-blue-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Lock size={18} /> API Keys
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === 'profile' ? (
                        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">First Name</label>
                                        <input
                                            type="text"
                                            value={profile.first}
                                            onChange={e => setProfile({ ...profile, first: e.target.value })}
                                            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Last Name</label>
                                        <input
                                            type="text"
                                            value={profile.last}
                                            onChange={e => setProfile({ ...profile, last: e.target.value })}
                                            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Role</label>
                                    <input type="text" defaultValue="Super Admin" disabled className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed" />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => alert("Settings saved successfully!")}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#111] border border-[#222] rounded-2xl p-12 text-center">
                            <p className="text-gray-400">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon.</p>
                        </div>
                    )}

                    <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
                        <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#222] rounded-xl">
                            <div>
                                <h4 className="text-sm font-medium text-white">Dark Mode</h4>
                                <p className="text-xs text-gray-500">Enable dark theme for the dashboard.</p>
                            </div>
                            <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
