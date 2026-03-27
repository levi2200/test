exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imageBase64, mediaType } = JSON.parse(event.body);

    if (!imageBase64 || !mediaType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing imageBase64 or mediaType' }),
      };
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: `You are a professional AI image prompt engineer specializing in YouTube thumbnails. 
Analyze this thumbnail image in extreme detail and extract the following information. 
Return ONLY a valid JSON object with no extra text, no markdown, no backticks.

{
  "aspect_ratio": "16:9 or 9:16 or 1:1 — detect from the image dimensions and composition",
  "style": "mrbeast / gaming / documentary / horror / splitnight / confession / beforeafter / revenue / wanted_thriller / historical / versus",
  "subject_count": 1,
  "main_expression": "exact detailed description of facial expression",
  "subject_clothing": "color, style, notable details",
  "subject_position": "left / right / center / full frame",
  "background_description": "full detail of background location, time, atmosphere",
  "color_grade": "dominant colors, saturation, contrast, film grade style",
  "lighting": "direction, hardness, color temperature, special effects",
  "props": "objects held or prominent in foreground",
  "text_elements": "font style, color, position, content",
  "graphic_elements": "arrows, circles, cards, UI overlays, emojis",
  "composition_notes": "rule of thirds, split screen, depth layers",
  "mood": "emotional tone and energy level",
  "niche": "gaming / travel / finance / education / entertainment",
  "camera_style": "fisheye / wide angle / portrait / telephoto / GoPro",
  "special_effects": "rain / fire / explosions / neon glow / motion blur / particles / fog"
}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`Anthropic API Error: \${response.status} \${errorText}\`);
    }

    const data = await response.json();
    const text = data.content[0].text;

    // Parse JSON safely
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (e) {
      // Try to extract JSON if there's extra text
      const match = text.match(/\\{[\\s\\S]*\\}/);
      if (match) {
        analysis = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse analysis to JSON: ' + text);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysis),
    };
  } catch (error) {
    console.error('Error in analyse-image function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Error processing image analysis' }),
    };
  }
};
