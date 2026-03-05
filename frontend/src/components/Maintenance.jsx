import { useState, useEffect } from 'react';
import { Wrench, Plus, X, Loader2, ChevronDown } from 'lucide-react';
import { api } from '../api';

const SAMPLE_TICKETS = [
  { id: 1, title: 'Burst pipe in kitchen', description: 'Water flooding under kitchen sink. Urgent repair needed.', category: 'Plumbing', priority: 'URGENT', status: 'OPEN', propertyId: 1, tenantId: 3, createdAt: '2024-03-01T08:00:00Z' },
  { id: 2, title: 'Tripped circuit breaker', description: 'Main bedroom circuit keeps tripping when AC is on.', category: 'Electrical', priority: 'HIGH', status: 'IN_PROGRESS', propertyId: 2, tenantId: 5, createdAt: '2024-02-28T14:30:00Z' },
  { id: 3, title: 'Cracked window in lounge', description: 'Front window has a hairline crack — security risk.', category: 'Structural', priority: 'MEDIUM', status: 'OPEN', propertyId: 1, tenantId: 3, createdAt: '2024-02-25T10:00:00Z' },
  { id: 4, title: 'Dishwasher not draining', description: 'Dishwasher fills with water but does not drain after cycle.', category: 'Appliances', priority: 'LOW', status: 'RESOLVED', propertyId: 3, tenantId: 7, createdAt: '2024-02-20T09:00:00Z' },
  { id: 5, title: 'Front gate lock broken', description: 'Remote for electric gate is not functioning. Manual override needed.', category: 'Security', priority: 'HIGH', status: 'IN_PROGRESS', propertyId: 4, tenantId: 2, createdAt: '2024-03-02T16:00:00Z' },
];

const CATEGORIES = ['Plumbing', 'Electrical', 'Structural', 'Appliances', 'Security', 'General'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const priorityConfig = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
};

const statusConfig = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
};

const defaultForm = {
  title: '', description: '', category: 'Plumbing', priority: 'MEDIUM',
  propertyId: '1', tenantId: '1',
};

export default function Maintenance() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sampleData, setSampleData] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.getTickets()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.content ?? [];
        setTickets(list.length > 0 ? list : SAMPLE_TICKETS);
        if (list.length === 0) setSampleData(true);
      })
      .catch(() => { setTickets(SAMPLE_TICKETS); setSampleData(true); })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, propertyId: Number(form.propertyId), tenantId: Number(form.tenantId) };
    try {
      const created = await api.createTicket(payload);
      setTickets(prev => [created, ...prev]);
    } catch {
      setTickets(prev => [{ ...payload, id: Date.now(), createdAt: new Date().toISOString(), status: 'OPEN' }, ...prev]);
    } finally {
      setSubmitting(false);
      setForm(defaultForm);
      setShowForm(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.updateTicketStatus(id, status);
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } finally {
      setUpdatingId(null);
    }
  };

  const open = tickets.filter(t => t.status === 'OPEN').length;
  const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance Management</h1>
          <p className="text-slate-500 mt-1">Track and manage property maintenance requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">{open} Open</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">{inProgress} In Progress</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">{resolved} Resolved</span>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'New Ticket'}
          </button>
        </div>
      </div>

      {sampleData && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          ⚠️ Backend not available — showing sample data
        </div>
      )}

      {/* New Ticket Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">New Maintenance Ticket</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input required name="title" value={form.title} onChange={handleChange} placeholder="Brief description of the issue"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Detailed description..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Property ID</label>
              <input name="propertyId" value={form.propertyId} onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tenant ID</label>
              <input name="tenantId" value={form.tenantId} onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg transition-colors font-medium">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Plus className="w-4 h-4" /> Submit Ticket</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="bg-slate-100 rounded-lg p-2 flex-shrink-0">
                    <Wrench className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-base">{ticket.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityConfig[ticket.priority] || priorityConfig.MEDIUM}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[ticket.status] || statusConfig.OPEN}`}>
                        {ticket.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-full">{ticket.category}</span>
                      <span>Property #{ticket.propertyId || ticket.property?.id} {ticket.property?.title ? `— ${ticket.property.title}` : ''}</span>
                      <span>Tenant #{ticket.tenantId || ticket.tenant?.id} {ticket.tenant?.name ? `— ${ticket.tenant.name}` : ''}</span>
                      <span>{new Date(ticket.createdAt || Date.now()).toLocaleDateString('en-ZA')}</span>
                    </div>
                    {ticket.description && (
                      <p className="text-sm text-slate-600 leading-relaxed">{ticket.description}</p>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                      disabled={updatingId === ticket.id}
                      className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer disabled:opacity-60"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                  </div>
                  {updatingId === ticket.id && (
                    <div className="flex justify-center mt-1">
                      <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
