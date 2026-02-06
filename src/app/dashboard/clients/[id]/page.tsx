"use client";

import { useEffect, useState, use } from "react";
import {
    ArrowLeft,
    Globe,
    Server,
    Database,
    Key,
    Mail,
    Download,
    Printer,
    Mail as MailIcon,
    Phone,
    Calendar,
    Check,
    XCircle
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Asset, Client } from "@/types";
import { motion } from "framer-motion";

export default function ClientProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const [client, setClient] = useState<Client | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClientData = async () => {
        try {
            const { data } = await api.get(`/api/clients/${params.id}`);
            setClient(data.client);
            setAssets(data.assets);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch client data", err);
            if (err.response?.status === 404) {
                setError('Client not found. It may have been deleted.');
            } else if (err.code === 'ERR_NETWORK') {
                setError('Cannot connect to backend. Please ensure the backend server is running.');
            } else {
                setError('Failed to load client data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientData();
    }, [params.id]);

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

    const handleDownloadExcel = () => {
        if (!client || assets.length === 0) return;
        const headers = ["Category", "Service Name", "Identifier", "Username", "Expiry Date", "Renewal Cost", "Currency", "Notes"];
        const csvContent = [
            headers.join(","),
            ...assets.map(asset => [
                asset.category,
                asset.serviceName,
                asset.identifier,
                asset.credentials?.username || "N/A",
                asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : "Never",
                asset.renewalCost || 0,
                asset.currency || "INR",
                `"${(asset.notes || "").replace(/"/g, '""')}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${client.companyName}_Assets_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPaymentRequest = () => {
        if (!client || assets.length === 0) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Payment Request - ${client.companyName}</title>
                    <style>
                        body { font-family: sans-serif; padding: 50px; line-height: 1.6; color: #333; }
                        .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
                        h1 { color: #2563eb; margin: 0; }
                        .client-info { margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
                        th { background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; }
                        .total { text-align: right; font-size: 20px; font-weight: bold; }
                        .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 20px; }
                        .bank-details { background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="header"><h1>RENEWAL NOTICE</h1><p>Magizh Vault Portfolio Management</p></div>
                    <div class="client-info"><strong>Bill To:</strong><br>${client.companyName}<br>Attn: ${client.contactPerson}<br>${client.email}</div>
                    <p>Dear ${client.contactPerson}, the following assets are due for renewal. Please process the payment to ensure uninterrupted service.</p>
                    <table>
                        <thead><tr><th>Description</th><th>Identifier</th><th>Expiry Date</th><th>Renewal Amount</th></tr></thead>
                        <tbody>${assets.map(a => `<tr><td>${a.category} - ${a.serviceName}</td><td>${a.identifier}</td><td>${a.expiryDate ? new Date(a.expiryDate).toLocaleDateString() : 'N/A'}</td><td>${a.currency || 'INR'} ${a.renewalCost || 0}</td></tr>`).join('')}</tbody>
                    </table>
                    <div class="total">Total Due: ₹${assets.reduce((sum, a) => sum + (a.renewalCost || 0), 0).toLocaleString()}</div>
                    <div class="bank-details"><strong>Bank Transfer Details:</strong><br>Account Name: Magizh Network Technologies<br>Bank: YOUR_BANK_NAME<br>IFSC: YOUR_IFSC_CODE<br>Account Number: YOUR_ACCOUNT_NUMBER</div>
                    <div class="footer">This is a computer-generated document. For queries, contact support@magizh.com</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    const toggleClientStatus = async () => {
        if (!client) return;
        const newStatus = client.status === 'Active' ? 'Inactive' : 'Active';
        try {
            await api.put(`/api/clients/${client._id}`, { status: newStatus });
            setClient({ ...client, status: newStatus });
        } catch (e) { alert("Failed to update status"); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading client profile...</p>
                </div>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="space-y-6">
                <Link href="/dashboard/clients" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} /><span>Back to Clients</span>
                </Link>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Client Not Found</h3>
                        <p className="text-red-400 mb-6">{error || 'The requested client does not exist.'}</p>
                        <Link
                            href="/dashboard/clients"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Clients List
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const totalRenewalVal = assets.reduce((sum, asset) => sum + (asset.renewalCost || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
                <Link href="/dashboard/clients" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} /><span>Back to Clients</span>
                </Link>
                <div className="flex gap-3">
                    <button onClick={handleDownloadPaymentRequest} className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-600/20 transition-all font-medium">
                        <MailIcon size={18} /> Payment Report
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] text-gray-300 px-4 py-2 rounded-xl hover:text-white transition-all">
                        <Printer size={18} /> PDF / Print
                    </button>
                    <button onClick={handleDownloadExcel} className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] text-gray-300 px-4 py-2 rounded-xl hover:text-white transition-all">
                        <Download size={18} /> Excel (CSV)
                    </button>
                </div>
            </div>

            <div className="bg-[#111] border border-[#222] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20">
                        {client.companyName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">{client.companyName}</h1>
                            <div className="flex flex-wrap gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-gray-400 text-sm"><Globe size={14} /> {client.website || "No Website"}</span>
                                <span className="flex items-center gap-1.5 text-gray-400 text-sm"><MailIcon size={14} /> {client.email}</span>
                                <span className="flex items-center gap-1.5 text-gray-400 text-sm"><Phone size={14} /> {client.phone || "No Phone"}</span>
                            </div>
                        </div>
                        <div className="flex gap-6 pt-4 border-t border-[#222]">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project Type</p>
                                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/20">{client.projectType}</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                <button onClick={toggleClientStatus} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {client.status === 'Active' ? <Check size={12} /> : <XCircle size={12} />}{client.status}
                                </button>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Annual Renewal</p>
                                <p className="text-lg font-bold text-emerald-400">₹{totalRenewalVal.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Associated Assets</h2>
                    <span className="text-sm text-gray-500 tracking-wide">{assets.length} items found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map((asset) => {
                        const Icon = getIcon(asset.category);
                        return (
                            <motion.div key={asset._id} whileHover={{ y: -5 }} className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-[#1a1a1a] rounded-xl text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors"><Icon size={20} /></div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-tighter">Renewal Cost</p>
                                        <p className="font-bold text-white">{asset.currency || "INR"} {asset.renewalCost || 0}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{asset.serviceName}</h3>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{asset.identifier}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#1a1a1a]">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={12} /><span>{asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : "No Expiry"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 justify-end">
                                            <button onClick={async () => {
                                                if (confirm("Confirm payment received and renew for 1 year?")) {
                                                    try {
                                                        await api.put(`/api/assets/renew/${asset._id}`);
                                                        fetchClientData();
                                                    } catch (e) { alert("Failed to renew"); }
                                                }
                                            }} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest px-2 py-1 bg-emerald-500/5 rounded hover:bg-emerald-500/10 transition-all border border-emerald-500/10">
                                                Paid & Renew
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .bg-[#111] { background: #f9f9f9 !important; border: 1px solid #ddd !important; }
                    .text-white { color: black !important; }
                    .text-gray-400, .text-gray-500 { color: #666 !important; }
                    .border-[#222], .border-[#1a1a1a] { border-color: #eee !important; }
                    .shadow-2xl, .shadow-xl { shadow: none !important; }
                }
            `}</style>
        </div>
    );
}
