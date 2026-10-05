import { AnimeStyle } from '../types';

export const ANIME_STYLES: AnimeStyle[] = [
  {
    id: 'shinkai',
    name: 'Makoto Shinkai',
    studio: 'CoMix Wave Films',
    description: 'Luminous skies, hyper-detailed golden hour rim lighting, soft lens flares, and emotive cel-shading.',
    tags: ['Cinematic', 'Luminous Skies', 'Emotional Realism', 'Lens Flare'],
    accentGradient: 'from-amber-500 via-rose-500 to-indigo-600',
    iconName: 'SunMedium',
  },
  {
    id: 'ghibli',
    name: 'Studio Ghibli',
    studio: 'Hayao Miyazaki',
    description: 'Nostalgic hand-painted gouache warmth, organic line work, earthy jewel tones, and timeless charm.',
    tags: ['Hand-drawn', 'Watercolor', 'Nostalgic', 'Soft Cel'],
    accentGradient: 'from-emerald-500 via-teal-500 to-amber-600',
    iconName: 'Leaf',
  },
  {
    id: 'kyoani',
    name: 'Kyoto Animation',
    studio: 'KyoAni Prestige',
    description: 'Hyper-detailed reflective eyes with layered specular highlights, silky hair physics, and delicate lines.',
    tags: ['Detailed Eyes', 'Silky Hair', 'Radiant Lighting', 'Prestige'],
    accentGradient: 'from-violet-500 via-purple-500 to-pink-500',
    iconName: 'Sparkles',
  },
  {
    id: 'mappa',
    name: 'MAPPA Action',
    studio: 'Modern Shonen',
    description: 'Sharp dynamic ink outlines, dramatic chiaroscuro contrast, cinematic color grading, bold edge lighting.',
    tags: ['Dynamic Inking', 'High Contrast', 'Sharp Angles', 'Action Edge'],
    accentGradient: 'from-red-600 via-orange-600 to-zinc-800',
    iconName: 'Zap',
  },
  {
    id: 'retro90s',
    name: '90s Vintage Cel',
    studio: 'Classic Golden Era',
    description: 'Authentic 90s hand-painted animation cels, warm chromatic aberration, film grain, and bold contour inks.',
    tags: ['Retro Cel', 'Warm Grain', '90s Nostalgia', 'Bold Lines'],
    accentGradient: 'from-yellow-500 via-red-500 to-purple-600',
    iconName: 'Tv',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neo-Tokyo',
    studio: 'Sci-Fi Noir',
    description: 'Neon cyan & magenta chromatic reflections, rain-slicked atmosphere, holographic glows, and dark city styling.',
    tags: ['Neon Cyan', 'Rain Reflections', 'Holographic', 'Futuristic'],
    accentGradient: 'from-cyan-400 via-blue-600 to-fuchsia-600',
    iconName: 'Cpu',
  },
  {
    id: 'highfashion',
    name: 'High-Fashion Anime',
    studio: 'Haute Couture Editorial',
    description: 'Clean runway aesthetics, immaculate fabric weave precision, sophisticated color harmony, and crisp manga lines.',
    tags: ['Runway Editorial', 'Textile Precision', 'Haute Couture', 'Minimalist'],
    accentGradient: 'from-slate-400 via-zinc-600 to-neutral-900',
    iconName: 'Crown',
  },
];

export interface SampleGarmentPreset {
  id: string;
  title: string;
  category: string;
  silhouetteType: string;
  garmentDescription: string;
  keyFeatures: string[];
  thumbnailSvg: string;
}

