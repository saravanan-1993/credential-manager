"use client";

import { Search, MoreVertical, Filter, X, Eye, Plus, Edit, Github, ExternalLink, Copy, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Project, Client } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/api/projects');
            setProjects(data);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project => {
        const query = searchQuery.toLowerCase();
        const clientName = typeof project.client === 'object' ? project.client.companyName : '';
        return (
            project.name.toLowerCase().includes(query) ||
            (project.description && project.description.toLowerCase().includes(query)) ||
            clientName.toLowerCase().includes(query) ||
            project.status.toLowerCase().includes(query)
        );
    });

    if (loading) return <div className="text-white p-8">Loading Projects...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Projects</h1>
                    <p className="text-gray-400 mt-1">Manage your development projects and repositories.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 w-full md:w-64 transition-all"
                        />
                    </div>
                    <button className="bg-[#111] border border-[#222] text-gray-300 px-3 py-2.5 rounded-xl hover:text-white hover:border-[#333] transition-colors">
                        <Filter size={18} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all">
                        + Add Project
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111] border border-[#222] rounded-2xl shadow-sm overflow-visible">
                <table className="w-full text-left">
                    <thead className="bg-[#1a1a1a] text-gray-400 text-sm font-medium border-b border-[#222]">
                        <tr>
                            <th className="px-6 py-4">Project Name</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">GitHub</th>
                            <th className="px-6 py-4">Deployment</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {filteredProjects.map((project: Project) => (
                            <tr key={project._id} className="hover:bg-[#161616] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-sm">
                                            {project.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <Link href={`/dashboard/projects/${project._id}`}>
                                                <p className="font-medium text-white hover:text-blue-400 transition-colors cursor-pointer">{project.name}</p>
                                            </Link>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{project.description || "No description"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {typeof project.client === 'object' ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium">{project.client.companyName}</span>
                                            <span className="text-xs text-gray-500">{project.client.email}</span>
                                        </div>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {project.github?.frontend && (
                                            <a href={project.github.frontend} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-400 transition-colors" title="Frontend Repo">
                                                <Github size={16} />
                                            </a>
                                        )}
                                        {project.github?.backend && (
                                            <a href={project.github.backend} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-green-400 transition-colors" title="Backend Repo">
                                                <Github size={16} />
                                            </a>
                                        )}
                                        {!project.github?.frontend && !project.github?.backend && <span className="text-gray-500 text-xs">No repos</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {project.deploymentUrls?.frontend && (
                                            <a href={project.deploymentUrls.frontend} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-400 transition-colors" title="Frontend URL">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        {project.deploymentUrls?.backend && (
                                            <a href={project.deploymentUrls.backend} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-green-400 transition-colors" title="Backend API">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        {!project.deploymentUrls?.frontend && !project.deploymentUrls?.backend && <span className="text-gray-500 text-xs">Not deployed</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={() => setMenuOpen((current: string | null) => current === (project._id as string) ? null : (project._id as string))}
                                        className="text-gray-500 hover:text-white p-2 hover:bg-[#222] rounded-lg transition-colors"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {menuOpen === project._id && (
                                        <div className="absolute right-6 top-12 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Link
                                                href={`/dashboard/projects/${project._id}`}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-all w-full text-left"
                                            >
                                                <Eye size={16} /> View Details
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setEditingProject(project);
                                                    setMenuOpen(null);
                                                }}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-all w-full text-left"
                                            >
                                                <Edit size={16} /> Edit Project
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Are you sure you want to delete this project?")) {
                                                        try {
                                                            await api.delete(`/api/projects/${project._id}`);
                                                            setProjects(projects.filter(p => p._id !== project._id));
                                                            setMenuOpen(null);
                                                        } catch (e) { alert("Failed to delete project"); }
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-all w-full text-left"
                                            >
                                                <MoreVertical size={16} className="rotate-90" /> Delete Project
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No projects found. Click "Add Project" to create one.
                    </div>
                )}
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchProjects();
                }}
            />

            <EditProjectModal
                project={editingProject}
                onClose={() => setEditingProject(null)}
                onSuccess={() => {
                    setEditingProject(null);
                    fetchProjects();
                }}
            />
        </div>
    )
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

function CreateProjectModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        client: "",
        description: "",
        githubFrontend: "",
        githubBackend: "",
        envFrontend: "",
        envBackend: "",
        deploymentFrontend: "",
        deploymentBackend: "",
        status: "Development",
        techStackFrontend: "",
        techStackBackend: "",
        notes: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const { data } = await api.get('/api/clients');
                setClients(data);
            } catch (err) {
                console.error("Failed to fetch clients", err);
            }
        };
        if (isOpen) {
            fetchClients();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                name: formData.name,
                client: formData.client,
                description: formData.description,
                github: {
                    frontend: formData.githubFrontend,
                    backend: formData.githubBackend
                },
                env: {
                    frontend: formData.envFrontend,
                    backend: formData.envBackend
                },
                deploymentUrls: {
                    frontend: formData.deploymentFrontend,
                    backend: formData.deploymentBackend
                },
                status: formData.status,
                techStack: {
                    frontend: formData.techStackFrontend,
                    backend: formData.techStackBackend
                },
                notes: formData.notes
            };

            await api.post('/api/projects', payload);
            onSuccess();
            setFormData({
                name: "",
                client: "",
                description: "",
                githubFrontend: "",
                githubBackend: "",
                envFrontend: "",
                envBackend: "",
                deploymentFrontend: "",
                deploymentBackend: "",
                status: "Development",
                techStackFrontend: "",
                techStackBackend: "",
                notes: ""
            });
        } catch (err: any) {
            console.error("Failed to create project", err);
            const errMsg = err.response?.data?.msg || err.message || "Unknown error";
            alert(`Failed to create project: ${errMsg}`);
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
                        className="w-full max-w-3xl bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[#222] sticky top-0 bg-[#111] z-10">
                            <h2 className="text-xl font-bold text-white">Add New Project</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Project Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="My Awesome Project"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Client *</label>
                                        <select
                                            required
                                            value={formData.client}
                                            onChange={e => setFormData({ ...formData, client: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                        >
                                            <option value="">Select a client</option>
                                            {clients.map(client => (
                                                <option key={client._id} value={client._id}>{client.companyName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 min-h-[80px] resize-none"
                                        placeholder="Brief description of the project..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        <option value="Development">Development</option>
                                        <option value="Staging">Staging</option>
                                        <option value="Production">Production</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            {/* GitHub Repositories */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                    <Github size={16} /> GitHub Repositories
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Frontend Repo</label>
                                        <input
                                            type="url"
                                            value={formData.githubFrontend}
                                            onChange={e => setFormData({ ...formData, githubFrontend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="https://github.com/user/frontend"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Backend Repo</label>
                                        <input
                                            type="url"
                                            value={formData.githubBackend}
                                            onChange={e => setFormData({ ...formData, githubBackend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="https://github.com/user/backend"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Deployment URLs */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                    <ExternalLink size={16} /> Deployment URLs
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Frontend URL</label>
                                        <input
                                            type="url"
                                            value={formData.deploymentFrontend}
                                            onChange={e => setFormData({ ...formData, deploymentFrontend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="https://myapp.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Backend API URL</label>
                                        <input
                                            type="url"
                                            value={formData.deploymentBackend}
                                            onChange={e => setFormData({ ...formData, deploymentBackend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="https://api.myapp.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Tech Stack</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Frontend</label>
                                        <input
                                            type="text"
                                            value={formData.techStackFrontend}
                                            onChange={e => setFormData({ ...formData, techStackFrontend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="Next.js, React, TypeScript"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Backend</label>
                                        <input
                                            type="text"
                                            value={formData.techStackBackend}
                                            onChange={e => setFormData({ ...formData, techStackBackend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="Node.js, Express, MongoDB"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Environment Variables */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Environment Variables</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Frontend .env</label>
                                        <textarea
                                            value={formData.envFrontend}
                                            onChange={e => setFormData({ ...formData, envFrontend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none font-mono text-xs"
                                            placeholder="NEXT_PUBLIC_API_URL=..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Backend .env</label>
                                        <textarea
                                            value={formData.envBackend}
                                            onChange={e => setFormData({ ...formData, envBackend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none font-mono text-xs"
                                            placeholder="MONGODB_URI=..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 min-h-[80px] resize-none"
                                    placeholder="Additional notes about the project..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-[#222]">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function EditProjectModal({ project, onClose, onSuccess }: { project: Project | null; onClose: () => void; onSuccess: () => void }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        client: "",
        description: "",
        githubFrontend: "",
        githubBackend: "",
        envFrontend: "",
        envBackend: "",
        deploymentFrontend: "",
        deploymentBackend: "",
        status: "Development",
        techStackFrontend: "",
        techStackBackend: "",
        notes: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const { data } = await api.get('/api/clients');
                setClients(data);
            } catch (err) {
                console.error("Failed to fetch clients", err);
            }
        };
        if (project) {
            fetchClients();
        }
    }, [project]);

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                client: typeof project.client === 'object' ? project.client._id || "" : project.client || "",
                description: project.description || "",
                githubFrontend: project.github?.frontend || "",
                githubBackend: project.github?.backend || "",
                envFrontend: project.env?.frontend || "",
                envBackend: project.env?.backend || "",
                deploymentFrontend: project.deploymentUrls?.frontend || "",
                deploymentBackend: project.deploymentUrls?.backend || "",
                status: project.status || "Development",
                techStackFrontend: project.techStack?.frontend || "",
                techStackBackend: project.techStack?.backend || "",
                notes: project.notes || ""
            });
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project?._id) return;

        setIsLoading(true);
        try {
            const payload = {
                name: formData.name,
                client: formData.client,
                description: formData.description,
                github: {
                    frontend: formData.githubFrontend,
                    backend: formData.githubBackend
                },
                env: {
                    frontend: formData.envFrontend,
                    backend: formData.envBackend
                },
                deploymentUrls: {
                    frontend: formData.deploymentFrontend,
                    backend: formData.deploymentBackend
                },
                status: formData.status,
                techStack: {
                    frontend: formData.techStackFrontend,
                    backend: formData.techStackBackend
                },
                notes: formData.notes
            };

            await api.put(`/api/projects/${project._id}`, payload);
            onSuccess();
        } catch (err: any) {
            console.error("Failed to update project", err);
            const errMsg = err.response?.data?.msg || err.message || "Unknown error";
            alert(`Failed to update project: ${errMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {project && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-3xl bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[#222] sticky top-0 bg-[#111] z-10">
                            <h2 className="text-xl font-bold text-white">Edit Project</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Same form structure as CreateProjectModal but with pre-filled values */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Project Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="My Awesome Project"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Client *</label>
                                        <select
                                            required
                                            value={formData.client}
                                            onChange={e => setFormData({ ...formData, client: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                        >
                                            <option value="">Select a client</option>
                                            {clients.map(client => (
                                                <option key={client._id} value={client._id}>{client.companyName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 min-h-[80px] resize-none"
                                        placeholder="Brief description of the project..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        <option value="Development">Development</option>
                                        <option value="Staging">Staging</option>
                                        <option value="Production">Production</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                    <Github size={16} /> GitHub Repositories
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Frontend Repo</label>
                                        <input
                                            type="url"
                                            value={formData.githubFrontend}
                                            onChange={e => setFormData({ ...formData, githubFrontend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="https://github.com/user/frontend"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Backend Repo</label>
                                        <input
                                            type="url"
                                            value={formData.githubBackend}
                                            onChange={e => setFormData({ ...formData, githubBackend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="https://github.com/user/backend"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                    <ExternalLink size={16} /> Deployment URLs
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Frontend URL</label>
                                        <input
                                            type="url"
                                            value={formData.deploymentFrontend}
                                            onChange={e => setFormData({ ...formData, deploymentFrontend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="https://myapp.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Backend API URL</label>
                                        <input
                                            type="url"
                                            value={formData.deploymentBackend}
                                            onChange={e => setFormData({ ...formData, deploymentBackend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="https://api.myapp.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Tech Stack</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Frontend</label>
                                        <input
                                            type="text"
                                            value={formData.techStackFrontend}
                                            onChange={e => setFormData({ ...formData, techStackFrontend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="Next.js, React, TypeScript"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Backend</label>
                                        <input
                                            type="text"
                                            value={formData.techStackBackend}
                                            onChange={e => setFormData({ ...formData, techStackBackend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                                            placeholder="Node.js, Express, MongoDB"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Environment Variables</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Frontend .env</label>
                                        <textarea
                                            value={formData.envFrontend}
                                            onChange={e => setFormData({ ...formData, envFrontend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none font-mono text-xs"
                                            placeholder="NEXT_PUBLIC_API_URL=..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Backend .env</label>
                                        <textarea
                                            value={formData.envBackend}
                                            onChange={e => setFormData({ ...formData, envBackend: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none font-mono text-xs"
                                            placeholder="MONGODB_URI=..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-blue-500/50 min-h-[80px] resize-none"
                                    placeholder="Additional notes about the project..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-[#222]">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? "Updating..." : "Update Project"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
