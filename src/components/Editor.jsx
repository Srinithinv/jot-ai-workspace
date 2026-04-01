import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { FileText, Download, Printer, X, Mic, Volume2, Wand2, Loader2, Sun, Moon } from 'lucide-react';
import { magicFormat } from '../lib/gemini';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ]
};

const Editor = ({ content, setContent, docTitle, setDocTitle, handleSelection, quillRef, isDark, setIsDark }) => {
  // Modal State
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfSettings, setPdfSettings] = useState({
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    topMargin: '40px',
    lineHeight: '1.6',
    includeTitle: true
  });

  // Phase 9 Features
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef(null);
  const [isReading, setIsReading] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const toggleDictation = () => {
    if (isDictating) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsDictating(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Your browser does not support Voice Typing. Try using Google Chrome.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
             finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript && quillRef.current) {
          const editor = quillRef.current.getEditor();
          const length = editor.getLength();
          editor.insertText(length, finalTranscript + ' ');
        }
      };

      recognition.onerror = () => setIsDictating(false);
      recognition.onend = () => setIsDictating(false);
      
      recognition.start();
      recognitionRef.current = recognition;
      setIsDictating(true);
    }
  };

  const toggleReadAloud = () => {
    if (isReading) {
       window.speechSynthesis.cancel();
       setIsReading(false);
    } else {
       const text = quillRef.current?.getEditor().getText();
       if (!text || !text.trim()) return alert('Document is empty!');
       const utterance = new SpeechSynthesisUtterance(text);
       utterance.onend = () => setIsReading(false);
       utterance.onerror = () => setIsReading(false);
       window.speechSynthesis.speak(utterance);
       setIsReading(true);
    }
  };

  const handleMagicFormat = async () => {
    const plainText = quillRef.current?.getEditor().getText() || '';
    if (!plainText.trim()) return alert("Document is empty!");
    
    setIsFormatting(true);
    try {
      const formattedHTML = await magicFormat(plainText);
      if (quillRef.current) {
         quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, formattedHTML);
      } else {
         setContent(formattedHTML);
      }
    } catch(e) {
      console.error(e);
      alert("Failed to magically format the document. The text might be too long.");
    }
    setIsFormatting(false);
  };

  // Export methods
  const handleExportTxt = () => {
    if (quillRef.current) {
       const text = quillRef.current.getEditor().getText();
       if (!text.trim()) return alert("Document is empty!");
       const blob = new Blob([text], { type: 'text/plain' });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `${docTitle.replace(/\s+/g, '_')}.txt`;
       a.click();
       URL.revokeObjectURL(url);
    }
  };

  const triggerPdfPrint = () => {
     if (!content.trim()) return alert("Document is empty!");
     const printWindow = window.open('', '_blank');
     const htmlContent = content; 

     printWindow.document.write(`
       <html>
         <head>
           <title>${docTitle}</title>
           <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
           <style>
             body { 
               font-family: ${pdfSettings.fontFamily};  font-size: ${pdfSettings.fontSize};
               padding: ${pdfSettings.topMargin} 50px; line-height: ${pdfSettings.lineHeight}; 
               color: #1e293b; max-width: 800px; margin: 0 auto;
             }
             h1 { padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; margin-bottom: 30px; font-size: 2.2em; color: #0f172a; }
             p { margin-bottom: 0.5em; }
             .ql-align-center { text-align: center; } .ql-align-right { text-align: right; } .ql-align-justify { text-align: justify; }
             @media print { body { padding: 0; max-width: 100%; } }
           </style>
         </head>
         <body>
           ${pdfSettings.includeTitle ? `<h1>${docTitle}</h1>` : ''}
           <div class="ql-editor">${htmlContent}</div>
         </body>
       </html>
     `);
     printWindow.document.close();
     
     setTimeout(() => {
       printWindow.print();
       setShowPdfModal(false);
     }, 250);
  };

  // Live Stats
  const rawText = quillRef.current ? quillRef.current.getEditor().getText() : content;
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.trim().length;
  const readTime = wordCount === 0 ? 0 : Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex-1 flex flex-col bg-white relative z-0 transition-colors duration-500">
      
      {/* Editor Header */}
      <div className="h-[72px] border-b border-slate-200 px-4 md:px-8 flex items-center justify-between bg-white shrink-0 transition-colors duration-500 w-full overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm relative z-0">
            <FileText className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-white opacity-[0.03] dark:opacity-10 z-0 rounded-xl"></div>
          </div>
          <div className="flex flex-col overflow-hidden max-w-[120px] sm:max-w-xs shrink-1">
            <input 
              type="text" 
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-slate-800 font-bold text-[14px] md:text-[16px] bg-transparent outline-none focus:border-b-2 hover:border-b border-slate-300 w-full mb-[1px] truncate" 
            />
            <p className="text-teal-600 text-[9px] md:text-[11px] font-bold tracking-widest uppercase truncate">Saved Locally</p>
          </div>

          <button onClick={() => setIsDark(!isDark)} className="ml-1 md:ml-4 p-2 md:p-2.5 shrink-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200" title="Toggle Theme">
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
        
        {/* EXPORT OPTIONS */}
        <div className="flex items-center gap-1 md:gap-2 flex-1 justify-end ml-2 shrink-0 overflow-x-auto no-scrollbar mask-fade-left">
           <button onClick={toggleDictation} className={`shrink-0 flex flex-col items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-inline md:rounded-xl transition-all cursor-pointer ${isDictating ? 'bg-rose-100 text-rose-600 animate-pulse border border-rose-200' : 'text-slate-500 hover:bg-slate-100 border border-transparent hover:text-slate-700'}`} title="Voice Typing">
             <Mic className="w-4 h-4 md:w-5 md:h-5" />
           </button>
           <button onClick={toggleReadAloud} className={`shrink-0 flex flex-col items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-inline md:rounded-xl transition-all cursor-pointer ${isReading ? 'bg-teal-100 text-teal-600 animate-pulse border border-teal-200' : 'text-slate-500 hover:bg-slate-100 border border-transparent hover:text-slate-700'}`} title="Read Aloud">
             <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
           </button>
           <button onClick={handleMagicFormat} disabled={isFormatting} className="shrink-0 flex items-center gap-1.5 md:gap-2 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 border border-transparent font-bold text-[11px] md:text-[13px] px-2.5 md:px-4 py-2 md:py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50" title="Auto-Format Magic">
             {isFormatting ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 md:w-4 md:h-4" />} <span className="hidden lg:inline">Magic Format</span>
           </button>

           <div className="w-px h-5 md:h-6 bg-slate-200 mx-1 md:mx-2 shrink-0"></div>

           <button onClick={handleExportTxt} className="shrink-0 flex items-center gap-1.5 md:gap-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold text-[11px] md:text-[13px] px-2 md:px-4 py-2 md:py-2.5 rounded-xl transition-all cursor-pointer">
             <Download className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden lg:inline">TXT</span>
           </button>
           <button onClick={() => setShowPdfModal(true)} className="shrink-0 flex items-center gap-1.5 md:gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] md:text-[13px] px-3 md:px-5 py-2 md:py-2.5 rounded-xl transition-all shadow-md cursor-pointer">
             <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden sm:inline">PDF</span>
           </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-y-auto px-0 md:px-16 py-0 md:py-8 relative flex justify-center bg-slate-50 border-t border-slate-200 transition-colors duration-500">
        <div className="w-full max-w-[850px] shadow-sm bg-white min-h-[max(calc(100vh-200px),600px)] md:min-h-[max(calc(100vh-200px),800px)] h-auto relative group flex flex-col pt-0 md:pt-2 border-0 md:border md:border-slate-200 rounded-none md:rounded-b-xl overflow-hidden transition-colors duration-500 pb-24">
           <ReactQuill 
             ref={quillRef}
             theme="snow"
             value={content}
             onChange={setContent}
             onChangeSelection={handleSelection}
             modules={quillModules}
             placeholder="Start typing your masterpiece... Highlight text to summon Jot AI's premium tools."
             className="flex-1 flex flex-col border-none w-full"
           />
        </div>
      </div>

      {/* Live Stats Ribbon */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-200 text-[10px] md:text-[12px] font-bold text-slate-500 flex items-center justify-center gap-4 md:gap-8 z-10 transition-all w-[90%] md:w-auto max-w-full overflow-x-auto no-scrollbar whitespace-nowrap">
         <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"></span> <span className="text-slate-700">{wordCount}</span> Words</div>
         <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span> <span className="text-slate-700">{charCount}</span> Chars</div>
         <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span> <span className="text-slate-700">{readTime}</span> Min Read</div>
      </div>

      {/* Override Quill's default borders to match minimalist theme */}
      <style>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 8px 12px !important;
          background: transparent;
        }
        @media (min-width: 768px) {
           .ql-toolbar.ql-snow {
              padding: 12px 24px !important;
           }
        }
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
          font-size: 15px;
        }
        @media (min-width: 768px) {
           .ql-container.ql-snow {
              font-size: 16px;
           }
        }
        .ql-editor {
          min-height: calc(100vh - 150px);
          padding: 16px 20px;
          line-height: 1.7;
          color: inherit;
        }
        .ql-editor.ql-blank::before {
          font-style: italic;
          color: #cbd5e1;
          left: 20px;
        }
        @media (min-width: 768px) {
          .ql-editor {
            min-height: calc(100vh - 200px);
            padding: 24px 48px;
            line-height: 1.8;
          }
          .ql-editor.ql-blank::before {
            left: 48px;
          }
        }
      `}</style>

      {/* PDF EXPORT MODAL */}
      {showPdfModal && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
           <div className="bg-white w-[480px] rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">PDF Settings</h2>
                 <button onClick={() => setShowPdfModal(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="space-y-5 mb-8">
                 <div>
                    <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Typography Style</label>
                    <select 
                      value={pdfSettings.fontFamily} 
                      onChange={(e) => setPdfSettings({...pdfSettings, fontFamily: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium p-3.5 rounded-xl outline-none focus:border-teal-500 cursor-pointer text-[14px]"
                    >
                       <option value="'Inter', sans-serif">Modern & Clean (Inter)</option>
                       <option value="'Merriweather', serif">Classic Academic (Merriweather)</option>
                       <option value="'JetBrains Mono', monospace">Technical (JetBrains Mono)</option>
                    </select>
                 </div>
                 
                 <div className="flex gap-4">
                   <div className="flex-1">
                      <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Font Size</label>
                      <select 
                        value={pdfSettings.fontSize} 
                        onChange={(e) => setPdfSettings({...pdfSettings, fontSize: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium p-3.5 rounded-xl outline-none focus:border-teal-500 cursor-pointer text-[14px]"
                      >
                         <option value="14px">Small (14px)</option>
                         <option value="16px">Normal (16px)</option>
                         <option value="18px">Large (18px)</option>
                         <option value="20px">Extra Large (20px)</option>
                      </select>
                   </div>
                   <div className="flex-1">
                      <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Spacing</label>
                      <select 
                        value={pdfSettings.lineHeight} 
                        onChange={(e) => setPdfSettings({...pdfSettings, lineHeight: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium p-3.5 rounded-xl outline-none focus:border-teal-500 cursor-pointer text-[14px]"
                      >
                         <option value="1.4">Compact (1.4x)</option>
                         <option value="1.6">Comfortable (1.6x)</option>
                         <option value="2.0">Double Spaced (2.0x)</option>
                      </select>
                   </div>
                 </div>

                 <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="incTitle" 
                      checked={pdfSettings.includeTitle}
                      onChange={(e) => setPdfSettings({...pdfSettings, includeTitle: e.target.checked})}
                      className="w-5 h-5 text-teal-600 rounded bg-slate-50 border border-slate-300 focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="incTitle" className="text-[14px] font-bold text-slate-700 cursor-pointer select-none">Include Document Title in PDF File</label>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowPdfModal(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-[14px]">Cancel</button>
                 <button onClick={triggerPdfPrint} className="flex-[2] py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-teal-500/20 cursor-pointer text-[14px] flex items-center justify-center gap-2">
                   <Printer className="w-[18px] h-[18px]" /> Download Custom PDF
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
