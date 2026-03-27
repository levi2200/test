export const buildCopyPrompt = (analysis: any, platform: string) => {
  // This recreates the thumbnail as exactly as possible
  let prompt = `Hyper-realistic ${analysis.aspect_ratio} YouTube thumbnail photograph.

SUBJECT: ${analysis.subject_count > 1 ? analysis.subject_count + ' people' : 'One person'} positioned on the ${analysis.subject_position} of the frame. Main subject with ${analysis.main_expression}. Wearing ${analysis.subject_clothing}. ${analysis.props ? 'Holding or featuring: ' + analysis.props + '.' : ''}

FACE REQUIREMENT: Front-facing subject, face well-lit, no heavy shadows on face, clear skin tone — optimized for face replacement in post-production.

BACKGROUND: ${analysis.background_description}

LIGHTING: ${analysis.lighting}

COLOR GRADE: ${analysis.color_grade}

COMPOSITION: ${analysis.composition_notes}

${analysis.text_elements ? 'TEXT ELEMENTS: ' + analysis.text_elements : ''}
${analysis.graphic_elements ? 'GRAPHIC OVERLAYS: ' + analysis.graphic_elements : ''}
${analysis.special_effects ? 'VISUAL EFFECTS: ' + analysis.special_effects : ''}

CAMERA: ${analysis.camera_style}. Ultra-realistic photographic quality. Cinematic production value.
MOOD: ${analysis.mood}`;

  // Add platform suffix
  if (platform === 'midjourney') {
    prompt += `\n\n--ar ${analysis.aspect_ratio.replace(':', ':')} --v 6 --style raw --q 2`;
  } else if (platform === 'firefly') {
    prompt += `\n\nPhotorealistic, highly detailed, cinematic lighting, 8k resolution`;
  } else if (platform === 'chatgpt') {
    prompt += `\n\nCreate this as a high-quality photorealistic image suitable for a YouTube thumbnail with exact details as described.`;
  }

  return prompt;
};

export const buildSimilarPrompt = (analysis: any, platform: string) => {
  // This is creatively inspired but generates something new
  // Pick random creative variations
  const variations = {
    expressions: [
      'extreme shock with mouth wide open and eyes bulging',
      'suspicious knowing smirk with one eyebrow raised',
      'triumphant celebration with arms raised wide',
      'intense focused determination jaw clenched',
      'pure comedic disbelief hands pressed to cheeks'
    ],
    timeOfDay: ['golden hour', 'blue hour just after sunset', 'dramatic midday harsh sun', 'stormy overcast', 'deep night with artificial lighting'],
    lightingMods: [
      'single hard spotlight from directly above',
      'warm golden backlight creating glowing rim light',
      'multiple colored practical lights',
      'Rembrandt dramatic side lighting',
      'cool moonlight silver tones'
    ]
  };

  const randExpr = variations.expressions[Math.floor(Math.random() * variations.expressions.length)];
  const randTime = variations.timeOfDay[Math.floor(Math.random() * variations.timeOfDay.length)];
  const randLight = variations.lightingMods[Math.floor(Math.random() * variations.lightingMods.length)];

  let prompt = `Hyper-realistic ${analysis.aspect_ratio} YouTube thumbnail — inspired by the same visual style and concept but with a fresh creative direction.

STYLE REFERENCE: ${analysis.style} style thumbnail — maintaining the same energy, niche (${analysis.niche}), and visual language.

SUBJECT: Person positioned on the ${analysis.subject_position} of the frame with ${randExpr}. Same type of clothing as reference: ${analysis.subject_clothing}.

FACE REQUIREMENT: Front-facing subject, face well-lit, no heavy shadows on face, clear skin tone — optimized for face replacement in post-production.

BACKGROUND: Same conceptual setting as the reference — ${analysis.background_description} — but at ${randTime} for a fresh atmosphere. Reimagine the details creatively while keeping the same location concept.

LIGHTING: ${randLight}. Inspired by reference lighting: ${analysis.lighting}.

COLOR GRADE: Maintain the same color palette approach — ${analysis.color_grade} — but push it further with more intensity and contrast.

COMPOSITION: ${analysis.composition_notes}. Same compositional structure but with more dynamic energy.

${analysis.special_effects ? 'VISUAL EFFECTS: Push the following effects further: ' + analysis.special_effects : ''}

MOOD: Same emotional tone as reference — ${analysis.mood} — but amplified to maximum intensity.

CAMERA: ${analysis.camera_style}. Ultra-realistic photographic quality.`;

  // Add platform suffix
  if (platform === 'midjourney') {
    prompt += `\n\n--ar ${analysis.aspect_ratio.replace(':', ':')} --v 6 --style raw --q 2`;
  } else if (platform === 'firefly') {
    prompt += `\n\nPhotorealistic, highly detailed, cinematic lighting, 8k resolution, fresh creative direction`;
  } else if (platform === 'chatgpt') {
    prompt += `\n\nCreate a highly detailed, hyper-realistic, visually striking YouTube thumbnail image based on the exact creative direction above.`;
  }

  return prompt;
};
