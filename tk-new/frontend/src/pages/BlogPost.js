import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API } from '../context/AuthContext';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API}/blog/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-4 md:px-8 text-center">
          <p className="text-white/60">Post not found.</p>
          <Link to="/blog" className="text-primary hover:underline mt-4 inline-block">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-32 pb-24 px-4 md:px-8" data-testid="blog-post-page">
        <div className="max-w-[900px] mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8"
            data-testid="back-to-blog"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary text-xs tracking-widest uppercase" data-testid="post-category">
              {post.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white my-6 font-heading" data-testid="post-title">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/60 mb-12">
              <span className="flex items-center gap-2" data-testid="post-date">
                <Calendar size={16} />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-2" data-testid="post-author">
                <User size={16} />
                {post.author}
              </span>
            </div>

            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-auto mb-12"
                data-testid="post-image"
              />
            )}

            <div className="prose prose-invert prose-lg max-w-none" data-testid="post-content">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-white/80 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
