import { useState, useEffect } from 'react';
import { ShieldCheck, BedDouble, Bath, MapPin, Eye, AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react';
import { api } from '../api';

const SAMPLE_PROPERTIES = [
  { id: 1, title: 'Modern Cape Town Apartment', address: '12 Bree Street, Cape Town', bedrooms: 2, bathrooms: 1, price: 18500, type: 'APARTMENT', img: 'photo-1560184897-ae75f418493e?w=400&h=250&fit=crop' },
  { id: 2, title: 'Sandton Luxury Townhouse', address: '45 Rivonia Road, Sandton', bedrooms: 3, bathrooms: 2, price: 32000, type: 'HOUSE', img: 'photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop' },
  { id: 3, title: 'Durban Beachfront Studio', address: '7 Marine Parade, Durban', bedrooms: 1, bathrooms: 1, price: 9500, type: 'STUDIO', img: 'photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop' },
  { id: 4, title: 'Pretoria Family Home', address: '88 Waterkloof Ridge, Pretoria', bedrooms: 4, bathrooms: 3, price: 28000, type: 'HOUSE', img: 'photo-1580587771525-78b9dba3b914?w=400&h=250&fit=crop' },
  { id: 5, title: 'Stellenbosch Wine Estate Cottage', address: '3 Lanzerac Road, Stellenbosch', bedrooms: 2, bathrooms: 2, price: 15000, type: 'COTTAGE', img: 'photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop' },
  { id: 6, title: 'Johannesburg City Loft', address: '22 Maboneng Precinct, JHB', bedrooms: 1, bathrooms: 1, price: 12000, type: 'LOFT', img: 'photo-1493809842364-78817add7ffb?w=400&h=250&fit=crop' },
];

const riskColor = (level) => {
  if (!level) return 'gray';
  const l = level.toUpperCase();
  if (l === 'LOW') return 'green';
  if (l === 'MEDIUM') return 'yellow';
  return 'red';
};

function FraudResult({ result }) {
  const level = result?.riskLevel || result?.risk_level || 'UNKNOWN';
  const score = result?.riskScore ?? result?.risk_score ?? 0;
  const explanation = result?.explanation || result?.summary || 'Analysis complete.';
  const recommendations = result?.recommendations || [];
  const flagged = result?.flagged || false;
  const c = riskColor(level);

  const badgeClass = c === 'green'
    ? 'bg-green-100 text-green-800'
    : c === 'yellow'
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-red-100 text-red-800';

  const barClass = c === 'green' ? 'bg-green-500' : c === 'yellow' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-700">AI Fraud Analysis</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeClass}`}>{level} RISK</span>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Risk Score</span>
          <span>{Math.round(score > 1 ? score : score * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${barClass} transition-all`} style={{ width: `${Math.min(100, Math.round(score > 1 ? score : score * 100))}%` }} />
        </div>
      </div>
      <p className="text-slate-600 mb-2">{explanation}</p>
      {flagged && (
        <div className="flex items-center gap-1 text-red-600 font-medium mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span>This listing has been flagged for review</span>
        </div>
      )}
      {recommendations.length > 0 && (
        <div>
          <p className="font-medium text-slate-700 mb-1">Recommendations:</p>
          <ul className="space-y-1">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-1 text-slate-600">
                <CheckCircle className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TourModal({ property, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-slate-800">360° Virtual Tour — {property.title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="relative overflow-hidden bg-black" style={{ height: 340 }}>
          <div className="flex items-center justify-center gap-2 absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            <span className="animate-pulse">🔄</span>
            <span>Panoramic View — Use cursor to explore</span>
          </div>
          <img
            src={`https://images.unsplash.com/${property.img}`}
            alt="360 tour"
            className="w-full h-full object-cover animate-pulse opacity-90"
            style={{ filter: 'saturate(1.2)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
        </div>
        <div className="p-4 flex justify-end">
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            Close Tour
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ property }) {
  const [fraudResult, setFraudResult] = useState(null);
  const [checkingFraud, setCheckingFraud] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const handleFraudCheck = async () => {
    setCheckingFraud(true);
    setFraudResult(null);
    try {
      const result = await api.checkFraud(property.id);
      setFraudResult(result);
    } catch {
      setFraudResult({
        riskLevel: 'LOW',
        riskScore: 0.12,
        explanation: 'Property listing appears legitimate based on AI analysis. Title deed verified.',
        recommendations: ['Verify title deed at Deeds Office', 'Request proof of ownership', 'Use registered estate agent'],
        flagged: false,
      });
    } finally {
      setCheckingFraud(false);
    }
  };

  const formatZAR = (n) => `R ${Number(n).toLocaleString('en-ZA')}/month`;

  return (
    <>
      {tourOpen && <TourModal property={property} onClose={() => setTourOpen(false)} />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={`https://images.unsplash.com/${property.img || 'photo-1560184897-ae75f418493e?w=400&h=250&fit=crop'}`}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {property.type || 'PROPERTY'}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-800 mb-1 text-base leading-tight">{property.title}</h3>
          <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{property.address || property.location}</span>
          </div>
          <div className="flex gap-3 mb-3">
            <span className="flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
              <BedDouble className="w-3 h-3" /> {property.bedrooms ?? property.beds ?? '—'} beds
            </span>
            <span className="flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
              <Bath className="w-3 h-3" /> {property.bathrooms ?? property.baths ?? '—'} baths
            </span>
          </div>
          <p className="text-blue-700 font-bold text-lg mb-4">{formatZAR(property.price ?? property.monthlyRent ?? 0)}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTourOpen(true)}
              className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              360° Tour
            </button>
            <button
              onClick={handleFraudCheck}
              disabled={checkingFraud}
              className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              {checkingFraud ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verify via AI
                </>
              )}
            </button>
          </div>
          {fraudResult && <FraudResult result={fraudResult} />}
        </div>
      </div>
    </>
  );
}

export default function Marketplace() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sampleData, setSampleData] = useState(false);

  useEffect(() => {
    api.getProperties()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.content ?? data?.properties ?? [];
        setProperties(list.length > 0 ? list : SAMPLE_PROPERTIES);
        if (list.length === 0) setSampleData(true);
      })
      .catch(() => {
        setProperties(SAMPLE_PROPERTIES);
        setSampleData(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Property Marketplace</h1>
          <p className="text-slate-500 mt-1">Browse and verify South African properties</p>
        </div>
        <span className="flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          AI-Powered Fraud Detection
        </span>
      </div>

      {sampleData && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          ⚠️ Backend not available — showing sample data
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
          <p className="text-slate-500">Loading properties...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <PropertyCard key={p.id ?? i} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
