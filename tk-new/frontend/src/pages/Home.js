import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API } from '../context/AuthContext';
import { ArrowRight, Star } from 'lucide-react';

const Home = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portfolioRes, testimonialsRes, servicesRes] = await Promise.all([
        axios.get(`${API}/portfolio?featured=true`),
        axios.get(`${API}/testimonials`),
        axios.get(`${API}/services?active=true`)
      ]);
      setPortfolioItems(portfolioRes.data.slice(0, 6));
      setTestimonials(testimonialsRes.data.slice(0, 3));
      setServices(servicesRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1637700941836-1d37c56e5615?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 font-heading" data-testid="hero-title">
            Capturing Moments,<br />Creating Memories
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-12 font-light" data-testid="hero-subtitle">
            Professional photography for life's most precious occasions
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all duration-300"
            data-testid="hero-cta-button"
          >
            Explore Portfolio
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      <section className="py-24 px-4 md:px-8" data-testid="services-preview-section">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-white mb-4 font-heading" data-testid="services-title">
              Our Services
            </h2>
            <p className="text-white/60" data-testid="services-subtitle">Tailored photography experiences for every occasion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 border border-white/5 hover:border-primary/50 transition-all duration-500 bg-card/50 backdrop-blur-sm group"
                data-testid={`service-card-${index}`}
              >
                <h3 className="text-2xl font-heading text-white mb-4 group-hover:text-primary transition-colors" data-testid={`service-title-${index}`}>
                  {service.title}
                </h3>
                <p className="text-white/60 mb-6 leading-relaxed" data-testid={`service-description-${index}`}>
                  {service.description}
                </p>
                {service.price && (
                  <p className="text-primary font-bold" data-testid={`service-price-${index}`}>{service.price}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-all duration-300"
              data-testid="view-all-services-button"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-8 bg-black/30" data-testid="portfolio-preview-section">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-white mb-4 font-heading" data-testid="portfolio-title">
              Featured Work
            </h2>
            <p className="text-white/60" data-testid="portfolio-subtitle">A glimpse into our creative vision</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden aspect-[3/4] bg-neutral-900"
                data-testid={`portfolio-item-${index}`}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-white font-heading text-xl mb-2" data-testid={`portfolio-item-title-${index}`}>{item.title}</h3>
                    <p className="text-primary text-xs tracking-widest uppercase" data-testid={`portfolio-item-category-${index}`}>{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all duration-300"
              data-testid="view-full-portfolio-button"
            >
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="py-24 px-4 md:px-8" data-testid="testimonials-section">
          <div className="max-w-[1800px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-white mb-4 font-heading" data-testid="testimonials-title">
                Client Stories
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="p-8 border border-white/5 bg-card/30 backdrop-blur-sm"
                  data-testid={`testimonial-${index}`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed italic" data-testid={`testimonial-content-${index}`}>
                    "{testimonial.content}"
                  </p>
                  <p className="text-primary font-bold" data-testid={`testimonial-name-${index}`}>{testimonial.client_name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-4 md:px-8 bg-black/30" data-testid="cta-section">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-white mb-6 font-heading" data-testid="cta-title">
            Let's Create Something Beautiful
          </h2>
          <p className="text-white/60 text-lg mb-12" data-testid="cta-description">
            Get in touch to discuss your photography needs
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all duration-300"
            data-testid="cta-contact-button"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
