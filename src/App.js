import React, { useState, useEffect } from 'react';

// ==========================================
// 1. DATABASE: ฐานข้อมูลอุปกรณ์
// (Updated V3.0: เพิ่มระบุ Phase เพื่อคำนวณ AC Breaker)
// ==========================================

const DB_INVERTERS = [
  // --- HUAWEI (Grid-Tied) ---
  { id: 'huawei_3k_l1', brand: 'Huawei', model: 'SUN2000-3KTL-L1', maxDcV: 600, startV: 100, mpptCount: 1, maxStrings: 2, maxDkW: 4500, maxIsc: 20, phase: 1 },
  { id: 'huawei_5k_l1', brand: 'Huawei', model: 'SUN2000-5KTL-L1', maxDcV: 600, startV: 100, mpptCount: 1, maxStrings: 2, maxDkW: 7500, maxIsc: 20, phase: 1 },
  { id: 'huawei_8k_lc0', brand: 'Huawei', model: 'SUN2000-8KTL-lc0', maxDcV: 600, startV: 100, mpptCount: 3, maxStrings: 3, maxDkW: 12000, maxIsc: 20, phase: 1 }, 
  { id: 'huawei_10k_lc0', brand: 'Huawei', model: 'SUN2000-10KTL-lc0', maxDcV: 600, startV: 100, mpptCount: 3, maxStrings: 3, maxDkW: 15000, maxIsc: 20, phase: 1 }, 
  
  // Huawei M1 (3 Phase)
  { id: 'huawei_3k_m1', brand: 'Huawei', model: 'SUN2000-3KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 2, maxStrings: 2, maxDkW: 4500, maxIsc: 19.5, phase: 3 },
  { id: 'huawei_5k_m1', brand: 'Huawei', model: 'SUN2000-5KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 2, maxStrings: 2, maxDkW: 7500, maxIsc: 19.5, phase: 3 },
  { id: 'huawei_6k_m1', brand: 'Huawei', model: 'SUN2000-6KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 2, maxStrings: 2, maxDkW: 9000, maxIsc: 19.5, phase: 3 },
  { id: 'huawei_8k_m1', brand: 'Huawei', model: 'SUN2000-8KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 2, maxStrings: 2, maxDkW: 12000, maxIsc: 19.5, phase: 3 },
  { id: 'huawei_10k_m1', brand: 'Huawei', model: 'SUN2000-10KTL-M1', maxDcV: 1100, startV: 200, mpptCount: 2, maxStrings: 2, maxDkW: 15000, maxIsc: 19.5, phase: 3 },
  
  // Huawei MAP0 (3 Phase Hybrid)
  { id: 'huawei_5k_map0', brand: 'Huawei', model: 'SUN2000-5KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 2, maxStrings: 2, maxDkW: 9000, maxIsc: 22, phase: 3 },
  { id: 'huawei_6k_map0', brand: 'Huawei', model: 'SUN2000-6KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 2, maxStrings: 2, maxDkW: 11000, maxIsc: 22, phase: 3 },
  { id: 'huawei_8k_map0', brand: 'Huawei', model: 'SUN2000-8KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 2, maxStrings: 2, maxDkW: 9000, maxIsc: 22, phase: 3 },
  { id: 'huawei_10k_map0', brand: 'Huawei', model: 'SUN2000-10KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 2, maxStrings: 2, maxDkW: 14600, maxIsc: 22, phase: 3 },
  { id: 'huawei_12k_map0', brand: 'Huawei', model: 'SUN2000-12KTL-MAP0', maxDcV: 1100, startV: 160, mpptCount: 2, maxStrings: 2, maxDkW: 22000, maxIsc: 22, phase: 3 },
  
  // --- DEYE ---
  { id: 'deye_5k_sg03', brand: 'Deye', model: 'SUN-5K-SG03LP1-EU (Hybrid)', maxDcV: 500, startV: 125, mpptCount: 2, maxStrings: 2, maxDkW: 6500, maxIsc: 13, phase: 1 },
  { id: 'deye_8k_sg01', brand: 'Deye', model: 'SUN-8K-SG01LP1-EU (Hybrid)', maxDcV: 500, startV: 125, mpptCount: 2, maxStrings: 2, maxDkW: 10400, maxIsc: 26, phase: 1 },
  { id: 'deye_12k_sg04', brand: 'Deye', model: 'SUN-12K-SG04LP3-EU (3P Hybrid)', maxDcV: 800, startV: 160, mpptCount: 2, maxStrings: 2, maxDkW: 15600, maxIsc: 34, phase: 3 },

  // --- SOLIS ---
  { id: 'solis_grid_3k', brand: 'Solis', model: 'S6-GR1P3K (Grid)', maxDcV: 600, startV: 90, mpptCount: 1, maxStrings: 1, maxDkW: 4500, maxIsc: 14, phase: 1 },
  { id: 'solis_grid_5k', brand: 'Solis', model: 'S6-GR1P5K (Grid)', maxDcV: 600, startV: 120, mpptCount: 2, maxStrings: 2, maxDkW: 7500, maxIsc: 14, phase: 1 },
  { id: 'solis_grid_10k', brand: 'Solis', model: 'S5-GR3P10K (3P Grid)', maxDcV: 1100, startV: 180, mpptCount: 2, maxStrings: 2, maxDkW: 15000, maxIsc: 16, phase: 3 },
  { id: 'solis_hyb_5k', brand: 'Solis', model: 'S6-EH1P5K-L-EU (Hybrid)', maxDcV: 600, startV: 90, mpptCount: 2, maxStrings: 2, maxDkW: 8000, maxIsc: 16, phase: 1 },
  { id: 'solis_hyb_6k', brand: 'Solis', model: 'S6-EH1P6K-L-EU (Hybrid)', maxDcV: 600, startV: 90, mpptCount: 2, maxStrings: 2, maxDkW: 9600, maxIsc: 16, phase: 1 },
  { id: 'solis_hyb_10k', brand: 'Solis', model: 'RHI-3P10K-HVES-5G (3P Hybrid)', maxDcV: 1000, startV: 160, mpptCount: 2, maxStrings: 4, maxDkW: 16000, maxIsc: 26, phase: 3 },

  // --- LUXPOWER ---
  { id: 'lux_sna_5k', brand: 'Luxpower', model: 'SNA 5000 WPV (Off/Hybrid)', maxDcV: 480, startV: 100, mpptCount: 2, maxStrings: 2, maxDkW: 6400, maxIsc: 13, phase: 1 },
  { id: 'lux_lxp_5k', brand: 'Luxpower', model: 'LXP 5K Hybrid', maxDcV: 550, startV: 100, mpptCount: 2, maxStrings: 2, maxDkW: 8000, maxIsc: 12.5, phase: 1 },
];

const DB_PANELS = [
  { id: 'jinko_545', brand: 'Jinko', model: 'Tiger Neo 545W', pmax: 545, voc: 49.92, vmp: 41.32, isc: 13.55, tempCoeff: -0.29 },
  { id: 'jinko_585', brand: 'Jinko', model: 'Tiger Neo 585W', pmax: 585, voc: 50.87, vmp: 42.14, isc: 14.31, tempCoeff: -0.29 },
  { id: 'longi_550', brand: 'Longi', model: 'LR5-72HPH-550M 550W', pmax: 550, voc: 49.80, vmp: 41.95, isc: 13.98, tempCoeff: -0.27 },
  { id: 'longi_555', brand: 'Longi', model: 'LR5-72HPH-555M 555W', pmax: 555, voc: 49.95, vmp: 42.10, isc: 14.04, tempCoeff: -0.27 },
  { id: 'longi_570', brand: 'Longi', model: 'LR5-72HTH-570M 570W', pmax: 570, voc: 51.91, vmp: 43.76, isc: 14.07, tempCoeff: -0.27 },
  { id: 'longi_575', brand: 'Longi', model: 'LR5-72HTH-575M 575W', pmax: 575, voc: 52.06, vmp: 43.91, isc: 14.14, tempCoeff: -0.27 },
  { id: 'longi_580', brand: 'Longi', model: 'LR5-72HTH-580M 580W', pmax: 580, voc: 52.21, vmp: 44.06, isc: 14.20, tempCoeff: -0.27 },
  { id: 'longi_580_hgd', brand: 'Longi', model: 'LR5-72HGD-580M 580W', pmax: 580, voc: 51.41, vmp: 43.22, isc: 14.22, tempCoeff: -0.27 },
  { id: 'longi_585', brand: 'Longi', model: 'LR5-72HTH-585M 585W', pmax: 585, voc: 52.36, vmp: 49.16, isc: 14.27, tempCoeff: -0.27 },  
  { id: 'longi_620', brand: 'Longi', model: 'LR7-72HTH-620M 620W', pmax: 620, voc: 52.72, vmp: 44.48, isc: 14.93, tempCoeff: -0.27 },
  { id: 'longi_630', brand: 'Longi', model: 'LR5-78HGD-630M 630W', pmax: 630, voc: 57.23, vmp: 47.99, isc: 13.91, tempCoeff: -0.27 },
  { id: 'longi_640', brand: 'Longi', model: 'LR7-72HVH-640M 640W', pmax: 640, voc: 53.70, vmp: 44.36, isc: 15.13, tempCoeff: -0.27 }, 
  { id: 'longi_645', brand: 'Longi', model: 'LR7-72HVH-645M 645W', pmax: 645, voc: 53.80, vmp: 44.46, isc: 15.21, tempCoeff: -0.27 }, 
  { id: 'talesun_550', brand: 'Talesun', model: 'TD7g72M(H)-550 550W', pmax: 550, voc: 40.80, vmp: 41.60, isc: 13.99, tempCoeff: -0.34 },
  { id: 'trina_550', brand: 'Trina', model: 'Vertex 550W', pmax: 550, voc: 38.40, vmp: 31.60, isc: 18.18, tempCoeff: -0.34 },
  { id: 'ja_550', brand: 'JA Solar', model: 'DeepBlue 3.0 550W', pmax: 550, voc: 49.90, vmp: 41.80, isc: 14.00, tempCoeff: -0.27 },
];

// ฟังก์ชันช่วยหาขนาด Breaker/Fuse มาตรฐาน
const getStandardBreaker = (amps) => {
    const standards = [10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160];
    return standards.find(s => s >= amps) || 'Custom';
};

const getStandardFuse = (amps) => {
    const standards = [15, 20, 25, 30, 32];
    return standards.find(s => s >= amps) || 32;
};

export default function SolarInverterMatcherV3() {
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

  const calculateResults = () => {
    if (!selectedInv) return null;
    
    // 1. Solar Calculation
    const tempDiff = minTemp - 25;
    const vocCorrectionFactor = 1 + (tempDiff * (selectedPanel.tempCoeff / 100));
    const maxVocPerPanel = selectedPanel.voc * vocCorrectionFactor;
    const maxPanelsPossible = Math.floor(selectedInv.maxDcV / maxVocPerPanel);
    const minPanelsPossible = Math.ceil(selectedInv.startV / selectedPanel.vmp);
    const currentStringVoc = maxVocPerPanel * panelsPerString;
    const currentStringVmp = selectedPanel.vmp * panelsPerString;
    const totalPower = panelsPerString * activeStrings * selectedPanel.pmax;

    // 2. Safety Checks
    const isVoltageSafe = currentStringVoc <= selectedInv.maxDcV;
    const isStartUp = currentStringVmp >= selectedInv.startV;
    const isPowerSafe = totalPower <= selectedInv.maxDkW;
    const isCurrentSafe = selectedPanel.isc <= selectedInv.maxIsc;

    // 3. Protection Devices Calculation (BoS)
    
    // --- DC Side (คำนวณจากแผง) ---
    const dcFuseRating = getStandardFuse(selectedPanel.isc * 1.5); // เผื่อ 1.5 เท่า
    const dcBreakerRating = getStandardBreaker(selectedPanel.isc * 1.25); // เผื่อ 1.25 เท่า
    const dcSpdVoltage = currentStringVoc > 600 ? "1000V / 1100V" : "600V"; // เลือก SPD ตามแรงดันสตริง

    // --- AC Side (คำนวณจาก Inverter Output) ---
    // สูตร: P = V * I (1 phase), P = V * I * 1.732 (3 phase)
    // สมมติ Power Factor = 1 เพื่อความปลอดภัยสูงสุด (Max Current)
    const acPowerWatt = selectedInv.maxDkW; // ใช้ Max Output ของ Inverter (ไม่ใช่แผง)
    // หมายเหตุ: ปกติใช้ Rated Output แต่ใช้ Max PV เพื่อ Safety Factor สูงสุด หรือถ้ามีค่า Rated AC ให้ใช้ค่า Rated
    
    // ประมาณการ AC Output Current (Amps)
    let acCurrent = 0;
    if (selectedInv.phase === 1) {
        acCurrent = (acPowerWatt / 220); 
    } else {
        acCurrent = (acPowerWatt / (380 * 1.732));
    }
    
    const acBreakerSize = getStandardBreaker(acCurrent * 1.25); // Breaker เผื่อ 1.25
    const acSpdType = selectedInv.phase === 1 ? "1P+N (2P)" : "3P+N (4P)";

    return {
      maxVocPerPanel, maxPanelsPossible, minPanelsPossible, currentStringVoc, currentStringVmp, totalPower,
      isVoltageSafe, isStartUp, isPowerSafe, isCurrentSafe,
      // Protection Data
      dcFuseRating, dcBreakerRating, dcSpdVoltage,
      acCurrent, acBreakerSize, acSpdType
    };
  };

  const result = calculateResults();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-sans text-gray-800">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#1e293b] p-6 text-white flex justify-between items-center">
            <div><h1 className="text-2xl font-bold">UD Solarmax Inverter Tool V3.0</h1><p className="text-gray-400 text-sm">Protection & BoS Calculator Included</p></div>
            <div className="text-right"><div className="text-xs text-green-400">System Ready</div></div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT: INPUTS (5/12) --- */}
            <div className="lg:col-span-5 space-y-6">
                {/* 1. BRAND */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-bold text-blue-800 mb-2">1. เลือกยี่ห้อ (Brand)</label>
                    <div className="flex gap-2 flex-wrap">
                      {brands.map(brand => (
                        <button key={brand} onClick={() => setSelectedBrand(brand)} className={`px-3 py-2 text-sm rounded-md border transition-all ${selectedBrand === brand ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>{brand}</button>
                      ))}
                    </div>
                </div>

                {/* 2. MODEL */}
                <div className="bg-white p-4 rounded-lg border-2 border-blue-100 relative">
                    <label className="block text-sm font-bold text-gray-800 mb-2">2. เลือกรุ่น (Model)</label>
                    <select className="w-full p-2 border rounded font-bold text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500" onChange={(e) => setSelectedInv(filteredInverters.find(i => i.id === e.target.value))} value={selectedInv ? selectedInv.id : ''}>
                        {filteredInverters.map(inv => (<option key={inv.id} value={inv.id}>{inv.model} ({inv.phase} Phase)</option>))}
                    </select>
                    {selectedInv && (
                      <div className="mt-3 bg-slate-800 text-white p-3 rounded text-xs grid grid-cols-2 gap-2">
                          <div>Phase: <span className="text-yellow-400">{selectedInv.phase} Phase</span></div>
                          <div>Max DC: <span className="text-yellow-400">{selectedInv.maxDcV} V</span></div>
                          <div>Max Power: <span className="text-yellow-400">{(selectedInv.maxDkW/1000).toFixed(1)} kW</span></div>
                          <div>Max Isc: <span className="text-yellow-400">{selectedInv.maxIsc} A</span></div>
                      </div>
                    )}
                </div>

                {/* 3. PANEL */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <label className="block text-sm font-bold text-orange-800 mb-2">3. เลือกแผงโซล่าเซลล์</label>
                    <select className="w-full p-2 border rounded font-bold text-gray-700 text-sm" onChange={(e) => setSelectedPanel(DB_PANELS.find(p => p.id === e.target.value))} value={selectedPanel.id}>
                        {DB_PANELS.map(p => (<option key={p.id} value={p.id}>{p.brand} {p.model}</option>))}
                    </select>
                </div>

                {/* 4. CONFIG */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center"><label className="text-sm font-bold text-gray-700">อุณหภูมิต่ำสุด (°C)</label><input type="number" value={minTemp} onChange={e => setMinTemp(Number(e.target.value))} className="w-20 border rounded p-1 text-center font-bold text-blue-600"/></div>
                    <div className="flex justify-between items-center border-t pt-4"><label className="text-sm font-bold text-gray-700">จำนวนแผง/สตริง</label><input type="number" value={panelsPerString} onChange={e => setPanelsPerString(Number(e.target.value))} className="w-20 border rounded p-1 text-center font-bold"/></div>
                    <div className="flex justify-between items-center"><label className="text-sm font-bold text-gray-700">จำนวนสตริง</label><input type="number" value={activeStrings} onChange={e => setActiveStrings(Number(e.target.value))} className="w-20 border rounded p-1 text-center font-bold"/></div>
                </div>
            </div>

            {/* --- RIGHT: RESULTS (7/12) --- */}
            {result && selectedInv && (
            <div className="lg:col-span-7 flex flex-col space-y-4">
                
                {/* 1. MATCHING RESULT */}
                <div className="bg-slate-900 text-white rounded-lg p-5 shadow-lg border-l-4 border-yellow-500">
                    <h3 className="text-md font-bold text-yellow-400 mb-4">⚡ ผลลัพธ์: {selectedInv.brand}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-3 rounded text-center border border-slate-700"><div className="text-xs text-gray-400">ใส่ได้สูงสุด (Max)</div><div className="text-3xl font-bold text-green-400">{result.maxPanelsPossible} <span className="text-sm">แผง</span></div></div>
                        <div className="bg-slate-800 p-3 rounded text-center border border-slate-700"><div className="text-xs text-gray-400">ใส่ขั้นต่ำ (Min)</div><div className="text-3xl font-bold text-yellow-400">{result.minPanelsPossible} <span className="text-sm">แผง</span></div></div>
                    </div>
                </div>

                {/* 2. SAFETY CHECK */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">🛡️ Safety Check <span className="text-xs font-normal text-gray-400">(ตรวจสอบสเปค)</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className={`flex justify-between items-center p-3 rounded ${result.isVoltageSafe ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}><div><div className="font-bold text-xs">แรงดันรวม (Voc)</div><div className="text-[10px]">{result.currentStringVoc.toFixed(0)}V / Max {selectedInv.maxDcV}V</div></div><div className="font-bold">{result.isVoltageSafe ? 'PASS' : 'FAIL'}</div></div>
                        <div className={`flex justify-between items-center p-3 rounded ${result.isCurrentSafe ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}><div><div className="font-bold text-xs">กระแสแผง (Isc)</div><div className="text-[10px]">{selectedPanel.isc}A / Max {selectedInv.maxIsc}A</div></div><div className="font-bold">{result.isCurrentSafe ? 'PASS' : 'FAIL'}</div></div>
                    </div>
                </div>

                {/* 3. PROTECTION DEVICES (NEW FEATURE!) */}
                <div className="bg-white border-2 border-blue-100 rounded-lg p-5 shadow-sm">
                    <h3 className="text-md font-bold text-blue-800 mb-4 flex items-center gap-2">🛠️ แนะนำอุปกรณ์ป้องกัน (BoS Recommendation)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* DC SIDE */}
                        <div className="space-y-3">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b pb-1">ฝั่ง DC (จากแผง)</div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">DC Fuse (1P):</span>
                                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{result.dcFuseRating} A</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">DC Breaker (2P):</span>
                                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{result.dcBreakerRating} A</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">DC Surge (SPD):</span>
                                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">{result.dcSpdVoltage}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">*คำนวณจาก Isc x 1.5 และ Voc Max</div>
                        </div>

                        {/* AC SIDE */}
                        <div className="space-y-3">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b pb-1">ฝั่ง AC (เข้าบ้าน/กริด)</div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">ระบบไฟ (System):</span>
                                <span className="font-bold text-gray-800">{selectedInv.phase} เฟส</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">กระแส Output:</span>
                                <span className="font-mono text-xs text-gray-500">{result.acCurrent.toFixed(1)} A</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">AC Breaker (Main):</span>
                                <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">{result.acBreakerSize} A</span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">AC Surge / RCBO:</span>
                                <span className="font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">{result.acSpdType}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">*คำนวณจาก Max Output / Voltage x 1.25</div>
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
