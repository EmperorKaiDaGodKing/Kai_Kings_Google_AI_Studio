import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCcw, Sparkles, AlertCircle, Timer } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<number>(0); // 0 = instant, 3 = 3s, 5 = 5s
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setError(null);
    stopCamera();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings.'
          : 'Could not access camera. Please check your camera connection or upload an image instead.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const playShutterSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio context may not be allowed without user interaction
    }
  };

  const executeCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front facing for mirror effect
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setIsFlashing(true);
    playShutterSound();
    setTimeout(() => setIsFlashing(false), 200);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    stopCamera();
    onCapture(dataUrl);
    onClose();
  };

  const handleCaptureClick = () => {
    if (selectedTimer > 0) {
      setCountdown(selectedTimer);
      const timerInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerInterval);
            executeCapture();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      executeCapture();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-semibold text-white">Capture Garment &amp; Portrait</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative bg-black aspect-[3/4] sm:aspect-[4/3] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-sm">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <p className="text-sm text-zinc-300 font-medium">{error}</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Garment & Portrait Framing Overlay */}
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/20 m-6 rounded-2xl flex flex-col items-center justify-between p-4">
                <div className="text-[11px] text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                  Align Face &amp; Garments Inside Guide
                </div>

                {/* Head oval guide */}
                <div className="w-36 h-48 border border-white/40 rounded-[50%] mt-4 shadow-sm" />

                {/* Garment / Torso guide indicator */}
                <div className="w-64 h-44 border-t border-dashed border-rose-400/50 flex flex-col items-center justify-center mt-auto">
                  <span className="text-[10px] text-rose-300/80 bg-rose-950/60 px-2 py-0.5 rounded font-mono">
                    Garment &amp; Collar Zone
                  </span>
                </div>
              </div>

              {/* Visual Flash effect */}
              {isFlashing && <div className="absolute inset-0 bg-white transition-opacity duration-200" />}

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                  <div className="w-24 h-24 rounded-full bg-rose-500 text-white flex items-center justify-center text-5xl font-black shadow-2xl animate-ping">
                    {countdown}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Hidden Canvas for capture rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Controls Bar */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
          {/* Timer toggle */}
          <div className="flex items-center space-x-1">
            <Timer className="w-4 h-4 text-zinc-400 mr-1" />
            {[0, 3, 5].map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedTimer(sec)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  selectedTimer === sec
                    ? 'bg-rose-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {sec === 0 ? 'Off' : `${sec}s`}
              </button>
            ))}
          </div>

          {/* Shutter Capture Button */}
          <button
            onClick={handleCaptureClick}
            disabled={!!error || countdown !== null}
            className="w-16 h-16 rounded-full border-4 border-white/80 p-1 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:scale-100"
          >
            <div className="w-full h-full bg-rose-500 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Flip camera switch */}
          <button
            onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center space-x-1.5 text-xs"
            title="Switch front/back camera"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Flip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
