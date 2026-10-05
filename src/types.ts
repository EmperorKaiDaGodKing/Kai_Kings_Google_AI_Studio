export interface PersonalFeatures {
  faceShape?: string;
  eyes?: string;
  hair?: string;
  distinctiveMarks?: string;
  expression?: string;
}

export interface GarmentDetails {
  primaryGarments?: string[];
  colors?: string[];
  patternsAndPrints?: string;
  texturesAndFabrics?: string;
  structuralElements?: string;
  accessories?: string[];
}

export interface FeatureAnalysis {
  personalFeatures: PersonalFeatures;
  garmentDetails: GarmentDetails;
  fidelityAnimePrompt?: string;
}

export interface AnimeStyle {
  id: string;
  name: string;
  studio: string;
  description: string;
  tags: string[];
  accentGradient: string;
  iconName: string;
}

export type UndergarmentSilhouette =
  | 'Auto-Detect'
  | 'Thongs'
  | 'Cheeky Brief & Strings'
  | 'Micro Wear'
  | 'Seamless High-Waist';

export interface SilhouettePresetOption {
  id: string;
  name: UndergarmentSilhouette;
  shortDesc: string;
  coverage: string;
  badge: string;
}

export interface TransformationItem {
  id: string;
  timestamp: number;
  originalImage: string;
  currentAnimeImage: string;
  historyVersions: string[];
  stylePreset: string;
  garmentFidelity: 'strict' | 'stylized';
  identityFidelity: number;
  undergarmentSilhouette?: UndergarmentSilhouette;
  customPrompt?: string;
  analysis?: FeatureAnalysis;
  usedModel?: string;
  notes?: string;
}
