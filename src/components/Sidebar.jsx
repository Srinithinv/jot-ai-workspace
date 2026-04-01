import React from 'react';
import { Feather, FileText, CheckSquare, Sparkles, ShieldCheck, Zap, AlignLeft, Languages, Maximize, BarChart2, Ghost, BookOpen, Search, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const tools = [
  { id: 'paraphrase', icon: Sparkles, label: 'Paraphraser' },
  { id: 'grammar', icon: CheckSquare, label: 'Grammar Checker' },
  { id: 'plagiarism', icon: ShieldCheck, label: 'Plagiarism Checker' },
  { id: 'humanize', icon: Ghost, label: 'AI Humanizer' },
  { id: 'summarize', icon: AlignLeft, label: 'Summarizer' },
  { id: 'translate', icon: Languages, label: 'Translator' },
  { id: 'expander', icon: Maximize, label: 'Content Expander' },
  { id: 'tone', icon: BarChart2, label: 'Tone Detector' },
  { id: 'ghostwriter', icon: Zap, label: 'Ghostwriter' },
  { id: 'readability', icon: BookOpen, label: 'Readability Analyzer' },
  { id: 'seo', icon: Search, label: 'SEO Optimizer' },
];

const Sidebar = ({ activeTool, setActiveTool, setIsDocsOpen }) => {
  return (
    <aside className="fixed bottom-0 left-0 w-full h-[85px] md:h-screen md:w-[72px] lg:w-[260px] md:static bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-col items-center lg:items-start px-0 md:px-0 py-0 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-none shrink-0 transition-all duration-500 overflow-hidden">
      
      {/* Desktop Logo Area */}
      <div className="hidden md:flex flex-col lg:flex-row items-center lg:justify-start gap-4 pt-6 mb-8 cursor-pointer w-full lg:px-6 shrink-0">
        <div className="w-10 h-10 shrink-0 bg-teal-600 rounded-[12px] flex items-center justify-center shadow-lg shadow-teal-600/20">
          <Feather className="text-white w-5 h-5" />
        </div>
        <span className="font-extrabold text-[22px] text-slate-800 tracking-tight leading-none hidden lg:block">Jot AI</span>
      </div>

      {/* Unified Universal Touch-Scroll Container */}
      <div className="w-full md:w-auto lg:w-full flex-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto no-scrollbar scroll-smooth px-2 lg:px-4 items-center md:items-stretch py-2 md:py-0">
        
        {/* 11 Main Tools */}
        <nav className="flex flex-row md:flex-col gap-2 md:gap-1.5 w-max md:w-full items-center md:items-stretch h-full md:h-auto shrink-0">
          {tools.map(tool => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`relative flex flex-col md:flex-row items-center md:justify-center lg:justify-start w-[72px] h-[64px] md:w-14 md:h-14 lg:w-full lg:h-[46px] shrink-0 rounded-2xl md:rounded-xl lg:px-4 group transition-all duration-300 cursor-pointer border md:border-transparent ${
                  isActive 
                  ? 'bg-teal-50 border-teal-100 text-teal-600 md:shadow-[0_4px_20px_-5px_rgba(13,148,136,0.2)] md:scale-105 z-10' 
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/50 hover:border-slate-200'
                }`}
              >
                <Icon className="w-[22px] h-[22px] md:w-6 md:h-6 lg:w-5 lg:h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Mobile text below icon */}
                <span className={`text-[10px] sm:text-[11px] font-bold mt-1.5 md:hidden leading-none tracking-tight break-words px-1 max-w-full truncate ${isActive ? 'text-teal-700' : 'text-slate-500'}`}>
                  {tool.label.split(' ')[0]}
                </span>

                {/* Desktop Expanded text next to icon */}
                <span className={`hidden lg:block ml-3.5 text-[13px] font-bold whitespace-nowrap tracking-wide ${isActive ? 'text-teal-700' : 'text-slate-600 group-hover:text-slate-800'}`}>
                  {tool.label}
                </span>

                {/* Tablet Hover Tooltip */}
                <span className="hidden md:block lg:hidden absolute left-[68px] px-3 py-1.5 bg-slate-800 text-white text-[12px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {tool.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Separator (Vertical on Mobile, Horizontal on Desktop) */}
        <div className="w-[1px] h-10 md:w-full md:h-[1px] bg-slate-200 shrink-0 mx-3 md:mx-0 md:my-4 lg:mb-4 lg:mt-auto"></div>

        {/* Docs & Logout Commands */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-1.5 w-max md:w-full shrink-0 pr-4 md:pr-0 md:pb-6">
          <div onClick={() => setIsDocsOpen(true)} className="w-[72px] h-[64px] md:w-12 md:h-12 lg:w-full lg:h-[46px] md:mx-auto lg:mx-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100/50 rounded-2xl md:rounded-xl transition-colors flex flex-col md:flex-row items-center justify-center lg:justify-start lg:px-4 cursor-pointer group relative shrink-0">
            <FileText className="w-[22px] h-[22px] md:w-5 md:h-5 shrink-0" />
            <span className="text-[10px] md:hidden mt-1.5 font-bold">Docs</span>
            <span className="hidden lg:block ml-3.5 text-[13px] font-bold whitespace-nowrap tracking-wide">My Documents</span>
            <span className="absolute left-[68px] px-3 py-1.5 bg-slate-800 text-white text-[12px] font-bold rounded-lg shadow-xl opacity-0 hidden md:block lg:hidden group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">My Docs</span>
          </div>
          
          <button onClick={async () => { await signOut(auth); localStorage.removeItem('jot_users'); window.location.href = '/login'; }} className="w-[72px] h-[64px] md:w-12 md:h-12 lg:w-full lg:h-[46px] md:mx-auto lg:mx-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl md:rounded-xl transition-colors flex flex-col md:flex-row items-center justify-center lg:justify-start lg:px-4 cursor-pointer group relative shrink-0">
            <LogOut className="w-[22px] h-[22px] md:w-5 md:h-5 shrink-0" />
            <span className="text-[10px] md:hidden mt-1.5 font-bold">Logout</span>
            <span className="hidden lg:block ml-3.5 text-[13px] font-bold whitespace-nowrap tracking-wide text-rose-500">Logout</span>
            <span className="absolute left-[68px] px-3 py-1.5 bg-slate-800 text-white text-[12px] font-bold rounded-lg shadow-xl opacity-0 hidden md:block lg:hidden group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Logout</span>
          </button>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
