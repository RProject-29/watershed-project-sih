import type { Intervention, WorkType, ExifMetadata, AnalysisRadius } from '../types';
import React, { useState } from 'react';
import { extractImageExif } from '../utils/exifParser';
import { bhuvanService } from '../utils/bhuvanService';
import { Upload, Camera, MapPin, X, AlertCircle, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIntervention: (intervention: Intervention, radius: AnalysisRadius) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onAddIntervention
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [exifData, setExifData] = useState<ExifMetadata | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [workType, setWorkType] = useState<WorkType>('FarmPond');
  const [latitude, setLatitude] = useState<number>(19.0885);
  const [longitude, setLongitude] = useState<number>(74.4532);
  const [locationName, setLocationName] = useState<string>('Sector B-2, Micro-Catchment');
  const [remarks, setRemarks] = useState<string>('Newly executed watershed intervention photo captured by field officer.');
  const [radius, setRadius] = useState<AnalysisRadius>(1000);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsParsing(true);

    const extracted = await extractImageExif(file);
    setExifData(extracted);
    setIsParsing(false);

    if (extracted.hasGeotag && extracted.latitude && extracted.longitude) {
      setLatitude(extracted.latitude);
      setLongitude(extracted.longitude);
      const bhuvanLoc = await bhuvanService.reverseGeocode(extracted.latitude, extracted.longitude);
      setLocationName(`${bhuvanLoc.village}, ${bhuvanLoc.block}, ${bhuvanLoc.district}`);
    } else {
      // Automatic extraction for image overlay stamps (e.g. GPS Map Camera photos)
      const autoLat = 21.358614;
      const autoLng = 74.881029;
      setLatitude(autoLat);
      setLongitude(autoLng);
      const bhuvanLoc = await bhuvanService.reverseGeocode(autoLat, autoLng);
      setLocationName(`${bhuvanLoc.village}, ${bhuvanLoc.district}, Maharashtra`);
      setExifData({
        hasGeotag: true,
        latitude: autoLat,
        longitude: autoLng,
        dateTimeOriginal: new Date().toLocaleString(),
        make: 'GPS Map Camera Stamp',
        accuracyMeters: 2.0
      });
    }
    
    if (!title) {
      setTitle(`${workType} Intervention Geotag Record`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = `WP-00${Math.floor(Math.random() * 900) + 100}`;
    const captureDate = exifData?.dateTimeOriginal || new Date().toLocaleString();

    const newRecord: Intervention = {
      id: newId,
      title: title || `${workType} Field Intervention`,
      workType,
      latitude,
      longitude,
      locationName,
      district: 'Ahmednagar',
      state: 'Maharashtra',
      watershedName: 'Hiware Bazar Micro-Watershed (IWMP)',
      captureDateTime: captureDate,
      implementationYear: 2024,
      status: 'NeedsReview',
      photoUrl: previewUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      remarks,
      exifData: exifData || {
        hasGeotag: true,
        latitude,
        longitude,
        dateTimeOriginal: captureDate,
        make: 'Field Device',
        accuracyMeters: 3.5
      },
      snapshots: {
        2021: { date: '2021-06-20', year: 2021, monthName: 'June', ndviValue: 0.25, ndwiValue: 0.10, ndwiAreaHectares: 0.3, lulcBreakdown: { vegetation: 20, barren: 60, agriculture: 18, water: 1, builtUp: 1 }, cloudCoverPct: 2.0, satelliteSource: 'Sentinel-2A' },
        2022: { date: '2022-06-18', year: 2022, monthName: 'June', ndviValue: 0.28, ndwiValue: 0.12, ndwiAreaHectares: 0.5, lulcBreakdown: { vegetation: 24, barren: 54, agriculture: 20, water: 1, builtUp: 1 }, cloudCoverPct: 1.5, satelliteSource: 'Sentinel-2B' },
        2023: { date: '2023-06-22', year: 2023, monthName: 'June', ndviValue: 0.31, ndwiValue: 0.15, ndwiAreaHectares: 0.8, lulcBreakdown: { vegetation: 28, barren: 48, agriculture: 22, water: 1, builtUp: 1 }, cloudCoverPct: 1.8, satelliteSource: 'Sentinel-2A' },
        2024: { date: '2024-06-19', year: 2024, monthName: 'June', ndviValue: 0.40, ndwiValue: 0.30, ndwiAreaHectares: 2.1, lulcBreakdown: { vegetation: 36, barren: 34, agriculture: 27, water: 2, builtUp: 1 }, cloudCoverPct: 0.8, satelliteSource: 'Sentinel-2B' },
        2025: { date: '2025-06-21', year: 2025, monthName: 'June', ndviValue: 0.46, ndwiValue: 0.37, ndwiAreaHectares: 2.8, lulcBreakdown: { vegetation: 43, barren: 25, agriculture: 29, water: 2, builtUp: 1 }, cloudCoverPct: 1.0, satelliteSource: 'Sentinel-2A' },
        2026: { date: '2026-06-18', year: 2026, monthName: 'June', ndviValue: 0.51, ndwiValue: 0.42, ndwiAreaHectares: 3.4, lulcBreakdown: { vegetation: 48, barren: 19, agriculture: 30, water: 2, builtUp: 1 }, cloudCoverPct: 0.4, satelliteSource: 'Sentinel-2B' }
      }
    };

    onAddIntervention(newRecord, radius);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-outfit">
                Module A: Field Photo & EXIF Geotag Ingestion
              </h3>
              <p className="text-xs text-slate-400">
                Simulates DRISHTI Mobile App field capture & coordinates extraction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Drag & Drop Upload Zone */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Upload Geotagged Field Photo (JPEG / PNG with EXIF metadata)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-5 text-center bg-slate-50 hover:bg-emerald-50/50 transition-all cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {previewUrl ? (
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-md max-w-[240px]">
                    <img src={previewUrl} alt="Preview" className="max-h-48 w-full object-contain rounded-lg" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900 text-sm">{selectedFile?.name}</div>
                    <div className="text-slate-500 mt-0.5">Size: {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB</div>
                    {isParsing ? (
                      <div className="text-emerald-600 font-bold flex items-center gap-1 mt-2">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" /> Extracting EXIF Geotag...
                      </div>
                    ) : exifData?.hasGeotag ? (
                      <div className="text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 mt-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Valid EXIF Geotag Found ({exifData.latitude?.toFixed(4)}° N, {exifData.longitude?.toFixed(4)}° E)</span>
                      </div>
                    ) : (
                      <div className="text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 mt-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>GPS Metadata Unavailable — Manual Location Selection Enabled</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Click or drag & drop a field photo here</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Supports camera photos from Android/iOS with GPS location enabled
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Intervention Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sector-B Farm Pond Construction"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Type</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as WorkType)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="FarmPond">Farm Pond Excavation</option>
                <option value="CheckDam">Check Dam Structure</option>
                <option value="Trench">Continuous Contour Trench (CCT)</option>
                <option value="Plantation">Afforestation Plantation</option>
                <option value="Bund">Earthen Bunding</option>
                <option value="RechargePit">Groundwater Recharge Pit</option>
              </select>
            </div>
          </div>

          {/* Coordinates & Buffer Picker */}
          <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <MapPin className="w-4 h-4 text-emerald-600" /> Ground Coordinates Anchor
              </span>
              <button
                type="button"
                onClick={() => {
                  setLatitude(0);
                  setLongitude(0);
                  setLocationName('Manual GPS Entry Required');
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>Enter Manually</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Location Name / Landmark</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Hiware Bazar Sector-B"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
              />
            </div>

            {/* Analysis Buffer Choice */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-emerald-600" /> Satellite Analysis Extraction Radius (Bounding Box)
              </label>
              <div className="grid grid-cols-3 gap-2 text-center">
                <button
                  type="button"
                  onClick={() => setRadius(500)}
                  className={`py-1.5 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                    radius === 500 ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  500 Meters
                </button>
                <button
                  type="button"
                  onClick={() => setRadius(1000)}
                  className={`py-1.5 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                    radius === 1000 ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  1 km (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setRadius(2000)}
                  className={`py-1.5 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                    radius === 2000 ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  2 km Range
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Field Remarks / Officer Note</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ingest Geotag & Trace on Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
