import { useState, useEffect } from 'react';
import { CreditCard, Loader2, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { api } from '../api';

const SAMPLE_INVOICES = [
  { id: 1, invoiceNumber: 'INV-2024-001', propertyTitle: 'Modern Cape Town Apartment', leaseId: 1, dueDate: '2024-03-01', amount: 18500, status: 'PAID' },
  { id: 2, invoiceNumber: 'INV-2024-002', propertyTitle: 'Sandton Luxury Townhouse', leaseId: 2, dueDate: '2024-03-01', amount: 32000, status: 'PENDING' },
  { id: 3, invoiceNumber: 'INV-2024-003', propertyTitle: 'Pretoria Family Home', leaseId: 3, dueDate: '2024-02-01', amount: 28000, status: 'LATE' },
  { id: 4, invoiceNumber: 'INV-2024-004', propertyTitle: 'Durban Beachfront Studio', leaseId: 4, dueDate: '2024-03-15', amount: 9500, status: 'PENDING' },
  { id: 5, invoiceNumber: 'INV-2024-005', propertyTitle: 'Stellenbosch Cottage', leaseId: 5, dueDate: '2024-02-28', amount: 15000, status: 'PAID' },
  { id: 6, invoiceNumber: 'INV-2024-006', propertyTitle: 'JHB City Loft', leaseId: 6, dueDate: '2024-01-15', amount: 12000, status: 'LATE' },
];

const statusConfig = {
  PAID: { badge: 'bg-green-100 text-green-700', icon: CheckCircle, iconClass: 'text-green-500' },
  PENDING: { badge: 'bg-yellow-100 text-yellow-700', icon: Clock, iconClass: 'text-yellow-500' },
  LATE: { badge: 'bg-red-100 text-red-700', icon: AlertCircle, iconClass: 'text-red-500' },
};

function StatCard({ label, value, sub, color }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sampleData, setSampleData] = useState(false);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    api.getInvoices()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.content ?? [];
        setInvoices(list.length > 0 ? list : SAMPLE_INVOICES);
        if (list.length === 0) setSampleData(true);
      })
      .catch(() => { setInvoices(SAMPLE_INVOICES); setSampleData(true); })
      .finally(() => setLoading(false));
  };

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      await api.payInvoice(id);
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'PAID' } : inv));
    } catch {
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'PAID' } : inv));
    } finally {
      setPayingId(null);
    }
  };

  const formatZAR = (n) => `R ${Number(n).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

  const paid = invoices.filter(i => i.status === 'PAID');
  const pending = invoices.filter(i => i.status === 'PENDING');
  const late = invoices.filter(i => i.status === 'LATE');
  const totalRevenue = paid.reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Management</h1>
          <p className="text-slate-500 mt-1">Track invoices and rental payments</p>
        </div>
        <span className="flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
          <TrendingUp className="w-4 h-4" />
          {invoices.length} Total Invoices
        </span>
      </div>

      {sampleData && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          ⚠️ Backend not available — showing sample data
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatZAR(totalRevenue)} sub={`${paid.length} paid invoices`} color="blue" />
        <StatCard label="Paid" value={paid.length} sub={formatZAR(paid.reduce((s, i) => s + i.amount, 0))} color="green" />
        <StatCard label="Pending" value={pending.length} sub={formatZAR(pending.reduce((s, i) => s + i.amount, 0))} color="yellow" />
        <StatCard label="Overdue" value={late.length} sub={formatZAR(late.reduce((s, i) => s + i.amount, 0))} color="red" />
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Invoice List</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Invoice #', 'Property / Lease', 'Due Date', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map((inv) => {
                  const cfg = statusConfig[inv.status] || statusConfig.PENDING;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono font-medium text-slate-700">
                        {inv.invoiceNumber || `INV-${inv.id}`}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800">{inv.propertyTitle || inv.lease?.property?.title || `Property #${inv.propertyId}`}</p>
                        <p className="text-xs text-slate-400">Lease #{inv.leaseId || inv.lease?.id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{inv.dueDate}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatZAR(inv.amount || 0)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
                          <StatusIcon className={`w-3 h-3 ${cfg.iconClass}`} />
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(inv.status === 'PENDING' || inv.status === 'LATE') && (
                          <button
                            onClick={() => handlePay(inv.id)}
                            disabled={payingId === inv.id}
                            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            {payingId === inv.id ? (
                              <><Loader2 className="w-3 h-3 animate-spin" /> Processing...</>
                            ) : (
                              <><CheckCircle className="w-3 h-3" /> Mark as Paid</>
                            )}
                          </button>
                        )}
                        {inv.status === 'PAID' && (
                          <span className="text-xs text-green-600 font-medium">✓ Settled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
