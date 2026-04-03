import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart2, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronDown,
  LayoutDashboard,
  Zap
} from "lucide-react";

// Show the AI results nicely
const AnalysisResults = ({ data, onBack }) => {
  const [showJson, setShowJson] = useState(false);

  const getSentimentStats = (sentiment = "") => {
    const s = sentiment.toLowerCase();
    if (s === "positive") {
      return { css: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 className="w-5 h-5" />, label: "Positive" };
    }
    if (s === "negative") {
      return { css: "text-rose-600 bg-rose-50 border-rose-100", icon: <AlertCircle className="w-5 h-5" />, label: "Negative" };
    }
    return { css: "text-blue-600 bg-blue-50 border-blue-100", icon: <BarChart2 className="w-5 h-5" />, label: "Neutral" };
  };

  const sentiment = getSentimentStats(data.sentiment);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("Copied raw JSON to clipboard");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100">
        <div className="space-y-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 text-slate-400 hover:text-blue-600 font-bold transition-all uppercase tracking-widest text-xs"
          >
            <div className="p-2 bg-slate-50 group-hover:bg-blue-50 rounded-xl transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Reset
          </button>
          
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              Results
              <span className="p-2 bg-blue-100/30 rounded-2xl">
                <LayoutDashboard className="w-8 h-8 text-blue-500" />
              </span>
            </h2>
            <p className="text-slate-400 text-lg font-medium">Automatic extraction of themes and data from the file.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className={`px-6 py-4 rounded-3xl border flex items-center gap-4 shadow-sm ${sentiment.css}`}>
            {sentiment.icon}
            <span className="font-black text-sm uppercase tracking-widest">{sentiment.label} Sentiment</span>
          </div>
          <button 
            onClick={copyJson}
            className="p-5 bg-white text-slate-400 hover:text-blue-600 border border-slate-50 rounded-[1.5rem] transition-all group"
          >
            <Copy className="w-6 h-6 group-hover:scale-110" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Summary Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 xl:col-span-7 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-50 relative overflow-hidden group hover:border-blue-100 transition-colors">
            
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Zap className="w-48 h-48 text-indigo-600 rotate-12" />
            </div>

            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <FileText className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Executive Summary</h3>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 w-1 h-full bg-indigo-50 rounded-full" />
              <p className="text-slate-600 leading-relaxed text-xl font-light italic">
                "{data.summary}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Data Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* People/Names */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <Users className="w-16 h-16 text-white" />
             </div>
             <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                Key People
             </h4>
             <div className="flex flex-wrap gap-3">
                {data.entities.names.length > 0 ? (
                  data.entities.names.map((name, idx) => (
                    <span key={idx} className="px-5 py-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-sm font-bold transition-all border border-white/5">
                      {name}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 font-bold italic text-sm">No names identified</span>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            
            {/* Dates */}
            <div className="bg-white rounded-3xl p-8 border border-slate-50 shadow-sm hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Dates Found</h4>
              </div>
              <div className="space-y-4">
                {data.entities.dates.length > 0 ? (
                  data.entities.dates.map((date, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                       <span className="text-slate-500 font-bold text-sm">{date}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-300 font-bold italic text-xs">No dates found</span>
                )}
              </div>
            </div>

            {/* Amounts */}
            <div className="bg-white rounded-3xl p-8 border border-slate-50 shadow-sm hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Money/Amounts</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.entities.amounts.length > 0 ? (
                  data.entities.amounts.map((amount, idx) => (
                    <span key={idx} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-black border border-emerald-100">
                      {amount}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-300 font-bold italic text-xs">No amounts identified</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Raw Data Toggle */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full pt-16 flex flex-col items-center">
        <button
          onClick={() => setShowJson(!showJson)}
          className="group flex items-center gap-4 text-xs font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest bg-white px-8 py-4 rounded-full border border-slate-100 shadow-sm"
        >
          {showJson ? "Hide Data" : "Inspect Raw JSON"}
          <ChevronDown className={`w-4 h-4 transform transition-all ${showJson ? "rotate-180" : ""}`} />
        </button>
        
        <AnimatePresence>
          {showJson && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-10 w-full overflow-hidden"
            >
              <div className="p-1 bg-slate-100 rounded-[3rem]">
                <pre className="bg-[#0b0e14] text-indigo-200 p-12 rounded-[2.8rem] text-xs md:text-sm overflow-x-auto font-mono leading-relaxed">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AnalysisResults;
