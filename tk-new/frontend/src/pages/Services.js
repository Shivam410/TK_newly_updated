import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API } from '../context/AuthContext';
import { Check } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services?active=true`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-8" data-testid="services-page">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 font-heading" data-testid="services-page-title">
              Our Services
            </h1>
            <p className="text-white/60 text-lg" data-testid="services-page-subtitle">
              Professional photography tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 border border-white/5 hover:border-primary/50 transition-all duration-500 bg-card/50 backdrop-blur-sm"
                data-testid={`service-card-${index}`}
              >
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-48 object-cover mb-6"
                  />
                )}
                <h2 className="text-3xl font-heading text-white mb-4" data-testid={`service-title-${index}`}>
                  {service.title}
                </h2>
                <p className="text-white/60 mb-6 leading-relaxed" data-testid={`service-description-${index}`}>
                  {service.description}
                </p>
                
                {service.features && service.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-primary text-sm tracking-widest uppercase mb-4">Includes:</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/80 text-sm" data-testid={`service-feature-${index}-${i}`}>
                          <Check size={16} className="text-primary mt-1 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {service.price && (
                  <p className="text-primary font-bold text-xl" data-testid={`service-price-${index}`}>
                    {service.price}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-20" data-testid="no-services-message">
              <p className="text-white/60">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
