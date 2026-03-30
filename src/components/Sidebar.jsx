import React from 'react';
import { Feather, FileText, CheckSquare, Sparkles, ShieldCheck, Zap, AlignLeft, Languages, Maximize, BarChart2, Ghost, BookOpen, Search, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const tools = [
  { id: 'paraphrase', icon: Sparkles, label: 'Paraphraser' },
  { id: 'grammar', icon: CheckSquare, label: 'Grammar Checker' },
  { id: 'plagiarism', icon: ShieldCheck, label: 'Plagiarism Checker' },
  { id: 'humanize', icon: Zap, label: 'AI Humanizer' },
  { id: 'summarize', icon: AlignLeft, label: 'Summarizer' },
  { id: 'translate', icon: Languages, label: 'Translate' },
  { id: 'expander', icon: Maximize, label: 'Content Expander' },
  { id: 'tone', icon: BarChart2, label: 'Tone Detector' },
  { id: 'ghostwriter', icon: Ghost, label: 'Ghostwriter' },
  { id: 'readability', icon: BookOpen, label: 'Readability Analyzer' },
  { id: 'seo', icon: Search, label: 'SEO Optimizer' },
];

const Sidebar = ({ activeTool, setActiveTool }) => {
  return (
    <aside className="w-[240px] bg-[#F9FAFB] border-r border-slate-200 h-full flex flex-col py-6 shrink-0 relative z-10">
      <div className="px-6 mb-8 flex items-center gap-3 cursor-pointer">
        <div className="w-10 h-10 bg-teal-600 rounded-[12px] flex items-center justify-center shadow-lg shadow-teal-600/20">
          <Feather className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-2xl text-slate-800 tracking-tight">Jot AI</span>
      </div>
      
      <nav className="flex flex-col gap-1 w-full px-3 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3 mt-2">Core Tools</div>
        
        {tools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button 
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-3.5 rounded-xl transition-all flex items-center gap-3 w-full text-left cursor-pointer ${isActive ? 'bg-white text-teal-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 border border-transparent'}`}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-semibold'}`}>{tool.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto px-4 w-full border-t border-slate-200 pt-4 pb-4">
        <div className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-100/50 rounded-xl transition-colors flex items-center gap-3 w-full cursor-pointer mb-2">
          <FileText className="w-[18px] h-[18px]" />
          <span className="text-[13px] font-semibold">My Documents</span>
        </div>
        <button onClick={async () => { await signOut(auth); localStorage.removeItem('jot_users'); window.location.href = '/login'; }} className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-3 w-full cursor-pointer">
          <LogOut className="w-[18px] h-[18px]" />
          <span className="text-[13px] font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
