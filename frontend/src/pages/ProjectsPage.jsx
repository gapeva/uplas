import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, Layers, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/projects/projects/')
           .then(res => setProjects(res.data.results || res.data))
           .catch(err => console.error(err))
           .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-20 text-center">Loading projects...</div>;

    return (
        <div className="py-12 container">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-bold mb-4">Real-World AI Projects</h1>
                <p className="text-gray-600">Build your portfolio with hands-on projects. Apply what you've learned in realistic scenarios.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(project => (
                    <div key={project.id} className="group bg-white rounded-2xl border hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <div className="absolute top-4 left-4 z-10">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                    project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {project.difficulty}
                                </span>
                            </div>
                            <img 
                                src={project.image || "https://placehold.co/600x400?text=Project"} 
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{project.short_description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.technologies?.slice(0, 3).map((tech, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <Link 
                                to={`/projects/${project.slug}`}
                                className="flex items-center justify-between w-full px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition group/btn"
                            >
                                <span className="font-bold text-sm">Start Project</span>
                                <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
