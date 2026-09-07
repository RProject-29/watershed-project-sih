import type { Intervention, GISLayer, AnalysisRadius } from './types';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { MOCK_GIS_LAYERS, INITIAL_INTERVENTIONS } from './data/mockData';
import { computeChangeAnalysis } from './utils/spectralEngine';

import { storageService } from './utils/storageService';

// Components
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import type { TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { SummaryBar } from './components/SummaryBar';
import { MapEngine } from './components/MapEngine';
import { IntegratedFieldAnalysis } from './components/IntegratedFieldAnalysis';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { AIEvidencePanel } from './components/AIEvidencePanel';
import { InterventionsTable } from './components/InterventionsTable';
import { GISLayerToggle } from './components/GISLayerToggle';
import { FieldPhotoIngestionCard } from './components/FieldPhotoIngestionCard';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { CopernicusSettingsModal } from './components/CopernicusSettingsModal';
import { AdvancedPlanning } from './components/AdvancedPlanning';
import { DataRepository } from './components/DataRepository';
import { ProcessingPipelineModal } from './components/ProcessingPipelineModal';
import { ReportExporter } from './components/ReportExporter';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jaldrishti_auth_active') === 'true';
    } catch {
      return false;
    }
  });
  const [userRole, setUserRole] = useState<string>(() => {
    try {
      return localStorage.getItem('jaldrishti_user_role') || 'District Watershed Officer';
    } catch {
      return 'District Watershed Officer';
    }
  });
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('jaldrishti_user_name') || 'Dr. R. K. Sharma';
    } catch {
      return 'Dr. R. K. Sharma';
    }
  });

  const [interventions, setInterventions] = useState<Intervention[]>(() => storageService.loadInterventions());
  const uniqueInterventions = Array.from(new Map(interventions.map(i => [i.id, i])).values());

  const [selectedId, setSelectedId] = useState<string>('WP-001');
  const [radius, setRadius] = useState<AnalysisRadius>(1000);
  const [beforeYear, setBeforeYear] = useState<number>(2021);
  const [afterYear, setAfterYear] = useState<number>(2026);
  const [gisLayers, setGisLayers] = useState<GISLayer[]>(MOCK_GIS_LAYERS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedWatershed, setSelectedWatershed] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  
  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isCopernicusModalOpen, setIsCopernicusModalOpen] = useState<boolean>(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState<boolean>(false);
  const [isReportExporterOpen, setIsReportExporterOpen] = useState<boolean>(false);
  const [pendingRecord, setPendingRecord] = useState<{ record: Intervention; radius: AnalysisRadius } | null>(null);
  const [, setCredentialTick] = useState<number>(0);

  // Selected Intervention object
  const selectedIntervention = uniqueInterventions.find(i => i.id === selectedId) || uniqueInterventions[0] || INITIAL_INTERVENTIONS[0];
  const changeAnalysis = computeChangeAnalysis(selectedIntervention, beforeYear, afterYear);

  // KPI Counts
  const totalCount = uniqueInterventions.length;
  const verifiedCount = uniqueInterventions.filter(i => i.status === 'Verified').length;
  const needsReviewCount = uniqueInterventions.filter(i => i.status === 'NeedsReview').length;
  const priorityCount = uniqueInterventions.filter(i => i.status === 'PriorityInspection').length;

  const handleLoginSuccess = (role: string, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('jaldrishti_auth_active', 'true');
      localStorage.setItem('jaldrishti_user_role', role);
      localStorage.setItem('jaldrishti_user_name', name);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    const freshData = storageService.loadInterventions();
    setInterventions(freshData);
    if (freshData.length > 0 && !freshData.find(i => i.id === selectedId)) {
      setSelectedId(freshData[0].id);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('jaldrishti_auth_active');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleDeleteIntervention = (id: string) => {
    const updated = storageService.deleteIntervention(id);
    setInterventions(updated);
    if (selectedId === id) {
      if (updated.length > 0) {
        setSelectedId(updated[0].id);
      }
    }
  };

  const handleToggleLayer = (id: string) => {
    setGisLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const handleAddIntervention = (newRecord: Intervention, chosenRadius: AnalysisRadius) => {
    setPendingRecord({ record: newRecord, radius: chosenRadius });
    setIsUploadModalOpen(false);
    setIsPipelineModalOpen(true);
  };

  const handlePipelineComplete = () => {
    if (pendingRecord) {
      const updated = storageService.addIntervention(pendingRecord.record);
      setInterventions(updated);
      setSelectedId(pendingRecord.record.id);
      setRadius(pendingRecord.radius);
      setPendingRecord(null);
    }
    setIsPipelineModalOpen(false);
    setActiveTab('Dashboard');

    // Trigger celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleVerifyIntervention = (remarks?: string) => {
    const updated = storageService.updateIntervention(selectedId, i => ({
      ...i,
      status: 'Verified',
      remarks: remarks || i.remarks
    }));
    setInterventions(updated);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const handleExportReport = () => {
    setIsReportExporterOpen(true);
  };

  // Render Login screen if not logged in
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-row">
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        selectedInterventionTitle={selectedIntervention.title}
        selectedInterventionId={selectedIntervention.id}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Header */}
        <Header
          userName={userName}
          userRole={userRole}
          onLogout={handleLogout}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenCopernicusSettings={() => setIsCopernicusModalOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedWatershed={selectedWatershed}
          onWatershedChange={setSelectedWatershed}
          onExportReport={handleExportReport}
        />

        {/* KPI Summary Bar */}
        <SummaryBar
          totalCount={totalCount}
          verifiedCount={verifiedCount}
          needsReviewCount={needsReviewCount}
          priorityCount={priorityCount}
          radius={radius}
          onRadiusChange={setRadius}
          beforeYear={beforeYear}
          afterYear={afterYear}
          onBeforeYearChange={setBeforeYear}
          onAfterYearChange={setAfterYear}
        />

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-6">

          {/* Tab Content 1: Main Officer Dashboard */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <MapEngine
                    interventions={uniqueInterventions}
                    selectedIntervention={selectedIntervention}
                    onSelectIntervention={setSelectedId}
                    gisLayers={gisLayers}
                    radius={radius}
                  />
                  <GISLayerToggle
                    layers={gisLayers}
                    onToggleLayer={handleToggleLayer}
                  />
                </div>

                <div className="lg:col-span-1 flex flex-col">
                  <FieldPhotoIngestionCard
                    selectedIntervention={selectedIntervention}
                    changeAnalysis={changeAnalysis}
                    onVerify={handleVerifyIntervention}
                    onAddIntervention={handleAddIntervention}
                    radius={radius}
                    onRadiusChange={setRadius}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: Unified Field Data Analysis & Comparison */}
          {(activeTab === 'Analysis' || activeTab === 'MultiMap' || activeTab === 'BeforeAfter') && (
            <IntegratedFieldAnalysis
              interventions={uniqueInterventions}
              selectedIntervention={selectedIntervention}
              onSelectIntervention={setSelectedId}
              beforeYear={beforeYear}
              afterYear={afterYear}
              onBeforeYearChange={setBeforeYear}
              onAfterYearChange={setAfterYear}
              radius={radius}
              onVerify={handleVerifyIntervention}
              onExportReport={handleExportReport}
            />
          )}

          {/* Tab Content 3: Time-Series Trends */}
          {activeTab === 'TimeSeries' && (
            <div className="space-y-6">
              <TimeSeriesChart intervention={selectedIntervention} />
              <AIEvidencePanel
                intervention={selectedIntervention}
                change={changeAnalysis}
                onConfirmVerification={handleVerifyIntervention}
              />
            </div>
          )}

          {/* Tab Content 4: Advanced Planning */}
          {activeTab === 'Planning' && (
            <AdvancedPlanning />
          )}

          {/* Tab Content 5: Data Repository */}
          {activeTab === 'Repository' && (
            <DataRepository interventions={uniqueInterventions} />
          )}

          {/* Tab Content 6: Registry Table */}
          {activeTab === 'Registry' && (
            <div className="space-y-6">
              <InterventionsTable
                interventions={uniqueInterventions}
                selectedId={selectedId}
                onSelectIntervention={setSelectedId}
                onViewAnalysis={(id) => {
                  setSelectedId(id);
                  setActiveTab('Analysis');
                }}
                beforeYear={beforeYear}
                afterYear={afterYear}
                onBeforeYearChange={setBeforeYear}
                onAfterYearChange={setAfterYear}
                radius={radius}
                onVerify={handleVerifyIntervention}
                onExportReport={handleExportReport}
                onDeleteIntervention={handleDeleteIntervention}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-200 font-outfit">
                JALDRISHTI Watershed Monitoring Platform
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                "We transform geo-tagged field photos into GIS-linked, satellite-validated evidence."
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>ISRO / Bhuvan Integration Protocol</span>
              <span>•</span>
              <span>DoLR Watershed Cell</span>
              <span>•</span>
              <span className="text-emerald-400">IWMP GIS Protocol</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddIntervention={handleAddIntervention}
      />

      {/* Copernicus Live Satellite API Settings Modal */}
      <CopernicusSettingsModal
        isOpen={isCopernicusModalOpen}
        onClose={() => setIsCopernicusModalOpen(false)}
        onCredentialsUpdated={() => setCredentialTick(t => t + 1)}
      />

      {/* Animated Processing Pipeline Modal */}
      <ProcessingPipelineModal
        isOpen={isPipelineModalOpen}
        onComplete={handlePipelineComplete}
        extractedLocation={pendingRecord ? { lat: pendingRecord.record.latitude, lng: pendingRecord.record.longitude, date: pendingRecord.record.captureDateTime } : null}
      />

      {/* Official Executive GIS Report Exporter */}
      <ReportExporter
        isOpen={isReportExporterOpen}
        onClose={() => setIsReportExporterOpen(false)}
        intervention={selectedIntervention}
        changeAnalysis={changeAnalysis}
      />
    </div>
  );
}

export default App;
