export type WorkType = 
  | 'FarmPond' 
  | 'CheckDam' 
  | 'Trench' 
  | 'Plantation' 
  | 'Bund' 
  | 'RechargePit';

export type InterventionStatus = 'Verified' | 'NeedsReview' | 'PriorityInspection';

export interface ExifMetadata {
  make?: string;
  model?: string;
  dateTimeOriginal?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  hasGeotag: boolean;
  accuracyMeters?: number;
}

export interface LulcBreakdown {
  vegetation: number; // percentage
  barren: number;
  agriculture: number;
  water: number;
  builtUp: number;
}

export interface SatelliteSnapshot {
  date: string; // YYYY-MM-DD
  year: number;
  monthName: string;
  ndviValue: number; // e.g. 0.47
  ndwiValue: number; // e.g. 0.35
  ndwiAreaHectares: number; // e.g. 3.2 ha
  lulcBreakdown: LulcBreakdown;
  cloudCoverPct: number;
  satelliteSource: 'Sentinel-2A' | 'Sentinel-2B' | 'Landsat-8' | 'Cartosat-3';
}

export interface Intervention {
  id: string;
  title: string;
  workType: WorkType;
  latitude: number;
  longitude: number;
  locationName: string;
  captureDateTime: string;
  photoUrl: string;
  remarks: string;
  implementationYear: number;
  status: InterventionStatus;
  district: string;
  state: string;
  watershedName: string;
  exifData: ExifMetadata;
  // Historical snapshot series
  snapshots: Record<number, SatelliteSnapshot>; // Keyed by year e.g. 2021, 2022, 2023, 2024, 2025, 2026
}

export interface ChangeAnalysis {
  interventionId: string;
  beforeYear: number;
  afterYear: number;
  ndviChange: number; // delta e.g. +0.15
  ndwiAreaChangeHa: number; // delta e.g. +1.4
  barrenChangePct: number; // delta e.g. -13%
  agriChangePct: number; // delta e.g. +8%
  vegChangePct: number; // delta e.g. +15%
  trend: 'Improved' | 'Declined' | 'NoMajorChange';
  aiSummary: string;
  suggestedAction: string;
  seasonalComparable: boolean;
  seasonMatchNote: string;
}

export interface GISLayer {
  id: string;
  name: string;
  category: 'Administrative' | 'Hydro' | 'Land' | 'Imagery';
  description: string;
  visible: boolean;
  color: string;
  iconName: string;
}

export type AnalysisRadius = 500 | 1000 | 2000; // in meters
