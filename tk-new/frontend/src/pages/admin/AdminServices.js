import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { API } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    features: '',
    image_url: '',
    active: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featuresArray = formData.features.split('\n').filter(f => f.trim());
    const serviceData = { ...formData, features: featuresArray };
    
    try {
      if (editingService) {
        await axios.put(`${API}/services/${editingService.id}`, serviceData);
        toast.success('Service updated!');
      } else {
        await axios.post(`${API}/services`, serviceData);
        toast.success('Service created!');
      }
      fetchServices();
      resetForm();
    } catch (error) {
      toast.error('Error saving service');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`${API}/services/${id}`);
      toast.success('Service deleted!');
      fetchServices();
    } catch (error) {
      toast.error('Error deleting service');
      console.error('Error:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price || '',
      features: service.features.join('\n'),
      image_url: service.image_url || '',
      active: service.active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', features: '', image_url: '', active: true });
    setEditingService(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" theme="dark" />
      <div data-testid="admin-services-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading text-white" data-testid="services-title">Services</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
            data-testid="add-service-button"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-card border border-white/10" data-testid="service-form">
            <h2 className="text-2xl font-heading text-white mb-4">
              {editingService ? 'Edit Service' : 'New Service'}
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
                type="text"
                placeholder="Price (optional)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-price"
              />
              <textarea
                placeholder="Features (one per line)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows="5"
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none resize-none"
                data-testid="input-features"
              />
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-image-url"
              />
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                  data-testid="input-active"
                />
                Active
              </label>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
                  data-testid="submit-button"
                >
                  {editingService ? 'Update' : 'Create'}
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
          {services.map((service, index) => (
            <div key={service.id} className="p-6 bg-card border border-white/5" data-testid={`service-${index}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-heading text-xl mb-2" data-testid={`service-title-${index}`}>{service.title}</h3>
                  <p className="text-white/60 mb-4" data-testid={`service-description-${index}`}>{service.description}</p>
                  {service.price && <p className="text-primary font-bold" data-testid={`service-price-${index}`}>{service.price}</p>}
                  {!service.active && <span className="inline-block bg-red-500/20 text-red-400 px-2 py-1 text-xs mt-2">Inactive</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 border border-white/20 text-white hover:bg-white/5 transition-colors"
                    data-testid={`edit-button-${index}`}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
                    data-testid={`delete-button-${index}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-20" data-testid="no-services-message">
            <p className="text-white/60">No services yet. Create your first one!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
