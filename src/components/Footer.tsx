import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-8">
      <div className="container-custom text-center text-text-secondary">
        <div className="flex justify-center items-center space-x-4 flex-wrap text-sm">
          <p>&copy; 2024 MΛRVI. All rights reserved.</p>
          <Link to="/privacy-policy" className="hover:text-accent">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-accent">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;