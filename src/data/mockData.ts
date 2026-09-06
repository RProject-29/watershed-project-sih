import type { Intervention, GISLayer } from '../types';

export const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'WP-001',
    title: 'Hiware Farm Pond Intervention',
    workType: 'FarmPond',
    latitude: 19.0885,
    longitude: 74.4532,
    locationName: 'Hiware Bazar Watershed, Sector A-4',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    watershedName: 'Hiware Bazar Micro-Watershed (IWMP)',
    captureDateTime: '2024-06-15 11:30 AM',
    implementationYear: 2024,
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    remarks: 'Farm pond excavated (20m x 20m x 3m). High runoff harvest observed in post-monsoon period.',
    exifData: {
      make: 'Smartphone',
      model: 'Field Camera',
      dateTimeOriginal: '2024-06-15 11:30:42',
      latitude: 19.0885,
      longitude: 74.4532,
      altitude: 642,
      hasGeotag: true,
      accuracyMeters: 3.2
    },
    snapshots: {
      2021: {
        date: '2021-06-20',
        year: 2021,
        monthName: 'June',
        ndviValue: 0.28,
        ndwiValue: 0.12,
        ndwiAreaHectares: 0.4,
        lulcBreakdown: { vegetation: 25, barren: 50, agriculture: 20, water: 2, builtUp: 3 },
        cloudCoverPct: 2.1,
        satelliteSource: 'Sentinel-2A'
      },
      2022: {
        date: '2022-06-18',
        year: 2022,
        monthName: 'June',
        ndviValue: 0.31,
        ndwiValue: 0.15,
        ndwiAreaHectares: 0.7,
        lulcBreakdown: { vegetation: 28, barren: 46, agriculture: 22, water: 3, builtUp: 1 },
        cloudCoverPct: 1.5,
        satelliteSource: 'Sentinel-2B'
      },
      2023: {
        date: '2023-06-22',
        year: 2023,
        monthName: 'June',
        ndviValue: 0.33,
        ndwiValue: 0.18,
        ndwiAreaHectares: 0.9,
        lulcBreakdown: { vegetation: 30, barren: 42, agriculture: 24, water: 3, builtUp: 1 },
        cloudCoverPct: 3.0,
        satelliteSource: 'Sentinel-2A'
      },
      2024: {
        date: '2024-06-19',
        year: 2024,
        monthName: 'June',
        ndviValue: 0.42,
        ndwiValue: 0.34,
        ndwiAreaHectares: 2.4,
        lulcBreakdown: { vegetation: 38, barren: 30, agriculture: 27, water: 4, builtUp: 1 },
        cloudCoverPct: 0.8,
        satelliteSource: 'Sentinel-2B'
      },
      2025: {
        date: '2025-06-21',
        year: 2025,
        monthName: 'June',
        ndviValue: 0.49,
        ndwiValue: 0.41,
        ndwiAreaHectares: 3.1,
        lulcBreakdown: { vegetation: 45, barren: 22, agriculture: 28, water: 4, builtUp: 1 },
        cloudCoverPct: 1.2,
        satelliteSource: 'Sentinel-2A'
      },
      2026: {
        date: '2026-06-18',
        year: 2026,
        monthName: 'June',
        ndviValue: 0.54,
        ndwiValue: 0.45,
        ndwiAreaHectares: 3.8,
        lulcBreakdown: { vegetation: 50, barren: 16, agriculture: 29, water: 4, builtUp: 1 },
        cloudCoverPct: 0.5,
        satelliteSource: 'Sentinel-2B'
      }
    }
  },
  {
    id: 'WP-002',
    title: 'Ralegan Drainage Check Dam',
    workType: 'CheckDam',
    latitude: 19.0941,
    longitude: 74.4485,
    locationName: 'Ralegan Siddhi Ridge, Stream 2',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    watershedName: 'Ralegan Catchment Zone (IWMP Micro-Watershed)',
    captureDateTime: '2024-07-02 02:15 PM',
    implementationYear: 2024,
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
    remarks: 'Masonry check dam constructed across 2nd order stream. Siltation barrier intact.',
    exifData: {
      make: 'Xiaomi',
      model: 'Redmi Note 12',
      dateTimeOriginal: '2024-07-02 14:15:10',
      latitude: 19.0941,
      longitude: 74.4485,
      altitude: 618,
      hasGeotag: true,
      accuracyMeters: 4.1
    },
    snapshots: {
      2021: { date: '2021-07-10', year: 2021, monthName: 'July', ndviValue: 0.22, ndwiValue: 0.10, ndwiAreaHectares: 0.2, lulcBreakdown: { vegetation: 20, barren: 60, agriculture: 18, water: 1, builtUp: 1 }, cloudCoverPct: 4.0, satelliteSource: 'Sentinel-2A' },
      2022: { date: '2022-07-12', year: 2022, monthName: 'July', ndviValue: 0.25, ndwiValue: 0.12, ndwiAreaHectares: 0.3, lulcBreakdown: { vegetation: 22, barren: 56, agriculture: 20, water: 1, builtUp: 1 }, cloudCoverPct: 2.2, satelliteSource: 'Sentinel-2B' },
      2023: { date: '2023-07-15', year: 2023, monthName: 'July', ndviValue: 0.29, ndwiValue: 0.16, ndwiAreaHectares: 0.5, lulcBreakdown: { vegetation: 26, barren: 50, agriculture: 22, water: 1, builtUp: 1 }, cloudCoverPct: 1.8, satelliteSource: 'Sentinel-2A' },
      2024: { date: '2024-07-14', year: 2024, monthName: 'July', ndviValue: 0.38, ndwiValue: 0.32, ndwiAreaHectares: 1.9, lulcBreakdown: { vegetation: 35, barren: 36, agriculture: 26, water: 2, builtUp: 1 }, cloudCoverPct: 1.0, satelliteSource: 'Sentinel-2B' },
      2025: { date: '2025-07-18', year: 2025, monthName: 'July', ndviValue: 0.44, ndwiValue: 0.39, ndwiAreaHectares: 2.6, lulcBreakdown: { vegetation: 41, barren: 28, agriculture: 28, water: 2, builtUp: 1 }, cloudCoverPct: 0.9, satelliteSource: 'Sentinel-2A' },
      2026: { date: '2026-07-12', year: 2026, monthName: 'July', ndviValue: 0.48, ndwiValue: 0.43, ndwiAreaHectares: 3.1, lulcBreakdown: { vegetation: 46, barren: 22, agriculture: 29, water: 2, builtUp: 1 }, cloudCoverPct: 0.4, satelliteSource: 'Sentinel-2B' }
    }
  }
];

