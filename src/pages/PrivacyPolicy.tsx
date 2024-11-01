import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container-custom py-20">
      <h1 className="text-section-heading font-bold mb-8">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p>MΛRVI.ΛI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
        
        <h2 className="text-subheading font-semibold mt-8 mb-4">Information We Collect</h2>
        <p>We collect information that you provide directly to us, such as when you sign up for our waitlist, contact us, or use our services. This may include:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Your name and email address</li>
          <li>Company information</li>
          <li>Any other information you choose to provide</li>
        </ul>

        <h2 className="text-subheading font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p>We may use the information we collect for various purposes, including to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Send you technical notices, updates, and administrative messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Communicate with you about products, services, offers, and events</li>
        </ul>

        <h2 className="text-subheading font-semibold mt-8 mb-4">Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.</p>

        <h2 className="text-subheading font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;