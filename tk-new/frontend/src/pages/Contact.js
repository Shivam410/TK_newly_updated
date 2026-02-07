import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API } from '../context/AuthContext';
import { toast, Toaster } from 'sonner';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    event_details: '',
    venue_address: '',
    number_of_guests: '',
    additional_requirements: '',
    date: '',
    time: '',
    how_did_you_hear: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/inquiries`, formData);
      toast.success('Inquiry submitted successfully! We\'ll get back to you soon.');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        country: '',
        event_details: '',
        venue_address: '',
        number_of_guests: '',
        additional_requirements: '',
        date: '',
        time: '',
        how_did_you_hear: '',
      });
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
      console.error('Error submitting inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" theme="dark" />
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-8" data-testid="contact-page">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 font-heading" data-testid="contact-page-title">
              Get In Touch
            </h1>
            <p className="text-white/60 text-lg" data-testid="contact-page-subtitle">
              Let's discuss your photography needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 border border-white/5" data-testid="contact-info-location">
              <MapPin className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="text-white font-heading mb-2">Location</h3>
              <p className="text-white/60 text-sm">123 Studio Street, Creative District</p>
            </div>
            <div className="text-center p-6 border border-white/5" data-testid="contact-info-phone">
              <Phone className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="text-white font-heading mb-2">Phone</h3>
              <p className="text-white/60 text-sm">+1 (555) 123-4567</p>
            </div>
            <div className="text-center p-6 border border-white/5" data-testid="contact-info-email">
              <Mail className="mx-auto mb-4 text-primary" size={32} />
              <h3 className="text-white font-heading mb-2">Email</h3>
              <p className="text-white/60 text-sm">hello@thedarkroom.com</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-[800px] mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-8" data-testid="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="First Name *"
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Last Name *"
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email *"
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number *"
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="Country *"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                  data-testid="input-country"
                />
              </div>

              <div>
                <textarea
                  name="event_details"
                  value={formData.event_details}
                  onChange={handleChange}
                  required
                  placeholder="Event Details *"
                  rows="4"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors resize-none"
                  data-testid="input-event-details"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="venue_address"
                  value={formData.venue_address}
                  onChange={handleChange}
                  required
                  placeholder="Venue Address *"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                  data-testid="input-venue-address"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="number_of_guests"
                  value={formData.number_of_guests}
                  onChange={handleChange}
                  required
                  placeholder="Number of Guests *"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                  data-testid="input-number-of-guests"
                />
              </div>

              <div>
                <textarea
                  name="additional_requirements"
                  value={formData.additional_requirements}
                  onChange={handleChange}
                  required
                  placeholder="Additional Requirements *"
                  rows="4"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors resize-none"
                  data-testid="input-additional-requirements"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    placeholder="Date (dd-mm-yyyy) *"
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                    data-testid="input-date"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    placeholder="Time *"
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                    data-testid="input-time"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="how_did_you_hear"
                  value={formData.how_did_you_hear}
                  onChange={handleChange}
                  required
                  placeholder="How Did You Hear About Us? *"
                  className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                  data-testid="input-how-did-you-hear"
                />
              </div>

              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-primary-foreground px-12 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
                  data-testid="submit-inquiry-button"
                >
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
