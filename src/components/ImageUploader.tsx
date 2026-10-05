import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { SAMPLE_GARMENTS, SampleGarmentPreset } from '../data/samplePresets';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageSelected: (imageDataUrl: string, sampleInfo?: SampleGarmentPreset) => void;
  onOpenCamera: () => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageSelected,
  onOpenCamera,
  isAnalyzing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onImageSelected(event.target.result as string);
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Box / Preview */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden ${
          isDragging
            ? 'border-rose-500 bg-rose-500/10'
            : currentImage
            ? 'border-zinc-700/80 bg-zinc-900/40'
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {currentImage ? (
          <div className="relative group p-3 flex flex-col items-center">
            <div className="relative w-full max-h-72 rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={currentImage}
                alt="Selected reference garment"
                className="w-full h-full object-contain max-h-72"
                referrerPolicy="no-referrer"
              />

              {/* Status pill */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-white flex items-center gap-1.5 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reference Ready</span>
              </div>

              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace
                </button>
                <button
                  onClick={onOpenCamera}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Camera
                </button>
              </div>
            </div>

            <div className="w-full flex items-center justify-between mt-2 px-1 text-xs text-zinc-400">
              <span>Photo &amp; Garments Loaded</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-rose-400 hover:underline"
              >
                Change photo
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mb-4 text-zinc-300 shadow-inner">
              <Upload className="w-6 h-6 text-rose-400" />
            </div>

            <h3 className="text-sm font-semibold text-white mb-1">
              Upload or snap a photo of you in your undergarments base layer
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mb-5">
              Drag and drop your photo, paste from clipboard (Ctrl+V), or take a live photo with framing guides.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <ImageIcon className="w-4 h-4 text-zinc-800" />
                Browse Photo
              </button>

              <button
                onClick={onOpenCamera}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition flex items-center gap-1.5 border border-zinc-700"
              >
                <Camera className="w-4 h-4 text-rose-400" />
                Use Live Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset Demo Garments for Instant 1-Click Testing */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Undergarments Base Layer Silhouettes
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Intimates, Bodysuits &amp; Foundation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_GARMENTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onImageSelected(preset.thumbnailSvg, preset)}
              className="group text-left p-2.5 rounded-xl border border-zinc-800/90 hover:border-rose-500/70 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 hover:bg-zinc-800/90 transition-all duration-200 flex flex-col items-center shadow-sm hover:shadow-md hover:shadow-rose-500/10 cursor-pointer"
            >
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-black mb-2 border border-zinc-800/90 group-hover:border-rose-500/40 transition">
                <img
                  src={preset.thumbnailSvg}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] font-mono text-rose-400 border border-rose-500/20">
                  Undergarment
                </div>
              </div>
              <p className="text-[11px] font-bold text-zinc-100 group-hover:text-rose-300 transition line-clamp-1 w-full text-center">
                {preset.title}
              </p>
              <span className="text-[10px] text-zinc-400 line-clamp-1 w-full text-center font-medium mt-0.5">
                {preset.silhouetteType}
              </span>
              <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                {preset.keyFeatures.slice(0, 2).map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
