import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API } from '../context/AuthContext';
import { Calendar, User } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog?published=true`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-8" data-testid="blog-page">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 font-heading" data-testid="blog-page-title">
              Blog
            </h1>
            <p className="text-white/60 text-lg" data-testid="blog-page-subtitle">
              Stories, tips, and inspiration from behind the lens
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
                data-testid={`blog-card-${index}`}
              >
                <Link to={`/blog/${post.id}`}>
                  {post.image_url && (
                    <div className="aspect-[4/3] overflow-hidden mb-4">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                    <span className="flex items-center gap-1" data-testid={`blog-date-${index}`}>
                      <Calendar size={14} />
                      {formatDate(post.created_at)}
                    </span>
                    <span className="flex items-center gap-1" data-testid={`blog-author-${index}`}>
                      <User size={14} />
                      {post.author}
                    </span>
                  </div>
                  <span className="text-primary text-xs tracking-widest uppercase" data-testid={`blog-category-${index}`}>
                    {post.category}
                  </span>
                  <h2 className="text-2xl font-heading text-white mt-2 mb-3 group-hover:text-primary transition-colors" data-testid={`blog-title-${index}`}>
                    {post.title}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed" data-testid={`blog-excerpt-${index}`}>
                    {post.excerpt}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20" data-testid="no-posts-message">
              <p className="text-white/60">No blog posts available yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
