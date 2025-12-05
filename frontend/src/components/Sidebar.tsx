import { Upload, Database, Settings, Play, X, FileCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { useRef } from 'react';

interface SidebarProps {
  threshold: number;
  setThreshold: (value: number) => void;
  useSampleData: boolean;
  setUseSampleData: (value: boolean) => void;
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
  onRunPipeline: () => void;
  pipelineRunning: boolean;
}

export function Sidebar({
  threshold,
  setThreshold,
  useSampleData,
  setUseSampleData,
  uploadedFile,
  onFileUpload,
  onRunPipeline,
  pipelineRunning
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileUpload(file);
    // Reset the input so the same file can be selected again
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSampleDataToggle = (checked: boolean) => {
    setUseSampleData(checked);
    // Clear uploaded file when switching to sample data
    if (checked) {
      onFileUpload(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <aside className="fixed left-0 top-[96px] bottom-0 w-80 bg-white/80 backdrop-blur-md border-r border-slate-200 shadow-lg overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Controls Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Settings className="size-5 text-blue-600" />
          </div>
          <h2 className="text-slate-900">Pipeline Controls</h2>
        </div>

        {/* File Upload Section */}
        <Card className="p-5 bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="size-4 text-blue-600" />
            <h3 className="text-slate-900">Upload Claims CSV</h3>
          </div>
          
          <div className="space-y-3">
            <label className="block group cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 bg-white group-hover:scale-[1.02]">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="size-10 text-slate-400 group-hover:text-blue-500 mx-auto mb-3 transition-colors" />
                <p className="text-sm text-slate-700 group-hover:text-blue-700 transition-colors">
                  Drag and drop file here
                </p>
                <p className="text-xs text-slate-400 mt-1">Limit 200MB per file • CSV</p>
                <Button variant="outline" size="sm" className="mt-4 group-hover:border-blue-500 group-hover:text-blue-600">
                  Browse files
                </Button>
              </div>
            </label>

            {uploadedFile && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 shadow-sm animate-in slide-in-from-top duration-200">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FileCheck className="size-4 text-blue-600 flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onFileUpload(null);
                    // Reset file input so the same file can be selected again
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Sample Dataset Checkbox */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:shadow-sm transition-shadow">
          <Checkbox
            id="sample-data"
            checked={useSampleData}
            onCheckedChange={(checked) => handleSampleDataToggle(checked as boolean)}
          />
          <label htmlFor="sample-data" className="text-sm text-slate-700 cursor-pointer flex-1">
            Use sample dataset
            <span className="block text-xs text-slate-500 mt-0.5">
              (data/mock_claims.csv)
            </span>
          </label>
        </div>

        {/* Threshold Slider */}
        <Card className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-sm">
          <h3 className="text-sm text-slate-900 mb-3 flex items-center gap-2">
            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">
              Critical
            </span>
            Anomaly Score Threshold
          </h3>
          <div className="space-y-4">
            <Slider
              value={[threshold]}
              onValueChange={(values) => setThreshold(values[0])}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">0 (Low)</span>
              <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-sm">
                {threshold}
              </div>
              <span className="text-slate-500">20 (High)</span>
            </div>
            <p className="text-xs text-slate-600 text-center">
              Claims with score ≥ {threshold} will be flagged
            </p>
          </div>
        </Card>

        {/* Run Pipeline Button */}
        <Button
          onClick={onRunPipeline}
          disabled={pipelineRunning}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
          size="lg"
        >
          {pipelineRunning ? (
            <>
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Running Analysis...
            </>
          ) : (
            <>
              <Play className="size-4 mr-2 fill-current" />
              Run Pipeline
            </>
          )}
        </Button>

        {/* Stats Preview */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500 mb-2">Pipeline Status</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Data Source:</span>
              <span className="text-slate-900">
                {uploadedFile ? 'Custom' : useSampleData ? 'Sample' : 'None'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Threshold:</span>
              <span className="text-slate-900">{threshold}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}