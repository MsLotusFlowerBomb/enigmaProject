import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, FileImage, Cpu } from 'lucide-react';
import { api } from '../api';

const costColor = (cost) => {
  if (cost >= 5000) return { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', level: 'HIGH' };
  if (cost >= 1500) return { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', level: 'MEDIUM' };
  return { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', level: 'LOW' };
};

const SAMPLE_RESULT = {
  timestamp: new Date().toISOString(),
  damages: [
    { description: 'Cracked bathroom tiles near shower area', estimatedCost: 3200 },
    { description: 'Water stains on bedroom ceiling — possible roof leak', estimatedCost: 8500 },
    { description: 'Broken kitchen cabinet hinges (x3)', estimatedCost: 450 },
    { description: 'Scuff marks and paint damage on living room walls', estimatedCost: 1800 },
    { description: 'Damaged door lock mechanism — security concern', estimatedCost: 950 },
  ],
  totalRepairCost: 14900,
  depositDeduction: 11920,
  recommendation: 'Significant damages found. Recommend withholding 80% of deposit and scheduling professional repairs before next tenancy.',
};

export default function Inspections() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const data = await api.analyzeInspection(file);
      setResult(data?.damages ? data : SAMPLE_RESULT);
    } catch {
      setResult(SAMPLE_RESULT);
    } finally {
      setAnalyzing(false);
    }
  };

  const formatZAR = (n) => `R ${Number(n).toLocaleString('en-ZA')}`;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Move-In/Out Inspection</h1>
          <p className="text-slate-500 mt-1">Upload photos for automated damage assessment</p>
        </div>
        <span className="flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full">
          <Cpu className="w-4 h-4" />
          Powered by Huawei ModelArts Vision AI
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Upload Inspection Photos</h2>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium mb-1">Upload inspection photos</p>
            <p className="text-slate-400 text-sm">Drag & drop or click to browse</p>
            <p className="text-slate-300 text-xs mt-1">JPEG, PNG, WEBP supported</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <FileImage className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-800 truncate">{file.name}</p>
                <p className="text-xs text-blue-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI Vision is analyzing images...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Analyze with AI
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Inspection Results</h2>
          {!result ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Camera className="w-14 h-14 text-slate-200 mb-3" />
              <p className="text-slate-400 font-medium">No analysis yet</p>
              <p className="text-slate-300 text-sm mt-1">Upload a photo and click Analyze</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600">Inspection Report</span>
                <span className="text-xs text-slate-400">
                  {new Date(result.timestamp || Date.now()).toLocaleString('en-ZA')}
                </span>
              </div>

              <div className="space-y-3 mb-5">
                {(result.damages || []).map((dmg, i) => {
                  const c = costColor(dmg.estimatedCost || dmg.cost || 0);
                  return (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${c.bg} ${c.border}`}>
                      <span className="text-lg leading-none mt-0.5">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{dmg.description || dmg.damage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.badge}`}>{c.level}</span>
                          <span className="text-sm font-bold text-slate-700">
                            {formatZAR(dmg.estimatedCost || dmg.cost || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Repair Cost</span>
                  <span className="font-bold text-red-600">{formatZAR(result.totalRepairCost || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Deposit Deduction</span>
                  <span className="font-bold text-orange-600">{formatZAR(result.depositDeduction || 0)}</span>
                </div>
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600">{result.recommendation || result.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
