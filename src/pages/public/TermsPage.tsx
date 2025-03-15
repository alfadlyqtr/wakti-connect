
import React from "react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: June 1, 2023</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Wakti ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of the Wakti platform, including our website, mobile applications, and services (collectively, the "Services").
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
            <p>
              To use certain features of our Services, you may need to create an account. When you register, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update your account information if it changes</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate your account if any information provided is inaccurate, out-of-date, or incomplete.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Subscription and Payments</h2>
            <p>
              Wakti offers various subscription plans. By subscribing to a paid plan, you agree to the following:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>You authorize us to charge the applicable fees to your chosen payment method</li>
              <li>Subscriptions will automatically renew unless cancelled before the renewal date</li>
              <li>You can cancel your subscription at any time through your account settings</li>
              <li>We may change subscription fees upon notice; continued use after a price change constitutes acceptance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p>
              When using our Services, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Use the Services to distribute unauthorized or unsolicited advertising</li>
              <li>Attempt to interfere with or disrupt the Services</li>
              <li>Impersonate another person or entity</li>
              <li>Use the Services to store or transmit harmful code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, and software, are the exclusive property of Wakti or our licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to use the Services for their intended purposes. You may not copy, modify, distribute, sell, or lease any part of our Services without our written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Privacy</h2>
            <p>
              Our collection and use of personal information in connection with the Services is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Services, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Wakti shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your access to or use of the Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
            <p>
              You agree to indemnify and hold Wakti harmless from any claims, damages, liabilities, costs, or expenses (including reasonable attorneys' fees) arising from your use of the Services or any violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Modifications to the Terms</h2>
            <p>
              We may modify these Terms at any time. If we make material changes, we will notify you by email or by posting a notice on our website. Your continued use of the Services after such notification constitutes your acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p>
              We may terminate or suspend your access to the Services at any time, with or without cause, and with or without notice. Upon termination, your right to use the Services will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved exclusively in the state or federal courts located in San Francisco, California.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@wakti.com" className="text-wakti-blue hover:underline">legal@wakti.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Related Documents:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="text-wakti-blue hover:underline">
              Privacy Policy
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

export default TermsPage;
