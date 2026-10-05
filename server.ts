import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to get Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to parse GenAI errors cleanly
function parseGenAIError(err: any): { isQuotaError: boolean; message: string } {
  const raw = err?.message || err?.toString() || '';
  const isQuota =
    raw.includes('RESOURCE_EXHAUSTED') ||
    raw.includes('429') ||
    raw.includes('Quota exceeded') ||
    raw.includes('free_tier_requests') ||
    raw.includes('limit: 0');

  if (isQuota) {
    return {
      isQuotaError: true,
      message:
        'Image generation with Gemini requires an API key with pay-as-you-go billing enabled (free tier quota limit for image models is 0). Please select or update your API key in AI Studio to enable image generation.',
    };
  }

  // Attempt to parse nested JSON error if present
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.error?.message) {
        return { isQuotaError: false, message: parsed.error.message };
      }
    }
  } catch {
    // ignore
  }

  return { isQuotaError: false, message: raw || 'Image processing failed. Please try again.' };
}

// Clean base64 helper
function parseBase64Image(dataUri: string): { mimeType: string; data: string } {
  const matches = dataUri.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (matches) {
    return { mimeType: matches[1], data: matches[2] };
  }
  return { mimeType: 'image/jpeg', data: dataUri.replace(/^data:image\/[a-z]+;base64,/, '') };
}

/**
 * 1. Deep Feature & Garment Analysis using gemini-3.8-flash
 * Scans the user's portrait/outfit and identifies distinct facial features, hair structure,
 * and intricate garment attributes (textures, patterns, color schemes, cuts, accessories).
 */
