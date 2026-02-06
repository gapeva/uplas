import { Link } from 'react-router-dom'
import { BookOpen, FolderKanban, MessageSquare, Trophy, Clock, TrendingUp } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const stats = [
    { icon: BookOpen, label: 'Courses In Progress', value: '3', color: 'text-[var(--color-primary)]' },
    { icon: FolderKanban, label: 'Projects Completed', value: '5', color: 'text-[var(--color-secondary)]' },
    { icon: Clock, label: 'Hours Learned', value: '24', color: 'text-[var(--color-accent)]' },
    { icon: Trophy, label: 'Certificates', value: '2', color: 'text-[var(--color-success)]' },
  ]

  const recentCourses = [
    { id: 1, title: 'Introduction to Machine Learning', progress: 75, lastAccessed: '2 hours ago' },
    { id: 2, title: 'Python for AI Development', progress: 45, lastAccessed: '1 day ago' },
    { id: 3, title: 'Neural Networks Fundamentals', progress: 20, lastAccessed: '3 days ago' },
  ]

  return (
    <div className="py-8">
      <div className="container">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Learner'}! 👋
          </h1>
          <p className="text-[color:var(--current-text-color-secondary)]">
            Continue your AI learning journey. You're making great progress!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-[var(--color-primary-ultralight)] flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-[color:var(--current-text-color-secondary)]">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Continue Learning</h2>
                <Link to="/courses" className="text-sm text-[color:var(--current-link-color)] hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentCourses.map(course => (
                  <div key={course.id} className="p-4 rounded-lg bg-[var(--current-bg-color)] border border-[var(--current-border-color-light)]">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{course.title}</h3>
                      <span className="text-xs text-[color:var(--current-text-color-secondary)]">{course.lastAccessed}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-[var(--current-border-color)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <Link 
                      to={`/course/${course.id}`}
                      className="button button--primary button--small mt-3"
                    >
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/ai-tutor" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--current-bg-color)] hover:bg-[var(--color-primary-ultralight)] transition-colors">
                  <MessageSquare className="text-[var(--color-primary)]" size={20} />
                  <span className="font-medium">Ask AI Tutor</span>
                </Link>
                <Link to="/projects" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--current-bg-color)] hover:bg-[var(--color-primary-ultralight)] transition-colors">
                  <FolderKanban className="text-[var(--color-secondary)]" size={20} />
                  <span className="font-medium">My Projects</span>
                </Link>
                <Link to="/community" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--current-bg-color)] hover:bg-[var(--color-primary-ultralight)] transition-colors">
                  <TrendingUp className="text-[var(--color-accent)]" size={20} />
                  <span className="font-medium">Community</span>
                </Link>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="card p-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={24} />
                <h3 className="font-semibold">Learning Streak</h3>
              </div>
              <p className="text-3xl font-bold mb-1">7 Days 🔥</p>
              <p className="text-sm opacity-90">Keep it up! You're on a roll.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
