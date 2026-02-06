import { MessageSquare, Users, TrendingUp, Award } from 'lucide-react'

export default function CommunityPage() {
  const stats = [
    { icon: Users, label: 'Active Members', value: '12,500+' },
    { icon: MessageSquare, label: 'Discussions', value: '45,000+' },
    { icon: TrendingUp, label: 'Topics', value: '1,200+' },
    { icon: Award, label: 'Mentors', value: '350+' },
  ]

  const forums = [
    { name: 'General Discussion', description: 'Chat about anything AI-related', topics: 234, posts: 1890 },
    { name: 'Course Help', description: 'Get help with course content', topics: 567, posts: 4532 },
    { name: 'Project Showcase', description: 'Share your AI projects', topics: 189, posts: 876 },
    { name: 'Career & Jobs', description: 'AI job opportunities and advice', topics: 312, posts: 2134 },
    { name: 'Study Groups', description: 'Find study partners', topics: 145, posts: 987 },
    { name: 'Resources & Tools', description: 'Share useful AI resources', topics: 278, posts: 1654 },
  ]

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Connect with fellow learners, share knowledge, and grow together in your AI journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary dark:text-secondary" />
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Forums */}
        <h2 className="text-2xl font-bold mb-6">Discussion Forums</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {forums.map((forum, index) => (
            <div key={index} className="card p-5 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-primary dark:text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{forum.name}</h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                    {forum.description}
                  </p>
                  <div className="flex gap-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    <span>{forum.topics} topics</span>
                    <span>{forum.posts} posts</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card p-8 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
          <h3 className="text-xl font-bold mb-2">Ready to Join?</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Sign up now to access all community features and connect with learners worldwide.
          </p>
          <a href="/#auth-section" className="btn btn-primary">Join the Community</a>
        </div>
      </div>
    </div>
  )
}
