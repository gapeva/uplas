import { Code, GitBranch, Star, Eye } from 'lucide-react'
import { cn } from '../lib/utils'

const sampleProjects = [
  {
    id: 1,
    title: 'AI-Powered Image Classifier',
    description: 'Build a CNN to classify images using TensorFlow and deploy it as a web app.',
    difficulty: 'Intermediate',
    technologies: ['Python', 'TensorFlow', 'Flask'],
    stars: 234,
    views: 1250,
  },
  {
    id: 2,
    title: 'Sentiment Analysis Dashboard',
    description: 'Create a real-time sentiment analysis tool for social media data.',
    difficulty: 'Intermediate',
    technologies: ['Python', 'NLP', 'React'],
    stars: 189,
    views: 980,
  },
  {
    id: 3,
    title: 'Chatbot with LangChain',
    description: 'Build an intelligent chatbot using LangChain and OpenAI APIs.',
    difficulty: 'Advanced',
    technologies: ['Python', 'LangChain', 'OpenAI'],
    stars: 312,
    views: 1890,
  },
  {
    id: 4,
    title: 'Stock Price Predictor',
    description: 'Develop an LSTM model to predict stock prices using historical data.',
    difficulty: 'Advanced',
    technologies: ['Python', 'Keras', 'Pandas'],
    stars: 156,
    views: 876,
  },
  {
    id: 5,
    title: 'Face Recognition System',
    description: 'Create a face recognition system using OpenCV and deep learning.',
    difficulty: 'Intermediate',
    technologies: ['Python', 'OpenCV', 'dlib'],
    stars: 278,
    views: 1456,
  },
  {
    id: 6,
    title: 'Recommendation Engine',
    description: 'Build a movie recommendation system using collaborative filtering.',
    difficulty: 'Beginner',
    technologies: ['Python', 'Scikit-learn', 'Pandas'],
    stars: 145,
    views: 734,
  },
]

export default function ProjectsPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Projects</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Build portfolio-ready projects with our AI-generated project ideas. Apply your skills to real-world problems.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProjects.map(project => (
            <div key={project.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary dark:text-secondary" />
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  project.difficulty === 'Beginner' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                  project.difficulty === 'Intermediate' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                  project.difficulty === 'Advanced' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                )}>
                  {project.difficulty}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map(tech => (
                  <span key={tech} className="text-xs px-2 py-1 bg-light-border dark:bg-dark-border rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <span className="flex items-center gap-1">
                  <Star size={14} /> {project.stars}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {project.views}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Get personalized project recommendations based on your learning progress.
          </p>
          <a href="/#auth-section" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </div>
  )
}
