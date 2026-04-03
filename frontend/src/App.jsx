import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  ArrowRight
} from "lucide-react";

import { analyzeDocument } from "./api/client";
import UploadZone from "./components/UploadZone";
import LoadingSpinner from "./components/LoadingSpinner";
import AnalysisResults from "./components/AnalysisResults";

const App = () => {
  const [screen, setScreen] = useState("upload"); 
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const uploadRef = useRef(null);

  // Analyze our document
  const handleAnalyze = async (file) => {
    setScreen("loading");
    setError(null);

    try {
      const result = await analyzeDocument(file);
      setAnalysisData(result);
      setScreen("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Analysis process failed:", err.message);
      setError(
        err.response?.data?.message || 
        "Analysis failed. Please try again."
      );
      setScreen("upload");
    }
  };

  const resetUI = () => {
    setScreen("upload");
    setAnalysisData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-inter selection:bg-blue-100 overflow-x-hidden">
      
      {/* Glow background bits */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-100/30 rounded-full blur-[160px] opacity-10" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-100/30 rounded-full blur-[160px] opacity-10" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-8 py-5 w-full bg-white/70 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetUI}>
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              DocuMind <span className="gradient-text ml-1.5 uppercase font-black text-blue-600">AI</span>
            </h1>
          </div>
          <div />
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          
          {/* Landing/Upload */}
          {screen === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -40 }}
              className="w-full"
            >
              <section className="pt-24 pb-20 px-6 flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.95]">
                    Understand Any <br />
                    <span className="gradient-text">Document</span> in Seconds
                  </h1>
                </motion.div>
                
                <p className="text-slate-400 font-medium text-xl md:text-2xl max-w-2xl leading-relaxed">
                  Fast summaries and key insights from your PDFs, images, or DOCX files.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
                  <button 
                    onClick={scrollToUpload}
                    className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-bold text-lg shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-3"
                  >
                    Start Analysis
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={scrollToUpload}
                    className="px-10 py-5 bg-white text-slate-800 border border-slate-100 rounded-3xl font-bold text-lg shadow-sm hover:bg-slate-50 transition-all"
                  >
                    Try Demo
                  </button>
                </div>
              </section>

              <section ref={uploadRef} className="py-20 px-6 container mx-auto">
                {error && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-10 max-w-md mx-auto p-5 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 font-bold"
                  >
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
                
                <UploadZone 
                  onAnalyze={handleAnalyze} 
                  isAnalyzing={screen === "loading"}
                />
              </section>

              {/* Minimal bullet list */}
              <section className="py-24 px-6 container mx-auto opacity-40 hover:opacity-100 transition-opacity">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                  {[
                    { icon: Sparkles, title: "Summaries", color: "text-indigo-500" },
                    { icon: CheckCircle2, title: "Key Info", color: "text-emerald-500" },
                    { icon: FileText, title: "OCR Support", color: "text-amber-500" }
                  ].map((feat, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-4">
                      <feat.icon className={`w-8 h-8 ${feat.color}`} />
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{feat.title}</h4>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* Loading */}
          {screen === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex-1 flex flex-col items-center justify-center p-6"
            >
              <div className="w-full max-w-md bg-white border border-slate-100 rounded-[3rem] p-16 shadow-xl text-center">
                <LoadingSpinner />
                <div className="mt-12 space-y-4">
                  <p className="text-blue-600 text-xs font-black tracking-[0.3em] uppercase">Checking Docs</p>
                  <p className="text-slate-400 font-medium text-lg animate-pulse">Running AI analysis engine...</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {screen === "result" && analysisData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full py-20 px-6"
            >
              <AnalysisResults data={analysisData} onBack={resetUI} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="py-12 flex items-center justify-center border-t border-slate-50">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          DocuMind AI
        </span>
      </footer>
    </div>
  );
};

export default App;
