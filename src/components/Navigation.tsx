import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const ScrollToSection = ({ to, children, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleClick = (e) => {
    e.preventDefault();
    const targetId = to.replace('/#', '');
    const element = document.getElementById(targetId);

    if (isHomePage && element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (to === '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { href: "/#about", label: "About" },
    { href: "/#services", label: "Services" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className="relative flex items-center justify-between w-full">
      <ScrollToSection to="/" className="flex items-center">
        <img 
          src="https://dl.dropboxusercontent.com/scl/fi/86il34hz641dbh825gsda/marvi-logo-Black.svg?rlkey=xlpb3uynr6k1wu1jht3fjjcn9&st=vbqxvvle&dl=0" 
          alt="Marvi Logo" 
          className={`h-8 mr-2 ${logoLoaded ? 'animate-logo-grow' : 'opacity-0'}`}
          onLoad={() => setLogoLoaded(true)}
        />
        <span className="text-2xl font-bold font-ubuntu">MΛRVI.ΛI</span>
      </ScrollToSection>
      {isMobile && (
        <button
          onClick={toggleMenu}
          className="text-primary p-2 focus:outline-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      <div
        className={`${
          isMobile
            ? `absolute top-full right-0 w-48 bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
              }`
            : 'flex space-x-6'
        }`}
      >
        {navItems.map((item) => (
          <ScrollToSection
            key={item.href}
            to={item.href}
            className={`block px-4 py-2 text-primary hover:text-accent transition-colors ${
              isMobile ? 'border-b border-gray-200 last:border-b-0' : ''
            }`}
            onClick={() => {
              closeMenu();
            }}
          >
            {item.label}
          </ScrollToSection>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;