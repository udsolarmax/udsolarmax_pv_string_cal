import React, { useState, useEffect } from 'react';

// ==========================================
// 1. DATABASE: ฐานข้อมูลอุปกรณ์ (รวม Huawei, Deye, Solis Hybrid/Grid, Luxpower)
// ==========================================

const DB_INVERTERS = [
  // --- HUAWEI (Grid-Tied) ---
  { id: 'huawei_3k_l1', brand: 'Huawei', model: 'SUN2000-3KTL-L1', maxDcV: 600, startV: 100, mpptCount: 1, maxStrings: 2, maxDkW: 4500, maxIsc: 20 },
  { id: 'huawei_5k_l1', brand: 'Huawei', model: 'SUN2000-5KTL-L1', maxDcV: 600, startV: 100, mpptCount: 1, maxStrings: 2, maxDkW: 7500, maxIsc: 20 },
  { id: 'huawei_8k_lc0', brand: 'Huawei', model: 'SUN2000-8KTL-lc0', maxDcV: 600, startV: 100, mpptCount: 3, maxStrings: 3, maxDkW: 12000, maxIsc: 20 }, 
  { id: 'huawei_10k_lc0', brand: 'Huawei', model: 'SUN2000-8KTL-lc0', maxDcV: 600, startV: 100, mpptCount: 3, maxStrings: 3, maxDkW: 15000, maxIsc: 20 }, 
  { id: 'huawei_3k_m1', brand: 'Huawei', model: 'SUN2000-3KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 1, maxStrings: 2, maxDkW: 4500, maxIsc: 19.5 },
  { id: 'huawei_5k_m1', brand: 'Huawei', model: 'SUN2000-5KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 1, maxStrings: 2, maxDkW: 7500, maxIsc: 19.5 },
  { id: 'huawei_6k_m1', brand: 'Huawei', model: 'SUN2000-5KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 1, maxStrings: 2, maxDkW: 9000, maxIsc: 19.5 },
  { id: 'huawei_8k_m1', brand: 'Huawei', model: 'SUN2000-5KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 1, maxStrings: 2, maxDkW: 12000, maxIsc: 19.5 },
  { id: 'huawei_10k_m1', brand: 'Huawei', model: 'SUN2000-10KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 1, maxStrings: 2, maxDkW: 15000, maxIsc: 19.5 },
  { id: 'huawei_5k_map0', brand: 'Huawei', model: 'SUN2000-5KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 1, maxStrings: 2, maxDkW: 9000, maxIsc: 22 },
  { id: 'huawei_6k_map0', brand: 'Huawei', model: 'SUN2000-5KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 1, maxStrings: 2, maxDkW: 11000, maxIsc: 22 },
  { id: 'huawei_8k_map0', brand: 'Huawei', model: 'SUN2000-5KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 1, maxStrings: 2, maxDkW: 9000, maxIsc: 22 },
  { id: 'huawei_10k_map0', brand: 'Huawei', model: 'SUN2000-10KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 1, maxStrings: 2, maxDkW: 14600, maxIsc: 22 },
  { id: 'huawei_12k_map0', brand: 'Huawei', model: 'SUN2000-12KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 1, maxStrings: 2, maxDkW: 22000, maxIsc: 22 },
  
  // --- DEYE (Hybrid) ---
  { id: 'deye_5k_sg03', brand: 'Deye', model: 'SUN-5K-SG03LP1-EU (Hybrid)', maxDcV: 500, startV: 125, mpptCount: 2, maxStrings: 2, maxDkW: 6500, maxIsc: 13 },
  { id: 'deye_8k_sg01', brand: 'Deye', model: 'SUN-8K-SG01LP1-EU (Hybrid)', maxDcV: 500, startV: 125, mpptCount: 2, maxStrings: 2, maxDkW: 10400, maxIsc: 26 },
  { id: 'deye_12k_sg04', brand: 'Deye', model: 'SUN-12K-SG04LP3-EU (3P Hybrid)', maxDcV: 800, startV: 160, mpptCount: 2, maxStrings: 2, maxDkW: 15600, maxIsc: 34 },

  // --- SOLIS (Grid & Hybrid) ---
  // Grid-Tied
  { id: 'solis_grid_3k', brand: 'Solis', model: 'S6-GR1P3K (Grid)', maxDcV: 600, startV: 90, mpptCount: 1, maxStrings: 1, maxDkW: 4500, maxIsc: 14 },
  { id: 'solis_grid_5k', brand: 'Solis', model: 'S6-GR1P5K (Grid)', maxDcV: 600, startV: 120, mpptCount: 2, maxStrings: 2, maxDkW: 7500, maxIsc: 14 },
  { id: 'solis_grid_10k', brand: 'Solis', model: 'S5-GR3P10K (3P Grid)', maxDcV: 1100, startV: 180, mpptCount: 2, maxStrings: 2, maxDkW: 15000, maxIsc: 16 },
  // Hybrid (เพิ่มใหม่!)
  { id: 'solis_hyb_5k', brand: 'Solis', model: 'S6-EH1P5K-L-EU (Hybrid)', maxDcV: 600, startV: 90, mpptCount: 2, maxStrings: 2, maxDkW: 8000, maxIsc: 16 },
  { id: 'solis_hyb_6k', brand: 'Solis', model: 'S6-EH1P6K-L-EU (Hybrid)', maxDcV: 600, startV: 90, mpptCount: 2, maxStrings: 2, maxDkW: 9600, maxIsc: 16 },
  { id: 'solis_hyb_10k', brand: 'Solis', model: 'RHI-3P10K-HVES-5G (3P Hybrid)', maxDcV: 1000, startV: 160, mpptCount: 2, maxStrings: 4, maxDkW: 16000, maxIsc: 26 },

  // --- LUXPOWER (Hybrid & Off-grid) ---
  { id: 'lux_sna_5k', brand: 'Luxpower', model: 'SNA 5000 WPV (Off/Hybrid)', maxDcV: 480, startV: 100, mpptCount: 2, maxStrings: 2, maxDkW: 6400, maxIsc: 13 },
  { id: 'lux_lxp_5k', brand: 'Luxpower', model: 'LXP 5K Hybrid', maxDcV: 550, startV: 100, mpptCount: 2, maxStrings: 2, maxDkW: 8000, maxIsc: 12.5 },
];

const DB_PANELS = [
  { id: 'jinko_545', brand: 'Jinko', model: 'Tiger Neo 545W', pmax: 545, voc: 49.92, vmp: 41.32, isc: 13.55, tempCoeff: -0.29 },
  { id: 'jinko_585', brand: 'Jinko', model: 'Tiger Neo 585W', pmax: 585, voc: 50.87, vmp: 42.14, isc: 14.31, tempCoeff: -0.29 },
  { id: 'longi_550', brand: 'Longi', model: 'Hi-MO 5 550W', pmax: 550, voc: 49.80, vmp: 41.95, isc: 13.98, tempCoeff: -0.27 },
  { id: 'trina_550', brand: 'Trina', model: 'Vertex 550W', pmax: 550, voc: 38.40, vmp: 31.60, isc: 18.18, tempCoeff: -0.34 },
  { id: 'ja_550', brand: 'JA Solar', model: 'DeepBlue 3.0 550W', pmax: 550, voc: 49.90, vmp: 41.80, isc: 14.00, tempCoeff: -0.27 },
];

export default function SolarInverterMatcherV2() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [filteredInverters, setFilteredInverters] = useState([]);
  const [selectedInv, setSelectedInv] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(DB_PANELS[0]);
  const [minTemp, setMinTemp] = useState(15);
  const [panelsPerString, setPanelsPerString] = useState(10);
  const [activeStrings, setActiveStrings] = useState(1);

  useEffect(() => {
    const uniqueBrands = [...new Set(DB_INVERTERS.map(item => item.brand))];
    setBrands(uniqueBrands);
    setSelectedBrand(uniqueBrands[0] || 'Huawei');
  }, []);

  useEffect(() => {
    const models = DB_INVERTERS.filter(inv => inv.brand === selectedBrand);
    setFilteredInverters(models);
    if (models.length > 0) setSelectedInv(models[0]);
  }, [selectedBrand]);

  const calculateCompatibility = () => {
    if (!selectedInv) return null;
    const tempDiff = minTemp - 25;
    const vocCorrectionFactor = 1 + (tempDiff * (selectedPanel.tempCoeff / 100));
    const maxVocPerPanel = selectedPanel.voc * vocCorrectionFactor;
    const maxPanelsPossible = Math.floor(selectedInv.maxDcV / maxVocPerPanel);
    const minPanelsPossible = Math.ceil(selectedInv.startV / selectedPanel.vmp);
    const currentStringVoc = maxVocPerPanel * panelsPerString;
    const currentStringVmp = selectedPanel.vmp * panelsPerString;
    const totalPower = panelsPerString * activeStrings * selectedPanel.pmax;
    const isVoltageSafe = currentStringVoc <= selectedInv.maxDcV;
    const isStartUp = currentStringVmp >= selectedInv.startV;
    const isPowerSafe = totalPower <= selectedInv.maxDkW;
    const isCurrentSafe = selectedPanel.isc <= selectedInv.maxIsc;

    return {
      maxVocPerPanel, maxPanelsPossible, minPanelsPossible, currentStringVoc, currentStringVmp, totalPower,
      isVoltageSafe, isStartUp, isPowerSafe, isCurrentSafe
    };
  };

  const result = calculateCompatibility();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-sans text-gray-800">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-[#1e293b] p-6 text-white flex justify-between items-center">
            <div><h1 className="text-2xl font-bold">UD Solarmax Inverter Tool V2.1</h1><p className="text-gray-400 text-sm">Huawei | Deye | Solis | Luxpower</p></div>
            <div className="text-right"><div className="text-xs text-yellow-400">Database Ready</div></div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-bold text-blue-800 mb-2">1. เลือกยี่ห้อ (Brand)</label>
                    <div className="flex gap-2 flex-wrap">
                      {brands.map(brand => (
                        <button key={brand} onClick={() => setSelectedBrand(brand)} className={`px-3 py-2 text-sm rounded-md border transition-all ${selectedBrand === brand ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>{brand}</button>
                      ))}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-blue-100 relative">
                    <label className="block text-sm font-bold text-gray-800 mb-2">2. เลือกรุ่น (Model)</label>
                    <select className="w-full p-2 border rounded font-bold text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500" onChange={(e) => setSelectedInv(filteredInverters.find(i => i.id === e.target.value))} value={selectedInv ? selectedInv.id : ''}>
                        {filteredInverters.map(inv => (<option key={inv.id} value={inv.id}>{inv.model} (Max {inv.maxDcV}V)</option>))}
                    </select>
                    {selectedInv && (
                      <div className="mt-3 bg-slate-800 text-white p-3 rounded text-xs grid grid-cols-2 gap-2">
                          <div>Max PV: <span className="text-yellow-400">{selectedInv.maxDkW} W</span></div>
                          <div>Max DC V: <span className="text-yellow-400">{selectedInv.maxDcV} V</span></div>
                          <div>Start V: <span className="text-yellow-400">{selectedInv.startV} V</span></div>
                          <div>Max Isc: <span className="text-yellow-400">{selectedInv.maxIsc} A</span></div>
                      </div>
                    )}
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <label className="block text-sm font-bold text-orange-800 mb-2">3. เลือกแผงโซล่าเซลล์</label>
                    <select className="w-full p-2 border rounded font-bold text-gray-700" onChange={(e) => setSelectedPanel(DB_PANELS.find(p => p.id === e.target.value))} value={selectedPanel.id}>
                        {DB_PANELS.map(p => (<option key={p.id} value={p.id}>{p.brand} {p.model} ({p.pmax}W)</option>))}
                    </select>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center"><label className="text-sm font-bold text-gray-700">อุณหภูมิต่ำสุด (°C)</label><input type="number" value={minTemp} onChange={e => setMinTemp(Number(e.target.value))} className="w-20 border rounded p-1 text-center font-bold text-blue-600"/></div>
                    <div className="flex justify-between items-center border-t pt-4"><label className="text-sm font-bold text-gray-700">จำนวนแผง/สตริง</label><input type="number" value={panelsPerString} onChange={e => setPanelsPerString(Number(e.target.value))} className="w-20 border rounded p-1 text-center font-bold"/></div>
                    <div className="flex justify-between items-center"><label className="text-sm font-bold text-gray-700">จำนวนสตริง</label><input type="number" value={activeStrings} onChange={e => setActiveStrings(Number(e.target.value))} className="w-20 border rounded p-1 text-center font-bold"/></div>
                </div>
            </div>
            {result && selectedInv && (
            <div className="flex flex-col space-y-4">
                <div className="bg-slate-900 text-white rounded-lg p-5 shadow-lg border-l-4 border-yellow-500">
                    <h3 className="text-md font-bold text-yellow-400 mb-4">⚡ ผลลัพธ์: {selectedInv.brand}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-800 p-3 rounded text-center border border-slate-700"><div className="text-xs text-gray-400">ใส่ได้สูงสุด (Max)</div><div className="text-3xl font-bold text-green-400">{result.maxPanelsPossible} <span className="text-sm">แผง</span></div></div>
                        <div className="bg-slate-800 p-3 rounded text-center border border-slate-700"><div className="text-xs text-gray-400">ใส่ขั้นต่ำ (Min)</div><div className="text-3xl font-bold text-yellow-400">{result.minPanelsPossible} <span className="text-sm">แผง</span></div></div>
                    </div>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <h3 className="text-md font-bold text-gray-800 mb-3">🛡️ Safety Check</h3>
                    <div className="space-y-3">
                        <div className={`flex justify-between items-center p-3 rounded ${result.isVoltageSafe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}><div><div className="font-bold text-sm">แรงดันรวม (Voc)</div><div className="text-xs">{result.currentStringVoc.toFixed(1)}V / Max {selectedInv.maxDcV}V</div></div><div className="font-bold text-xl">{result.isVoltageSafe ? 'PASS' : 'FAIL'}</div></div>
                        <div className={`flex justify-between items-center p-3 rounded ${result.isPowerSafe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}><div><div className="font-bold text-sm">กำลังผลิต (Power)</div><div className="text-xs">{(result.totalPower/1000).toFixed(2)}kW / Max {(selectedInv.maxDkW/1000).toFixed(2)}kW</div></div><div className="font-bold text-xl">{result.isPowerSafe ? 'PASS' : 'FAIL'}</div></div>
                        <div className={`flex justify-between items-center p-3 rounded ${result.isCurrentSafe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}><div><div className="font-bold text-sm">กระแสแผง (Isc)</div><div className="text-xs">{selectedPanel.isc}A / Max {selectedInv.maxIsc}A</div></div><div className="font-bold text-xl">{result.isCurrentSafe ? 'PASS' : 'FAIL'}</div></div>
                        <div className={`flex justify-between items-center p-3 rounded ${result.isStartUp ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}><div><div className="font-bold text-sm">แรงดันทำงาน (Vmp)</div><div className="text-xs">{result.currentStringVmp.toFixed(1)}V / Start {selectedInv.startV}V</div></div><div className="font-bold text-xl">{result.isStartUp ? 'OK' : 'LOW'}</div></div>
                    </div>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