app.post('/api/analyze-features', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const ai = getGeminiClient();
    const { mimeType, data } = parseBase64Image(imageBase64);

    const prompt = `Analyze this image in extreme high-fidelity detail for an anime conversion that MUST maintain 100% accurate, identical personal features and garment details.
Pay special attention if the person is in base layers or undergarments (such as bralette and brief sets, sculpting bodysuits, undershirts, boxer briefs, seamless intimate layers, or camisoles), recording exact strap widths, waistbands, leg cuts, seam stitching, and contour lines.
Return your analysis in valid JSON format matching this exact JSON structure:
{
  "personalFeatures": {
    "faceShape": "Detailed description of face shape and jawline",
    "eyes": "Eye shape, color, eyelid crease, eyebrow style",
    "hair": "Hair texture, length, styling, parting, bangs, exact color and undertones",
    "distinctiveMarks": "Any freckles, beauty marks, facial hair, glasses, piercings, or distinct contours",
    "expression": "Facial expression and head angle"
  },
  "garmentDetails": {
    "primaryGarments": ["List of distinct garments (e.g., undergarment bralette & briefs set, sculpting bodysuit, ribbed undershirt, boxer briefs, compression base layer)"],
    "colors": ["List of primary and accent colors detected in clothing"],
    "patternsAndPrints": "Detailed description of any patterns, stripes, florals, graphics, embroideries, weaves, or logos",
    "texturesAndFabrics": "Description of materials (e.g., micro-rib knit, modal stretch, matte cotton, silk-satin, seamless microfiber)",
    "structuralElements": "Neckline, straps, waistbands, elastic underbands, seams, leg cuts, flatlock stitching, ribbing",
    "accessories": ["Hats, necklaces, rings, watches, belts, scarves, bags"]
  },
  "fidelityAnimePrompt": "A comprehensive, engineered anime transformation prompt that instructs the anime image generator to reproduce this exact individual and their exact garments/undergarments with 100% fidelity in Japanese anime art style."
}
Only output pure JSON. Do not wrap in markdown quotes if possible or use standard json blocks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let analysis;
    try {
      analysis = JSON.parse(rawText);
    } catch {
      // Clean possible markdown code fences
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      analysis = JSON.parse(cleaned);
    }

    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Feature analysis error:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze features and garments',
      details: error.toString(),
    });
  }
});

/**
 * 2. Anime Transformation using gemini-3.1-flash-image-preview
 * Preserves user's identity and exact garments into an authentic anime art style.
 */
app.post('/api/transform-anime', async (req, res) => {
  try {
    const {
      imageBase64,
      stylePreset = 'Makoto Shinkai',
      garmentFidelity = 'strict', // 'strict' | 'stylized'
      identityFidelity = 95, // 0-100%
      undergarmentSilhouette = 'Auto-Detect',
      customPrompt = '',
      aspectRatio = '3:4',
      analysis = null,
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const ai = getGeminiClient();
    const { mimeType, data } = parseBase64Image(imageBase64);

    // Style preset descriptions tailored for authentic Japanese anime aesthetics
    const styleDescriptions: Record<string, string> = {
      'Makoto Shinkai':
        'Makoto Shinkai cinematic aesthetic (Your Name, Weathering With You), breathtaking luminous atmosphere, rich cumulus cloud skies, hyper-detailed golden hour rim lighting, soft lens flare, deep emotional depth, pristine cel shading with delicate watercolor undertones',
      'Studio Ghibli':
        'Classic Studio Ghibli Hayao Miyazaki hand-drawn aesthetic, organic nostalgic warmth, painterly gouache background, rich earth and jewel tones, gentle expressive character line art, soft natural lighting, timeless anime cinema craftsmanship',
      'Kyoto Animation (KyoAni)':
        'Kyoto Animation signature prestige style (Violet Evergarden, Hyouka), exceptionally intricate reflective anime eyes with multi-layered specular highlights, silky hair strands with soft glowing illumination, delicate clean linework, radiant ambient occlusion',
      'MAPPA Action Shonen':
        'Modern MAPPA action anime style (Jujutsu Kaisen, Chainsaw Man), bold sharp ink outlines, high-contrast dynamic chiaroscuro lighting, dramatic cinematic color grading, punchy edge rim lights, intense stylish presence',
      '90s Vintage Cel Shading':
        'Authentic 1990s retro anime aesthetic, nostalgic hand-painted animation cel look, classic bold black ink lines, gentle vintage film grain, warm chromatic aberration, rich vintage color palette, Evangelion and Cowboy Bebop era visual mastery',
      'Cyberpunk Neo-Tokyo':
        'Futuristic Neo-Tokyo anime aesthetic, vibrant holographic cyan and magenta rim lights, reflective rain-slicked atmosphere, sleek technical accents, high-contrast neon illumination, moody cybernetic cityscape ambiance',
      'Modern High-Fashion Anime':
        'Editorial fashion anime illustration, runway-level garment precision, crisp haute couture line work, refined minimalist background, ultra-crisp textile details, sophisticated color harmony',
    };

    const chosenStyle = styleDescriptions[stylePreset] || styleDescriptions['Makoto Shinkai'];

    let garmentInstructions = '';
    if (analysis && analysis.garmentDetails) {
      const g = analysis.garmentDetails;
      garmentInstructions = `
CRITICAL GARMENT REPLICATION REQUIREMENTS:
- Primary clothing to replicate identically: ${g.primaryGarments?.join(', ') || 'user outfit'}.
- Exact color scheme: ${g.colors?.join(', ') || 'match original photo'}.
- Exact patterns and prints: ${g.patternsAndPrints || 'reproduce all fabric motifs, graphics, and embroideries accurately'}.
- Textile texture & finish: ${g.texturesAndFabrics || 'match fabric drape and sheen'}.
- Structural garment cuts: ${g.structuralElements || 'reproduce collars, buttons, seams, and neckline identical to reference'}.
- Accessories: ${g.accessories?.join(', ') || 'reproduce all jewelry, headwear, or accessories'}.
`;
    }

    let silhouetteInstructions = '';
    if (undergarmentSilhouette && undergarmentSilhouette !== 'Auto-Detect') {
      if (undergarmentSilhouette === 'Thongs') {
        silhouetteInstructions = `
CRITICAL UNDERGARMENT SILHOUETTE SPECIFICATION (THONGS CUT):
- The undergarment bottoms MUST be rendered with a high-leg THONGS cut silhouette: minimal rear coverage with a sleek arched back string contour, high-cut leg openings accentuating hip lines, fine elastic waistband, and seamless edge binding.
- Ensure the thong silhouette integrates flawlessly into the anime cel shading with elegant anime contour lines.`;
      } else if (undergarmentSilhouette === 'Cheeky Brief & Strings') {
        silhouetteInstructions = `
CRITICAL UNDERGARMENT SILHOUETTE SPECIFICATION (CHEEKY BRIEF & STRINGS):
- The undergarment MUST be rendered with a CHEEKY BRIEF & STRINGS cut: cheeky rear arch coverage, fine string-tie side cords / dual hip cords at the hip crest, contoured waistline, and refined elastic edge seams.
- Render with delicate anime inking and clean cel highlights on the hip cords.`;
      } else if (undergarmentSilhouette === 'Micro Wear') {
        silhouetteInstructions = `
CRITICAL UNDERGARMENT SILHOUETTE SPECIFICATION (MICRO WEAR):
- The undergarment MUST be rendered with an ultra-minimal MICRO WEAR silhouette: delicate micro-straps, minimal triangle coverage, ultra-fine elastic edge cords, and sleek body-contouring lines in high-end Japanese anime studio style.`;
      } else if (undergarmentSilhouette === 'Seamless High-Waist') {
        silhouetteInstructions = `
CRITICAL UNDERGARMENT SILHOUETTE SPECIFICATION (SEAMLESS HIGH-WAIST):
- The undergarment MUST be rendered with a SEAMLESS HIGH-WAIST brief silhouette: high-rise waistline hugging the natural waist, flattering retro contour lines, wide comfortable waistband, and seamless bonded leg openings.`;
      }
    }

    let identityInstructions = '';
    if (analysis && analysis.personalFeatures) {
      const p = analysis.personalFeatures;
      identityInstructions = `
CRITICAL PERSONAL IDENTITY PRESERVATION (Fidelity Target: ${identityFidelity}%):
- Face shape: Maintain the distinctive ${p.faceShape}.
- Eyes: Translate ${p.eyes} faithfully into anime character eyes with identical color, shape, and gaze.
- Hairstyle: Accurately reproduce ${p.hair} with identical cut, parting, volume, and color in anime rendering.
- Distinctive features: Preserve ${p.distinctiveMarks || 'all unique facial traits'} identically.
- Demographics & Skin tone: Maintain exact ethnicity and natural skin tone.
`;
    }

    const masterPrompt = `Transform this photo into an authentic, stunning masterpiece anime illustration in ${chosenStyle}.

${garmentInstructions}
${silhouetteInstructions}
${identityInstructions}

CORE RULES:
1. Maintain ${garmentFidelity === 'strict' ? '100% STRICT IDENTICAL REPLICATION' : 'accurate stylized adaptation'} of all garments and undergarments worn by the subject (including bralettes, briefs, bodysuits, undershirts, boxer briefs, straps, waistbands, seam bindings, ribbing, and fabric finish). The clothing/undergarments must be instantly recognizable as the exact garments in the source image, rendered in crisp anime cel-shading with accurate folds, seams, logos, patterns, and fabric drape with tasteful, elegant anime studio craftsmanship.
2. Maintain the subject's distinct identity and facial structure: the viewer must immediately recognize the person transformed into anime form.
3. Masterful Japanese anime art direction: elegant clean line art, master-level anime shading and highlights, balanced composition.
${customPrompt ? `Additional User Direction: ${customPrompt}` : ''}
Output a complete, high-resolution anime illustration.`;

    // Try primary model: gemini-3.1-flash-image-preview
    // With fallbacks to gemini-3.1-flash-image and gemini-3.1-flash-lite-image if needed
    const candidateModels = [
      'gemini-3.1-flash-image-preview',
      'gemini-3.1-flash-image',
      'gemini-3.1-flash-lite-image',
    ];

    let lastError: any = null;
    let animeImageUrl = '';
    let usedModel = '';
    let responseNotes = '';

    for (const modelName of candidateModels) {
      try {
        console.log(`Attempting transformation with model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data,
                },
              },
              {
                text: masterPrompt,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio) ? aspectRatio : '3:4') as any,
              imageSize: '1K',
            },
          },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const outMime = part.inlineData.mimeType || 'image/png';
              animeImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
            } else if (part.text) {
              responseNotes += part.text + ' ';
            }
          }
        }

        if (animeImageUrl) {
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!animeImageUrl) {
      const parsed = parseGenAIError(lastError);
      return res.status(parsed.isQuotaError ? 429 : 500).json({
        error: parsed.message,
        isQuotaError: parsed.isQuotaError,
        details: lastError?.message || lastError?.toString(),
      });
    }

    res.json({
      success: true,
      animeImageUrl,
      usedModel,
      stylePreset,
      undergarmentSilhouette,
      notes: responseNotes.trim(),
    });
  } catch (error: any) {
    console.error('Transformation error:', error);
    const parsed = parseGenAIError(error);
    res.status(parsed.isQuotaError ? 429 : 500).json({
      error: parsed.message,
      isQuotaError: parsed.isQuotaError,
      details: error.toString(),
    });
  }
});

