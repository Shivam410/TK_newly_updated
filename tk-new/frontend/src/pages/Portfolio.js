import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API } from '../context/AuthContext';

const Portfolio = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API}/portfolio`);
      setItems(response.data);
      const uniqueCategories = ['all', ...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-8" data-testid="portfolio-page">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 font-heading" data-testid="portfolio-page-title">
              Portfolio
            </h1>
            <p className="text-white/60 text-lg" data-testid="portfolio-page-subtitle">Our finest work, curated for you</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-16" data-testid="portfolio-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                data-testid={`filter-${category}`}
                className={`px-6 py-2 text-xs tracking-widest uppercase transition-all ${
                  filter === category
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-white/20 text-white hover:border-primary hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden aspect-[3/4] bg-neutral-900"
                data-testid={`portfolio-card-${index}`}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-white font-heading text-2xl mb-2" data-testid={`portfolio-item-title-${index}`}>{item.title}</h3>
                  <p className="text-primary text-xs tracking-widest uppercase mb-4" data-testid={`portfolio-item-category-${index}`}>{item.category}</p>
                  <p className="text-white/80 text-sm" data-testid={`portfolio-item-description-${index}`}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20" data-testid="no-items-message">
              <p className="text-white/60">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
