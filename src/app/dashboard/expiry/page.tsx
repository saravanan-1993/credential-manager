"use client";

import { Calendar, AlertTriangle, AlertCircle, CheckCircle, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Asset } from "@/types";

export default function ExpiryTrackerPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const { data } = await api.get('/api/assets');
                setAssets(data);
            } catch (err) {
                console.error("Failed to fetch assets for tracker", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const handleDownloadReport = () => {
        setExporting(true);
        try {
            const expiries = assets
                .filter(a => a.expiryDate)
                .map(a => ({
                    Client: typeof a.client === 'object' ? a.client.companyName : 'N/A',
                    Item: a.serviceName,
                    Type: a.category,
                    Expiry: new Date(a.expiryDate!).toLocaleDateString(),
                    DaysLeft: Math.ceil((new Date(a.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                }))
                .sort((a, b) => a.DaysLeft - b.DaysLeft);

            const headers = ["Client", "Item", "Type", "Expiry", "DaysLeft"];
            const csvContent = [
                headers.join(","),
                ...expiries.map(e => `"${e.Client}","${e.Item}","${e.Type}","${e.Expiry}","${e.DaysLeft}"`)
            ].join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `expiry_report_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <div className="text-white p-8">Loading Expiry Tracker...</div>;

    const critical = assets.filter(a => a.expiryDate && (new Date(a.expiryDate).getTime() - new Date().getTime()) < 7 * 24 * 60 * 60 * 1000).length;
    const warning = assets.filter(a => a.expiryDate && (new Date(a.expiryDate).getTime() - new Date().getTime()) < 30 * 24 * 60 * 60 * 1000).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Expiry Tracker</h1>
                    <p className="text-gray-400 mt-1">Monitor upcoming domain, hosting, and SSL expirations.</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    disabled={exporting}
                    className="bg-[#1a1a1a] border border-[#333] text-gray-300 px-4 py-2.5 rounded-xl hover:bg-[#222] hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {exporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                    Download Report
                </button>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] border border-[#222] p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{critical}</h3>
                        <p className="text-sm text-gray-400">Critical (Next 7 Days)</p>
                    </div>
                </div>
                <div className="bg-[#111] border border-[#222] p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{warning}</h3>
                        <p className="text-sm text-gray-400">Warning (Next 30 Days)</p>
                    </div>
                </div>
                <div className="bg-[#111] border border-[#222] p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{assets.length - warning}</h3>
                        <p className="text-sm text-gray-400">Healthy</p>
                    </div>
                </div>
            </div>

            {/* Expiry Timeline List */}
            <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[#222]">
                    <h3 className="font-semibold text-white">Upcoming Expirations</h3>
                </div>
                <div className="divide-y divide-[#222]">
                    {assets.filter(a => a.expiryDate).sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()).map((asset, i) => {
                        const daysLeft = Math.ceil((new Date(asset.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        const isCritical = daysLeft < 7;
                        const isWarning = daysLeft < 30;

                        return (
                            <div key={asset._id} className="p-4 flex items-center justify-between hover:bg-[#161616] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCritical ? 'bg-red-500/10 text-red-500' : isWarning ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{asset.serviceName}</h4>
                                        <p className="text-xs text-gray-400">{(asset.client as any)?.companyName || 'N/A'} • {asset.category}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={`font-mono text-sm ${isCritical ? 'text-red-400 font-bold' : isWarning ? 'text-yellow-400' : 'text-gray-400'}`}>
                                            {new Date(asset.expiryDate!).toISOString().split('T')[0]}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : `Expires in ${daysLeft} days`}
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10">
                                        Action
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {assets.filter(a => a.expiryDate).length === 0 && (
                        <div className="p-12 text-center text-gray-500">No upcoming expiries tracked.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
