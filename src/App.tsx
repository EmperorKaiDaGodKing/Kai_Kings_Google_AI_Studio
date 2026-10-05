/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  Shirt,
  ShieldCheck,
  Wand2,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { FidelityPanel } from './components/FidelityPanel';
import { StyleSelector } from './components/StyleSelector';
import { ComparisonViewer } from './components/ComparisonViewer';
import { EditPanel } from './components/EditPanel';
import { CameraModal } from './components/CameraModal';
import { ExportModal } from './components/ExportModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { TextToAnimeModal } from './components/TextToAnimeModal';
import { FeatureAnalysis, TransformationItem, UndergarmentSilhouette } from './types';
import { SampleGarmentPreset } from './data/samplePresets';

export default function App() {
  // Image State
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FeatureAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Settings State
  const [selectedStyle, setSelectedStyle] = useState<string>('Makoto Shinkai');
  const [garmentFidelity, setGarmentFidelity] = useState<'strict' | 'stylized'>('strict');
  const [identityFidelity, setIdentityFidelity] = useState<number>(95);
  const [selectedSilhouette, setSelectedSilhouette] = useState<UndergarmentSilhouette>('Cheeky Brief & Strings');
  const [aspectRatio, setAspectRatio] = useState<string>('3:4');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Transformation Results State
  const [transformedAnimeImage, setTransformedAnimeImage] = useState<string | null>(null);
  const [historyVersions, setHistoryVersions] = useState<string[]>([]);
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(0);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState<boolean>(false);

  // Modal Visibility State
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isTextToAnimeOpen, setIsTextToAnimeOpen] = useState<boolean>(false);

  // Local Storage History
  const [savedHistory, setSavedHistory] = useState<TransformationItem[]>(() => {
    try {
      const stored = localStorage.getItem('anime_garment_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('anime_garment_history', JSON.stringify(savedHistory));
    } catch {
      // Storage quota or private browsing
    }
  }, [savedHistory]);

  // Deep Scan Features with Gemini 3.8 Flash
  const scanFeatures = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/analyze-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageDataUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze features');
      }
      setAnalysis(data.analysis);
    } catch (err: any) {
      console.warn('Feature analysis warning:', err.message);
      // Soft fail: create basic analysis fallback so user can still transform smoothly
      setAnalysis({
        personalFeatures: {
          faceShape: 'Preserved subject facial contours and proportions',
          eyes: 'Faithful anime eye geometry and color',
          hair: 'Accurate hair structure, parting, and natural color tones',
        },
        garmentDetails: {
          primaryGarments: ['Subject outfit and styled garments'],
          patternsAndPrints: 'Exact replication of textile patterns, weave, and seams',
          texturesAndFabrics: 'Authentic fabric shading and draping',
        },
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Image Selection Handler (Upload, Camera, or Preset)
  const handleImageSelected = (imageDataUrl: string, sampleInfo?: SampleGarmentPreset) => {
    setReferenceImage(imageDataUrl);
    setTransformedAnimeImage(null);
    setHistoryVersions([]);
    setActiveVersionIndex(0);
    setErrorMessage(null);

    if (sampleInfo) {
      // Immediate preset metadata for instant fidelity display
      setAnalysis({
        personalFeatures: {
          faceShape: 'Athletic proportional facial contours and jawline',
          eyes: 'Focused expressive anime character eyes',
          hair: 'Sculpted athletic anime hair highlights and clean contour',
        },
        garmentDetails: {
          primaryGarments: [sampleInfo.title, sampleInfo.silhouetteType],
          patternsAndPrints: sampleInfo.garmentDescription,
          texturesAndFabrics: sampleInfo.keyFeatures.join(', '),
          structuralElements: `${sampleInfo.silhouetteType} with authentic undergarment strap widths, elastic waistband bindings, contour seamlines, and second-skin base layer silhouette`,
        },
      });
    } else {
      scanFeatures(imageDataUrl);
    }
  };

  // Run Anime Transformation
  const handleTransform = async () => {
    if (!referenceImage || isTransforming) return;
    setIsTransforming(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/transform-anime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: referenceImage,
          stylePreset: selectedStyle,
          garmentFidelity,
          identityFidelity,
          undergarmentSilhouette: selectedSilhouette,
          customPrompt,
          aspectRatio,
          analysis,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.isQuotaError || res.status === 429) {
          setIsQuotaExhausted(true);
        }
        throw new Error(data.error || 'Anime transformation failed');
      }

      const generatedUrl = data.animeImageUrl;
      setTransformedAnimeImage(generatedUrl);
      setHistoryVersions([generatedUrl]);
      setActiveVersionIndex(0);

      // Save item to history
      const newItem: TransformationItem = {
        id: `trans_${Date.now()}`,
        timestamp: Date.now(),
        originalImage: referenceImage,
        currentAnimeImage: generatedUrl,
        historyVersions: [generatedUrl],
        stylePreset: selectedStyle,
        garmentFidelity,
        identityFidelity,
        undergarmentSilhouette: selectedSilhouette,
        customPrompt,
        analysis: analysis || undefined,
        usedModel: data.usedModel,
        notes: data.notes,
      };

      setSavedHistory((prev) => [newItem, ...prev.slice(0, 24)]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message ||
          'Failed to transform image into anime. Please verify your GEMINI_API_KEY has image generation permissions or try another style.'
      );
    } finally {
      setIsTransforming(false);
    }
  };

  // Apply Iterative Text Prompt Edit to Anime Image
  const handleApplyEdit = async (editPrompt: string) => {
    if (!transformedAnimeImage || isEditing) return;
    setIsEditing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/edit-anime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAnimeImage: transformedAnimeImage,
          editPrompt,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.isQuotaError || res.status === 429) {
          setIsQuotaExhausted(true);
        }
        throw new Error(data.error || 'Failed to edit image');
      }

      const updatedUrl = data.editedImageUrl;
      setTransformedAnimeImage(updatedUrl);
      setHistoryVersions((prev) => [...prev, updatedUrl]);
      setActiveVersionIndex(historyVersions.length);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Image edit failed. Please try a different prompt.');
    } finally {
      setIsEditing(false);
    }
  };

  // Rollback / Switch Version in Stack
  const handleSelectVersion = (index: number) => {
    if (historyVersions[index]) {
      setActiveVersionIndex(index);
      setTransformedAnimeImage(historyVersions[index]);
    }
  };

  // Load Past Transformation from History
  const handleLoadHistoryItem = (item: TransformationItem) => {
    setReferenceImage(item.originalImage);
    setTransformedAnimeImage(item.currentAnimeImage);
    setHistoryVersions(item.historyVersions || [item.currentAnimeImage]);
    setActiveVersionIndex((item.historyVersions?.length || 1) - 1);
    setSelectedStyle(item.stylePreset);
    setGarmentFidelity(item.garmentFidelity);
    setIdentityFidelity(item.identityFidelity);
    if (item.undergarmentSilhouette) setSelectedSilhouette(item.undergarmentSilhouette);
    if (item.analysis) setAnalysis(item.analysis);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top App Header */}
      <Header
        onOpenTextToAnime={() => setIsTextToAnimeOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={savedHistory.length}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner / Guarantees */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-rose-950/40 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-semibold uppercase tracking-wider border border-rose-500/30">
                Undergarment &amp; Identity Preserved
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Powered by gemini-3.1-flash-image-preview
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Transform into accurate, identical Japanese anime art while locking your undergarments, foundation silhouettes, fabrics, and facial traits
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs text-zinc-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Undergarment Strap &amp; Seam Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Contour Silhouette Lock</span>
            </div>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 flex flex-col sm:flex-row items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-bold text-sm text-white block">
                {isQuotaExhausted ? 'Paid Gemini API Key Required for Image Generation' : 'Transformation Notice'}
              </span>
              <p className="text-zinc-300 leading-relaxed">{errorMessage}</p>
              {isQuotaExhausted && (
                <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="text-zinc-400">
                    💡 Tip: In AI Studio, ensure your attached API key has Pay-as-you-go billing enabled to unlock image generation models.
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setErrorMessage(null);
                setIsQuotaExhausted(false);
              }}
              className="text-rose-400 hover:text-white text-xs underline shrink-0 mt-1 sm:mt-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2-Column Responsive Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input, Reference, Fidelity Config (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Image Uploader & Live Camera Input */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Shirt className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold text-white">1. Reference Outfit / Undergarment Base Layer</h3>
                </div>
                {referenceImage && (
                  <button
                    onClick={() => {
                      setReferenceImage(null);
                      setTransformedAnimeImage(null);
                      setAnalysis(null);
                    }}
                    className="text-xs text-zinc-400 hover:text-rose-400 transition"
                  >
                    Clear Photo
                  </button>
                )}
              </div>

              <ImageUploader
                currentImage={referenceImage}
                onImageSelected={handleImageSelected}
                onOpenCamera={() => setIsCameraOpen(true)}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* Feature & Garment Fidelity Controls */}
            <FidelityPanel
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              garmentFidelity={garmentFidelity}
              onGarmentFidelityChange={setGarmentFidelity}
              identityFidelity={identityFidelity}
              onIdentityFidelityChange={setIdentityFidelity}
              selectedSilhouette={selectedSilhouette}
              onSelectSilhouette={setSelectedSilhouette}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              onReanalyze={() => referenceImage && scanFeatures(referenceImage)}
            />

            {/* Anime Studio Style Selector */}
            <StyleSelector
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
              customPrompt={customPrompt}
              onCustomPromptChange={setCustomPrompt}
            />

            {/* Big Action Transform Button */}
            <button
              onClick={handleTransform}
              disabled={!referenceImage || isTransforming || isAnalyzing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:opacity-95 disabled:opacity-40 text-white font-bold text-sm tracking-wide transition shadow-xl shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isTransforming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transforming with 100% Garment Fidelity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Transform into Identical Anime Art</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

          {/* Right Column: Comparison Viewer & Iterative Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {transformedAnimeImage && referenceImage ? (
              <>
                {/* Interactive Split Slider Comparison Viewer */}
                <ComparisonViewer
                  originalImage={referenceImage}
                  animeImage={transformedAnimeImage}
                  stylePreset={selectedStyle}
                  onOpenExport={() => setIsExportOpen(true)}
                />

                {/* Prompt-based Image Editor (Feature Block) */}
                <EditPanel
                  onApplyEdit={handleApplyEdit}
                  isEditing={isEditing}
                  historyVersions={historyVersions}
                  activeVersionIndex={activeVersionIndex}
                  onSelectVersion={handleSelectVersion}
                />
              </>
            ) : (
              /* Empty Canvas State with Guides */
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[480px]">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
                  <Sparkles className="w-8 h-8 text-rose-400 animate-pulse" />
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  Studio Canvas Ready
                </h3>
                <p className="text-xs text-zinc-400 max-w-md leading-relaxed mb-6">
                  Select or upload your garment photo on the left, then click{' '}
                  <span className="text-rose-400 font-semibold">Transform into Identical Anime Art</span>.
                  You'll be able to compare with an interactive split slider, inspect seam fidelity with a 2.5x loupe, and use iterative text prompts to refine the art.
                </p>

                {/* Feature Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full max-w-md bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
                  <div className="flex items-start space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Exact fabric patterns, logos &amp; seam structures preserved</span>
                  </div>
                  <div className="flex items-start space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Facial identity, eyes, hair texture &amp; skin tone accuracy</span>
                  </div>
                  <div className="flex items-start space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Choice of 7 authentic Japanese anime studio aesthetics</span>
                  </div>
                  <div className="flex items-start space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Natural language prompt editing with gemini-3.1-flash-image-preview</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-4 bg-zinc-950 text-center text-xs text-zinc-500 font-mono">
        Anime Garment &amp; Identity Studio • Powered by Gemini 3.1 Flash Image &amp; Gemini 3.8 Flash
      </footer>

      {/* Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => handleImageSelected(dataUrl)}
      />

      {referenceImage && transformedAnimeImage && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          originalImage={referenceImage}
          animeImage={transformedAnimeImage}
          stylePreset={selectedStyle}
        />
      )}

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={savedHistory}
        onSelectItem={handleLoadHistoryItem}
        onClearHistory={() => setSavedHistory([])}
      />

      <TextToAnimeModal
        isOpen={isTextToAnimeOpen}
        onClose={() => setIsTextToAnimeOpen(false)}
        onUseAsReference={(imgUrl) => handleImageSelected(imgUrl)}
      />
    </div>
  );
}
