import React from 'react';
import {
  ShieldCheck,
  Sliders,
  Sparkles,
  Shirt,
  User,
  Palette,
  CheckCircle2,
  Lock,
  Layers,
  Ratio,
  Check,
  Flame,
  Scissors,
} from 'lucide-react';
import { FeatureAnalysis, UndergarmentSilhouette, SilhouettePresetOption } from '../types';

interface FidelityPanelProps {
  analysis: FeatureAnalysis | null;
  isAnalyzing: boolean;
  garmentFidelity: 'strict' | 'stylized';
  onGarmentFidelityChange: (mode: 'strict' | 'stylized') => void;
  identityFidelity: number;
  onIdentityFidelityChange: (val: number) => void;
  selectedSilhouette: UndergarmentSilhouette;
  onSelectSilhouette: (silhouette: UndergarmentSilhouette) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  onReanalyze: () => void;
}

const SILHOUETTE_PRESETS: SilhouettePresetOption[] = [
  {
    id: 'thongs',
    name: 'Thongs',
    shortDesc: 'Minimal rear coverage, high-leg cut arches, and fine elastic waistband',
    coverage: 'Minimal Back',
    badge: 'High-Leg Arch',
  },
  {
    id: 'cheeky_strings',
    name: 'Cheeky Brief & Strings',
    shortDesc: 'Cheeky coverage with string tie side cords, dual hip cords & sculpted seams',
    coverage: 'Cheeky',
    badge: 'String Sides',
  },
  {
    id: 'micro_wear',
    name: 'Micro Wear',
    shortDesc: 'Ultra-minimal micro wear lines with delicate micro-straps & bonded edges',
    coverage: 'Micro Cut',
    badge: 'Ultra-Minimal',
  },
  {
    id: 'high_waist',
    name: 'Seamless High-Waist',
    shortDesc: 'High-rise waistline reaching natural waist with contoured compression',
    coverage: 'Fuller Rise',
    badge: 'Contoured',
  },
  {
    id: 'auto',
    name: 'Auto-Detect',
    shortDesc: 'Faithfully replicate exact undergarment cut detected from uploaded photo',
    coverage: 'Adaptive',
    badge: 'From Photo',
  },
];

