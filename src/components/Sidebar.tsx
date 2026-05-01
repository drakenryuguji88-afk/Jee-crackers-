import { BookOpen, Target, Sparkles, MessageSquare, History, Trophy, GraduationCap, Timer } from 'lucide-react';
import { cn } from '../lib/utils';
import React from 'react';
import { motion } from 'motion/react';

const SYLLABUS = [
  { subject: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'] },
  { subject: 'Chemistry', topics: ['Physical', 'Organic', 'Inorganic'] },
  { subject: 'Mathematics', topics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry'] },
];

export function Sidebar({ onFocusToggle }: { onFocusToggle?: () => void }) {
  return (
    <div className="w-72 bg-white/[0.01] backdrop-blur-3xl border-r border-white/5 h-screen flex flex-col shrink-0 overflow-y-auto hidden lg:flex relative z-20">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl leading-tight text-white tracking-tight">JEE Sage</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Elite Phase</p>
            </div>
          </div>
        </div>

        <nav className="space-y-10">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 px-4 block mb-5">Interface</label>
            <div className="space-y-1.5">
              <NavItem icon={<MessageSquare size={18} />} label="Mentorship" active />
              <button 
                onClick={onFocusToggle}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-slate-500 hover:text-slate-300 group"
              >
                <Timer size={18} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                Focus Mode
              </button>
              <NavItem icon={<History size={18} />} label="Session History" />
              <NavItem icon={<Target size={18} />} label="PYQ Vault" />
              <NavItem icon={<Trophy size={18} />} label="Rank Tracker" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 px-4 block mb-5">Syllabus Matrix</label>
            <div className="space-y-6">
              {SYLLABUS.map((sub) => (
                <div key={sub.subject} className="px-4">
                  <h3 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2.5">
                    <div className="h-1 w-1 bg-emerald-500/50 rounded-full"></div>
                    {sub.subject}
                  </h3>
                  <ul className="space-y-3 ml-1 border-l border-white/5">
                    {sub.topics.map(topic => (
                      <li key={topic} className="text-[11px] text-slate-500 hover:text-emerald-400 cursor-pointer py-0.5 px-5 transition-all duration-300 relative group font-medium">
                        <span className="absolute left-[-1px] top-1/2 -translate-y-1/2 h-0 w-[2px] bg-emerald-500 transition-all duration-300 group-hover:h-3"></span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>
      
      <div className="mt-auto p-8 border-t border-white/5 bg-white/[0.01]">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 blur-2xl -mr-8 -mt-8 rounded-full transition-all group-hover:bg-emerald-500/10"></div>
          <h4 className="text-[10px] font-bold text-slate-500 flex items-center gap-2 mb-3 uppercase tracking-widest relative">
            <Sparkles size={12} className="text-emerald-500" />
            Sage Principle
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium relative">
            "First principles are the only immovable truth. Derivation is worship."
          </p>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative",
      active 
        ? "text-white font-medium" 
        : "text-slate-500 hover:text-slate-300"
    )}>
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="absolute inset-0 bg-white/5 border-l-2 border-emerald-500 rounded-lg -z-10" 
        />
      )}
      <span className={cn(
        "transition-colors",
        active ? "text-emerald-400" : "text-slate-600 group-hover:text-slate-400"
      )}>
        {icon}
      </span>
      {label}
    </button>
  );
}
