import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="container max-w-md text-center">
        <div className="text-8xl font-bold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={18} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}