export const FidelityPanel: React.FC<FidelityPanelProps> = ({
  analysis,
  isAnalyzing,
  garmentFidelity,
  onGarmentFidelityChange,
  identityFidelity,
  onIdentityFidelityChange,
  selectedSilhouette,
  onSelectSilhouette,
  aspectRatio,
  onAspectRatioChange,
  onReanalyze,
}) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Identity &amp; Undergarment Fidelity Engine</h3>
            <p className="text-[11px] text-zinc-400">
              Guarantees 1:1 precision for clothing cuts, undergarment seams, and facial traits
            </p>
          </div>
        </div>

        {analysis && (
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-50 transition"
          >
            {isAnalyzing ? 'Scanning...' : 'Rescan Image'}
          </button>
        )}
      </div>

      {/* Fidelity Control Toggles & Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Garment Fidelity Lock Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-rose-400" />
              Garment Fidelity Mode
            </span>
            <span className="text-[10px] text-rose-400 font-mono">
              {garmentFidelity === 'strict' ? '100% Identical' : 'Stylized'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => onGarmentFidelityChange('strict')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                garmentFidelity === 'strict'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Lock className="w-3 h-3" />
              Strict Lock
            </button>
            <button
              onClick={() => onGarmentFidelityChange('stylized')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                garmentFidelity === 'stylized'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Stylized
            </button>
          </div>
          <p className="text-[10px] text-zinc-500">
            {garmentFidelity === 'strict'
              ? 'Locks exact seam lines, straps, waistband elastic, and fabric cut.'
              : 'Adapts undergarments harmoniously into anime studio aesthetics.'}
          </p>
        </div>

        {/* Identity Preservation Slider */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Identity Preservation
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">
              {identityFidelity}%
            </span>
          </label>
          <div className="pt-2">
            <input
              type="range"
              min="70"
              max="100"
              value={identityFidelity}
              onChange={(e) => onIdentityFidelityChange(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>70% (Anime Idealized)</span>
            <span>95% (Recommended)</span>
            <span>100% (Strict 1:1)</span>
          </div>
        </div>
      </div>

      {/* NEW: Silhouette Presets Section */}
      <div className="space-y-2.5 pt-3 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-rose-400" />
            Silhouette Presets
            <span className="text-[10px] font-normal text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Active: {selectedSilhouette}
            </span>
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">Toggles transformation cut</span>
        </div>
        <p className="text-[11px] text-zinc-400">
          Quickly switch the undergarment silhouette. The transformation engine automatically adapts waistbands, leg arches, and strap structures accordingly:
        </p>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SILHOUETTE_PRESETS.map((preset) => {
            const isSelected = selectedSilhouette === preset.name;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectSilhouette(preset.name)}
                className={`text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between relative cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/40 shadow-sm'
                    : 'border-zinc-800/90 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-rose-400">
                      {preset.badge}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 leading-snug line-clamp-2">
                  {preset.shortDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <Ratio className="w-3.5 h-3.5 text-amber-400" />
          Output Aspect Ratio
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: '3:4', label: '3:4 Portrait', desc: 'Standard Outfit' },
            { id: '1:1', label: '1:1 Square', desc: 'Avatar / Icon' },
            { id: '9:16', label: '9:16 Mobile', desc: 'Full Body' },
            { id: '16:9', label: '16:9 Cinema', desc: 'Movie Still' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onAspectRatioChange(item.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex flex-col items-start ${
                aspectRatio === item.id
                  ? 'border-rose-500/80 bg-rose-500/10 text-white'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span className="font-semibold">{item.label}</span>
              <span className="text-[9px] text-zinc-500">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detected Feature Breakdown (Live Gemini 3.8 Flash Analysis) */}
      <div className="space-y-3 pt-3 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Detected Garment &amp; Identity Attributes
          </span>
          {isAnalyzing && (
            <span className="text-[11px] text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Scanning with Gemini 3.8 Flash...
            </span>
          )}
        </div>

        {analysis ? (
          <div className="space-y-3 bg-zinc-950/80 rounded-xl p-3 border border-zinc-800/80 text-xs">
            {/* Garments detected */}
            <div>
              <div className="text-[11px] font-semibold text-rose-400 mb-1 flex items-center gap-1">
                <Shirt className="w-3 h-3" />
                Clothing Pieces &amp; Structure:
              </div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {analysis.garmentDetails.primaryGarments?.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 text-[10px] font-medium border border-zinc-700/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
              {analysis.garmentDetails.structuralElements && (
                <p className="text-[11px] text-zinc-400">
                  <span className="text-zinc-500 font-medium">Details: </span>
                  {analysis.garmentDetails.structuralElements}
                </p>
              )}
              {analysis.garmentDetails.patternsAndPrints && (
                <p className="text-[11px] text-zinc-400 mt-1">
                  <span className="text-zinc-500 font-medium">Pattern / Texture: </span>
                  {analysis.garmentDetails.patternsAndPrints}
                </p>
              )}
            </div>

            {/* Color Palette detected */}
            {analysis.garmentDetails.colors && analysis.garmentDetails.colors.length > 0 && (
              <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                  <Palette className="w-3 h-3 text-amber-400" />
                  Palette:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.garmentDetails.colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personal traits */}
            <div className="pt-2 border-t border-zinc-800/60">
              <div className="text-[11px] font-semibold text-indigo-400 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" />
                Identified Personal Identity Traits:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-zinc-400">
                {analysis.personalFeatures.hair && (
                  <div>
                    <span className="text-zinc-500">Hair: </span>
                    {analysis.personalFeatures.hair}
                  </div>
                )}
                {analysis.personalFeatures.eyes && (
                  <div>
                    <span className="text-zinc-500">Eyes: </span>
                    {analysis.personalFeatures.eyes}
                  </div>
                )}
                {analysis.personalFeatures.faceShape && (
                  <div>
                    <span className="text-zinc-500">Face Contour: </span>
                    {analysis.personalFeatures.faceShape}
                  </div>
                )}
                {analysis.personalFeatures.distinctiveMarks && (
                  <div>
                    <span className="text-zinc-500">Features / Acc: </span>
                    {analysis.personalFeatures.distinctiveMarks}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950/40 rounded-xl p-3 border border-zinc-800/60 text-xs text-zinc-500 text-center py-4">
            Upload or snap your photo to run automatic garment &amp; facial feature scanning.
          </div>
        )}
      </div>
    </div>
  );
};
