import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Bot, 
    Terminal, 
    BookOpen, 
    GitBranch, 
    Users, 
    PlusCircle,
    Play,
    Save,
    X,
    MessageSquare,
    Eye
} from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';

export default function ProjectsPage() {
    const [activePanel, setActivePanel] = useState('dashboard');
    const [userProjects, setUserProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // IDE State
    const [currentIdeProject, setCurrentIdeProject] = useState(null);
    const [ideCode, setIdeCode] = useState("# Select a project to start coding...");
    const [ideOutput, setIdeOutput] = useState("");

    // AI Tutor State
    const [chatMessages, setChatMessages] = useState([{ role: 'assistant', text: "Hello! I'm your AI Project Assistant. Open a project and ask me anything." }]);
    const [chatInput, setChatInput] = useState("");

    useEffect(() => {
        fetchUserProjects();
    }, []);

    const fetchUserProjects = async () => {
        setLoading(true);
        try {
            const res = await api.get('/projects/user-projects/');
            setUserProjects(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to load user projects", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLaunchIde = (project) => {
        setCurrentIdeProject(project);
        setIdeCode(`# Workspace: ${project.project_title}\n\nprint("Hello World")`);
        setIdeOutput("Environment loaded.");
        setActivePanel('ide');
    };

    const handleRunCode = () => {
        setIdeOutput(`Running main.py...\n> Hello World\n> Process finished with exit code 0`);
    };

    const handleSendChat = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newUserMsg = { role: 'user', text: chatInput };
        setChatMessages(prev => [...prev, newUserMsg]);
        setChatInput("");

        // Mock AI Response
        setTimeout(() => {
            setChatMessages(prev => [...prev, { role: 'assistant', text: "That's a great question! Based on your current project context, I'd suggest checking the `requirements.txt` file first." }]);
        }, 1000);
    };

    // --- Sub-Components ---

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button 
            onClick={() => setActivePanel(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activePanel === id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100 overflow-hidden">
            
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 overflow-y-auto">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-lg font-bold tracking-wide">Project Tools</h2>
                </div>
                <nav className="mt-4">
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem id="ai-tutor" icon={Bot} label="AI Tutor" />
                    <SidebarItem id="ide" icon={Terminal} label="Cloud IDE" />
                    <SidebarItem id="resources" icon={BookOpen} label="Resources" />
                    <SidebarItem id="version-control" icon={GitBranch} label="Version Control" />
                    <SidebarItem id="collaboration" icon={Users} label="Team Hub" />
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto p-8 relative">
                
                {/* --- DASHBOARD PANEL --- */}
                {activePanel === 'dashboard' && (
                    <div className="max-w-6xl mx-auto animate-fadeIn">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <LayoutDashboard className="text-blue-600"/> Your AI Project Launchpad
                            </h1>
                            <p className="text-gray-600 mt-2">Track progress, manage creations, and access tools.</p>
                        </header>

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="text-gray-500 font-medium mb-1">Projects Started</h3>
                                <p className="text-3xl font-bold text-gray-900">{userProjects.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="text-gray-500 font-medium mb-1">Projects Completed</h3>
                                <p className="text-3xl font-bold text-gray-900">{userProjects.filter(p => p.status === 'completed').length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="text-gray-500 font-medium mb-1">Overall Progress</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '25%'}}></div>
                                </div>
                            </div>
                        </div>

                        {/* Projects List Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Current Projects</h2>
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                            >
                                <PlusCircle size={18} /> Start New Project
                            </button>
                        </div>

                        {/* Projects Grid */}
                        {loading ? (
                            <p>Loading projects...</p>
                        ) : userProjects.length > 0 ? (
                            <div className="grid gap-4">
                                {userProjects.map(proj => (
                                    <div key={proj.id} className="bg-white p-5 rounded-lg border shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-gray-900">{proj.project_title}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold ${
                                                    proj.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>{proj.status_display}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">Started: {new Date(proj.started_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* <button className="text-gray-600 hover:text-gray-900 border px-3 py-1.5 rounded text-sm flex items-center gap-2">
                                                <Eye size={16}/> Details
                                            </button> */}
                                            <button 
                                                onClick={() => handleLaunchIde(proj)}
                                                className="bg-gray-900 text-white hover:bg-black px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                            >
                                                <Terminal size={16} /> Workspace
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                                <p className="text-gray-500 mb-4">No projects yet.</p>
                                <button onClick={() => setIsCreateModalOpen(true)} className="text-blue-600 font-medium">Browse Catalog to Start One</button>
                            </div>
                        )}
                    </div>
                )}

                {/* --- IDE PANEL --- */}
                {activePanel === 'ide' && (
                    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden">
                        <header className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                            <h2 className="font-bold flex items-center gap-2 text-gray-700">
                                <Terminal size={18} /> 
                                {currentIdeProject ? `Workspace: ${currentIdeProject.project_title}` : "Cloud IDE"}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={handleRunCode} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                                    <Play size={14} /> Run
                                </button>
                                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm flex items-center gap-1">
                                    <Save size={14} /> Save
                                </button>
                            </div>
                        </header>
                        <div className="flex-1 flex flex-col">
                            <textarea 
                                className="flex-1 w-full p-4 font-mono text-sm bg-[#1e1e1e] text-[#d4d4d4] resize-none focus:outline-none"
                                value={ideCode}
                                onChange={(e) => setIdeCode(e.target.value)}
                                spellCheck="false"
                            ></textarea>
                            <div className="h-32 bg-gray-900 text-white p-4 font-mono text-xs overflow-auto border-t border-gray-700">
                                <div className="text-gray-400 mb-1">Output Terminal</div>
                                <pre>{ideOutput}</pre>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- AI TUTOR PANEL --- */}
                {activePanel === 'ai-tutor' && (
                    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden max-w-3xl mx-auto">
                        <header className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                            <h2 className="font-bold flex items-center gap-2">
                                <Bot size={20} /> AI Project Assistant
                            </h2>
                        </header>
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                        msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendChat} className="p-4 bg-white border-t flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ask about your code..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                            />
                            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                                <Play size={20} className="ml-1" /> {/* Send icon */}
                            </button>
                        </form>
                    </div>
                )}

                {/* --- PLACEHOLDERS FOR OTHER PANELS --- */}
                {['resources', 'version-control', 'collaboration'].includes(activePanel) && (
                    <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded-xl border">
                        <div className="text-center">
                            <p className="text-xl mb-2">Feature Coming Soon</p>
                            <p className="text-sm">This module is currently under development.</p>
                        </div>
                    </div>
                )}

            </main>

            {/* --- CREATE PROJECT MODAL --- */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                        <button 
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Start New Project</h2>
                        <p className="text-gray-600 mb-6">Enter details to initialize your new AI project workspace.</p>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Logic to create project via API would go here
                            setIsCreateModalOpen(false);
                            alert("This would create a project via API in the real app.");
                        }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                <input type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="e.g., Sentiment Analysis Bot" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Briefly describe your project goals..."></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
