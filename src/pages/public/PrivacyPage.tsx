
import React from "react";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              Last Updated: June 15, 2023
            </p>
            
            <p>
              At WAKTI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and application (the "Service"). Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            
            <p>
              We collect information that you provide directly to us when you:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account and use our Service</li>
              <li>Fill out forms or fields on our Service</li>
              <li>Sign up for our newsletters or other communications</li>
              <li>Request customer support</li>
              <li>Otherwise communicate with us</li>
            </ul>
            
            <p>
              The types of information we may collect include:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Personal identifiers (such as name, email address, phone number)</li>
              <li>Account credentials (such as username and password)</li>
              <li>Payment and billing information</li>
              <li>Business information (for Business plan users)</li>
              <li>User content (such as tasks, appointments, messages, and other content you create while using our Service)</li>
            </ul>
            
            <p>
              We also automatically collect certain information about your device and how you interact with our Service, including:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Device information (such as your IP address, browser type, operating system)</li>
              <li>Usage information (such as how you use and navigate our Service)</li>
              <li>Log data (such as access times, hardware and software information)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            
            <p>
              We use the information we collect for various purposes, including to:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative notifications, such as updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Customize and personalize your experience</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Sharing of Information</h2>
            
            <p>
              We may share the information we collect in various ways, including:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>With vendors, service providers, and consultants that perform services on our behalf</li>
              <li>With other users when you use certain features (such as sharing tasks or sending messages)</li>
              <li>In response to a request for information if we believe disclosure is in accordance with applicable law</li>
              <li>If we believe your actions are inconsistent with our user agreements or policies</li>
              <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Retention</h2>
            
            <p>
              We store the information we collect for as long as is necessary for the purpose(s) for which we originally collected it, or for other legitimate business purposes, including to meet our legal, regulatory, or other compliance obligations.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Choices</h2>
            
            <p>
              You have several choices regarding the information we collect and how it's used:
            </p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Account Information: You may update or correct your account information at any time by logging into your account</li>
              <li>Marketing Communications: You may opt out of receiving promotional emails by following the instructions in those emails</li>
              <li>Cookies: Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject cookies</li>
              <li>Do Not Track: Some browsers have "do not track" features that allow you to tell websites not to track you. These features are not all uniform, and we do not currently respond to those signals</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
            
            <p>
              Our Service is not directed to children under 16, and we do not knowingly collect personal information from children under 16. If we learn we have collected personal information from a child under 16, we will delete this information as quickly as possible.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. International Data Transfers</h2>
            
            <p>
              We may transfer information that we collect about you to affiliated entities, or to other third parties across borders and from your country or jurisdiction to other countries or jurisdictions. If you are located in the European Union or other regions with laws governing data collection and use that may differ from Qatar law, please note that we may transfer information to a country that does not have the same data protection laws as your jurisdiction.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Qatar Data Protection Law Compliance</h2>
            
            <p>
              We comply with Qatar's data protection laws, including the Personal Data Privacy Protection Law No. 13 of 2016. Under these laws, you have the right to access, correct, and delete your personal information, as well as the right to object to or restrict certain types of processing of your personal information.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date. You are advised to review this privacy policy periodically for any changes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
            
            <p>
              If you have any questions about this Privacy Policy, please <Link to="/contact" className="text-wakti-blue hover:underline">contact us</Link>.
            </p>
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link to="/terms" className="text-wakti-blue hover:underline">View our Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
