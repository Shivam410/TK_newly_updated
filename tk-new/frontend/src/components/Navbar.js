import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'HOME' },
    { path: '/portfolio', label: 'PORTFOLIO' },
    { path: '/gallery', label: 'GALLERY' },
    { path: '/services', label: 'SERVICES' },
    { path: '/about', label: 'ABOUT' },
    { path: '/blog', label: 'BLOG' },
    { path: '/contact', label: 'CONTACT' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 py-6 px-4 md:px-8">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-heading tracking-tight" data-testid="logo-link">
            THE DARKROOM
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={`text-xs tracking-widest transition-colors ${
                  location.pathname === link.path ? 'text-primary' : 'text-white/60 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white z-50"
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 flex items-center justify-center md:hidden"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col gap-8">
              {links.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                    className={`text-2xl font-heading tracking-tight transition-colors ${
                      location.pathname === link.path ? 'text-primary' : 'text-white hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
