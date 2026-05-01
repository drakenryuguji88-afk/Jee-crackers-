import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatBubble } from './components/ChatBubble';
import { FocusTimer } from './components/FocusTimer';
import { DoubtScanner } from './components/DoubtScanner';
import { sendMessageToSage } from './services/geminiService';
import { ChatMessage } from './types';
import { Send, Sparkles, AlertCircle, RefreshCw, Trash2, BrainCircuit, Timer, Camera, X as XIcon, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "### System Initialized: JEE Sage Mentorship Protocol\n\nGreetings, aspirant. I am **JEE Sage**. \n\nWhether it's a daunting Integral in Calculus, complex Mechanisms in Organic Chemistry, or the intricacies of Rotational Mechanics—my objective is to bridge the gap between information and intuition. \n\n**Mission Status:** Ready to analyze. How shall we proceed with your preparation today?",
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setScannedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleSend = async (image?: string) => {
    const finalContent = input.trim();
    const finalImage = image || scannedImage;

    if (!finalContent && !finalImage) return;
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: finalContent || (finalImage ? "Please analyze this problem for me." : ""),
      timestamp: Date.now(),
      imageUrls: finalImage ? [finalImage] : undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setScannedImage(null);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessageToSage(newMessages);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Sage. Please check your connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear current doubt session?')) {
      setMessages([messages[0]]);
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-300 overflow-hidden font-sans relative">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <Sidebar onFocusToggle={() => setShowFocusTimer(!showFocusTimer)} />

      <main className="flex-1 flex flex-col relative min-w-0 z-10">
        {/* Header - Glass */}
        <header className="h-16 bg-white/[0.02] backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="lg:hidden h-8 w-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 border border-emerald-500/20 mr-2">
              <BrainCircuit size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                JEE Sage <span className="text-[10px] text-emerald-500/80 font-mono tracking-tighter bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">v3.1</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              </h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.15em]">Neural Interface Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowScanner(true)}
              className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3"
              title="Scan Doubt"
            >
              <Camera size={18} />
              <span className="hidden sm:inline">Scanner</span>
            </button>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <button 
              onClick={() => setShowFocusTimer(!showFocusTimer)}
              className={cn(
                "p-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3",
                showFocusTimer 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              <Timer size={18} />
              <span className="hidden sm:inline">Focus Mode</span>
            </button>
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <button 
              onClick={clearChat}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
              title="Terminate Session"
            >
              <Trash2 size={18} />
            </button>
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm flex items-center justify-center text-[9px] font-bold text-blue-400">Ph</div>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm flex items-center justify-center text-[9px] font-bold text-emerald-400">Ch</div>
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm flex items-center justify-center text-[9px] font-bold text-amber-400">Ma</div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence mode="popLayout">
              {messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 max-w-3xl"
                >
                  <QuickPrompt 
                    label="Physics Archive" 
                    text="Give me 3 challenging PYQs on Rotation from JEE Advanced 2020-2024." 
                    onClick={(t) => setInput(t)} 
                  />
                  <QuickPrompt 
                    label="Organic Analysis" 
                    text="Explain the concept of Mesomeric effect with examples." 
                    onClick={(t) => setInput(t)} 
                  />
                  <QuickPrompt 
                    label="Calc Strategy" 
                    text="How should I approach Coordinate Geometry problems to save time?" 
                    onClick={(t) => setInput(t)} 
                  />
                  <QuickPrompt 
                    label="Thermodynamics" 
                    text="I'm stuck on a Thermodynamics problem involving adiabatic expansion..." 
                    onClick={(t) => setInput(t)} 
                  />
                </motion.div>
              )}
              {messages.map((msg) => (
                <ChatBubble key={msg.id} {...msg} />
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-4"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0 mt-1 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <RefreshCw size={14} className="animate-spin" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 bg-emerald-500/50 rounded-full animate-bounce"></div>
                      <div className="h-1.5 w-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-1.5 w-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                    <p className="text-xs font-medium text-emerald-400/80 italic font-mono tracking-widest uppercase">Processing logic nodes...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-400/5 border border-red-400/10 text-red-400 backdrop-blur-md rounded-2xl text-sm max-w-md mx-auto shadow-xl">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            <div ref={messagesEndRef} className="h-8" />
          </div>
        </div>

        {/* Focus Timer Overlay */}
        <AnimatePresence>
          {showFocusTimer && (
            <div className="absolute bottom-32 right-8 z-50">
              <FocusTimer onClose={() => setShowFocusTimer(false)} />
            </div>
          )}
        </AnimatePresence>

        {/* Doubt Scanner Overlay */}
        <AnimatePresence>
          {showScanner && (
            <DoubtScanner 
              onCapture={(img) => setScannedImage(img)} 
              onClose={() => setShowScanner(false)} 
            />
          )}
        </AnimatePresence>

        {/* Input Area - Deep Glass */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[60px] rounded-full -z-10 group-focus-within:bg-emerald-500/10 transition-all duration-1000"></div>
            
            {/* Scanned Image Preview */}
            <AnimatePresence>
              {scannedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute bottom-full mb-4 left-0 p-3 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20 group/preview"
                >
                  <button 
                    onClick={() => setScannedImage(null)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity"
                  >
                    <XIcon size={12} />
                  </button>
                  <img src={scannedImage} alt="Preview" className="h-32 rounded-lg border border-white/5" />
                  <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-center">Problem Captured</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-[#0f172a]/40 border border-white/10 rounded-[24px] shadow-2xl backdrop-blur-2xl p-2.5 flex items-end gap-2 focus-within:ring-1 focus-within:ring-emerald-500/30 focus-within:border-emerald-500/50 transition-all duration-500">
              <div className="flex gap-1 mb-0.5 ml-1">
                <button
                  onClick={() => setShowScanner(true)}
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-white/5 transition-all"
                  title="Scan Doubt with Camera"
                >
                  <Camera size={20} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-white/5 transition-all"
                  title="Upload Image"
                >
                  <ImageIcon size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Query the Sage (e.g., Explain Entropic change...)"
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3.5 px-5 text-sm max-h-48 min-h-[54px] text-white placeholder:text-slate-600 custom-scrollbar leading-relaxed"
                rows={1}
              />
              <div className="flex gap-1 pr-1 pb-1">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 relative overflow-hidden group/btn",
                    (input.trim() || scannedImage) && !isLoading 
                      ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.3)] active:scale-90 hover:shadow-[0_0_30px_rgba(5,150,105,0.5)]" 
                      : "bg-white/5 text-white/10 cursor-not-allowed border border-white/5"
                  )}
                >
                  {(input.trim() || scannedImage) && !isLoading && (
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  )}
                  <Send size={20} className={cn((input.trim() || scannedImage) && !isLoading ? "translate-y-0 opacity-100" : "translate-y-1 opacity-50")}/>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 px-4">
              <div className="flex gap-8">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></div>
                  Socratic Mode
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></div>
                  LaTeX Core
                </span>
              </div>
              <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500/50"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickPrompt({ label, text, onClick }: { label: string, text: string, onClick: (t: string) => void }) {
  return (
    <button 
      onClick={() => onClick(text)}
      className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl text-left hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all duration-500 group relative overflow-hidden backdrop-blur-sm"
    >
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
        <Sparkles size={14} className="text-emerald-400" />
      </div>
      <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-emerald-500/50 rounded-full"></span>
        {label}
      </p>
      <p className="text-[13px] text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed font-medium">{text}</p>
    </button>
  );
}
