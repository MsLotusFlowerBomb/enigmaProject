import { useState, useEffect } from 'react';
import { FileText, Loader2, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { api } from '../api';

const today = new Date().toISOString().split('T')[0];
const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const SAMPLE_LEASES = [
  { id: 1, tenantName: 'Sipho Nkosi', propertyTitle: 'Modern Cape Town Apartment', monthlyRent: 18500, status: 'ACTIVE', startDate: '2024-01-01', endDate: '2024-12-31' },
  { id: 2, tenantName: 'Priya Naidoo', propertyTitle: 'Sandton Luxury Townhouse', monthlyRent: 32000, status: 'PENDING', startDate: '2024-03-01', endDate: '2025-02-28' },
  { id: 3, tenantName: 'Johan van der Berg', propertyTitle: 'Pretoria Family Home', monthlyRent: 28000, status: 'ACTIVE', startDate: '2023-07-01', endDate: '2024-06-30' },
];

const statusBadge = (status) => {
  const classes = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    EXPIRED: 'bg-red-100 text-red-700',
    TERMINATED: 'bg-gray-100 text-gray-700',
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
};

export default function Leases() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sampleData, setSampleData] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedLease, setGeneratedLease] = useState(null);
  const [form, setForm] = useState({
    propertyId: '1',
    tenantId: '3',
    landlordId: '1',
    startDate: today,
    endDate: nextYear,
    monthlyRent: '18500',
  });

  useEffect(() => {
    api.getLeases()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.content ?? [];
        setLeases(list.length > 0 ? list : SAMPLE_LEASES);
        if (list.length === 0) setSampleData(true);
      })
      .catch(() => { setLeases(SAMPLE_LEASES); setSampleData(true); })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedLease(null);
    try {
      const result = await api.generateLease({
        propertyId: Number(form.propertyId),
        tenantId: Number(form.tenantId),
        landlordId: Number(form.landlordId),
        startDate: form.startDate,
        endDate: form.endDate,
        monthlyRent: Number(form.monthlyRent),
      });
      setGeneratedLease(result?.leaseText || result?.content || result?.lease || JSON.stringify(result, null, 2));
    } catch {
      setGeneratedLease(generateSampleLease(form));
    } finally {
      setGenerating(false);
    }
  };

  const formatZAR = (n) => `R ${Number(n).toLocaleString('en-ZA')}`;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lease Management</h1>
          <p className="text-slate-500 mt-1">Manage and generate rental agreements</p>
        </div>
        <span className="flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
          <FileText className="w-4 h-4" />
          AI-Powered Generation
        </span>
      </div>

      {sampleData && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          ⚠️ Backend not available — showing sample data
        </div>
      )}

      {/* Existing Leases */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Active Leases</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {leases.map((lease, i) => (
              <div key={lease.id ?? i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{lease.tenantName || `Tenant #${lease.tenantId}`}</p>
                    <p className="text-slate-500 text-xs">{lease.propertyTitle || `Property #${lease.propertyId}`}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-700">{formatZAR(lease.monthlyRent)}/mo</p>
                  <p className="text-xs text-slate-400">{lease.startDate} → {lease.endDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(lease.status)}`}>
                  {lease.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Lease Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-800">Generate New Lease</h2>
        </div>
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            { name: 'propertyId', label: 'Property ID' },
            { name: 'tenantId', label: 'Tenant ID' },
            { name: 'landlordId', label: 'Landlord ID' },
            { name: 'monthlyRent', label: 'Monthly Rent (ZAR)' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={generating}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> AI is drafting your lease...</>
              ) : (
                <><FileText className="w-4 h-4" /> Generate AI Lease Agreement</>
              )}
            </button>
          </div>
        </form>

        {generatedLease && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Lease Agreement Generated</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6 max-h-96 overflow-y-auto font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner">
              {generatedLease}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generateSampleLease(form) {
  return `RESIDENTIAL LEASE AGREEMENT
==============================

This Lease Agreement ("Agreement") is entered into as of ${form.startDate},
between:

LANDLORD: Landlord ID #${form.landlordId}
TENANT:   Tenant ID #${form.tenantId}
PROPERTY: Property ID #${form.propertyId}

TERM
----
The lease commences on ${form.startDate} and expires on ${form.endDate}.

RENT
----
Monthly Rent: R ${Number(form.monthlyRent).toLocaleString('en-ZA')}
Due Date:     1st of each month
Late Fee:     R 500 if paid after the 7th

DEPOSIT
-------
A security deposit of R ${(Number(form.monthlyRent) * 2).toLocaleString('en-ZA')} is due at signing.

OBLIGATIONS
-----------
1. Tenant shall maintain the premises in clean condition.
2. Tenant shall not sublet without written consent.
3. Landlord shall maintain structural integrity of the property.
4. All repairs under R 500 are the tenant's responsibility.

SOUTH AFRICAN LAW
-----------------
This agreement is governed by the Rental Housing Act 50 of 1999
and the Consumer Protection Act 68 of 2008.

Signed electronically via PropMate AI Platform.

_______________________     _______________________
Landlord Signature           Tenant Signature
Date: ${form.startDate}`;
}
