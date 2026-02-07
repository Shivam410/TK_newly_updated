import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API } from '../context/AuthContext';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`${API}/team`);
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-8" data-testid="about-page">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 font-heading" data-testid="about-page-title">
              About Us
            </h1>
            <p className="text-white/60 text-lg" data-testid="about-page-subtitle">
              The story behind the lens
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1696694138288-d3c14bdd35f1?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Studio"
                className="w-full h-auto"
                data-testid="about-hero-image"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              data-testid="about-content"
            >
              <h2 className="text-4xl font-heading text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Founded with a passion for capturing life's most precious moments, The Darkroom has been serving clients for over a decade. Our journey began with a simple belief: every moment deserves to be preserved beautifully.
                </p>
                <p>
                  We specialize in creating timeless imagery that tells your unique story. From intimate weddings to grand corporate events, our team brings artistic vision and technical expertise to every shoot.
                </p>
                <p>
                  Our philosophy is simple - we don't just take photos, we create visual narratives that evoke emotion and stand the test of time. Every frame is carefully composed, every moment thoughtfully captured.
                </p>
              </div>
            </motion.div>
          </div>

          {teamMembers.length > 0 && (
            <div>
              <h2 className="text-4xl md:text-6xl font-heading text-white text-center mb-16" data-testid="team-section-title">
                Meet Our Team
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="text-center"
                    data-testid={`team-member-${index}`}
                  >
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full aspect-square object-cover mb-6 grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    <h3 className="text-2xl font-heading text-white mb-2" data-testid={`team-member-name-${index}`}>
                      {member.name}
                    </h3>
                    <p className="text-primary text-xs tracking-widest uppercase mb-4" data-testid={`team-member-role-${index}`}>
                      {member.role}
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed" data-testid={`team-member-bio-${index}`}>
                      {member.bio}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
