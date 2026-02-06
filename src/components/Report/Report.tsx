"use client";

import { FileText, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import { Asset, Client } from "@/types";

export default function ReportsPage() {
    const [exporting, setExporting] = useState<string | null>(null);

    const downloadCSV = (data: any[], filename: string) => {
        if (data.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(","),
            ...data.map(row => headers.map(header => {
                const val = row[header] ?? "";
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportAssets = async (type: 'all' | 'forecast') => {
        setExporting(type);
        try {
            const { data: assets } = await api.get('/api/assets');

            let exportData = assets.map((asset: any) => ({
                Client: typeof asset.client === 'object' ? asset.client.companyName : (asset.client || 'N/A'),
                Category: asset.category,
                Service: asset.serviceName,
                Identifier: asset.identifier,
                Expiry: asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : 'Never',
                Notes: asset.notes || ''
            }));

            if (type === 'forecast') {
                const ninetyDaysFromNow = new Date();
                ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
                exportData = exportData.filter((a: any) => {
                    if (a.Expiry === 'Never') return false;
                    const expDate = new Date(a.Expiry);
                    return expDate <= ninetyDaysFromNow && expDate >= new Date();
                });
                downloadCSV(exportData, `expiry_forecast_${new Date().toISOString().split('T')[0]}.csv`);
            } else {
                downloadCSV(exportData, `all_assets_report_${new Date().toISOString().split('T')[0]}.csv`);
            }
        } catch (err) {
            console.error("Export failed", err);
            alert("Failed to export report data.");
        } finally {
            setExporting(null);
        }
    };

    const handleExportPDF = async (type: 'all' | 'forecast') => {
        setExporting(type + '_pdf');
        try {
            const { data: assets } = await api.get('/api/assets');
            let reportData = assets;
            if (type === 'forecast') {
                const ninetyDaysFromNow = new Date();
                ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
                reportData = assets.filter((a: any) => {
                    if (!a.expiryDate) return false;
                    const expDate = new Date(a.expiryDate);
                    return expDate <= ninetyDaysFromNow && expDate >= new Date();
                });
            }

            // Generate a simple printable report window
            const printWindow = window.open('', '_blank');
            if (!printWindow) return alert("Please allow popups for PDF generation");

            const title = type === 'forecast' ? 'Expiry Forecast (90 Days)' : 'All Assets Summary';

            printWindow.document.write(`
                <html>
                    <head>
                        <title>${title}</title>
                        <style>
                            body { font-family: sans-serif; padding: 40px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            h1 { color: #2563eb; }
                            .footer { margin-top: 30px; font-size: 12px; color: #666; }
                        </style>
                    </head>
                    <body>
                        <h1>${title}</h1>
                        <p>Report Generated: ${new Date().toLocaleString()}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Category</th>
                                    <th>Service</th>
                                    <th>Identifier</th>
                                    <th>Expiry</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${reportData.map((a: any) => `
                                    <tr>
                                        <td>${a.client?.companyName || 'N/A'}</td>
                                        <td>${a.category}</td>
                                        <td>${a.serviceName}</td>
                                        <td>${a.identifier}</td>
                                        <td>${a.expiryDate ? new Date(a.expiryDate).toLocaleDateString() : 'Never'}</td>
                                        <td>${a.currency || 'INR'} ${a.renewalCost || 0}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div class="footer">Magizh Vault - Portfolio Management Software</div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        } catch (err) {
            console.error("PDF Export failed", err);
        } finally {
            setExporting(null);
        }
    };

    const reports = [
        { id: 'summary', title: 'Client Asset Summary', desc: 'Comprehensive list of all assets grouped by client.', csv: () => handleExportAssets('all'), pdf: () => handleExportPDF('all') },
        { id: 'forecast', title: 'Expiry Forecast', desc: 'Upcoming domain and hosting expirations for next 90 days.', csv: () => handleExportAssets('forecast'), pdf: () => handleExportPDF('forecast') },
        { id: 'audit', title: 'Security Audit Log', desc: 'Detailed log of all access attempts and credential reveals.', csv: () => alert("Coming soon"), pdf: () => alert("Coming soon") }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reports Center</h1>
                    <p className="text-gray-400 mt-1">Generate and download system audits.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleExportAssets('all')}
                        disabled={exporting !== null}
                        className="bg-[#1a1a1a] border border-[#333] text-gray-300 px-4 py-2.5 rounded-xl hover:bg-[#222] hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {exporting === 'all' ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        CSV Export
                    </button>
                    <button
                        onClick={() => handleExportPDF('all')}
                        disabled={exporting !== null}
                        className="bg-blue-600 border border-blue-500 text-white px-4 py-2.5 rounded-xl hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                    >
                        {exporting === 'all_pdf' ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        PDF Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-[#111] p-6 rounded-2xl border border-[#222] hover:border-blue-500/30 transition-all group hover:shadow-2xl hover:shadow-blue-900/10">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{report.title}</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[40px]">{report.desc}</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={report.csv}
                                disabled={exporting !== null}
                                className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span className="font-semibold text-xs">CSV</span>
                            </button>
                            <button
                                onClick={report.pdf}
                                disabled={exporting !== null}
                                className="py-2.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-sm text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span className="font-semibold text-xs">PDF</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
