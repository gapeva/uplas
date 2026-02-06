export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
        <p className="text-center text-light-text-secondary dark:text-dark-text-secondary mb-12">
          Last updated: January 31, 2025
        </p>
        
        <div className="prose dark:prose-invert max-w-none card p-8">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Uplas ("the Platform"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Uplas provides an AI-powered online learning platform for artificial intelligence and 
            related technology education, including courses, AI tutoring, community features, and 
            project-based learning.
          </p>

          <h2>3. User Accounts</h2>
          <ul>
            <li>You must provide accurate and complete registration information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must be at least 13 years old to use the Platform</li>
            <li>One person per account; no sharing of login credentials</li>
          </ul>

          <h2>4. Subscription and Payments</h2>
          <ul>
            <li>Paid subscriptions are billed monthly or annually as selected</li>
            <li>Subscriptions auto-renew unless cancelled</li>
            <li>Refunds are available within 14 days of initial purchase</li>
            <li>Prices may change with 30 days notice to existing subscribers</li>
          </ul>

          <h2>5. User Content</h2>
          <p>
            You retain ownership of content you create on the Platform. By posting content, you grant 
            Uplas a license to use, display, and distribute your content within the Platform.
          </p>

          <h2>6. Prohibited Activities</h2>
          <ul>
            <li>Sharing or redistributing course content without permission</li>
            <li>Using the Platform for any illegal purpose</li>
            <li>Attempting to bypass security measures</li>
            <li>Harassing other users</li>
            <li>Using automated tools to access the Platform</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            All Platform content, including courses, AI technology, and branding, is owned by 
            Uplas EdTech Solutions Ltd. and protected by intellectual property laws.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            Uplas is provided "as is" without warranties. We are not liable for any indirect, 
            incidental, or consequential damages arising from your use of the Platform.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the Platform after changes 
            constitutes acceptance of the new terms.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these terms, contact us at:
            <br />
            Email: <a href="mailto:legal@uplas.me">legal@uplas.me</a>
            <br />
            Address: Uplas Towers, Kilifi, Kenya
          </p>
        </div>
      </div>
    </div>
  )
}
