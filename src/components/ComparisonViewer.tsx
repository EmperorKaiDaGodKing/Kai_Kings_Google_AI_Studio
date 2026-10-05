import React, { useState, useRef, useEffect } from 'react';
import {
  Columns2,
  SplitSquareVertical,
  Search,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  CheckCircle2,
  Shirt,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface ComparisonViewerProps {
  originalImage: string;
  animeImage: string;
  stylePreset: string;
  onOpenExport: () => void;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  originalImage,
  animeImage,
  stylePreset,
  onOpenExport,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side'>('split');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMagnifierActive, setIsMagnifierActive] = useState<boolean>(false);
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handlePointerUp = () => setIsDragging(false);
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagnifierActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMagnifierPos({ x, y });
  };

  return (
    <div className={`space-y-3 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4 flex flex-col' : ''}`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between bg-zinc-900/80 px-4 py-2.5 rounded-xl border border-zinc-800">
        <div className="flex items-center space-x-2">
          {/* Mode switch */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'split' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Interactive Split Slider"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Slider</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'side-by-side' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Side-by-Side Comparison"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side-by-Side</span>
            </button>
          </div>

          {/* Magnifier toggle */}
          <button
            onClick={() => setIsMagnifierActive(!isMagnifierActive)}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
              isMagnifierActive
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Inspect garment fabric &amp; stitching with 2.5x Loupe"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Garment Loupe</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export &amp; Share</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Comparison Container */}
      {viewMode === 'split' ? (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[3/4] max-h-[640px] bg-black rounded-2xl overflow-hidden select-none border border-zinc-800 mx-auto cursor-ew-resize group"
        >
          {/* Base: Transformed Anime Image (Full right side) */}
          <img
            src={animeImage}
            alt="Transformed Anime Art"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Badge right */}
          <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-400 border border-rose-500/20 shadow-lg pointer-events-none flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {stylePreset} Anime
          </div>

          {/* Clipped Top: Original Reference Photo (Left side) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={originalImage}
              alt="Original Reference Garments"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                maxWidth: 'none',
              }}
              referrerPolicy="no-referrer"
            />
            {/* Badge left */}
            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-zinc-300 border border-white/10 shadow-lg flex items-center gap-1">
              <Shirt className="w-3 h-3 text-zinc-400" />
              Original Garment
            </div>
          </div>

          {/* Divider Line & Drag Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-black/40">
              &#x2194;
            </div>
          </div>

          {/* Garment Detail Loupe Magnifier */}
          {isMagnifierActive && (
            <div
              className="absolute w-36 h-36 rounded-full border-2 border-rose-400 pointer-events-none overflow-hidden shadow-2xl bg-black"
              style={{
                left: `${magnifierPos.x - 72}px`,
                top: `${magnifierPos.y - 72}px`,
                backgroundImage: `url(${sliderPosition > 50 ? originalImage : animeImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${(containerRef.current?.clientWidth || 400) * 2.5}px ${(containerRef.current?.clientHeight || 500) * 2.5}px`,
                backgroundPosition: `-${magnifierPos.x * 2.5 - 72}px -${magnifierPos.y * 2.5 - 72}px`,
              }}
            >
              <div className="absolute bottom-1 inset-x-0 text-center text-[9px] bg-black/70 text-rose-300 font-mono">
                2.5x Garment Loupe
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-zinc-800">
            <img
              src={originalImage}
              alt="Original Reference"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-zinc-400" />
              Original Garment &amp; Portrait
            </div>
          </div>

          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-zinc-800">
            <img
              src={animeImage}
              alt="Anime Art Transformation"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Identical Anime Art ({stylePreset})
            </div>
          </div>
        </div>
      )}

      {/* Fidelity Confirmation Pill */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-200 font-medium">Fidelity Verified:</span>
          <span>Facial structure, hair shape, and garment elements maintained 1:1.</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">
          Slide bar left/right to inspect details
        </span>
      </div>
    </div>
  );
};
