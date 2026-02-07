import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { API } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    category: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/gallery`, formData);
      toast.success('Image added to gallery!');
      fetchImages();
      resetForm();
    } catch (error) {
      toast.error('Error adding image');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await axios.delete(`${API}/gallery/${id}`);
      toast.success('Image deleted!');
      fetchImages();
    } catch (error) {
      toast.error('Error deleting image');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({ image_url: '', caption: '', category: '' });
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" theme="dark" />
      <div data-testid="admin-gallery-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading text-white" data-testid="gallery-title">Gallery</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
            data-testid="add-image-button"
          >
            <Plus size={18} />
            Add Image
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-card border border-white/10" data-testid="gallery-form">
            <h2 className="text-2xl font-heading text-white mb-4">New Gallery Image</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Caption (optional)"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-caption"
              />
              <input
                type="text"
                placeholder="Category (e.g., Studio, Events)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-category"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
                  data-testid="submit-button"
                >
                  Add Image
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

        <div className="columns-1 md:columns-4 gap-4 space-y-4">
          {images.map((image, index) => (
            <div key={image.id} className="break-inside-avoid group relative" data-testid={`gallery-image-${index}`}>
              <img src={image.image_url} alt={image.caption || 'Gallery image'} className="w-full h-auto" />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600 transition-colors"
                  data-testid={`delete-button-${index}`}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-20" data-testid="no-images-message">
            <p className="text-white/60">No images in gallery yet. Add your first one!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
