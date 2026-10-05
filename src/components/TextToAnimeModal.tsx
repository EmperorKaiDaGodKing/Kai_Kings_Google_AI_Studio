import React, { useState } from 'react';
import { X, Wand2, Sparkles, Loader2, Download, AlertCircle } from 'lucide-react';
import { ANIME_STYLES } from '../data/samplePresets';

interface TextToAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseAsReference?: (imageUrl: string) => void;
}

export const TextToAnimeModal: React.FC<TextToAnimeModalProps> = ({
  isOpen,
  onClose,
  onUseAsReference,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [stylePreset, setStylePreset] = useState<string>('Makoto Shinkai');
  const [aspectRatio, setAspectRatio] = useState<string>('3:4');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/create-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          stylePreset,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create anime image');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating anime image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `anime-created-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Create Anime Art from Text Prompt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Garment &amp; Character Prompt
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe character garments and setting, e.g.: 'A fashionable protagonist wearing a customized black varsity jacket with white leather sleeves and embroidery, standing under neon lanterns in Akihabara'..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition resize-none"
              />
            </div>

            {/* Style Selector Chips */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Anime Studio Aesthetic
              </label>
              <div className="flex flex-wrap gap-2">
                {ANIME_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setStylePreset(style.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      stylePreset === style.name
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Aspect Ratio</label>
              <div className="flex gap-2">
                {['3:4', '1:1', '9:16', '16:9'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border transition ${
                      aspectRatio === ratio
                        ? 'bg-zinc-100 text-zinc-900 border-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:opacity-95 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Anime Illustration (gemini-3.1-flash-image-preview)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Anime Artwork</span>
                </>
              )}
            </button>
          </form>

          {/* Generated Result Display */}
          {generatedImage && (
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Created Anime Art
              </span>
              <div className="relative aspect-[3/4] max-h-96 rounded-xl overflow-hidden bg-black border border-zinc-800 mx-auto">
                <img
                  src={generatedImage}
                  alt="Created Anime Art"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-zinc-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Artwork
                </button>
                {onUseAsReference && (
                  <button
                    onClick={() => {
                      onUseAsReference(generatedImage);
                      onClose();
                    }}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    Use in Garment Studio
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
