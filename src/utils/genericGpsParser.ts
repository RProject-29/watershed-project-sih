/**
 * Generic GPS Parser Service
 * 
 * Semantically parses latitude and longitude from arbitrary text strings
 * produced by OCR or metadata overlays. Supports Decimal, DMS, Hemispheres,
 * and conservative OCR error normalization. Zero hardcoded coordinates.
 */

export interface ParsedGpsResult {
  isValid: boolean;
  latitude: number | null;
  longitude: number | null;
  rawTextMatched?: string;
  formatType?: 'DECIMAL' | 'DMS' | 'TAGGED';
}

/**
 * Validate numeric latitude and longitude bounds
 */
export function isValidCoordinatePair(lat: number | null, lng: number | null): boolean {
  if (lat === null || lng === null) return false;
  if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Normalizes common OCR misread characters (O -> 0, I/l -> 1, S -> 5, B -> 8, comma -> dot)
 * strictly when contained within digit-like coordinate patterns.
 */
export function normalizeOcrCoordinateText(text: string): string {
  if (!text) return '';
  return text
    // Replace comma with period between digits (e.g. 21,358614 -> 21.358614)
    .replace(/(?<=\d),(?=\d)/g, '.')
    // Remove spaces around decimal dots (e.g. 21 . 358614 -> 21.358614)
    .replace(/(?<=\d)\s*\.\s*(?=\d)/g, '.')
    .replace(/(?<=\d)O(?=\d)/gi, '0')
    .replace(/(?<=\d)[Il](?=\d)/gi, '1')
    .replace(/(?<=\d)S(?=\d)/gi, '5')
    .replace(/(?<=\d)B(?=\d)/gi, '8');
}

/**
 * Convert DMS (Degrees, Minutes, Seconds) to Decimal Degrees
 * e.g. 21°21'30.5"N -> 21.35847
 */
export function parseDmsToDecimal(degrees: number, minutes: number, seconds: number, direction: string): number {
  let decimal = Math.abs(degrees) + minutes / 60 + seconds / 3600;
  if (direction && (direction.toUpperCase() === 'S' || direction.toUpperCase() === 'W')) {
    decimal = -decimal;
  }
  return Number(decimal.toFixed(6));
}

/**
 * Parses generic GPS text from OCR output string
 */
export function parseGenericGpsText(inputText: string): ParsedGpsResult {
  if (!inputText) {
    return { isValid: false, latitude: null, longitude: null };
  }

  const cleanedText = normalizeOcrCoordinateText(inputText);

  // 1. Check for Tagged Format: "Lat 21.362372° Long 74.87924°", "LAT: 21.35849 / LONG: 74.88086"
  const taggedRegex = /LAT(?:ITUDE|\.)?[:\s]*([+-]?\d{1,2}\.\d{3,7})\s*(?:°|[NnSs])?[\s,/|\r\n]*LON?G(?:ITUDE|\.)?[:\s]*([+-]?\d{1,3}\.\d{3,7})\s*(?:°|[EeWw])?/i;
  const taggedMatch = cleanedText.match(taggedRegex);
  if (taggedMatch) {
    const lat = parseFloat(taggedMatch[1]);
    const lng = parseFloat(taggedMatch[2]);
    if (isValidCoordinatePair(lat, lng)) {
      return {
        isValid: true,
        latitude: lat,
        longitude: lng,
        rawTextMatched: taggedMatch[0],
        formatType: 'TAGGED'
      };
    }
  }

  // 1b. Check for Prefix Direction Format: "N 21.362372° E 74.87924°" or "Lat N 21.362372 Long E 74.87924"
  const prefixDirRegex = /(?:[NnSs])\s*([+-]?\d{1,2}\.\d{3,7})\s*(?:°)?[\s,/|\r\n]+(?:[EeWw])\s*([+-]?\d{1,3}\.\d{3,7})\s*(?:°)?/i;
  const prefixDirMatch = cleanedText.match(prefixDirRegex);
  if (prefixDirMatch) {
    const lat = parseFloat(prefixDirMatch[1]);
    const lng = parseFloat(prefixDirMatch[2]);
    if (isValidCoordinatePair(lat, lng)) {
      return {
        isValid: true,
        latitude: lat,
        longitude: lng,
        rawTextMatched: prefixDirMatch[0],
        formatType: 'DECIMAL'
      };
    }
  }

  // 2. Check for Direction-Suffixed Format: "21.35849 N, 74.88086 E" or "21.35849N 74.88086E"
  const directionalRegex = /([+-]?\d{1,2}\.\d{3,7})\s*([NnSs])[\s,/|\r\n]+([+-]?\d{1,3}\.\d{3,7})\s*([EeWw])/i;
  const dirMatch = cleanedText.match(directionalRegex);
  if (dirMatch) {
    let lat = parseFloat(dirMatch[1]);
    let lng = parseFloat(dirMatch[3]);
    if (dirMatch[2].toUpperCase() === 'S') lat = -lat;
    if (dirMatch[4].toUpperCase() === 'W') lng = -lng;
    if (isValidCoordinatePair(lat, lng)) {
      return {
        isValid: true,
        latitude: lat,
        longitude: lng,
        rawTextMatched: dirMatch[0],
        formatType: 'DECIMAL'
      };
    }
  }

  // 3. Check for DMS Format: "21°21'30.5"N 74°52'51.1"E"
  const dmsRegex = /(\d{1,2})°\s*(\d{1,2})'\s*(\d{1,2}(?:\.\d+)?)"?\s*([NnSs])[\s,/|]+(\d{1,3})°\s*(\d{1,2})'\s*(\d{1,2}(?:\.\d+)?)"?\s*([EeWw])/i;
  const dmsMatch = cleanedText.match(dmsRegex);
  if (dmsMatch) {
    const lat = parseDmsToDecimal(parseFloat(dmsMatch[1]), parseFloat(dmsMatch[2]), parseFloat(dmsMatch[3]), dmsMatch[4]);
    const lng = parseDmsToDecimal(parseFloat(dmsMatch[5]), parseFloat(dmsMatch[6]), parseFloat(dmsMatch[7]), dmsMatch[8]);
    if (isValidCoordinatePair(lat, lng)) {
      return {
        isValid: true,
        latitude: lat,
        longitude: lng,
        rawTextMatched: dmsMatch[0],
        formatType: 'DMS'
      };
    }
  }

  // 4. Check for Generic Coordinate Pair: "21.35849, 74.88086" or "GPS: 21.35849 74.88086"
  const pairRegex = /(?:GPS[:\s]*)?([+-]?\d{1,2}\.\d{3,7})[\s,/|]+([+-]?\d{1,3}\.\d{3,7})/i;
  const pairMatch = cleanedText.match(pairRegex);
  if (pairMatch) {
    const lat = parseFloat(pairMatch[1]);
    const lng = parseFloat(pairMatch[2]);
    if (isValidCoordinatePair(lat, lng)) {
      return {
        isValid: true,
        latitude: lat,
        longitude: lng,
        rawTextMatched: pairMatch[0],
        formatType: 'DECIMAL'
      };
    }
  }

  return { isValid: false, latitude: null, longitude: null };
}
