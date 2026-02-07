import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { API } from '../../context/AuthContext';
import { Image, Images, Briefcase, Users, Mail, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Portfolio Items', value: stats.portfolio_items || 0, icon: Image, link: '/admin/portfolio' },
    { label: 'Gallery Images', value: stats.gallery_images || 0, icon: Images, link: '/admin/gallery' },
    { label: 'Services', value: stats.services || 0, icon: Briefcase, link: '/admin/services' },
    { label: 'Team Members', value: stats.team_members || 0, icon: Users, link: '/admin/team' },
    { label: 'New Inquiries', value: stats.new_inquiries || 0, icon: Mail, link: '/admin/inquiries', highlight: true },
    { label: 'Blog Posts', value: stats.blog_posts || 0, icon: FileText, link: '/admin/blog' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-primary text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div data-testid="admin-dashboard">
        <h1 className="text-4xl font-heading text-white mb-8" data-testid="dashboard-title">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className={`p-6 bg-card border transition-all duration-300 hover:border-primary/50 ${
                stat.highlight ? 'border-primary/30' : 'border-white/5'
              }`}
              data-testid={`stat-card-${index}`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="text-primary" size={32} />
                <span className={`text-4xl font-bold ${
                  stat.highlight ? 'text-primary' : 'text-white'
                }`} data-testid={`stat-value-${index}`}>
                  {stat.value}
                </span>
              </div>
              <h3 className="text-white/60 text-sm tracking-widest uppercase" data-testid={`stat-label-${index}`}>
                {stat.label}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-8 bg-card border border-white/5">
          <h2 className="text-2xl font-heading text-white mb-6" data-testid="quick-actions-title">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/portfolio"
              className="p-4 border border-white/10 hover:border-primary/50 transition-colors text-center"
              data-testid="quick-action-portfolio"
            >
              <p className="text-white">Add Portfolio Item</p>
            </Link>
            <Link
              to="/admin/gallery"
              className="p-4 border border-white/10 hover:border-primary/50 transition-colors text-center"
              data-testid="quick-action-gallery"
            >
              <p className="text-white">Upload to Gallery</p>
            </Link>
            <Link
              to="/admin/inquiries"
              className="p-4 border border-white/10 hover:border-primary/50 transition-colors text-center"
              data-testid="quick-action-inquiries"
            >
              <p className="text-white">View Inquiries</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
