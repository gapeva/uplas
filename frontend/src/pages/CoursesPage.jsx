import { useState, useEffect } from 'react'
import { Search, Filter, Clock, Users, Star } from 'lucide-react'
import { cn } from '../lib/utils'

const sampleCourses = [
  {
    id: 1,
    title: 'Introduction to AI & Machine Learning',
    description: 'Learn the fundamentals of artificial intelligence and machine learning from scratch.',
    image: null,
    duration: '8 weeks',
    students: 1250,
    rating: 4.8,
    level: 'Beginner',
    category: 'AI Fundamentals',
  },
  {
    id: 2,
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis, visualization, and machine learning.',
    image: null,
    duration: '6 weeks',
    students: 2340,
    rating: 4.9,
    level: 'Beginner',
    category: 'Programming',
  },
  {
    id: 3,
    title: 'Deep Learning with TensorFlow',
    description: 'Build neural networks and deep learning models using TensorFlow and Keras.',
    image: null,
    duration: '10 weeks',
    students: 890,
    rating: 4.7,
    level: 'Intermediate',
    category: 'Deep Learning',
  },
  {
    id: 4,
    title: 'Natural Language Processing',
    description: 'Understand and implement NLP techniques for text analysis and language models.',
    image: null,
    duration: '8 weeks',
    students: 650,
    rating: 4.6,
    level: 'Advanced',
    category: 'NLP',
  },
  {
    id: 5,
    title: 'Computer Vision & Image Recognition',
    description: 'Learn to build image classification and object detection systems.',
    image: null,
    duration: '9 weeks',
    students: 720,
    rating: 4.8,
    level: 'Intermediate',
    category: 'Computer Vision',
  },
  {
    id: 6,
    title: 'AI Ethics & Responsible AI',
    description: 'Explore the ethical considerations and best practices in AI development.',
    image: null,
    duration: '4 weeks',
    students: 430,
    rating: 4.5,
    level: 'All Levels',
    category: 'AI Fundamentals',
  },
]

const categories = ['All', 'AI Fundamentals', 'Programming', 'Deep Learning', 'NLP', 'Computer Vision']
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [filteredCourses, setFilteredCourses] = useState(sampleCourses)

  useEffect(() => {
    let filtered = sampleCourses

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    if (selectedLevel !== 'All Levels') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    setFilteredCourses(filtered)
  }, [searchQuery, selectedCategory, selectedLevel])

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore AI Courses</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Master the skills you need to thrive in the AI-driven future. Our courses combine theory with hands-on practice.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input md:w-48"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input md:w-48"
          >
            {levels.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              No courses found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function CourseCard({ course }) {
  return (
    <div className="card overflow-hidden group cursor-pointer">
      <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <span className="text-4xl">🎓</span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            'text-xs px-2 py-1 rounded-full',
            course.level === 'Beginner' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            course.level === 'Intermediate' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            course.level === 'Advanced' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            course.level === 'All Levels' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          )}>
            {course.level}
          </span>
          <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            {course.category}
          </span>
        </div>
        <h3 className="font-semibold mb-2 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between text-sm text-light-text-secondary dark:text-dark-text-secondary">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span>{course.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