// Generate base64 SVG data URLs for high-quality instant testing presets
function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const SAMPLE_GARMENTS: SampleGarmentPreset[] = [
  {
    id: 'undergarment_ribbed_set',
    title: 'Ribbed Bralette & High-Waist Brief Set',
    category: 'Undergarments Base Layer',
    silhouetteType: 'Bralette & High-Waist Brief',
    garmentDescription: 'Matte black ribbed cotton-stretch undergarment set: minimalist scoop-neck triangle bralette with wide elastic underband, paired with high-waist seamless contoured underwear briefs.',
    keyFeatures: ['Scoop Bralette Underband', 'High-Waist Seamless Brief', 'Micro-Rib Stretch Texture', 'Contoured Leg Cut'],
    thumbnailSvg: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
        <defs>
          <linearGradient id="underBg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#09090b"/>
            <stop offset="100%" stop-color="#18181b"/>
          </linearGradient>
          <linearGradient id="blackUnderwear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#27272a"/>
            <stop offset="50%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
          <linearGradient id="roseAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f43f5e"/>
            <stop offset="100%" stop-color="#fb7185"/>
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill="url(#underBg1)"/>
        
        <!-- Soft backlight glow -->
        <ellipse cx="300" cy="420" rx="180" ry="240" fill="#f43f5e" opacity="0.12"/>
        
        <!-- Natural Skin Tone Silhouette (Torso, Shoulders, Waist, Legs) -->
        <!-- Neck and Head -->
        <ellipse cx="300" cy="140" rx="50" ry="65" fill="#fcd34d" opacity="0.9"/>
        <path d="M 250 140 Q 245 80 300 75 Q 355 80 350 140 Q 345 190 335 200 Q 320 130 300 125 Q 275 130 260 200 Z" fill="#18181b"/>
        
        <!-- Skin Silhouette Body Contour -->
        <path d="M 280 195 L 220 250 L 195 440 L 220 440 L 235 340 Q 245 420 240 500 Q 235 560 220 620 L 245 780 L 290 780 L 295 640 L 305 640 L 310 780 L 355 780 L 380 620 Q 365 560 360 500 Q 355 420 365 340 L 380 440 L 405 440 L 380 250 L 320 195 Z" fill="#fed7aa"/>

        <!-- Bralette Undergarment Top -->
        <!-- Shoulder straps -->
        <line x1="260" y1="230" x2="265" y2="300" stroke="#27272a" stroke-width="4"/>
        <line x1="340" y1="230" x2="335" y2="300" stroke="#27272a" stroke-width="4"/>

        <!-- Bralette Cups -->
        <path d="M 245 300 Q 275 285 295 315 L 295 375 L 235 375 Q 235 320 245 300 Z" fill="url(#blackUnderwear)" stroke="#3f3f46" stroke-width="1.5"/>
        <path d="M 355 300 Q 325 285 305 315 L 305 375 L 365 375 Q 365 320 355 300 Z" fill="url(#blackUnderwear)" stroke="#3f3f46" stroke-width="1.5"/>

        <!-- Elastic Underband with Rose accent stitching -->
        <rect x="235" y="375" width="130" height="18" rx="3" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
        <line x1="235" y1="384" x2="365" y2="384" stroke="url(#roseAccent)" stroke-width="1.5" stroke-dasharray="4 2"/>

        <!-- High-Waisted Underwear Briefs Bottom -->
        <path d="M 245 470 Q 300 485 355 470 L 360 540 Q 330 560 305 620 L 295 620 Q 270 560 240 540 Z" fill="url(#blackUnderwear)" stroke="#3f3f46" stroke-width="1.5"/>
        
        <!-- Brief Elastic Waistband -->
        <path d="M 245 470 Q 300 485 355 470 L 355 484 Q 300 499 245 484 Z" fill="#18181b" stroke="url(#roseAccent)" stroke-width="1.5"/>

        <!-- Ribbed texture lines on underwear -->
        <g stroke="#3f3f46" stroke-width="1" opacity="0.6">
          <line x1="255" y1="510" x2="345" y2="510"/>
          <line x1="262" y1="525" x2="338" y2="525"/>
          <line x1="272" y1="540" x2="328" y2="540"/>
          <line x1="282" y1="555" x2="318" y2="555"/>
        </g>

        <text x="300" y="745" fill="#fb7185" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="3">BRALETTE &amp; BRIEF UNDERGARMENT</text>
      </svg>
    `),
  },
  {
    id: 'undergarment_contour_bodysuit',
    title: 'Seamless Sculpting Bodysuit Undergarment',
    category: 'Undergarments Base Layer',
    silhouetteType: 'Sculpting Bodysuit Foundation',
    garmentDescription: 'Espresso brown second-skin sculpting undergarment bodysuit with delicate spaghetti straps, scoop neckline, mid-torso rib compression, and high-cut leg opening.',
    keyFeatures: ['Fine Spaghetti Straps', 'Sculpting Torso Compression', 'Seamless High-Cut Leg', 'Breathable Modal Fabric'],
    thumbnailSvg: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
        <defs>
          <linearGradient id="underBg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="espressoCloth" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#451a03"/>
            <stop offset="50%" stop-color="#292524"/>
            <stop offset="100%" stop-color="#1c1917"/>
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill="url(#underBg2)"/>
        <ellipse cx="300" cy="420" rx="180" ry="240" fill="#38bdf8" opacity="0.1"/>

        <!-- Head / Neck -->
        <ellipse cx="300" cy="140" rx="50" ry="65" fill="#fbcfe8"/>
        <path d="M 250 140 Q 245 80 300 75 Q 355 80 350 140 L 345 180 Q 320 130 300 125 Q 275 130 255 180 Z" fill="#09090b"/>

        <!-- Skin Arms & Legs Silhouette -->
        <path d="M 240 230 L 200 450 L 225 450 L 245 310" stroke="#fbcfe8" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M 360 230 L 400 450 L 375 450 L 355 310" stroke="#fbcfe8" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M 270 590 L 255 780" stroke="#fbcfe8" stroke-width="45" stroke-linecap="round" fill="none"/>
        <path d="M 330 590 L 345 780" stroke="#fbcfe8" stroke-width="45" stroke-linecap="round" fill="none"/>

        <!-- Spaghetti Straps -->
        <line x1="262" y1="220" x2="268" y2="290" stroke="#38bdf8" stroke-width="2.5"/>
        <line x1="338" y1="220" x2="332" y2="290" stroke="#38bdf8" stroke-width="2.5"/>

        <!-- One-Piece Sculpting Undergarment Bodysuit -->
        <path d="M 255 290 Q 300 325 345 290 L 355 370 Q 360 450 350 510 L 355 550 Q 325 570 305 615 L 295 615 Q 275 570 245 550 L 250 510 Q 240 450 245 370 Z" fill="url(#espressoCloth)" stroke="#57534e" stroke-width="1.5"/>

        <!-- Curved Scoop Neck Binding -->
        <path d="M 255 290 Q 300 325 345 290" stroke="#38bdf8" stroke-width="2" fill="none"/>

        <!-- Bodysuit Contour Seamlines -->
        <path d="M 270 340 Q 255 420 265 520" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" fill="none" opacity="0.8"/>
        <path d="M 330 340 Q 345 420 335 520" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 3" fill="none" opacity="0.8"/>

        <!-- Abdominal Compression Panel -->
        <ellipse cx="300" cy="440" rx="35" ry="50" fill="none" stroke="#78716c" stroke-width="1.5" stroke-dasharray="3 3"/>

        <text x="300" y="745" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="3">SCULPTING BODYSUIT BASE</text>
      </svg>
    `),
  },
  {
    id: 'undergarment_undershirt_boxer',
    title: 'Athletic Undershirt & Fitted Boxer Briefs',
    category: 'Undergarments Base Layer',
    silhouetteType: 'Undershirt & Boxer Brief Set',
    garmentDescription: 'Heather charcoal athletic undergarment set: ribbed sleeveless tank undershirt with reinforced bound collar, paired with low-rise fitted boxer briefs with branded elastic waistband.',
    keyFeatures: ['Ribbed Cotton Undershirt', 'Fitted Boxer Brief Underwear', 'Woven Elastic Waistband', 'Contoured Inseam Panels'],
    thumbnailSvg: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
        <defs>
          <linearGradient id="underBg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="100%" stop-color="#064e3b"/>
          </linearGradient>
          <linearGradient id="greyCloth" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4b5563"/>
            <stop offset="50%" stop-color="#374151"/>
            <stop offset="100%" stop-color="#1f2937"/>
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill="#09090b"/>
        <ellipse cx="300" cy="420" rx="180" ry="240" fill="#10b981" opacity="0.1"/>

        <!-- Portrait Head -->
        <ellipse cx="300" cy="140" rx="52" ry="65" fill="#fed7aa"/>
        <path d="M 245 140 Q 240 80 300 75 Q 360 80 355 140 L 350 175 Q 320 125 300 120 Q 275 125 250 175 Z" fill="#18181b"/>

        <!-- Skin Body -->
        <path d="M 230 240 L 195 440 L 220 440 L 235 310" stroke="#fed7aa" stroke-width="22" stroke-linecap="round" fill="none"/>
        <path d="M 370 240 L 405 440 L 380 440 L 365 310" stroke="#fed7aa" stroke-width="22" stroke-linecap="round" fill="none"/>
        <path d="M 265 630 L 255 780" stroke="#fed7aa" stroke-width="45" stroke-linecap="round" fill="none"/>
        <path d="M 335 630 L 345 780" stroke="#fed7aa" stroke-width="45" stroke-linecap="round" fill="none"/>

        <!-- Ribbed Undershirt (Tank Base Layer) -->
        <path d="M 255 220 L 235 250 Q 235 340 245 370 L 250 490 L 350 490 L 355 370 Q 365 340 365 250 L 345 220 Q 300 270 255 220 Z" fill="url(#greyCloth)" stroke="#4b5563" stroke-width="1.5"/>

        <!-- Scoop Neck & Armhole Trim Binding -->
        <path d="M 255 220 Q 300 270 345 220" stroke="#34d399" stroke-width="2.5" fill="none"/>
        <line x1="300" y1="270" x2="300" y2="490" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4 2"/>

        <!-- Boxer Brief Underwear (Bottoms) -->
        <rect x="240" y="500" width="120" height="130" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
        <!-- Woven Elastic Waistband -->
        <rect x="240" y="500" width="120" height="20" rx="3" fill="#0f172a" stroke="#34d399" stroke-width="1.5"/>
        <line x1="240" y1="510" x2="360" y2="510" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6 3"/>

        <!-- Boxer Brief Inseam & Pouch Flatlock Seams -->
        <path d="M 285 520 L 285 590 L 300 630 L 315 590 L 315 520" stroke="#34d399" stroke-width="1.5" fill="none"/>

        <text x="300" y="745" fill="#34d399" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="3">UNDERSHIRT &amp; BOXER UNDERWEAR</text>
      </svg>
    `),
  },
  {
    id: 'undergarment_silk_camisole',
    title: 'Contoured Silk Camisole & Boyshort Set',
    category: 'Undergarments Base Layer',
    silhouetteType: 'Silky Camisole & Boyshort',
    garmentDescription: 'Midnight navy silk-stretch intimate undergarment set: delicate v-neck camisole with adjustable straps, paired with matching mid-rise seamless boyshort undergarments.',
    keyFeatures: ['V-Neck Camisole Straps', 'Seamless Boyshort Cut', 'Silk-Stretch Satin Luster', 'Anatomical Hip Contours'],
    thumbnailSvg: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
        <defs>
          <linearGradient id="silkNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="50%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="goldUnderwear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill="#09090b"/>
        <ellipse cx="300" cy="420" rx="180" ry="240" fill="#f59e0b" opacity="0.1"/>

        <!-- Head / Neck -->
        <ellipse cx="300" cy="140" rx="50" ry="65" fill="#fde047" opacity="0.9"/>
        <path d="M 250 140 Q 245 80 300 75 Q 355 80 350 140 L 345 180 Q 320 130 300 125 Q 275 130 255 180 Z" fill="#292524"/>

        <!-- Body Silhouette Skin -->
        <path d="M 235 240 L 195 440 L 220 440 L 240 310" stroke="#fed7aa" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M 365 240 L 405 440 L 380 440 L 360 310" stroke="#fed7aa" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M 265 620 L 255 780" stroke="#fed7aa" stroke-width="45" stroke-linecap="round" fill="none"/>
        <path d="M 335 620 L 345 780" stroke="#fed7aa" stroke-width="45" stroke-linecap="round" fill="none"/>

        <!-- Dainty Shoulder Straps -->
        <line x1="265" y1="215" x2="265" y2="280" stroke="url(#goldUnderwear)" stroke-width="2"/>
        <line x1="335" y1="215" x2="335" y2="280" stroke="url(#goldUnderwear)" stroke-width="2"/>

        <!-- V-Neck Silk Camisole -->
        <path d="M 250 280 L 300 320 L 350 280 L 355 450 Q 330 470 300 470 Q 270 470 245 450 Z" fill="url(#silkNavy)" stroke="#312e81" stroke-width="1.5"/>
        <path d="M 250 280 L 300 320 L 350 280" stroke="url(#goldUnderwear)" stroke-width="2" fill="none"/>

        <!-- Boyshort Underwear Bottoms -->
        <rect x="245" y="490" width="110" height="95" rx="6" fill="url(#silkNavy)" stroke="#312e81" stroke-width="1.5"/>
        <!-- Waistband trim -->
        <line x1="245" y1="495" x2="355" y2="495" stroke="url(#goldUnderwear)" stroke-width="2"/>
        <!-- Side Seams -->
        <line x1="260" y1="495" x2="260" y2="585" stroke="#4338ca" stroke-width="1.5" stroke-dasharray="4 2"/>
        <line x1="340" y1="495" x2="340" y2="585" stroke="#4338ca" stroke-width="1.5" stroke-dasharray="4 2"/>

        <text x="300" y="745" fill="#f59e0b" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="3">SILK CAMISOLE &amp; BOYSHORT SET</text>
      </svg>
    `),
  },
];

export const QUICK_EDIT_PROMPTS = [
  'Highlight undergarment contour seams and waistband with subtle anime rim lighting',
  'Add floating cherry blossom (sakura) petals swirling gently in the scene',
  'Shift lighting to golden hour sunset rim light with soft anime glow',
  'Transform background into a serene modern minimalist anime studio apartment with warm sunlight',
  'Add an ethereal glowing anime aura around the character',
  'Enhance delicate undergarment fabric sheen and micro-rib knit texture',
  'Add soft watercolor anime bokeh background with gentle pastel tones',
  'Refine anime eye reflections and sparkling light particle ambiance',
];
