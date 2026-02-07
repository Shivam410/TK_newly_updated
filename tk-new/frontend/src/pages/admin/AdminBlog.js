import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { API } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    category: '',
    author: '',
    published: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await axios.put(`${API}/blog/${editingPost.id}`, formData);
        toast.success('Blog post updated!');
      } else {
        await axios.post(`${API}/blog`, formData);
        toast.success('Blog post created!');
      }
      fetchPosts();
      resetForm();
    } catch (error) {
      toast.error('Error saving blog post');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await axios.delete(`${API}/blog/${id}`);
      toast.success('Blog post deleted!');
      fetchPosts();
    } catch (error) {
      toast.error('Error deleting blog post');
      console.error('Error:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      image_url: post.image_url || '',
      category: post.category,
      author: post.author,
      published: post.published,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', excerpt: '', image_url: '', category: '', author: '', published: false });
    setEditingPost(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" theme="dark" />
      <div data-testid="admin-blog-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading text-white" data-testid="blog-title">Blog</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
            data-testid="add-post-button"
          >
            <Plus size={18} />
            Add Blog Post
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-card border border-white/10" data-testid="blog-form">
            <h2 className="text-2xl font-heading text-white mb-4">
              {editingPost ? 'Edit Blog Post' : 'New Blog Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-title"
              />
              <textarea
                placeholder="Excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                rows="2"
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none resize-none"
                data-testid="input-excerpt"
              />
              <textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows="10"
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none resize-none"
                data-testid="input-content"
              />
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-image-url"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                  data-testid="input-category"
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                  data-testid="input-author"
                />
              </div>
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                  data-testid="input-published"
                />
                Published
              </label>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
                  data-testid="submit-button"
                >
                  {editingPost ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-white/20 text-white px-6 py-3 text-sm font-bold hover:bg-white/5 transition-colors"
                  data-testid="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post, index) => (
            <div key={post.id} className="p-6 bg-card border border-white/5 flex gap-6" data-testid={`blog-post-${index}`}>
              {post.image_url && (
                <img src={post.image_url} alt={post.title} className="w-32 h-32 object-cover flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-heading text-xl mb-2" data-testid={`post-title-${index}`}>{post.title}</h3>
                    <p className="text-white/60 text-sm mb-2" data-testid={`post-excerpt-${index}`}>{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span data-testid={`post-author-${index}`}>{post.author}</span>
                      <span data-testid={`post-category-${index}`}>{post.category}</span>
                      <span data-testid={`post-date-${index}`}>{formatDate(post.created_at)}</span>
                      {post.published ? (
                        <span className="text-green-400" data-testid={`post-published-${index}`}>Published</span>
                      ) : (
                        <span className="text-yellow-400" data-testid={`post-draft-${index}`}>Draft</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 border border-white/20 text-white hover:bg-white/5 transition-colors"
                      data-testid={`edit-button-${index}`}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
                      data-testid={`delete-button-${index}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20" data-testid="no-posts-message">
            <p className="text-white/60">No blog posts yet. Create your first one!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
