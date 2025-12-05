import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KpiCards } from './components/KpiCards';
import { AnomalyCharts } from './components/AnomalyCharts';
import { AnomalyTable } from './components/AnomalyTable';
import { ClaimInspector } from './components/ClaimInspector';
import { Footer } from './components/Footer';
import { DataQualityScore } from './components/DataQualityScore';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { AdvancedStats } from './components/AdvancedStats';
import { QuickActions } from './components/QuickActions';
import { StatisticsSummary } from './components/StatisticsSummary';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { ComplianceScore } from './components/ComplianceScore';
import { AnomalyTimeline } from './components/AnomalyTimeline';
import { ExportOptions } from './components/ExportOptions';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { Alert, AlertDescription } from './components/ui/alert';
import { CheckCircle2, Info, AlertCircle, Loader2 } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ClaimData, transformClaim, TransformedClaim } from './types/claim';
import { runPipeline, checkHealth, runSamplePipeline } from './services/api';
import { API_BASE } from './config';

export default function App() {
  const [threshold, setThreshold] = useState(5);
  const [useSampleData, setUseSampleData] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [claimsData, setClaimsData] = useState<ClaimData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isOnline = await checkHealth();
      setBackendOnline(isOnline);
      if (!isOnline) {
        setError('Backend is not reachable. Please ensure the FastAPI server is running.');
      }
      setLoading(false);
    };
    checkBackend();
  }, []);

  // Removed automatic loading of latest report on mount
  // Users must now explicitly select a dataset and run the pipeline

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
    setPipelineComplete(false);
    // Clear sample data selection when uploading a file
    if (file) {
      setUseSampleData(false);
    }
  };

  const handleRunPipeline = async () => {
    if (!backendOnline) {
      toast.error('Backend is not reachable. Please start the FastAPI server.');
      return;
    }

    // Handle sample data option
    if (useSampleData) {
      // Clear uploaded file when using sample data
      setUploadedFile(null);
      try {
        setPipelineRunning(true);
        setError(null);
        toast.info('Processing sample data... This may take a moment.');
        
        const data = await runSamplePipeline();
        setClaimsData(data);
        setPipelineComplete(true);
        toast.success('Pipeline completed successfully with sample data!');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to run sample pipeline';
        setError(message);
        toast.error(message);
      } finally {
        setPipelineRunning(false);
      }
      return;
    }

    if (!uploadedFile) {
      toast.error('Please upload a CSV file or select sample data');
      return;
    }

    await processFile(uploadedFile);
  };

  const processFile = async (file: File) => {
    try {
      setPipelineRunning(true);
      setError(null);
      toast.info('Processing file... This may take a moment.');
      
      const data = await runPipeline(file);
      setClaimsData(data);
      setPipelineComplete(true);
      toast.success('Pipeline completed successfully! Anomaly report saved.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to run pipeline';
      setError(message);
      toast.error(message);
    } finally {
      setPipelineRunning(false);
    }
  };

  // Transform claims data for components
  const transformedClaims: TransformedClaim[] = claimsData.map(transformClaim);
  
  const anomalies = transformedClaims.filter(claim => claim.anomaly_score >= threshold);
  const duplicates = transformedClaims.filter(claim => claim.is_duplicate);
  const missingFields = transformedClaims.filter(claim => claim.missing_critical);

  const selectedClaim = transformedClaims.find(claim => claim.claim_id === selectedClaimId);

  // Loading state
  if (loading && backendOnline === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Checking backend connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="flex">
        <Sidebar
          threshold={threshold}
          setThreshold={setThreshold}
          useSampleData={useSampleData}
          setUseSampleData={setUseSampleData}
          uploadedFile={uploadedFile}
          onFileUpload={handleFileUpload}
          onRunPipeline={handleRunPipeline}
          pipelineRunning={pipelineRunning}
        />

        <main className="flex-1 p-8 ml-80">
          {/* Backend Offline Alert */}
          {backendOnline === false && (
            <Alert className="mb-6 bg-red-50 border-red-200 animate-in fade-in duration-500">
              <AlertCircle className="size-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Backend not reachable. Please ensure the FastAPI server is running at {API_BASE}
                <button onClick={() => window.location.reload()} className="ml-2 underline hover:no-underline">
                  Retry
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && backendOnline && (
            <Alert className="mb-6 bg-red-50 border-red-200 animate-in fade-in duration-500">
              <AlertCircle className="size-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
                <button onClick={() => setError(null)} className="ml-2 underline hover:no-underline">
                  Dismiss
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          {showInfo && !pipelineComplete && backendOnline && (
            <Alert className="mb-6 bg-blue-50 border-blue-200 animate-in fade-in duration-500">
              <Info className="size-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Upload a CSV file or use the sample dataset, adjust the anomaly threshold, then click "Run pipeline" to analyze claims data.
                <button onClick={() => setShowInfo(false)} className="ml-2 underline hover:no-underline">
                  Dismiss
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {pipelineComplete && backendOnline && (
            <Alert className="mb-6 bg-green-50 border-green-200 animate-in slide-in-from-top duration-300">
              <CheckCircle2 className="size-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Pipeline completed successfully! Anomaly report saved to data/anomaly_report.csv
              </AlertDescription>
            </Alert>
          )}

          {/* No Data Placeholder */}
          {!loading && claimsData.length === 0 && backendOnline && !pipelineRunning && (
            <Alert className="mb-6 bg-blue-50 border-blue-200 animate-in fade-in duration-500">
              <Info className="size-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Get Started:</strong> Select a dataset (upload a CSV file or use sample data) and click "Run Pipeline" to analyze claims data.
              </AlertDescription>
            </Alert>
          )}

          {/* Data Quality Score - Prominent placement */}
          {claimsData.length > 0 && (
            <div className="mb-6 animate-in fade-in duration-500">
              <DataQualityScore
                totalClaims={transformedClaims.length}
                totalAnomalies={anomalies.length}
                duplicates={duplicates.length}
                missingFields={missingFields.length}
              />
            </div>
          )}

          {/* KPI Cards */}
          {claimsData.length > 0 && (
            <div className="animate-in fade-in duration-500 delay-100">
              <KpiCards
                totalClaims={transformedClaims.length}
                totalAnomalies={anomalies.length}
                duplicateClaims={duplicates.length}
                missingFields={missingFields.length}
                threshold={threshold}
              />
            </div>
          )}

          {/* Statistics Summary */}
          {claimsData.length > 0 && (
            <div className="mt-6 animate-in fade-in duration-500 delay-150">
              <StatisticsSummary data={transformedClaims} />
            </div>
          )}

          {/* Main Content with Tabs */}
          {claimsData.length > 0 && (
            <div className="mt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm p-1">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    Overview & Analysis
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    Advanced Statistics
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    Insights & Actions
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="animate-in fade-in duration-300">
                  {/* Real-Time Monitor */}
                  <div className="mb-6">
                    <RealTimeMonitor />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                      <AnomalyCharts data={transformedClaims} threshold={threshold} />
                    </div>

                    <div className="space-y-6">
                      <AnomalyTable
                        anomalies={anomalies}
                        selectedClaimId={selectedClaimId}
                        onSelectClaim={setSelectedClaimId}
                      />
                      
                      {selectedClaimId && selectedClaim && (
                        <div className="animate-in slide-in-from-right duration-300">
                          <ClaimInspector claim={selectedClaim} />
                        </div>
                      )}

                      {/* Anomaly Timeline */}
                      <AnomalyTimeline data={transformedClaims} threshold={threshold} />
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Statistics Tab */}
                <TabsContent value="advanced" className="animate-in fade-in duration-300">
                  {/* Compliance Score */}
                  <div className="mb-6">
                    <ComplianceScore
                      totalClaims={transformedClaims.length}
                      totalAnomalies={anomalies.length}
                      duplicates={duplicates.length}
                      missingFields={missingFields.length}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AdvancedStats data={transformedClaims} />
                  </div>
                </TabsContent>

                {/* Insights & Actions Tab */}
                <TabsContent value="insights" className="animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <RecommendationsPanel
                        totalAnomalies={anomalies.length}
                        duplicates={duplicates.length}
                        missingFields={missingFields.length}
                      />
                      
                      {/* Export Options */}
                      <ExportOptions data={transformedClaims} />
                    </div>
                    <div>
                      <QuickActions />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>

      <Footer />
      <KeyboardShortcuts />
      <Toaster position="top-right" richColors />
    </div>
  );
}
