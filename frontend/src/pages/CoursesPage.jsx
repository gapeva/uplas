import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Star, Filter, X } from 'lucide-react';
import api from '../lib/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
        fetchCourses();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedLevel]);

  const fetchCategories = async () => {
      try {
          const res = await api.get('/courses/categories/');
          setCategories(res.data.results || res.data);
      } catch (err) {
          console.error("Failed to load categories", err);
      }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category__slug', selectedCategory);
      if (selectedLevel) params.append('level', selectedLevel);

      const res = await api.get(`/courses/courses/?${params.toString()}`); 
      setCourses(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
      setSearchQuery('');
      setSelectedCategory('');
      setSelectedLevel('');
  };

  return (
    <div className="py-12 container mx-auto px-4">
      {/* Header & Search */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore AI Courses</h1>
        <p className="text-gray-600 mb-8">Find the right path to enhance your AI skills.</p>
        
        <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Search courses (e.g., Python, Machine Learning)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter size={18} />
              <span>Filters:</span>
          </div>
          <div className="flex flex-wrap gap-4">
              <select 
                className="border rounded px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
              </select>

              <select 
                className="border rounded px-3 py-2 bg-white focus:outline-none focus:border-blue-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
              </select>

              {(selectedCategory || selectedLevel || searchQuery) && (
                  <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">
                      Clear All
                  </button>
              )}
          </div>
      </div>

      {/* Course Grid */}
      {loading ? (
           <div className="text-center py-20">Loading courses...</div>
      ) : courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
            <div key={course.id} className="card hover:shadow-xl transition-shadow border rounded-lg overflow-hidden bg-white flex flex-col h-full">
                <div className="h-48 bg-gray-200 relative">
                    {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-blue-100 text-blue-500">🎓</div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 px-2 py-1 text-xs font-bold uppercase rounded shadow-sm text-gray-800">
                        {course.level}
                    </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        <Link to={`/courses/${course.slug}`} className="hover:text-blue-600 transition-colors">
                            {course.title}
                        </Link>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{course.short_description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1"><Users size={14}/> {course.total_enrollments || 0}</span>
                        <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor"/> {course.average_rating || "N/A"}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-lg">{course.price > 0 ? `$${course.price}` : 'Free'}</span>
                        <Link to={`/courses/${course.slug}`} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
            ))}
        </div>
      ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900">No courses found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
              <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline">View All Courses</button>
          </div>
      )}
    </div>
  );
}
