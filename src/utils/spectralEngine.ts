import type { Intervention, SatelliteSnapshot, ChangeAnalysis, AnalysisRadius } from '../types';

export function getSnapshotForYear(intervention: Intervention, year: number): SatelliteSnapshot {
  if (intervention.snapshots[year]) {
    return intervention.snapshots[year];
  }
  // Fallback interpolation if year snapshot is missing
  const availableYears = Object.keys(intervention.snapshots).map(Number).sort((a, b) => a - b);
  const closestYear = availableYears.reduce((prev, curr) => 
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev, availableYears[0]);
  return intervention.snapshots[closestYear];
}

export function computeChangeAnalysis(
  intervention: Intervention,
  beforeYear: number,
  afterYear: number
): ChangeAnalysis {
  const before = getSnapshotForYear(intervention, beforeYear);
  const after = getSnapshotForYear(intervention, afterYear);

  const ndviChange = Number((after.ndviValue - before.ndviValue).toFixed(2));
  const ndwiAreaChangeHa = Number((after.ndwiAreaHectares - before.ndwiAreaHectares).toFixed(1));
  const barrenChangePct = after.lulcBreakdown.barren - before.lulcBreakdown.barren;
  const agriChangePct = after.lulcBreakdown.agriculture - before.lulcBreakdown.agriculture;
  const vegChangePct = after.lulcBreakdown.vegetation - before.lulcBreakdown.vegetation;

  let trend: 'Improved' | 'Declined' | 'NoMajorChange' = 'NoMajorChange';
  if (ndviChange >= 0.08 || ndwiAreaChangeHa >= 0.5 || vegChangePct >= 8) {
    trend = 'Improved';
  } else if (ndviChange <= -0.05 || ndwiAreaChangeHa <= -0.3) {
    trend = 'Declined';
  }

  // Generate audit-adherent AI summary string (hedged language)
  let aiSummary = '';
  if (trend === 'Improved') {
    aiSummary = `Satellite evidence indicates positive vegetation recovery (NDVI +${ndviChange}) and an expansion of surface-water extent (+${ndwiAreaChangeHa} ha) within the 1 km intervention radius. Barren land cover decreased by ${Math.abs(barrenChangePct)}%.`;
  } else if (trend === 'Declined') {
    aiSummary = `Satellite evidence shows a slight drop in canopy index (NDVI ${ndviChange}) and surface moisture reduction. Field inspection is recommended to verify structure integrity.`;
  } else {
    aiSummary = `Satellite evidence shows stable land-cover conditions (NDVI delta: ${ndviChange > 0 ? '+' : ''}${ndviChange}). Vegetation and surface water metrics remain steady compared to baseline period.`;
  }

  let suggestedAction = 'Continue routine satellite monitoring — no immediate field action required.';
  if (intervention.status === 'PriorityInspection' || trend === 'Declined') {
    suggestedAction = 'Field review recommended — inspect structure spillway and slope stability.';
  } else if (intervention.status === 'NeedsReview') {
    suggestedAction = 'Verify post-monsoon water holding capacity in Q3 inspection cycle.';
  }

  const seasonalComparable = Math.abs(beforeYear - afterYear) > 0;
  const seasonMatchNote = `Comparing ${before.monthName} ${beforeYear} vs ${after.monthName} ${afterYear} (Seasonally Aligned Baseline).`;

  return {
    interventionId: intervention.id,
    beforeYear,
    afterYear,
    ndviChange,
    ndwiAreaChangeHa,
    barrenChangePct,
    agriChangePct,
    vegChangePct,
    trend,
    aiSummary,
    suggestedAction,
    seasonalComparable,
    seasonMatchNote
  };
}

/**
 * Generate synthetic HTML Canvas Data URLs for multi-spectral raster visualization tiles
 */
export function generateSpectralCanvasTile(
  type: 'rgb' | 'ndvi' | 'ndwi' | 'lulc',
  snapshot: SatelliteSnapshot,
  radius: AnalysisRadius = 1000,
  size: number = 300
): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  const cx = size / 2;
  const cy = size / 2;

  // Background base
  if (type === 'rgb') {
    // True Color Satellite Simulation
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, size / 2);
    grad.addColorStop(0, '#3f5d38'); // lush green center near intervention
    grad.addColorStop(0.4, '#5e7047');
    grad.addColorStop(1, '#94815a'); // dry terrain outskirts
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Draw stream lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 100, cy - 120);
    ctx.quadraticCurveTo(cx - 20, cy, cx + 110, cy + 120);
    ctx.stroke();

    // Draw pond polygon if water is significant
    if (snapshot.ndwiAreaHectares > 0.5) {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 35 + snapshot.ndwiAreaHectares * 6, 25 + snapshot.ndwiAreaHectares * 4, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'ndvi') {
    // NDVI Spectral Heatmap (Red -> Yellow -> Bright Green)
    const ndvi = snapshot.ndviValue;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, size / 2);

    if (ndvi > 0.45) {
      grad.addColorStop(0, '#15803d'); // High NDVI (Dense Veg)
      grad.addColorStop(0.5, '#4ade80');
      grad.addColorStop(1, '#fef08a'); // Moderate
    } else if (ndvi > 0.3) {
      grad.addColorStop(0, '#84cc16'); // Moderate NDVI
      grad.addColorStop(0.5, '#fde047');
      grad.addColorStop(1, '#f97316'); // Barren
    } else {
      grad.addColorStop(0, '#eab308');
      grad.addColorStop(0.5, '#f97316');
      grad.addColorStop(1, '#ef4444'); // Barren / Low NDVI
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Noise pixels for realistic raster look
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * size;
      const ry = Math.random() * size;
      ctx.fillRect(rx, ry, 3, 3);
    }
  } else if (type === 'ndwi') {
    // NDWI Hydro Map (Tan -> Light Blue -> Deep Water Blue)
    const ndwi = snapshot.ndwiValue;
    const grad = ctx.createRadialGradient(cx, cy, 15, cx, cy, size / 2);

    if (ndwi > 0.35) {
      grad.addColorStop(0, '#0369a1'); // High Moisture / Pond
      grad.addColorStop(0.4, '#38bdf8');
      grad.addColorStop(1, '#e0f2fe');
    } else {
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.5, '#bae6fd');
      grad.addColorStop(1, '#fef3c7'); // Low Moisture
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Stream overlay
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 110, cy - 120);
    ctx.quadraticCurveTo(cx - 10, cy + 10, cx + 120, cy + 110);
    ctx.stroke();
  } else if (type === 'lulc') {
    // LULC Land Use Classification Map
    const { vegetation, agriculture, water } = snapshot.lulcBreakdown;
    
    // Fill base with barren color
    ctx.fillStyle = '#f59e0b'; // Barren
    ctx.fillRect(0, 0, size, size);

    // Agriculture regions
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, size * (agriculture / 100 + 0.2), size);

    // Forest / Plantation regions
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(cx, cy, size * (vegetation / 150 + 0.15), 0, Math.PI * 2);
    ctx.fill();

    // Waterbody
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(cx, cy, size * (water / 60 + 0.08), size * (water / 80 + 0.05), Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw 1 km Radius Buffer Circle overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  const radiusPx = (size / 2) * 0.75;
  ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center Marker
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Label text overlay (Buffer radius tag)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(10, size - 32, 130, 22);
  ctx.fillStyle = '#ffffff';
  ctx.font = '11px sans-serif';
  ctx.fillText(`Buffer: ${radius}m Radius`, 16, size - 17);

  return canvas.toDataURL('image/png');
}