export const MOCK_GIS_LAYERS: GISLayer[] = [
  {
    id: 'admin_bound',
    name: 'Administrative & Gram Panchayat Boundary',
    category: 'Administrative',
    description: 'Gram Panchayat and Block revenue boundaries (Bhuvan 2D)',
    visible: true,
    color: '#3b82f6',
    iconName: 'Building2'
  },
  {
    id: 'watershed_poly',
    name: 'IWMP Watershed Catchment Boundary',
    category: 'Administrative',
    description: 'Micro-watershed hydrological boundary polygon',
    visible: true,
    color: '#8b5cf6',
    iconName: 'Hexagon'
  },
  {
    id: 'drainage_net',
    name: 'Drainage Stream Network (1st-4th Order)',
    category: 'Hydro',
    description: 'Stream lines derived from Cartosat DEM (ISRO Bhuvan)',
    visible: true,
    color: '#06b6d4',
    iconName: 'GitBranch'
  },
  {
    id: 'water_bodies',
    name: 'Existing Water Bodies & Ponds',
    category: 'Hydro',
    description: 'Bhuvan 2D digitized surface water storage points',
    visible: true,
    color: '#0284c7',
    iconName: 'Droplets'
  },
  {
    id: 'lulc_layer',
    name: 'Bhuvan Land Use / Land Cover (LULC)',
    category: 'Land',
    description: 'ISRO Bhuvan 50k LULC classification map',
    visible: false,
    color: '#10b981',
    iconName: 'Layers'
  },
  {
    id: 'contour_lines',
    name: 'Elevation Contours (10m Interval)',
    category: 'Land',
    description: 'Terrain slope contours for runoff modeling',
    visible: false,
    color: '#f59e0b',
    iconName: 'Mountain'
  }
];
