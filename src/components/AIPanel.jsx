import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Zap, Settings2, RefreshCw, Loader2, ArrowRight, CheckSquare, AlignLeft, Languages, Maximize, BarChart2, Ghost, BookOpen, Search } from 'lucide-react';
import { rewriteText, humanizeText, checkOriginality, checkGrammar, summarizeText, translateText, expandText, detectTone, autoComplete, analyzeReadability, optimizeSEO } from '../lib/gemini';

const paraphraseTones = ['Standard', 'Fluency', 'Formal', 'Academic', 'Creative', 'Shorten'];
const summaryLengths = ['Short', 'Medium', 'Long'];
const translateLanguages = ['Spanish', 'French', 'German', 'Tamil', 'Hindi', 'Japanese', 'Chinese', 'Arabic', 'Russian'];

const AIPanel = ({ activeTab, selectedText, editorContent, onReplace, setContent }) => {
  // Grammar State
  const [grammarReport, setGrammarReport] = useState(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);

  // Paraphraser State
  const [activeTone, setActiveTone] = useState('Standard');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteResult, setRewriteResult] = useState(null);
  
  // Plagiarism State
  const [isScanning, setIsScanning] = useState(false);
  const [plagiarismReport, setPlagiarismReport] = useState(null);
  
  // Humanizer State
  const [burstiness, setBurstiness] = useState(50);
  const [isHumanizing, setIsHumanizing] = useState(false);

  // Summarize State
  const [summaryLength, setSummaryLength] = useState('Short');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState('');

  // Translate State
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateResult, setTranslateResult] = useState('');

  // --- NEW STATES FOR PHASE 5 ---
  
  // Expander
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandResult, setExpandResult] = useState('');

  // Tone Detector
  const [isDetectingTone, setIsDetectingTone] = useState(false);
  const [toneResult, setToneResult] = useState(null);

  // Ghostwriter
  const [isGhostwriting, setIsGhostwriting] = useState(false);
  const [ghostResult, setGhostResult] = useState('');

  // Readability
  const [isAnalyzingReadability, setIsAnalyzingReadability] = useState(false);
  const [readabilityResult, setReadabilityResult] = useState(null);

  // SEO Optimizer
  const [isOptimizingSEO, setIsOptimizingSEO] = useState(false);
  const [seoResult, setSeoResult] = useState(null);

  // --- HANDLERS ---
  const handleCheckGrammar = async () => {
    if (!editorContent.trim()) return alert("Write something in the document canvas first!");
    setIsCheckingGrammar(true); setGrammarReport(null);
    try { setGrammarReport(await checkGrammar(editorContent)); } catch(e) { console.error(e); }
    setIsCheckingGrammar(false);
  };

  const applyGrammarFix = (original, suggestion, idx) => {
    const newContent = editorContent.replace(original, suggestion);
    setContent(newContent);
    const updatedIssues = [...grammarReport.issues];
    updatedIssues.splice(idx, 1);
    setGrammarReport({ ...grammarReport, issues: updatedIssues });
  };
  
  const ignoreGrammarFix = (idx) => {
    const updatedIssues = [...grammarReport.issues];
    updatedIssues.splice(idx, 1);
    setGrammarReport({ ...grammarReport, issues: updatedIssues });
  };

  const handleRewrite = async () => {
    if (!selectedText) return alert('Please highlight text in the editor first!');
    setIsRewriting(true); setRewriteResult(null);
    try { setRewriteResult(await rewriteText(selectedText, activeTone)); } catch(e) { console.error(e); }
    setIsRewriting(false);
  };

  const handleHumanize = async () => {
    if (!selectedText) return alert('Please highlight text in the editor first!');
    setIsHumanizing(true);
    try { onReplace(await humanizeText(selectedText, burstiness)); } catch(e) { console.error(e); }
    setIsHumanizing(false);
  };

  const handleScan = async () => {
    if (!editorContent.trim()) return alert("Write something in the document canvas first!");
    setIsScanning(true); setPlagiarismReport(null);
    try { setPlagiarismReport(await checkOriginality(editorContent)); } catch(e) { console.error(e); }
    setIsScanning(false);
  };

  const handleSummarize = async () => {
    if (!selectedText) return alert('Please highlight text to summarize!');
    setIsSummarizing(true); setSummaryResult('');
    try { setSummaryResult(await summarizeText(selectedText, summaryLength)); } catch(e) { console.error(e); }
    setIsSummarizing(false);
  };

  const handleTranslate = async () => {
    if (!selectedText) return alert('Please highlight text to translate!');
    setIsTranslating(true); setTranslateResult('');
    try { setTranslateResult(await translateText(selectedText, targetLanguage)); } catch(e) { console.error(e); }
    setIsTranslating(false);
  };

  // --- PHASE 5 HANDLERS ---
  const handleExpand = async () => {
    if (!selectedText) return alert('Please highlight text to expand!');
    setIsExpanding(true); setExpandResult('');
    try { setExpandResult(await expandText(selectedText)); } catch(e) { console.error(e); }
    setIsExpanding(false);
  };

  const handleDetectTone = async () => {
    if (!editorContent.trim()) return alert("Write something in the document canvas first!");
    setIsDetectingTone(true); setToneResult(null);
    try { setToneResult(await detectTone(editorContent)); } catch(e) { console.error(e); }
    setIsDetectingTone(false);
  };

  const handleGhostwriter = async () => {
    if (!editorContent.trim()) return alert("Write something in the document canvas first!");
    setIsGhostwriting(true); setGhostResult('');
    try { setGhostResult(await autoComplete(editorContent)); } catch(e) { console.error(e); }
    setIsGhostwriting(false);
  };

  const handleReadability = async () => {
    if (!editorContent.trim()) return alert("Write something in the document canvas first!");
    setIsAnalyzingReadability(true); setReadabilityResult(null);
    try { setReadabilityResult(await analyzeReadability(editorContent)); } catch(e) { console.error(e); }
    setIsAnalyzingReadability(false);
  };

  const handleSEO = async () => {
    if (!editorContent.trim()) return alert("Write something in the document canvas first!");
    setIsOptimizingSEO(true); setSeoResult(null);
    try { setSeoResult(await optimizeSEO(editorContent)); } catch(e) { console.error(e); }
    setIsOptimizingSEO(false);
  };

  return (
    <aside className="w-[420px] bg-slate-50/30 h-full flex flex-col shrink-0 shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)] relative z-20">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-slate-50/20">
        
        {/* PARAPHRASE TAB */}
        {activeTab === 'paraphrase' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">AI Paraphraser</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Select text in your document to get precise sentence-level improvement suggestions.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {!rewriteResult && selectedText && (
                <div className="mb-6 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-100/50">
                    <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest block mb-2">Selected Text</span>
                    <p className="text-[13px] text-slate-700 italic border-l-2 border-teal-400 pl-3">"{selectedText.length > 100 ? selectedText.substring(0,100) + '...' : selectedText}"</p>
                  </div>
                </div>
              )}

              {rewriteResult && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                   <div className="p-5 rounded-2xl bg-white border border-teal-200/60 shadow-md shadow-teal-500/5 mb-6">
                     <div className="flex items-center gap-2 mb-3">
                       <Sparkles className="w-4 h-4 text-teal-600" />
                       <span className="text-[12px] font-bold text-teal-800 uppercase tracking-wider">Improved Version</span>
                     </div>
                     <p className="text-[14px] text-slate-800 leading-[1.7] font-medium">"{rewriteResult.rewrittenText}"</p>
                   </div>
                   <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Specific Suggestions</h4>
                   <div className="space-y-3 mb-6">
                     {rewriteResult.suggestions && rewriteResult.suggestions.length > 0 ? (
                       rewriteResult.suggestions.map((sug, idx) => (
                         <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm transition-colors">
                           <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                             <span className="text-rose-500 font-semibold text-[13px] line-through bg-rose-50 px-2 py-0.5 rounded-md">{sug.original}</span>
                             <ArrowRight className="w-3 h-3 text-slate-300" />
                             <span className="text-teal-700 font-bold text-[13px] bg-teal-50 px-2 py-0.5 rounded-md">{sug.suggestion}</span>
                           </div>
                           <p className="text-[11px] font-bold text-slate-400 uppercase mt-2">{sug.reason}</p>
                         </div>
                       ))
                     ) : (
                       <p className="text-sm text-slate-500">No specific phrases were changed.</p>
                     )}
                   </div>
                </div>
              )}
              
              {!rewriteResult && (
                <div className="mb-6">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block pl-1">Document Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {paraphraseTones.map(tone => (
                      <button key={tone} onClick={() => setActiveTone(tone)} className={`cursor-pointer px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${activeTone === tone ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'bg-white border border-slate-200 text-slate-600'}`}>{tone}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
               {rewriteResult ? (
                 <div className="flex gap-3">
                   <button onClick={() => setRewriteResult(null)} className="w-1/3 cursor-pointer bg-white border border-slate-200 text-slate-600 rounded-xl py-3.5 font-bold text-[13px]">Discard</button>
                   <button onClick={() => { onReplace(rewriteResult.rewrittenText); setRewriteResult(null); }} className="w-2/3 cursor-pointer bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl py-3.5 font-bold text-[14px]">Apply to Document</button>
                 </div>
               ) : (
                 <button onClick={handleRewrite} disabled={isRewriting || !selectedText} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[14px] disabled:opacity-50">
                   {isRewriting ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <RefreshCw className="w-[18px] h-[18px]" />}
                   {isRewriting ? 'Generating Suggestions...' : 'Rewrite & Suggest'}
                 </button>
               )}
            </div>
          </div>
        )}

        {/* GRAMMAR TAB */}
        {activeTab === 'grammar' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-slate-800 font-bold mb-1 text-xl tracking-tight">Grammar Checker</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed pr-2">Find and instantly fix typos, grammar, and punctuation.</p>
              </div>
              <button onClick={handleCheckGrammar} disabled={isCheckingGrammar || !editorContent.trim()} className="bg-white border border-teal-200 hover:bg-teal-50 text-teal-700 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer">
                {isCheckingGrammar ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isCheckingGrammar ? 'Checking...' : 'Check All'}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 pb-4">
               {grammarReport ? (
                 grammarReport.issues.length > 0 ? (
                   <div className="space-y-4">
                     <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">{grammarReport.issues.length} Suggestions</h4>
                     {grammarReport.issues.map((issue, idx) => (
                       <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm transition-colors">
                         <div className="flex items-center gap-2 mb-3">
                           <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                           <span className="text-[12px] font-bold text-slate-600 uppercase tracking-widest">{issue.explanation}</span>
                         </div>
                         <div className="flex items-center gap-3 mb-5 pl-1 flex-wrap">
                           <span className="text-rose-500 font-semibold text-[14px] line-through bg-rose-50 px-2 py-0.5 rounded-lg">{issue.original}</span>
                           <ArrowRight className="w-4 h-4 text-slate-300" />
                           <span className="text-teal-700 font-bold text-[14px] bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-lg shadow-sm shadow-teal-500/10">{issue.suggestion}</span>
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => applyGrammarFix(issue.original, issue.suggestion, idx)} className="flex-1 cursor-pointer bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-2.5 text-[14px] font-bold transition-all shadow-md shadow-teal-600/20">Accept</button>
                           <button onClick={() => ignoreGrammarFix(idx)} className="flex-1 cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl py-2.5 text-[14px] font-bold transition-colors">Ignore</button>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="p-8 text-center rounded-2xl bg-teal-50 border border-teal-100 h-[300px] flex flex-col items-center justify-center">
                     <CheckSquare className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                     <h3 className="text-xl text-teal-800 font-bold mb-2">Perfect Grammar!</h3>
                     <p className="text-[14px] text-teal-600/80 font-medium">No spelling or punctuation issues found in your document.</p>
                   </div>
                 )
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-70 pt-10">
                   <CheckSquare className="w-12 h-12 text-slate-300 mb-4" />
                   <p className="text-[14px] font-medium text-slate-500">Click "Check All" to scan the entire document for typos.</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* PLAGIARISM TAB */}
        {activeTab === 'plagiarism' && (
           <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">Originality Check</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Scan your document against billions of web pages.</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-6">
              {plagiarismReport ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                   <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center mb-6 shadow-sm">
                     <div className={`text-6xl font-black mb-1 tracking-tighter ${plagiarismReport.originalityScore > 80 ? 'text-teal-500' : 'text-rose-500'}`}>{plagiarismReport.originalityScore}%</div>
                     <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Originality Score</div>
                     <div className={`py-2 px-4 rounded-xl inline-flex text-[13px] font-bold ${plagiarismReport.originalityScore >= 80 ? 'bg-teal-50 text-teal-700 border-teal-100/50' : plagiarismReport.originalityScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-100/50' : 'bg-rose-50 text-rose-700 border-rose-100/50'}`}>
                       {plagiarismReport.originalityScore >= 80 ? 'Your content is good to use ✨' : plagiarismReport.originalityScore >= 50 ? 'Your content needs some changes 📝' : 'Your content has high plagiarism 🚨'}
                     </div>
                   </div>
                   <h4 className="text-[13px] font-bold text-slate-700 mb-4 px-1">Matched Sources Overview</h4>
                   {plagiarismReport.matches && plagiarismReport.matches.length > 0 ? (
                     <div className="space-y-4">
                       {plagiarismReport.matches.map((match, idx) => (
                         <div key={idx} className="p-5 rounded-2xl border border-rose-100 bg-rose-50/50 shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
                           <p className="text-[13px] font-semibold text-slate-700 mb-3 italic">"{match.text}"</p>
                           <div className="flex justify-between items-center text-[11px] font-bold">
                             <span className="truncate max-w-[200px] text-teal-600">{match.source}</span>
                             <span className="text-rose-600 bg-rose-100 px-2 py-1 rounded-md">{match.percentage}% match</span>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="p-6 text-center rounded-2xl bg-teal-50/50 border border-teal-100">
                       <ShieldCheck className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                       <p className="text-[14px] text-teal-700 font-bold">Perfect! 100% Unique Context.</p>
                     </div>
                   )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center pt-8">
                  <div className="w-32 h-32 rounded-full bg-slate-50 border-[8px] border-white shadow-sm flex items-center justify-center relative mb-6">
                    {isScanning ? <Loader2 className="w-12 h-12 text-teal-500 animate-spin" /> : <ShieldCheck className="w-12 h-12 text-slate-300" />}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100">
               <button onClick={handleScan} disabled={isScanning || !editorContent.trim()} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[15px] disabled:opacity-50">
                 {isScanning ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <ShieldCheck className="w-[18px] h-[18px]" />}
                 {isScanning ? 'Scanning...' : 'Scan Canvas Content'}
               </button>
            </div>
          </div>
        )}

        {/* HUMANIZER TAB */}
        {activeTab === 'humanize' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="mb-8">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">AI Humanizer</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Bypass AI detectors by adding natural human imperfections.</p>
            </div>
             {selectedText && (
              <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-100/50">
                <p className="text-[13px] text-slate-700 italic border-l-2 border-teal-400 pl-3">"{selectedText.length > 80 ? selectedText.substring(0,80) + '...' : selectedText}"</p>
              </div>
            )}
            <div className="space-y-6 mb-6">
              <div className="p-5 rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[14px] font-bold text-slate-700">Burstiness: {burstiness}%</span>
                  <Settings2 className="w-5 h-5 text-slate-400" />
                </div>
                <input type="range" min="0" max="100" value={burstiness} onChange={(e) => setBurstiness(e.target.value)} className="w-full accent-teal-600 rounded-lg bg-slate-100 h-2 outline-none cursor-pointer" />
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-slate-100">
               <button onClick={handleHumanize} disabled={isHumanizing || !selectedText} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl py-4 font-semibold text-[14px] disabled:opacity-50">
                 {isHumanizing ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Zap className="w-[18px] h-[18px] fill-white/20" />}
                 {isHumanizing ? 'Humanizing...' : 'Humanize Text'}
               </button>
            </div>
          </div>
        )}

        {/* SUMMARIZE TAB */}
        {activeTab === 'summarize' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">Summarizer</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Instantly condense long articles or paragraphs.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {selectedText && !summaryResult && (
                <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-100/50">
                  <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest block mb-2">Selected Text</span>
                  <p className="text-[13px] text-slate-700 italic border-l-2 border-teal-400 pl-3">"{selectedText.length > 100 ? selectedText.substring(0,100) + '...' : selectedText}"</p>
                </div>
              )}
              {summaryResult && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                   <div className="p-5 rounded-2xl bg-white border border-teal-200/60 shadow-md shadow-teal-500/5 mb-6">
                     <div className="flex items-center gap-2 mb-3">
                       <AlignLeft className="w-4 h-4 text-teal-600" />
                       <span className="text-[12px] font-bold text-teal-800 uppercase tracking-wider">Summary</span>
                     </div>
                     <p className="text-[14px] text-slate-800 leading-[1.7] font-medium">"{summaryResult}"</p>
                   </div>
                </div>
              )}
              {!summaryResult && (
                <div className="mb-6">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block pl-1">Summary Length</label>
                  <div className="flex flex-wrap gap-2">
                    {summaryLengths.map(len => (
                      <button key={len} onClick={() => setSummaryLength(len)} className={`cursor-pointer px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${summaryLength === len ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{len}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
               {summaryResult ? (
                 <div className="flex gap-3">
                   <button onClick={() => setSummaryResult('')} className="w-1/3 cursor-pointer bg-white border border-slate-200 text-slate-600 rounded-xl py-3.5 font-bold text-[13px]">Discard</button>
                   <button onClick={() => { onReplace(summaryResult); setSummaryResult(''); }} className="w-2/3 cursor-pointer bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl py-3.5 font-bold text-[14px]">Insert Summary</button>
                 </div>
               ) : (
                 <button onClick={handleSummarize} disabled={isSummarizing || !selectedText} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[14px] disabled:opacity-50">
                   {isSummarizing ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <AlignLeft className="w-[18px] h-[18px]" />}
                   {isSummarizing ? 'Summarizing...' : 'Summarize Selection'}
                 </button>
               )}
            </div>
          </div>
        )}

        {/* TRANSLATE TAB */}
        {activeTab === 'translate' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">AI Translator</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Translate text accurately into multiple languages.</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {selectedText && !translateResult && (
                <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-100/50">
                  <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest block mb-2">Selected Text</span>
                  <p className="text-[13px] text-slate-700 italic border-l-2 border-teal-400 pl-3">"{selectedText.length > 100 ? selectedText.substring(0,100) + '...' : selectedText}"</p>
                </div>
              )}
              {translateResult && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                   <div className="p-5 rounded-2xl bg-white border border-teal-200/60 shadow-md shadow-teal-500/5 mb-6">
                     <div className="flex items-center gap-2 mb-3">
                       <Languages className="w-4 h-4 text-teal-600" />
                       <span className="text-[12px] font-bold text-teal-800 uppercase tracking-wider">{targetLanguage}</span>
                     </div>
                     <p className="text-[14px] text-slate-800 leading-[1.7] font-medium">"{translateResult}"</p>
                   </div>
                </div>
              )}
              {!translateResult && (
                <div className="mb-6">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block pl-1">Target Language</label>
                  <select 
                    value={targetLanguage} 
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium outline-none cursor-pointer"
                  >
                    {translateLanguages.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="mt-auto pt-6 border-t border-slate-100">
               {translateResult ? (
                 <div className="flex gap-3">
                   <button onClick={() => setTranslateResult('')} className="w-1/3 cursor-pointer bg-white border border-slate-200 text-slate-600 rounded-xl py-3.5 font-bold text-[13px]">Discard</button>
                   <button onClick={() => { onReplace(translateResult); setTranslateResult(''); }} className="w-2/3 cursor-pointer bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl py-3.5 font-bold text-[14px]">Insert Translation</button>
                 </div>
               ) : (
                 <button onClick={handleTranslate} disabled={isTranslating || !selectedText} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[14px] disabled:opacity-50">
                   {isTranslating ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Languages className="w-[18px] h-[18px]" />}
                   {isTranslating ? 'Translating...' : 'Translate Selection'}
                 </button>
               )}
            </div>
          </div>
        )}

        {/* EXPANDER TAB (NEW) */}
        {activeTab === 'expander' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">Content Expander</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Instantly lengthen your content with rich vocabulary and examples.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {selectedText && !expandResult && (
                <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-100/50">
                  <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest block mb-2">Selected Text</span>
                  <p className="text-[13px] text-slate-700 italic border-l-2 border-teal-400 pl-3">"{selectedText.length > 100 ? selectedText.substring(0,100) + '...' : selectedText}"</p>
                </div>
              )}
              {expandResult && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                   <div className="p-5 rounded-2xl bg-white border border-teal-200/60 shadow-md shadow-teal-500/5 mb-6">
                     <div className="flex items-center gap-2 mb-3">
                       <Maximize className="w-4 h-4 text-teal-600" />
                       <span className="text-[12px] font-bold text-teal-800 uppercase tracking-wider">Expanded Content</span>
                     </div>
                     <p className="text-[14px] text-slate-800 leading-[1.7] font-medium">"{expandResult}"</p>
                   </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
               {expandResult ? (
                 <div className="flex gap-3">
                   <button onClick={() => setExpandResult('')} className="w-1/3 cursor-pointer bg-white border border-slate-200 text-slate-600 rounded-xl py-3.5 font-bold text-[13px]">Discard</button>
                   <button onClick={() => { onReplace(expandResult); setExpandResult(''); }} className="w-2/3 cursor-pointer bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl py-3.5 font-bold text-[14px]">Insert Expansion</button>
                 </div>
               ) : (
                 <button onClick={handleExpand} disabled={isExpanding || !selectedText} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[14px] disabled:opacity-50">
                   {isExpanding ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Maximize className="w-[18px] h-[18px]" />}
                   {isExpanding ? 'Expanding...' : 'Expand Selection'}
                 </button>
               )}
            </div>
          </div>
        )}

        {/* TONE DETECTOR TAB (NEW) */}
        {activeTab === 'tone' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">Tone Detector</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Analyze the complex emotions embedded in your document.</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-6">
              {toneResult ? (
                <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
                   <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Emotional Profile</h4>
                   {toneResult.map((t, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500"></div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-[15px] text-slate-800">{t.tone}</span>
                          <span className="text-[18px] font-black text-teal-600">{t.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                           <div className="bg-teal-500 h-full rounded-full transition-all duration-1000" style={{width: `${t.percentage}%`}}></div>
                        </div>
                      </div>
                   ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center pt-8">
                  <div className="w-32 h-32 rounded-full bg-slate-50 border-[8px] border-white shadow-sm flex items-center justify-center relative mb-6">
                    {isDetectingTone ? <Loader2 className="w-12 h-12 text-teal-500 animate-spin" /> : <BarChart2 className="w-12 h-12 text-slate-300" />}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100">
               <button onClick={handleDetectTone} disabled={isDetectingTone || !editorContent.trim()} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[15px] disabled:opacity-50">
                 {isDetectingTone ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <BarChart2 className="w-[18px] h-[18px]" />}
                 {isDetectingTone ? 'Analyzing...' : 'Analyze Document Tone'}
               </button>
            </div>
          </div>
        )}

        {/* GHOSTWRITER TAB (NEW) */}
        {activeTab === 'ghostwriter' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">Ghostwriter</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Let Jot AI effortlessly auto-complete your next few sentences.</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {ghostResult ? (
                <div className="animate-in fade-in zoom-in-95 duration-300 mt-2">
                   <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Suggested Continuation</h4>
                   <div className="p-5 rounded-2xl bg-white border border-teal-200/60 shadow-md shadow-teal-500/5 mb-6">
                     <p className="text-[14px] text-slate-800 leading-[1.7] font-medium italic">"{ghostResult}"</p>
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center pt-8">
                  <div className="w-32 h-32 rounded-full bg-slate-50 border-[8px] border-white shadow-sm flex items-center justify-center relative mb-6">
                    {isGhostwriting ? <Loader2 className="w-12 h-12 text-teal-500 animate-spin" /> : <Ghost className="w-12 h-12 text-slate-300" />}
                  </div>
                  <p className="text-[13px] text-slate-500 font-medium text-center px-4">This tool will read the end of your document and naturally continue writing.</p>
                </div>
              )}
            </div>
            <div className="mt-auto pt-6 border-t border-slate-100">
               {ghostResult ? (
                 <div className="flex gap-3">
                   <button onClick={() => setGhostResult('')} className="w-1/3 cursor-pointer bg-white border border-slate-200 text-slate-600 rounded-xl py-3.5 font-bold text-[13px]">Discard</button>
                   <button onClick={() => { setContent(editorContent + (editorContent.endsWith(' ') ? '' : ' ') + ghostResult); setGhostResult(''); }} className="w-2/3 cursor-pointer bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl py-3.5 font-bold text-[14px]">Keep Writing</button>
                 </div>
               ) : (
                 <button onClick={handleGhostwriter} disabled={isGhostwriting || !editorContent.trim()} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[14px] disabled:opacity-50">
                   {isGhostwriting ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Ghost className="w-[18px] h-[18px]" />}
                   {isGhostwriting ? 'Writing...' : 'Auto-Complete Flow'}
                 </button>
               )}
            </div>
          </div>
        )}

        {/* READABILITY TAB (NEW) */}
        {activeTab === 'readability' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">Readability</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">Ensure your text is instantly understandable by your audience.</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-6">
              {readabilityResult ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                   <div className="text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm mb-4">
                      <h1 className={`text-6xl font-black mb-2 tracking-tighter ${readabilityResult.score > 70 ? 'text-teal-500' : readabilityResult.score > 40 ? 'text-amber-500' : 'text-rose-500'}`}>{readabilityResult.score}</h1>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Readability Index</div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4 flex justify-between items-center text-left">
                         <span className="text-[13px] font-bold text-slate-500 uppercase">Reading Level</span>
                         <span className="text-[15px] font-black text-teal-700">{readabilityResult.level}</span>
                      </div>
                      <p className="text-[14px] text-slate-700 font-medium bg-teal-50/50 p-4 rounded-xl border border-teal-100/50 leading-relaxed">
                         {readabilityResult.feedback}
                      </p>
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center pt-8">
                  <div className="w-32 h-32 rounded-full bg-slate-50 border-[8px] border-white shadow-sm flex items-center justify-center relative mb-6">
                    {isAnalyzingReadability ? <Loader2 className="w-12 h-12 text-teal-500 animate-spin" /> : <BookOpen className="w-12 h-12 text-slate-300" />}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100">
               <button onClick={handleReadability} disabled={isAnalyzingReadability || !editorContent.trim()} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[15px] disabled:opacity-50">
                 {isAnalyzingReadability ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <BookOpen className="w-[18px] h-[18px]" />}
                 {isAnalyzingReadability ? 'Analyzing...' : 'Analyze Text Clarity'}
               </button>
            </div>
          </div>
        )}

        {/* SEO TAB (NEW) */}
        {activeTab === 'seo' && (
           <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-6">
                 <h3 className="text-slate-800 font-bold mb-2 text-xl tracking-tight">SEO Optimizer</h3>
                 <p className="text-[14px] text-slate-500 leading-relaxed">Generate search-engine tags natively from your document.</p>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 pb-6">
                 {seoResult ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                       <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Meta Title</h4>
                          <p className="text-[16px] font-bold text-blue-700 hover:underline cursor-pointer">{seoResult.title}</p>
                       </div>
                       <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-500"></div>
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Meta Description</h4>
                          <p className="text-[14px] text-slate-600 font-medium leading-[1.6]">{seoResult.description}</p>
                       </div>
                       <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Top Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                             {seoResult.keywords.map((k, i) => (
                                <span key={i} className="text-[12px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg">{k}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center pt-8">
                      <div className="w-32 h-32 rounded-full bg-slate-50 border-[8px] border-white shadow-sm flex items-center justify-center relative mb-6">
                        {isOptimizingSEO ? <Loader2 className="w-12 h-12 text-teal-500 animate-spin" /> : <Search className="w-12 h-12 text-slate-300" />}
                      </div>
                    </div>
                 )}
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100">
                 <button onClick={handleSEO} disabled={isOptimizingSEO || !editorContent.trim()} className="w-full cursor-pointer flex items-center justify-center gap-2.5 bg-slate-900 text-white rounded-xl py-4 font-semibold text-[15px] disabled:opacity-50">
                   {isOptimizingSEO ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Search className="w-[18px] h-[18px]" />}
                   {isOptimizingSEO ? 'Optimizing...' : 'Generate Meta Tags'}
                 </button>
              </div>
           </div>
        )}

      </div>
    </aside>
  );
};

export default AIPanel;
