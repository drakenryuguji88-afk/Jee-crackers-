import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface DoubtScannerProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function DoubtScanner({ onCapture, onClose }: DoubtScannerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Use video.videoWidth or a fallback if it's not yet ready
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
    >
      <div className="bg-[#0f172a] border border-white/10 rounded-[32px] overflow-hidden max-w-2xl w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 bg-black/20 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Camera size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">Doubt Scanner</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Image Analysis Protocol</p>
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-white/5 shadow-inner group">
            {!capturedImage ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm mb-4">
                      {error}
                    </div>
                    <label className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer">
                      <ImageIcon size={20} />
                      <span>Upload from Device</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                )}
                {!error && (
                  <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-2xl pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-xl translate-x-4 translate-y-4"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-xl -translate-x-4 translate-y-4"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-xl translate-x-4 -translate-y-4"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-xl -translate-x-4 -translate-y-4"></div>
                    
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] opacity-0 group-hover:opacity-40 transition-opacity"></div>
                  </div>
                )}
              </>
            ) : (
              <img src={capturedImage} className="w-full h-full object-contain bg-slate-950" alt="Captured doubt" />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            {!capturedImage ? (
              <>
                <label className="p-4 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                  <ImageIcon size={24} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                <button 
                  onClick={capture}
                  disabled={!!error}
                  className="h-20 w-20 rounded-full bg-white border-8 border-white/10 flex items-center justify-center text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-90 transition-all disabled:opacity-50"
                  title="Capture Doubt"
                >
                  <div className="h-10 w-10 rounded-full border-2 border-slate-900"></div>
                </button>
                <div className="w-14"></div> {/* Spacer to keep capture centered */}
              </>
            ) : (
              <>
                <button 
                  onClick={retake}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-all"
                >
                  <RefreshCw size={18} />
                  <span>Retake</span>
                </button>
                <button 
                  onClick={confirm}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/40 active:scale-95 transition-all font-bold tracking-widest uppercase text-xs"
                >
                  <Check size={18} />
                  <span>Analyze Problem</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
