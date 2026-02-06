"use client";

import { Search, MoreVertical, Filter, X, Eye, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Client } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);

    const fetchClients = async () => {
        try {
            const { data } = await api.get('/api/clients');
            setClients(data);
        } catch (err) {
            console.error("Failed to fetch clients", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    if (loading) return <div className="text-white p-8">Loading Clients...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Clients</h1>
                    <p className="text-gray-400 mt-1">Manage your client organizations and projects.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 w-full md:w-64 transition-all"
                        />
                    </div>
                    <button className="bg-[#111] border border-[#222] text-gray-300 px-3 py-2.5 rounded-xl hover:text-white hover:border-[#333] transition-colors">
                        <Filter size={18} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all">
                        + Add Client
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#1a1a1a] text-gray-400 text-sm font-medium border-b border-[#222]">
                        <tr>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Contact Person</th>
                            <th className="px-6 py-4">Project Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {clients.map((client: Client) => (
                            <tr key={client._id} className="hover:bg-[#161616] transition-colors group cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                                            {client.companyName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <Link href={`/dashboard/clients/${client._id}`}>
                                                <p className="font-medium text-white hover:text-blue-400 transition-colors cursor-pointer">{client.companyName}</p>
                                            </Link>
                                            <p className="text-xs text-gray-500">{client.website || "No Website"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    <div className="flex flex-col">
                                        <span>{client.contactPerson}</span>
                                        <span className="text-xs text-gray-500">{client.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                                        {client.projectType}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm flex items-center gap-2 ${client.status === 'Inactive' ? 'text-red-400' : 'text-emerald-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${client.status === 'Inactive' ? 'bg-red-400' : 'bg-emerald-400'}`}></span> {client.status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={() => setMenuOpen((current: string | null) => current === (client._id as string) ? null : (client._id as string))}
                                        className="text-gray-500 hover:text-white p-2 hover:bg-[#222] rounded-lg transition-colors"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {menuOpen === client._id && (
                                        <div className="absolute right-6 top-12 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Link
                                                href={`/dashboard/clients/${client._id}`}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-all w-full text-left"
                                            >
                                                <Eye size={16} /> View Profile
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Are you sure you want to delete this client?")) {
                                                        try {
                                                            await api.delete(`/api/clients/${client._id}`);
                                                            setClients(clients.filter(c => c._id !== client._id));
                                                            setMenuOpen(null);
                                                        } catch (e) { alert("Failed to delete client"); }
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-all w-full text-left"
                                            >
                                                <MoreVertical size={16} className="rotate-90" /> Delete Client
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No clients found. Click "Add Client" to create one.
                    </div>
                )}
            </div>

            <CreateClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchClients();
                }}
            />
        </div>
    )
}

function CreateClientModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        companyName: "",
        contactPerson: "",
        email: "",
        projectType: "Web",
        website: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/api/clients', formData);
            onSuccess();
        } catch (err: any) {
            console.error("Failed to create client", err);
            const errMsg = err.response?.data?.msg || err.message || "Unknown error";
            alert(`Failed to create client: ${errMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-lg bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[#222]">
                            <h2 className="text-xl font-bold text-white">Add New Client</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                    placeholder="Acme Corp"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Contact Person</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contactPerson}
                                        onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                        placeholder="john@acme.com"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Project Type</label>
                                    <select
                                        value={formData.projectType}
                                        onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        <option value="Web">Web Development</option>
                                        <option value="App">App Development</option>
                                        <option value="SaaS">SaaS Product</option>
                                        <option value="SEO">SEO</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Website</label>
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                        placeholder="acme.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? "creating..." : "Create Client"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