/**
 * 3. Edit Existing Anime Image using text prompts
 * Allows iterative modifications (e.g. changing backgrounds, lighting, garment colors, accessories)
 */
app.post('/api/edit-anime', async (req, res) => {
  try {
    const {
      currentAnimeImage,
      editPrompt,
      aspectRatio = '3:4',
    } = req.body;

    if (!currentAnimeImage || !editPrompt) {
      return res.status(400).json({ error: 'currentAnimeImage and editPrompt are required' });
    }

    const ai = getGeminiClient();
    const { mimeType, data } = parseBase64Image(currentAnimeImage);

    const fullEditPrompt = `Edit this anime image according to these specific instructions while strictly maintaining the character's facial identity, anime art style, and clothing continuity:
${editPrompt}
Ensure professional Japanese anime studio production quality.`;

    const candidateModels = [
      'gemini-3.1-flash-image-preview',
      'gemini-3.1-flash-image',
      'gemini-3.1-flash-lite-image',
    ];

    let lastError: any = null;
    let editedImageUrl = '';
    let usedModel = '';
    let responseNotes = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data,
                },
              },
              {
                text: fullEditPrompt,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio) ? aspectRatio : '3:4') as any,
              imageSize: '1K',
            },
          },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const outMime = part.inlineData.mimeType || 'image/png';
              editedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
            } else if (part.text) {
              responseNotes += part.text + ' ';
            }
          }
        }

        if (editedImageUrl) {
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        console.warn(`Edit with ${modelName} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!editedImageUrl) {
      const parsed = parseGenAIError(lastError);
      return res.status(parsed.isQuotaError ? 429 : 500).json({
        error: parsed.message,
        isQuotaError: parsed.isQuotaError,
        details: lastError?.message || lastError?.toString(),
      });
    }

    res.json({
      success: true,
      editedImageUrl,
      usedModel,
      notes: responseNotes.trim(),
    });
  } catch (error: any) {
    console.error('Edit error:', error);
    const parsed = parseGenAIError(error);
    res.status(parsed.isQuotaError ? 429 : 500).json({
      error: parsed.message,
      isQuotaError: parsed.isQuotaError,
      details: error.toString(),
    });
  }
});

/**
 * 4. Text-to-Anime Image Generation
 * Allows creating new anime images directly from text prompts
 */
app.post('/api/create-image', async (req, res) => {
  try {
    const { prompt, stylePreset = 'Makoto Shinkai', aspectRatio = '3:4' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();

    const fullPrompt = `Masterpiece Japanese anime artwork, high-definition anime film still in ${stylePreset} style: ${prompt}. Pristine line art, exquisite anime cel-shading, vibrant cinematic lighting, highly detailed garments and textures.`;

    const candidateModels = [
      'gemini-3.1-flash-image-preview',
      'gemini-3.1-flash-image',
      'gemini-3.1-flash-lite-image',
    ];

    let lastError: any = null;
    let imageUrl = '';
    let usedModel = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio) ? aspectRatio : '3:4') as any,
              imageSize: '1K',
            },
          },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const outMime = part.inlineData.mimeType || 'image/png';
              imageUrl = `data:${outMime};base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (imageUrl) {
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!imageUrl) {
      const parsed = parseGenAIError(lastError);
      return res.status(parsed.isQuotaError ? 429 : 500).json({
        error: parsed.message,
        isQuotaError: parsed.isQuotaError,
        details: lastError?.message || lastError?.toString(),
      });
    }

    res.json({ success: true, imageUrl, usedModel });
  } catch (error: any) {
    console.error('Create image error:', error);
    const parsed = parseGenAIError(error);
    res.status(parsed.isQuotaError ? 429 : 500).json({
      error: parsed.message,
      isQuotaError: parsed.isQuotaError,
      details: error.toString(),
    });
  }
});

// Setup Vite middleware or static serving
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
