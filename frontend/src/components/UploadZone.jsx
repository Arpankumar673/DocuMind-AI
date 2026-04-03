import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, 
  FileText, 
  ImageIcon, 
  X, 
  Loader2, 
  Sparkles,
  Zap
} from "lucide-react";

// Drag and drop for the documents
const UploadZone = ({ onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    // Basic type check
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(selectedFile.type)) return;
    
    // Check if under 10MB
    if (selectedFile.size > 10 * 1024 * 1024) return;
    
    setFile(selectedFile);
  };

  const cancelSelection = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runAnalysis = () => {
    if (file && !isAnalyzing) onAnalyze(file);
  };

  const demoMode = () => {
    const demoPayload = "DocuMind AI Sample Report\n\nDate: 2026-04-02\nProject: Alpha Dynamics\nContact: Arpan S.\n\nKey Insights: The project is progressing well and ahead of schedule. We have secured funding and sentiment is very high across the team.";
    const demoFile = new File([demoPayload], "sample_report.pdf", { type: "application/pdf" });
    setFile(demoFile);
    setTimeout(() => onAnalyze(demoFile), 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <AnimatePresence mode="wait">
        
        {/* Upload State */}
        {!file ? (
          <motion.div key="upload" className="flex flex-col items-center">
            <div
              className={`relative border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-300 ease-in-out cursor-pointer bg-white/50 border-slate-200 hover:border-blue-400 ${
                dragActive ? "border-blue-500 bg-blue-50/20" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
              />
              
              <div className="flex flex-col items-center space-y-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-100 rounded-full blur-2xl opacity-40 transition-opacity" />
                  <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <FileUp className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">Drop your file here</h3>
                  <p className="text-slate-400 font-medium text-lg max-w-sm mx-auto">
                    Select a PDF or Image to start the analysis.
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4 opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PDF • JPG • PNG</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MAX 10MB</span>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all shadow-md active:scale-95"
              >
                Upload File
              </button>
              <button
                onClick={demoMode}
                className="px-8 py-4 bg-white text-slate-600 border border-slate-100 rounded-2xl font-bold transition-all shadow-sm hover:bg-slate-50 active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                Live Demo
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" className="flex flex-col items-center">
            
            {/* File Preview */}
            <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-12 relative shadow-lg">
              <div className="flex flex-col items-center space-y-8 text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center p-6 border border-blue-100">
                    {file.type === "application/pdf" 
                      ? <FileText className="w-12 h-12 text-blue-500" />
                      : <ImageIcon className="w-12 h-12 text-purple-500" />}
                  </div>
                  <button
                    onClick={cancelSelection}
                    className="absolute -top-3 -right-3 bg-white text-slate-400 p-2 rounded-xl shadow-md hover:text-red-500 border border-slate-100"
                    disabled={isAnalyzing}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-slate-800 truncate max-w-sm">{file.name}</h4>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • READY
                  </p>
                </div>

                <div className="pt-4 w-full max-w-xs">
                  <button
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5" />}
                    {isAnalyzing ? "Processing..." : "Run Analysis"}
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={cancelSelection}
              className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-slate-600"
              disabled={isAnalyzing}
            >
              Cancel and select another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadZone;
