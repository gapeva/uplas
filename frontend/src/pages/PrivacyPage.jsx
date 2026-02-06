export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <p className="text-center text-light-text-secondary dark:text-dark-text-secondary mb-12">
          Last updated: January 31, 2025
        </p>
        
        <div className="prose dark:prose-invert max-w-none card p-8">
          <h2>1. Introduction</h2>
          <p>
            Uplas EdTech Solutions Ltd. ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our platform.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <ul>
            <li>Name and email address</li>
            <li>Phone number</li>
            <li>Organization and profession</li>
            <li>Payment information</li>
            <li>Learning preferences and progress</li>
          </ul>

          <h3>Usage Information</h3>
          <ul>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Course interaction and progress data</li>
            <li>AI Tutor conversation logs</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Provide and personalize our services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Improve our AI algorithms and user experience</li>
            <li>Send relevant communications and updates</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with:
          </p>
          <ul>
            <li>Service providers who assist in platform operations</li>
            <li>Payment processors for transaction handling</li>
            <li>Analytics providers (in anonymized form)</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption, secure servers, 
            and regular security audits to protect your data.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request data deletion</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>7. Contact Us</h2>
          <p>
            For privacy-related inquiries, contact us at:
            <br />
            Email: <a href="mailto:privacy@uplas.me">privacy@uplas.me</a>
            <br />
            Address: Uplas Towers, Kilifi, Kenya
          </p>
        </div>
      </div>
    </div>
  )
}
