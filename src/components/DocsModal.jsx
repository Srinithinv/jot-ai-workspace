import React from 'react';
import { X, FileText, Plus, Trash2, Clock } from 'lucide-react';

const DocsModal = ({ isOpen, onClose, documents, activeDocId, switchDocument, createNewDocument, deleteDocument }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shadow-inner">
                <FileText className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">My Documents</h2>
                <p className="text-[12px] text-slate-500 font-medium">{documents.length} Saved Locally</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 md:p-6 shrink-0 border-b border-slate-100 dark:border-slate-800/50">
           <button onClick={createNewDocument} className="w-full py-4 rounded-xl border-2 border-dashed border-teal-200 dark:border-teal-900/50 text-teal-600 dark:text-teal-400 font-bold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-sm">
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Create New Document
           </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 no-scrollbar bg-slate-50/50 dark:bg-slate-900/20">
           {documents.sort((a, b) => b.updatedAt - a.updatedAt).map(doc => {
              const isActive = doc.id === activeDocId;
              const date = new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              const displayTitle = doc.title.trim() === '' ? 'Untitled Document' : doc.title;
              const wordCount = doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0;
              
              return (
                 <div key={doc.id} onClick={() => switchDocument(doc.id)} className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${isActive ? 'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800 scale-[1.01] shadow-sm' : 'bg-white border-slate-200 hover:border-teal-300 dark:bg-slate-800 dark:border-slate-700 hover:shadow-md'}`}>
                    <div className="flex flex-col gap-1 overflow-hidden pr-4 flex-1">
                       <h3 className={`font-bold text-[15px] truncate max-w-full ${isActive ? 'text-teal-800 dark:text-teal-300' : 'text-slate-700 dark:text-slate-200'}`}>{displayTitle}</h3>
                       <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3" /> {date} • {wordCount} Words
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                       {isActive && <span className="px-2.5 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-[9px] font-black rounded-md tracking-widest uppercase shadow-sm border border-teal-200 dark:border-teal-800">Active</span>}
                       <button onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 md:opacity-0 focus:opacity-100 touch-manipulation cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              );
           })}
        </div>

      </div>
    </div>
  );
};

export default DocsModal;
