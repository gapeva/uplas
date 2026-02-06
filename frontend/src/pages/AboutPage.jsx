import { Target, Users, Globe, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">About Uplas</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary text-center mb-12">
            Empowering the next generation of AI innovators through personalized, accessible education.
          </p>

          {/* Mission */}
          <div className="card p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-primary dark:text-secondary" />
              <h2 className="text-2xl font-bold m-0">Our Mission</h2>
            </div>
            <p className="text-light-text-secondary dark:text-dark-text-secondary m-0">
              At Uplas, we believe that AI education should be accessible to everyone, regardless of their 
              background or experience level. Our mission is to democratize AI learning by providing 
              personalized, engaging, and practical education that prepares learners for the AI-driven future.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-4 text-primary dark:text-secondary" />
              <h3 className="font-semibold mb-2">Community First</h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                We foster a supportive global community of learners and mentors.
              </p>
            </div>
            <div className="card p-6 text-center">
              <Globe className="w-10 h-10 mx-auto mb-4 text-primary dark:text-secondary" />
              <h3 className="font-semibold mb-2">Global Access</h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Education without borders - accessible from anywhere in the world.
              </p>
            </div>
            <div className="card p-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-4 text-primary dark:text-secondary" />
              <h3 className="font-semibold mb-2">Excellence</h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                We maintain the highest standards in our curriculum and platform.
              </p>
            </div>
          </div>

          {/* Story */}
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Uplas was founded in 2024 with a simple idea: AI education should adapt to each learner, 
            not the other way around. Our founders experienced firsthand the challenges of learning 
            AI through traditional methods - static videos, one-size-fits-all curricula, and lack of 
            practical application.
          </p>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            We built Uplas to be different. Using our proprietary AI technology, we create 
            personalized learning paths that adapt in real-time to each student's progress, 
            strengths, and areas for improvement. Our AI Tutor provides 24/7 support, and our 
            project-based approach ensures learners build real, portfolio-ready work.
          </p>

          {/* Contact */}
          <div className="card p-8 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
            <h3 className="text-xl font-bold mb-2">Get in Touch</h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
              Have questions or want to partner with us?
            </p>
            <a href="mailto:hello@uplas.me" className="btn btn-primary">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
