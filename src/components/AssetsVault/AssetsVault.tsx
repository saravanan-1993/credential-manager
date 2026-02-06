"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Eye, EyeOff, Copy, Server, Globe, Database, Key, Mail, X, Download, Edit3 } from "lucide-react";
import api from "@/lib/api";
import { Asset, Client } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function AssetVaultPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
    const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [filterCategory, setFilterCategory] = useState("All Categories");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAssets = async () => {
        try {
            const { data } = await api.get('/api/assets');
            setAssets(data);
        } catch (err) {
            console.error("Failed to fetch assets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const toggleReveal = async (id: string) => {
        if (visiblePasswords[id]) {
            setVisiblePasswords(prev => ({ ...prev, [id]: false }));
            return;
        }
        try {
            if (decryptedPasswords[id]) {
                setVisiblePasswords(prev => ({ ...prev, [id]: true }));
                return;
            }
            const { data } = await api.get(`/api/assets/reveal/${id}`);
            const password = data.credentials?.password || data.credentials?.apiKey || "No Secret";
            setDecryptedPasswords(prev => ({ ...prev, [id]: password }));
            setVisiblePasswords(prev => ({ ...prev, [id]: true }));
        } catch (err) {
            console.error("Failed to reveal secret", err);
            alert("Failed to reveal secret.");
        }
    };

    const getIcon = (category: string) => {
        switch (category) {
            case "Domain": return Globe;
            case "Server": return Server;
            case "Database": return Database;
            case "Cloudinary": return Key;
            case "Email": return Mail;
            default: return Server;
        }
    };

    const filteredAssets = assets.filter((a: any) => {
        const matchesCategory = filterCategory === "All Categories" || a.category === filterCategory;
        const matchesSearch = a.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.identifier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.client?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Asset Vault</h1>
                    <p className="text-gray-400 mt-1">Securely manage and track technical assets.</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-[#1a1a1a] border border-[#222] text-gray-300 px-4 py-2.5 rounded-xl hover:text-white"
                    >
                        <option>All Categories</option>
                        <option>Domain</option>
                        <option>Hosting</option>
                        <option>Server</option>
                        <option>Database</option>
                        <option>Email</option>
                        <option>Cloudinary</option>
                        <option>Other</option>
                    </select>
                    <button
                        onClick={() => {
                            if (filteredAssets.length === 0) return alert("No assets to export");
                            const exportData = filteredAssets.map(asset => ({
                                Client: asset.client?.companyName || "N/A",
                                Category: asset.category,
                                Service: asset.serviceName,
                                Identifier: asset.identifier,
                                Username: asset.credentials?.username || "N/A",
                                Cost: asset.renewalCost || 0,
                                Currency: asset.currency || "INR",
                                Expiry: asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : "Never"
                            }));

                            const headers = Object.keys(exportData[0]);
                            const csvContent = [
                                headers.join(","),
                                ...exportData.map(row => headers.map(header => `"${String((row as any)[header]).replace(/"/g, '""')}"`).join(","))
                            ].join("\n");

                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.setAttribute("download", `assets_export_${new Date().toISOString().split('T')[0]}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="bg-[#1a1a1a] border border-[#222] text-gray-300 px-4 py-2.5 rounded-xl hover:text-white transition-all flex items-center gap-2"
                    >
                        <Download size={18} /> Export
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingAsset(null); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-500 shadow-lg flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Asset
                    </button>
                </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => {
                    const Icon = getIcon(asset.category);
                    const isVisible = visiblePasswords[asset._id];
                    const secretValue = decryptedPasswords[asset._id] || "••••••••";

                    return (
                        <div key={asset._id} className="bg-[#111] border border-[#222] rounded-2xl p-5 hover:border-[#333] transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-gray-400 group-hover:text-blue-400">
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{asset.serviceName}</h3>
                                        <p className="text-xs text-gray-400">{asset.client?.companyName || "Unknown Client"}</p>
                                    </div>
                                </div>
                                <span className="bg-[#1a1a1a] text-gray-400 px-2 py-1 rounded text-xs border border-[#2a2a2a]">
                                    {asset.category}
                                </span>
                            </div>

                            <div className="space-y-3 bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Host</span>
                                    <span className="text-gray-300 font-mono text-xs truncate max-w-[150px]">{asset.identifier}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Username</span>
                                    <span className="text-gray-300 font-mono text-xs">{asset.credentials?.username}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Secret</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono text-xs ${isVisible ? "text-yellow-400" : "text-gray-500"}`}>
                                            {isVisible ? secretValue : "••••••••"}
                                        </span>
                                        <button onClick={() => toggleReveal(asset._id)} className="text-gray-600 hover:text-white">
                                            {isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                <span>Expires: {asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : "N/A"}</span>
                                <button
                                    onClick={() => { setEditingAsset(asset); setIsModalOpen(true); }}
                                    className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                                >
                                    <Edit3 size={12} /> Edit Details
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AssetFormModal
                isOpen={isModalOpen}
                asset={editingAsset}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { setIsModalOpen(false); fetchAssets(); }}
            />
        </div>
    );
}

function AssetFormModal({ isOpen, asset, onClose, onSuccess }: { isOpen: boolean; asset: Asset | null; onClose: () => void; onSuccess: () => void }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        client: "",
        category: "Domain",
        serviceName: "",
        identifier: "",
        username: "",
        password: "",
        expiryDate: "",
        renewalCost: 0,
        currency: "INR",
        notes: ""
    });

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const { data } = await api.get('/api/clients');
                setClients(data || []);
                if (asset) {
                    setFormData({
                        client: typeof asset.client === 'string' ? asset.client : (asset.client as any)?._id || "",
                        category: asset.category,
                        serviceName: asset.serviceName,
                        identifier: asset.identifier,
                        username: asset.credentials?.username || "",
                        password: "••••••••", // Masked placeholder
                        expiryDate: asset.expiryDate ? new Date(asset.expiryDate).toISOString().split('T')[0] : "",
                        renewalCost: asset.renewalCost || 0,
                        currency: asset.currency || "INR",
                        notes: asset.notes || ""
                    });
                } else {
                    setFormData({
                        client: (data && data.length > 0) ? data[0]._id : "",
                        category: "Domain",
                        serviceName: "",
                        identifier: "",
                        username: "",
                        password: "",
                        expiryDate: "",
                        renewalCost: 0,
                        currency: "INR",
                        notes: ""
                    });
                }
            };
            fetchData();
        }
    }, [isOpen, asset]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = { ...formData, credentials: { username: formData.username, password: formData.password } };
        try {
            if (asset?._id) {
                await api.put(`/api/assets/${asset._id}`, payload);
            } else {
                await api.post('/api/assets', payload);
            }
            onSuccess();
        } catch (err: any) {
            alert("Failed to save: " + (err.response?.data?.msg || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-[#222]">
                            <h2 className="text-xl font-bold text-white">{asset ? "Edit Asset" : "Add New Asset"}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Client</label>
                                    <select
                                        required
                                        value={formData.client}
                                        onChange={e => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                    >
                                        <option value="">Select Client</option>
                                        {clients.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white">
                                        <option value="Domain">Domain</option><option value="Hosting">Hosting</option><option value="Server">Server</option><option value="Database">Database</option><option value="Email">Email</option><option value="Cloudinary">Cloudinary</option><option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Service Name</label>
                                <input required type="text" value={formData.serviceName} onChange={e => setFormData({ ...formData, serviceName: e.target.value })} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Identifier (URL/Host)</label>
                                <input required type="text" value={formData.identifier} onChange={e => setFormData({ ...formData, identifier: e.target.value })} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Username</label>
                                    <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Password / API Key</label>
                                    <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Expiry Date</label>
                                    <input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Cost</label>
                                        <input type="number" value={formData.renewalCost} onChange={e => setFormData({ ...formData, renewalCost: Number(e.target.value) })} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Currency</label>
                                        <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white">
                                            <option value="INR">INR (₹)</option><option value="USD">USD ($)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
                                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all">{isLoading ? "Saving..." : "Save Changes"}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
