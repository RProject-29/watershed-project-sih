/**
 * Copernicus Data Space Ecosystem (CDSE) & Sentinel Hub Process API Service
 * 
 * Provides live satellite imagery & spectral index calculation (NDVI, NDWI, NDMI)
 * for Sentinel-2 L2A multispectral observations.
 */

export interface SentinelApiConfig {
  clientId: string;
  clientSecret: string;
}

export interface SentinelProcessRequest {
  lat: number;
  lng: number;
  radiusMeters: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  evalscriptType: 'rgb' | 'ndvi' | 'ndwi' | 'ndmi';
}

const STORAGE_KEY_ID = 'copernicus_client_id';
const STORAGE_KEY_SECRET = 'copernicus_client_secret';

const TOKEN_URL = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';
const PROCESS_API_URL = 'https://sh.dataspace.copernicus.eu/api/v1/process';

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

/**
 * Storage Helpers
 */
export function getStoredCredentials(): SentinelApiConfig {
  return {
    clientId: localStorage.getItem(STORAGE_KEY_ID) || import.meta.env.VITE_COPERNICUS_CLIENT_ID || '',
    clientSecret: localStorage.getItem(STORAGE_KEY_SECRET) || import.meta.env.VITE_COPERNICUS_CLIENT_SECRET || ''
  };
}

export function saveStoredCredentials(clientId: string, clientSecret: string): void {
  localStorage.setItem(STORAGE_KEY_ID, clientId.trim());
  localStorage.setItem(STORAGE_KEY_SECRET, clientSecret.trim());
  cachedToken = null; // Clear cached token on credential change
}

export function hasValidCredentials(): boolean {
  const creds = getStoredCredentials();
  return Boolean(creds.clientId && creds.clientSecret);
}

/**
 * 1. Obtain OAuth2 Access Token from Copernicus CDSE (with caching)
 */
export async function getCopernicusAuthToken(config?: SentinelApiConfig): Promise<string> {
  const activeConfig = config || getStoredCredentials();
  
  if (!activeConfig.clientId || !activeConfig.clientSecret) {
    throw new Error('Copernicus API credentials not configured.');
  }

  const now = Date.now();
  if (cachedToken && now < tokenExpiryTime - 60000) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', activeConfig.clientId);
  params.append('client_secret', activeConfig.clientSecret);

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Copernicus Auth Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token || '';
  tokenExpiryTime = now + (data.expires_in || 3600) * 1000;
  return cachedToken as string;
}

/**
 * Test Connection helper
 */
export async function testCopernicusConnection(config: SentinelApiConfig): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getCopernicusAuthToken(config);
    if (token) {
      return { success: true, message: 'Successfully authenticated with Copernicus Data Space Ecosystem!' };
    }
    return { success: false, message: 'Received empty token from Copernicus.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown authentication error';
    return { success: false, message: msg };
  }
}

/**
 * 2. Evalscripts for Sentinel-2 Bands (B03: Green, B04: Red, B08: NIR, B11: SWIR)
 */
export const EVALSCRIPTS = {
  rgb: `
    //VERSION=3
    function setup() {
      return {
        input: ["B04", "B03", "B02"],
        output: { bands: 3 }
      };
    }
    function evaluatePixel(sample) {
      return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
    }
  `,
  ndvi: `
    //VERSION=3
    function setup() {
      return {
        input: ["B04", "B08"],
        output: { bands: 3 }
      };
    }
    function evaluatePixel(sample) {
      let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04 + 0.0001);
      if (ndvi < 0.2) return [0.9, 0.2, 0.1];
      if (ndvi < 0.4) return [0.9, 0.9, 0.2];
      return [0.1, 0.8, 0.2];
    }
  `,
  ndwi: `
    //VERSION=3
    function setup() {
      return {
        input: ["B03", "B08"],
        output: { bands: 3 }
      };
    }
    function evaluatePixel(sample) {
      let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08 + 0.0001);
      if (ndwi > 0.1) return [0.1, 0.5, 0.9];
      return [0.9, 0.8, 0.6];
    }
  `,
  ndmi: `
    //VERSION=3
    function setup() {
      return {
        input: ["B08", "B11"],
        output: { bands: 3 }
      };
    }
    function evaluatePixel(sample) {
      let ndmi = (sample.B08 - sample.B11) / (sample.B08 + sample.B11 + 0.0001);
      if (ndmi > 0.2) return [0.2, 0.7, 0.9];
      return [0.8, 0.7, 0.4];
    }
  `
};

/**
 * 3. Bounding Box helper
 */
function computeBoundingBox(lat: number, lng: number, radiusMeters: number): [number, number, number, number] {
  const deltaLat = radiusMeters / 111000;
  const deltaLng = radiusMeters / (111000 * Math.cos((lat * Math.PI) / 180));
  return [
    lng - deltaLng,
    lat - deltaLat,
    lng + deltaLng,
    lat + deltaLat
  ];
}

// Tile blob cache
const tileCache = new Map<string, string>();

/**
 * 4. Fetch Live Sentinel-2 Satellite Raster Image Blob from Copernicus Process API
 */
export async function fetchLiveSatelliteImage(
  req: SentinelProcessRequest,
  config?: SentinelApiConfig
): Promise<string> {
  const cacheKey = `${req.lat}_${req.lng}_${req.radiusMeters}_${req.startDate}_${req.endDate}_${req.evalscriptType}`;
  if (tileCache.has(cacheKey)) {
    return tileCache.get(cacheKey)!;
  }

  const token = await getCopernicusAuthToken(config);
  const bbox = computeBoundingBox(req.lat, req.lng, req.radiusMeters);
  const evalscript = EVALSCRIPTS[req.evalscriptType];

  const payload = {
    input: {
      bounds: {
        bbox: bbox,
        properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' }
      },
      data: [
        {
          type: 'sentinel-2-l2a',
          dataFilter: {
            timeRange: {
              from: `${req.startDate}T00:00:00Z`,
              to: `${req.endDate}T23:59:59Z`
            },
            maxCloudCoverage: 30
          }
        }
      ]
    },
    output: {
      width: 512,
      height: 512,
      responses: [
        {
          identifier: 'default',
          format: { type: 'image/png' }
        }
      ]
    },
    evalscript: evalscript
  };

  const response = await fetch(PROCESS_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Sentinel Process API Error (${response.status}): ${errBody}`);
  }

  const imageBlob = await response.blob();
  const blobUrl = URL.createObjectURL(imageBlob);
  tileCache.set(cacheKey, blobUrl);
  return blobUrl;
}
