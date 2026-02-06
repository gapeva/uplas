import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Users, Star } from 'lucide-react';
import api from '../lib/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Backend: CourseListView
      const res = await api.get('/courses/courses/'); 
      setCourses(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center py-20">Loading courses...</div>;

  return (
    <div className="py-12 container">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore AI Courses</h1>
        <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <div key={course.id} className="card hover:shadow-xl transition-shadow border rounded-lg overflow-hidden">
             <div className="h-48 bg-gray-200">
                {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover"/>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎓</div>
                )}
             </div>
             <div className="p-5">
                <span className="text-xs uppercase font-bold text-primary mb-2 block">{course.level}</span>
                <h3 className="text-xl font-bold mb-2">
                    <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.short_description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Users size={14}/> {course.total_enrollments}</span>
                    <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor"/> {course.average_rating}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">{course.price > 0 ? `$${course.price}` : 'Free'}</span>
                    <Link to={`/courses/${course.slug}`} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                        View Course
                    </Link>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
