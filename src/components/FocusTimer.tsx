import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type TimerMode = 'work' | 'break';

export function FocusTimer({ onClose }: { onClose?: () => void }) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const switchMode = useCallback(() => {
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
    setIsActive(false);
    if (mode === 'work') setSessionsCompleted(s => s + 1);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      switchMode();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, switchMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.4)] w-80 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-1 transition-all duration-1000",
        mode === 'work' ? "bg-emerald-500 shadow-[0_0_20px_#10b981]" : "bg-blue-500 shadow-[0_0_20px_#3b82f6]"
      )} />

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {mode === 'work' ? <Sparkles size={16} className="text-emerald-400" /> : <Coffee size={16} className="text-blue-400" />}
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {mode === 'work' ? 'Deep Work Session' : 'Mental Recharge'}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="relative flex justify-center items-center mb-10">
        {/* Progress Ring Background */}
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={552}
            animate={{ strokeDashoffset: 552 - (552 * progress) / 100 }}
            className={cn(
              "transition-all duration-1000",
              mode === 'work' ? "text-emerald-500" : "text-blue-500"
            )}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-mono font-light text-white tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
            Remaining
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mb-8">
        <button
          onClick={() => setTimeLeft(prev => Math.max(0, prev - 60))}
          className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          -1m
        </button>
        <button
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 scale-100 active:scale-90",
            isActive 
              ? "bg-slate-800 text-white border border-white/10" 
              : "bg-emerald-600 text-white shadow-emerald-900/40 hover:bg-emerald-500"
          )}
        >
          {isActive ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
        </button>
        <button
          onClick={() => setTimeLeft(prev => prev + 60)}
          className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          +1m
        </button>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            {sessionsCompleted}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Blocks Done
          </span>
        </div>
        <button
          onClick={() => {
            setIsActive(false);
            setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
          }}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </motion.div>
  );
}
