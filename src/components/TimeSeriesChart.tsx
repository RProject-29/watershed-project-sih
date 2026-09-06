import type { Intervention } from '../types';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Calendar, Layers } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeSeriesChartProps {
  intervention: Intervention;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ intervention }) => {
  const years = Object.keys(intervention.snapshots).map(Number).sort((a, b) => a - b);
  
  const ndviData = years.map(y => intervention.snapshots[y].ndviValue);
  const ndwiArea = years.map(y => intervention.snapshots[y].ndwiAreaHectares);
  const barrenPct = years.map(y => intervention.snapshots[y].lulcBreakdown.barren);
  const vegPct = years.map(y => intervention.snapshots[y].lulcBreakdown.vegetation);

  // Line Chart for NDVI
  const lineChartData = {
    labels: years.map(y => `${y}`),
    datasets: [
      {
        label: 'NDVI Canopy Index (Sentinel-2)',
        data: ndviData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#047857',
        pointRadius: 5
      }
    ]
  };

  // Bar Chart for Water Area & Land Use
  const barChartData = {
    labels: years.map(y => `${y}`),
    datasets: [
      {
        label: 'Water Extent (Hectares)',
        data: ndwiArea,
        backgroundColor: '#0284c7',
        borderRadius: 4
      },
      {
        label: 'Dense Veg (%)',
        data: vegPct,
        backgroundColor: '#059669',
        borderRadius: 4
      },
      {
        label: 'Barren Land (%)',
        data: barrenPct,
        backgroundColor: '#f59e0b',
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11, family: 'Inter' }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.6)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-xs">
              Historical Time-Series (2021–2026)
            </span>
            <h3 className="text-base font-bold text-slate-900 font-outfit">
              Satellite Spectral Indices Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-year trend analysis for {intervention.title} in {intervention.locationName}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>6-Year Timeline View</span>
        </div>
      </div>

      {/* Two Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: NDVI Line */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> NDVI Vegetation Canopy Index (2021-2026)
          </h4>
          <div className="h-56">
            <Line data={lineChartData} options={options} />
          </div>
        </div>

        {/* Graph 2: Barren vs Veg vs Water */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Water Storage & Land Cover Distribution
          </h4>
          <div className="h-56">
            <Bar data={barChartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};
