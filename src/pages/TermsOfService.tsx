import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container-custom py-20">
      <h1 className="text-section-heading font-bold mb-8">Terms of Service</h1>
      <div className="prose max-w-none">
        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the MΛRVI.ΛI website (the "Service") operated by MΛRVI.ΛI ("us", "we", or "our").</p>

        <h2 className="text-subheading font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

        <h2 className="text-subheading font-semibold mt-8 mb-4">2. Use of the Service</h2>
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>In any way that violates any applicable national or international law or regulation</li>
          <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation</li>
          <li>To impersonate or attempt to impersonate MΛRVI.ΛI, a MΛRVI.ΛI employee, another user, or any other person or entity</li>
        </ul>

        <h2 className="text-subheading font-semibold mt-8 mb-4">3. Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of MΛRVI.ΛI and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

        <h2 className="text-subheading font-semibold mt-8 mb-4">4. Limitation of Liability</h2>
        <p>In no event shall MΛRVI.ΛI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

        <h2 className="text-subheading font-semibold mt-8 mb-4">5. Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
      </div>
    </div>
  );
};

export default TermsOfService;