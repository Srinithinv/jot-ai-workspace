import React from 'react';
import { Feather, FileText, CheckSquare, Sparkles, ShieldCheck, Zap, AlignLeft, Languages, Maximize, BarChart2, Ghost, BookOpen, Search, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const tools = [
  { id: 'paraphrase', icon: Sparkles, label: 'Paraphraser' },
  { id: 'grammar', icon: CheckSquare, label: 'Grammar Checker' },
  { id: 'plagiarism', icon: ShieldCheck, label: 'Plagiarism Checker' },
  { id: 'humanizer', icon: Ghost, label: 'AI Humanizer' },
  { id: 'summarize', icon: AlignLeft, label: 'Summarizer' },
  { id: 'translate', icon: Languages, label: 'Translator' },
  { id: 'expand', icon: Maximize, label: 'Content Expander' },
  { id: 'tone', icon: BarChart2, label: 'Tone Detector' },
  { id: 'ghostwriter', icon: Zap, label: 'Ghostwriter' },
  { id: 'readability', icon: BookOpen, label: 'Readability Analyzer' },
  { id: 'seo', icon: Search, label: 'SEO Optimizer' },
];

const Sidebar = ({ activeTool, setActiveTool }) => {
  return (
    <aside className="fixed bottom-0 left-0 w-full h-[72px] md:h-screen md:w-[72px] md:static bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col items-center px-1 md:px-0 py-0 md:py-6 z-40 overflow-x-auto no-scrollbar shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-none shrink-0 transition-colors duration-500">
      
      {/* Desktop Logo */}
      <div className="hidden md:flex flex-col items-center gap-3 mb-8 cursor-pointer">
        <div className="w-10 h-10 bg-teal-600 rounded-[12px] flex items-center justify-center shadow-lg shadow-teal-600/20">
          <Feather className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-2xl text-slate-800 tracking-tight leading-none text-center">Jot AI</span>
      </div>
      
      <nav className="flex flex-row md:flex-col gap-1 w-max md:w-full px-2 md:px-3 flex-1 items-center md:overflow-y-auto md:overflow-x-hidden pt-1 md:pt-0 pb-1 md:pb-0 no-scrollbar">
        {tools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl group transition-all duration-300 cursor-pointer border ${
                isActive 
                ? 'bg-teal-50 border-teal-100 text-teal-600 shadow-[0_4px_20px_-5px_rgba(13,148,136,0.3)] scale-[1.02] md:scale-105 z-10' 
                : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/50 hover:border-slate-200'
              }`}
            >
              <Icon className={`${isActive ? 'w-5 h-5 md:w-6 md:h-6' : 'w-5 h-5 md:w-6 md:h-6 opacity-75'}`} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Desktop Hover Label */}
              <span className="absolute left-16 px-3 py-1.5 bg-slate-800 text-white text-[12px] font-bold rounded-lg shadow-xl opacity-0 hidden md:block group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {tool.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Bottom Actions / Mobile Scroll End Actions */}
      <div className="flex flex-row md:flex-col items-center mt-0 md:mt-auto px-2 md:px-4 w-max md:w-full border-l md:border-l-0 md:border-t border-slate-200 py-0 md:pt-4 md:pb-4 gap-1 md:gap-0 shrink-0 h-full md:h-auto">
        <div className="w-12 h-12 md:w-12 md:h-12 md:mx-auto text-slate-400 hover:text-slate-700 hover:bg-slate-100/50 rounded-xl transition-colors flex items-center justify-center cursor-pointer group relative md:mb-2 shrink-0">
          <FileText className="w-5 h-5 md:w-5 md:h-5" />
          <span className="absolute left-16 px-3 py-1.5 bg-slate-800 text-white text-[12px] font-bold rounded-lg shadow-xl opacity-0 hidden md:block group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">My Docs</span>
        </div>
        <button onClick={async () => { await signOut(auth); localStorage.removeItem('jot_users'); window.location.href = '/login'; }} className="w-12 h-12 md:w-12 md:h-12 md:mx-auto text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center cursor-pointer group relative shrink-0">
          <LogOut className="w-5 h-5 md:w-5 md:h-5" />
          <span className="absolute left-16 px-3 py-1.5 bg-slate-800 text-white text-[12px] font-bold rounded-lg shadow-xl opacity-0 hidden md:block group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
