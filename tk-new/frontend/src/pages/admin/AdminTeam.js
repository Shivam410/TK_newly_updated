import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { API } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API}/team`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await axios.put(`${API}/team/${editingMember.id}`, formData);
        toast.success('Team member updated!');
      } else {
        await axios.post(`${API}/team`, formData);
        toast.success('Team member added!');
      }
      fetchMembers();
      resetForm();
    } catch (error) {
      toast.error('Error saving team member');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await axios.delete(`${API}/team/${id}`);
      toast.success('Team member deleted!');
      fetchMembers();
    } catch (error) {
      toast.error('Error deleting team member');
      console.error('Error:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image_url: member.image_url,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', image_url: '' });
    setEditingMember(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" theme="dark" />
      <div data-testid="admin-team-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading text-white" data-testid="team-title">Team</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
            data-testid="add-member-button"
          >
            <Plus size={18} />
            Add Team Member
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-card border border-white/10" data-testid="team-form">
            <h2 className="text-2xl font-heading text-white mb-4">
              {editingMember ? 'Edit Team Member' : 'New Team Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-name"
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none"
                data-testid="input-role"
              />
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
                rows="3"
                className="w-full bg-background border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:ring-0 focus:outline-none resize-none"
                data-testid="input-bio"
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
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:bg-primary/90 transition-colors"
                  data-testid="submit-button"
                >
                  {editingMember ? 'Update' : 'Add'}
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
          {members.map((member, index) => (
            <div key={member.id} className="bg-card border border-white/5" data-testid={`team-member-${index}`}>
              <img src={member.image_url} alt={member.name} className="w-full aspect-square object-cover" />
              <div className="p-4">
                <h3 className="text-white font-heading text-lg mb-1" data-testid={`member-name-${index}`}>{member.name}</h3>
                <p className="text-primary text-sm mb-3" data-testid={`member-role-${index}`}>{member.role}</p>
                <p className="text-white/60 text-sm mb-4" data-testid={`member-bio-${index}`}>{member.bio}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                    data-testid={`edit-button-${index}`}
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
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

        {members.length === 0 && (
          <div className="text-center py-20" data-testid="no-members-message">
            <p className="text-white/60">No team members yet. Add your first one!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;
