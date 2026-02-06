import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Github, ExternalLink } from 'lucide-react';
import api from '../lib/api';

export default function ProjectDetailPage() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/projects/projects/${slug}/`).then(res => {
            setProject(res.data);
            setLoading(false);
        });
    }, [slug]);

    if (loading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="bg-white min-h-screen pb-20">
            <header className="bg-gray-900 text-white py-20">
                <div className="container">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">{project.difficulty} Project</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
                    <p className="text-xl text-gray-300 max-w-2xl">{project.short_description}</p>
                </div>
            </header>

            <div className="container -mt-10 grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border p-8">
                    <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                    <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: project.description }} />
                    
                    <div className="mt-10">
                        <h3 className="text-xl font-bold mb-4">What you'll learn</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.learning_outcomes?.map((outcome, i) => (
                                <li key={i} className="flex gap-2 items-start">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span className="text-sm text-gray-700">{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg border p-6">
                        <h3 className="font-bold mb-4">Project Resources</h3>
                        <div className="space-y-3">
                            {project.starter_code_url && (
                                <a href={project.starter_code_url} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-3">
                                        <Github size={20} />
                                        <span className="text-sm font-medium">Starter Code</span>
                                    </div>
                                    <ExternalLink size={16} className="text-gray-400"/>
                                </a>
                            )}
                            {project.dataset_url && (
                                <a href={project.dataset_url} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-3">
                                        <Download size={20} />
                                        <span className="text-sm font-medium">Download Dataset</span>
                                    </div>
                                    <Download size={16} className="text-gray-400"/>
                                </a>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition">
                            Submit Project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
