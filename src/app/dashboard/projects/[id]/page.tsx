"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Project, Client } from "@/types";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, Copy, Eye, EyeOff, Edit, Calendar, Clock } from "lucide-react";

export default function ProjectDetailPage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFrontendEnv, setShowFrontendEnv] = useState(false);
    const [showBackendEnv, setShowBackendEnv] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await api.get(`/api/projects/${params.id}`);
                setProject(data);
            } catch (err) {
                console.error("Failed to fetch project", err);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    if (loading) return <div className="text-white p-8">Loading Project...</div>;
    if (!project) return <div className="text-white p-8">Project not found</div>;

    const client = typeof project.client === 'object' ? project.client : null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/projects" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                        <p className="text-gray-400 mt-1">{project.description || "No description provided"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                    </span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* GitHub Repositories */}
                    <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Github size={20} /> GitHub Repositories
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Frontend</p>
                                {project.github?.frontend ? (
                                    <a href={project.github.frontend} target="_blank" rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 text-sm break-all flex items-center gap-2">
                                        {project.github.frontend}
                                        <ExternalLink size={14} />
                                    </a>
                                ) : (
                                    <p className="text-gray-500 text-sm">Not configured</p>
                                )}
                            </div>
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Backend</p>
                                {project.github?.backend ? (
                                    <a href={project.github.backend} target="_blank" rel="noopener noreferrer"
                                        className="text-green-400 hover:text-green-300 text-sm break-all flex items-center gap-2">
                                        {project.github.backend}
                                        <ExternalLink size={14} />
                                    </a>
                                ) : (
                                    <p className="text-gray-500 text-sm">Not configured</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Deployment URLs */}
                    <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <ExternalLink size={20} /> Deployment URLs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Frontend</p>
                                {project.deploymentUrls?.frontend ? (
                                    <a href={project.deploymentUrls.frontend} target="_blank" rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 text-sm break-all flex items-center gap-2">
                                        {project.deploymentUrls.frontend}
                                        <ExternalLink size={14} />
                                    </a>
                                ) : (
                                    <p className="text-gray-500 text-sm">Not deployed</p>
                                )}
                            </div>
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Backend API</p>
                                {project.deploymentUrls?.backend ? (
                                    <a href={project.deploymentUrls.backend} target="_blank" rel="noopener noreferrer"
                                        className="text-green-400 hover:text-green-300 text-sm break-all flex items-center gap-2">
                                        {project.deploymentUrls.backend}
                                        <ExternalLink size={14} />
                                    </a>
                                ) : (
                                    <p className="text-gray-500 text-sm">Not deployed</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Environment Variables */}
                    <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Environment Variables</h2>
                        <div className="space-y-4">
                            {/* Frontend Env */}
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-medium text-blue-400">Frontend .env</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowFrontendEnv(!showFrontendEnv)}
                                            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#222] transition-colors"
                                            title={showFrontendEnv ? "Hide" : "Show"}
                                        >
                                            {showFrontendEnv ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        {project.env?.frontend && (
                                            <button
                                                onClick={() => copyToClipboard(project.env?.frontend || "", "frontend")}
                                                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#222] transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {project.env?.frontend ? (
                                    <pre className="text-xs font-mono bg-[#050505] p-3 rounded-lg overflow-x-auto text-gray-300 whitespace-pre-wrap">
                                        {showFrontendEnv ? project.env.frontend : "••••••••••••••••••••\n••••••••••••••••\n••••••••••••"}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500 text-sm">No environment variables configured</p>
                                )}
                                {copied === "frontend" && (
                                    <p className="text-xs text-green-400 mt-2">Copied to clipboard!</p>
                                )}
                            </div>

                            {/* Backend Env */}
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-medium text-green-400">Backend .env</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowBackendEnv(!showBackendEnv)}
                                            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#222] transition-colors"
                                            title={showBackendEnv ? "Hide" : "Show"}
                                        >
                                            {showBackendEnv ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        {project.env?.backend && (
                                            <button
                                                onClick={() => copyToClipboard(project.env?.backend || "", "backend")}
                                                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#222] transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {project.env?.backend ? (
                                    <pre className="text-xs font-mono bg-[#050505] p-3 rounded-lg overflow-x-auto text-gray-300 whitespace-pre-wrap">
                                        {showBackendEnv ? project.env.backend : "••••••••••••••••••••\n••••••••••••••••\n••••••••••••"}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500 text-sm">No environment variables configured</p>
                                )}
                                {copied === "backend" && (
                                    <p className="text-xs text-green-400 mt-2">Copied to clipboard!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {project.notes && (
                        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Notes</h2>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{project.notes}</p>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar Info */}
                <div className="space-y-6">
                    {/* Client Info */}
                    {client && (
                        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Client</h2>
                            <Link href={`/dashboard/clients/${client._id}`} className="block">
                                <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#222] rounded-xl hover:border-blue-500/50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                                        {client.companyName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{client.companyName}</p>
                                        <p className="text-xs text-gray-500">{client.email}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Tech Stack */}
                    <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Tech Stack</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Frontend</p>
                                <p className="text-sm text-gray-300">{project.techStack?.frontend || "Not specified"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Backend</p>
                                <p className="text-sm text-gray-300">{project.techStack?.backend || "Not specified"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Timeline</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar size={14} className="text-gray-500" />
                                <span className="text-gray-500">Created:</span>
                                <span className="text-gray-300">
                                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Unknown"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={14} className="text-gray-500" />
                                <span className="text-gray-500">Updated:</span>
                                <span className="text-gray-300">
                                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "Unknown"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'Production':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'Staging':
            return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        case 'Development':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'Maintenance':
            return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        case 'Archived':
            return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        default:
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
}
