import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, X } from 'lucide-react';
import api from '../lib/api';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    
    // Filters
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Posts & Categories
                const [postsRes, catsRes] = await Promise.all([
                    api.get('/blog/posts/'),
                    api.get('/blog/categories/')
                ]);
                setPosts(postsRes.data.results || postsRes.data);
                setCategories(catsRes.data.results || catsRes.data);
            } catch (err) {
                console.error("Error fetching blog data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to filter posts locally (or call API with params in real implementation)
    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeCategory === 'All' || post.category?.name === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20"></div> {/* Subtle overlay */}
                <div className="container relative z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Uplas AI Insights</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Explore the latest in AI trends, education, ethics, and how Uplas is shaping the future of learning.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-10 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <div className="container py-12 px-4">
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    <button 
                        onClick={() => setActiveCategory('All')}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                            activeCategory === 'All' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All Posts
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                                activeCategory === cat.name
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading articles...</div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <article key={post.id} className="flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 group">
                                <Link to={`/blog/${post.slug}`} className="h-56 bg-gray-200 overflow-hidden relative">
                                    <img 
                                        src={post.featured_image || "https://placehold.co/600x400?text=AI+Article"} 
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    {post.category && (
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-gray-900 rounded-full shadow-sm">
                                            {post.category.name}
                                        </span>
                                    )}
                                </Link>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition leading-snug">
                                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t mt-auto">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-blue-500" />
                                            <span>{post.author?.full_name || 'Uplas Team'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed">
                        <h3 className="text-xl font-medium text-gray-900">No articles found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                        <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-blue-600 font-medium">Clear Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
