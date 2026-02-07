import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { API } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';

const AdminPortfolio = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    featured: false,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API}/portfolio`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API}/portfolio/${editingItem.id}`, formData);
        toast.success('Portfolio item updated!');
      } else {
        await axios.post(`${API}/portfolio`, formData);
        toast.success('Portfolio item created!');
      }
      fetchItems();
      resetForm();
    } catch (error) {
      toast.error('Error saving portfolio item');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API}/portfolio/${id}`);
      toast.success('Portfolio item deleted!');
      fetchItems();
    } catch (error) {
      toast.error('Error deleting portfolio item');
      console.error('Error:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      category: item.category,
      featured: item.featured,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', image_url: '', category: '', featured: false });
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" theme="dark" />
      <div data-testid="admin-portfolio-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading text-white" data-testid="portfolio-title">Portfolio</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
            data-testid="add-portfolio-button"
          >
            <Plus size={18} />
            Add Portfolio Item
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-card border border-white/10" data-testid="portfolio-form">
            <h2 className="text-2xl font-heading text-white mb-4">
              {editingItem ? 'Edit Portfolio Item' : 'New Portfolio Item'}
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
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="3"
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none resize-none"
                data-testid="input-description"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-image-url"
              />
              <input
                type="text"
                placeholder="Category (e.g., Wedding, Corporate)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-category"
              />
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                  data-testid="input-featured"
                />
                Featured Item
              </label>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
                  data-testid="submit-button"
                >
                  {editingItem ? 'Update' : 'Create'}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={item.id} className="bg-card border border-white/5" data-testid={`portfolio-item-${index}`}>
              <img src={item.image_url} alt={item.title} className="w-full aspect-[3/4] object-cover" />
              <div className="p-4">
                <h3 className="text-white font-heading text-lg mb-2" data-testid={`item-title-${index}`}>{item.title}</h3>
                <p className="text-white/60 text-sm mb-2" data-testid={`item-category-${index}`}>{item.category}</p>
                {item.featured && (
                  <span className="inline-block bg-primary text-primary-foreground px-2 py-1 text-xs mb-2">Featured</span>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                    data-testid={`edit-button-${index}`}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-500/50 text-red-400 px-4 py-2 text-sm hover:bg-red-500/10 transition-colors"
                    data-testid={`delete-button-${index}`}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20" data-testid="no-items-message">
            <p className="text-white/60">No portfolio items yet. Create your first one!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
