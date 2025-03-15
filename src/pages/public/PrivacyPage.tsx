
import React from "react";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: June 1, 2023</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              At Wakti ("we," "our," or "us"), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Services").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>
              We may collect several types of information from and about users of our Services, including:
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">2.1 Personal Information</h3>
            <p>
              Personal information is data that can be used to identify you individually, such as:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, email address, phone number, and other contact information</li>
              <li>Account credentials</li>
              <li>Billing information and payment details</li>
              <li>Business information (for business accounts)</li>
              <li>Profile pictures and other content you choose to upload</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">2.2 Usage Information</h3>
            <p>
              We automatically collect certain information about how you interact with our Services, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and features used</li>
              <li>Time spent on the Services and frequency of use</li>
              <li>Referring websites, search terms, and links that lead to our Services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative messages, updates, and security alerts</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Understand user preferences and tailor content</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and fraudulent activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
            <p>
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who need access to your information to help us provide our Services.</li>
              <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              <li><strong>With Your Consent:</strong> We may share your information with third parties when you have given us your consent to do so.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Services and maintain certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access to the personal information we hold about you</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing of your personal information</li>
              <li>Objection to processing of your personal information</li>
              <li>Data portability</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the contact information provided at the end of this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>
              Our Services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child under the age of 16 without parental consent, we will take steps to remove that information from our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@wakti.com" className="text-wakti-blue hover:underline">privacy@wakti.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Related Documents:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/terms" className="text-wakti-blue hover:underline">
              Terms & Conditions
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/contact" className="text-wakti-blue hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
