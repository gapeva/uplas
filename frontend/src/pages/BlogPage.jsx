import { Calendar, User, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const samplePosts = [
  {
    id: 1,
    title: 'The Future of AI in Education: Trends to Watch in 2025',
    excerpt: 'Explore how artificial intelligence is transforming the educational landscape and what it means for learners worldwide.',
    author: 'Dr. Sarah Chen',
    date: '2025-01-28',
    category: 'AI Trends',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Getting Started with Machine Learning: A Beginner\'s Guide',
    excerpt: 'A comprehensive introduction to machine learning concepts, tools, and your first project.',
    author: 'James Mwangi',
    date: '2025-01-25',
    category: 'Tutorials',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'How Uplas Uses AI to Personalize Your Learning Journey',
    excerpt: 'Behind the scenes of our AI-powered tutoring system and how it adapts to your unique learning style.',
    author: 'Uplas Team',
    date: '2025-01-22',
    category: 'Product',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Top 10 AI Skills Employers Are Looking For',
    excerpt: 'Discover the most in-demand AI skills and how to build a career in artificial intelligence.',
    author: 'Career Team',
    date: '2025-01-20',
    category: 'Career',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'Understanding Large Language Models: From GPT to Gemini',
    excerpt: 'A deep dive into how large language models work and their applications in various industries.',
    author: 'Dr. Sarah Chen',
    date: '2025-01-18',
    category: 'AI Trends',
    readTime: '10 min read',
  },
  {
    id: 6,
    title: 'Building Your First Neural Network with Python',
    excerpt: 'Step-by-step tutorial on creating a neural network from scratch using Python and NumPy.',
    author: 'James Mwangi',
    date: '2025-01-15',
    category: 'Tutorials',
    readTime: '12 min read',
  },
]

const categories = ['All', 'AI Trends', 'Tutorials', 'Product', 'Career']

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Uplas Blog</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Insights, tutorials, and news about AI, machine learning, and the future of education.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(category => (
            <button
              key={category}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors
                bg-light-border dark:bg-dark-border hover:bg-primary hover:text-white
                dark:hover:bg-secondary dark:hover:text-black"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="card overflow-hidden mb-12">
          <div className="grid md:grid-cols-2">
            <div className="h-64 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-6xl">📰</span>
            </div>
            <div className="p-8">
              <span className="text-sm text-primary dark:text-secondary font-medium">Featured</span>
              <h2 className="text-2xl font-bold mt-2 mb-4">{samplePosts[0].title}</h2>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                {samplePosts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
                <span className="flex items-center gap-1"><User size={14} /> {samplePosts[0].author}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {samplePosts[0].date}</span>
              </div>
              <button className="btn btn-primary">
                Read More <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePosts.slice(1).map(post => (
            <article key={post.id} className="card overflow-hidden group cursor-pointer">
              <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary">
                    {post.category}
                  </span>
                  <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary dark:group-hover:text-secondary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  <User size={12} />
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
