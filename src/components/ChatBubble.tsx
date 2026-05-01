import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { User, GraduationCap } from 'lucide-react';

interface ChatBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  imageUrls?: string[];
}

export function ChatBubble({ content, role, imageUrls }: ChatBubbleProps) {
  const isAssistant = role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-6",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "flex max-w-[90%] sm:max-w-[75%] gap-3",
        !isAssistant && "flex-row-reverse"
      )}>
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-1 sm:mt-0 transition-all",
          isAssistant 
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
            : "bg-slate-800 text-slate-400 border border-slate-700"
        )}>
          {isAssistant ? <GraduationCap size={16} /> : <User size={16} />}
        </div>
        
        <div className={cn(
          "rounded-2xl px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500",
          isAssistant 
            ? "bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden" 
            : "bg-emerald-600/20 border border-emerald-500/20 text-white backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        )}>
          {isAssistant && (
            <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 rounded-full -z-10"></div>
          )}
          
          {imageUrls && imageUrls.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative group/img overflow-hidden rounded-xl border border-white/10 max-w-full shadow-2xl">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in">
                    <img 
                      src={url} 
                      alt={`User doubt ${idx}`} 
                      className="max-h-[500px] w-auto rounded-xl object-contain bg-black/20 transition-transform duration-500 group-hover/img:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                  </a>
                  <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/50 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-md uppercase tracking-widest font-bold">
                    Click to Open
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={cn(
            "markdown-body max-w-none text-[15px] sm:text-base selection:bg-emerald-500/40 leading-relaxed",
            !isAssistant && "text-slate-200"
          )}>
            <ReactMarkdown 
              remarkPlugins={[remarkMath]} 
              rehypePlugins={[rehypeKatex]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
