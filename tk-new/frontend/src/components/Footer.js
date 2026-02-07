import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-16">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-heading text-white mb-4" data-testid="footer-logo">THE DARKROOM</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Capturing moments, creating memories. Professional photography services for all your special occasions.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-widest text-primary mb-4">QUICK LINKS</h4>
            <div className="flex flex-col gap-2">
              <Link to="/portfolio" className="text-white/60 hover:text-primary transition-colors text-sm" data-testid="footer-portfolio">Portfolio</Link>
              <Link to="/services" className="text-white/60 hover:text-primary transition-colors text-sm" data-testid="footer-services">Services</Link>
              <Link to="/about" className="text-white/60 hover:text-primary transition-colors text-sm" data-testid="footer-about">About Us</Link>
              <Link to="/contact" className="text-white/60 hover:text-primary transition-colors text-sm" data-testid="footer-contact">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-widest text-primary mb-4">FOLLOW US</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors" data-testid="footer-instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors" data-testid="footer-facebook">
                <Facebook size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition-colors" data-testid="footer-youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center">
          <p className="text-white/40 text-xs" data-testid="footer-copyright">
            © {new Date().getFullYear()} The Darkroom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
