import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Shirt,
  Image as ImageIcon,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  animeImage: string;
  stylePreset: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  originalImage,
  animeImage,
  stylePreset,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  if (!isOpen) return null;

  // Download High-Res Anime Image
  const downloadAnimeOnly = () => {
    const link = document.createElement('a');
    link.href = animeImage;
    link.download = `anime-garment-art-${stylePreset.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.click();
  };

  // Copy Anime Image to Clipboard
  const copyToClipboard = async () => {
    try {
      const response = await fetch(animeImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy data URL
      await navigator.clipboard.writeText(animeImage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate Side-by-Side Branded Comparison Card via HTML Canvas
  const downloadComparisonCard = async () => {
    setIsGeneratingCard(true);
    try {
      const canvas = document.createElement('canvas');
      const width = 1600;
      const height = 1000;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark studio background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Subtle gradient highlight
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#18181b');
      grad.addColorStop(0.5, '#09090b');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Header Bar
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('ANIME GARMENT & IDENTITY STUDIO', 60, 80);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '20px sans-serif';
      ctx.fillText(`Aesthetic: ${stylePreset} Anime | 100% Garment & Feature Fidelity`, 60, 115);

      // Helper to load image
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      const [img1, img2] = await Promise.all([loadImage(originalImage), loadImage(animeImage)]);

      // Draw original photo on left
      const cardW = 690;
      const cardH = 750;
      const cardY = 160;

      // Card 1
      ctx.drawImage(img1, 60, cardY, cardW, cardH);
      // Overlay pill on Card 1
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(80, cardY + 20, 260, 42);
      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('ORIGINAL GARMENT', 100, cardY + 48);

      // Card 2
      ctx.drawImage(img2, 850, cardY, cardW, cardH);
      // Overlay pill on Card 2
      ctx.fillStyle = 'rgba(225, 29, 72, 0.85)';
      ctx.fillRect(870, cardY + 20, 310, 42);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('IDENTICAL ANIME ART', 890, cardY + 48);

      // Footer signature
      ctx.fillStyle = '#71717a';
      ctx.font = '16px monospace';
      ctx.fillText('POWERED BY GEMINI 3.1 FLASH IMAGE & GEMINI 3.8 FLASH', 60, height - 35);

      // Trigger download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `garment-anime-comparison-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to generate card:', err);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Export &amp; Share Artwork</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Preview Thumbnail */}
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black border border-zinc-800 relative">
            <img
              src={animeImage}
              alt="Anime Artwork"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] text-zinc-300 font-mono">
              {stylePreset} Style
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Download Anime Art */}
            <button
              onClick={downloadAnimeOnly}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
            >
              <Download className="w-4 h-4" />
              Download High-Res Anime Art (PNG)
            </button>

            {/* Download Side-by-Side Comparison Card */}
            <button
              onClick={downloadComparisonCard}
              disabled={isGeneratingCard}
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition flex items-center justify-center gap-2 border border-zinc-700"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              {isGeneratingCard ? 'Generating Card...' : 'Download Side-by-Side Comparison Card'}
            </button>

            {/* Copy to Clipboard */}
            <button
              onClick={copyToClipboard}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition flex items-center justify-center gap-2 border border-zinc-800"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
