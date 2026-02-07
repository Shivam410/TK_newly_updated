import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { API } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';
import { Trash2, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`${API}/inquiries`);
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`${API}/inquiries/${id}/status`, { status });
      toast.success('Status updated!');
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (error) {
      toast.error('Error updating status');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await axios.delete(`${API}/inquiries/${id}`);
      toast.success('Inquiry deleted!');
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      toast.error('Error deleting inquiry');
      console.error('Error:', error);
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(inq => inq.status === filter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-primary/20 text-primary',
      contacted: 'bg-blue-500/20 text-blue-400',
      closed: 'bg-green-500/20 text-green-400',
    };
    return styles[status] || styles.new;
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" theme="dark" />
      <div data-testid="admin-inquiries-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading text-white" data-testid="inquiries-title">Inquiries</h1>
          <div className="flex gap-2">
            {['all', 'new', 'contacted', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                data-testid={`filter-${status}`}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${
                  filter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-white/20 text-white hover:border-primary'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            {filteredInquiries.map((inquiry, index) => (
              <div
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`p-4 border cursor-pointer transition-all ${
                  selectedInquiry?.id === inquiry.id
                    ? 'border-primary bg-card'
                    : 'border-white/10 hover:border-white/20 bg-card/50'
                }`}
                data-testid={`inquiry-card-${index}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-heading" data-testid={`inquiry-name-${index}`}>
                    {inquiry.first_name} {inquiry.last_name}
                  </h3>
                  <span className={`px-2 py-1 text-xs ${getStatusBadge(inquiry.status)}`} data-testid={`inquiry-status-${index}`}>
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-2" data-testid={`inquiry-email-${index}`}>{inquiry.email}</p>
                <p className="text-white/40 text-xs" data-testid={`inquiry-date-${index}`}>{formatDate(inquiry.created_at)}</p>
              </div>
            ))}
            {filteredInquiries.length === 0 && (
              <div className="text-center py-10" data-testid="no-inquiries-message">
                <p className="text-white/60">No inquiries found.</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {selectedInquiry ? (
              <div className="p-6 bg-card border border-white/10" data-testid="inquiry-details">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-heading text-white" data-testid="detail-title">Inquiry Details</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'contacted')}
                      className="p-2 border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Mark as Contacted"
                      data-testid="status-contacted-button"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'closed')}
                      className="p-2 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-colors"
                      title="Mark as Closed"
                      data-testid="status-closed-button"
                    >
                      <XCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="p-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                      data-testid="delete-inquiry-button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/40 text-xs mb-1">First Name</p>
                      <p className="text-white" data-testid="detail-first-name">{selectedInquiry.first_name}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">Last Name</p>
                      <p className="text-white" data-testid="detail-last-name">{selectedInquiry.last_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/40 text-xs mb-1">Email</p>
                      <p className="text-white" data-testid="detail-email">{selectedInquiry.email}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">Phone</p>
                      <p className="text-white" data-testid="detail-phone">{selectedInquiry.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Country</p>
                    <p className="text-white" data-testid="detail-country">{selectedInquiry.country}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Event Details</p>
                    <p className="text-white" data-testid="detail-event-details">{selectedInquiry.event_details}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Venue Address</p>
                    <p className="text-white" data-testid="detail-venue-address">{selectedInquiry.venue_address}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Number of Guests</p>
                    <p className="text-white" data-testid="detail-number-of-guests">{selectedInquiry.number_of_guests}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Additional Requirements</p>
                    <p className="text-white" data-testid="detail-additional-requirements">{selectedInquiry.additional_requirements}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/40 text-xs mb-1">Date</p>
                      <p className="text-white" data-testid="detail-date">{selectedInquiry.date}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">Time</p>
                      <p className="text-white" data-testid="detail-time">{selectedInquiry.time}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">How Did You Hear About Us</p>
                    <p className="text-white" data-testid="detail-how-did-you-hear">{selectedInquiry.how_did_you_hear}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Submitted On</p>
                    <p className="text-white" data-testid="detail-submitted-on">{formatDate(selectedInquiry.created_at)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-card border border-white/10 text-center" data-testid="select-inquiry-message">
                <Eye className="mx-auto mb-4 text-white/40" size={48} />
                <p className="text-white/60">Select an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;
