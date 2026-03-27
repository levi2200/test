import { useState, useRef, useCallback } from 'react';
import { buildCopyPrompt, buildSimilarPrompt } from '../utils/promptBuilders';

interface GeneratePageProps {
  userRole: string | null;
  freeUsesLeft: number;
  onUsed: () => void;
  onNavigate: (page: string) => void;
}

type Step = 'upload' | 'analyze' | 'result';

const ANALYSIS_STEPS = [
  { key: 'composition', label: 'Composition Analysis', detail: 'Subject position · Eye-line · Framing · Camera angle' },
  { key: 'face', label: 'Face & Subject Analysis', detail: 'Facial structure · Skin tone · Expression · Eye openness' },
  { key: 'lighting', label: 'Lighting Analysis', detail: 'Light direction · Intensity · Rim light · Color temp' },
  { key: 'color', label: 'Color Grading', detail: 'Palette extraction · Saturation · Contrast curve · Tints' },
  { key: 'depth', label: 'Depth & Lens Analysis', detail: 'Bokeh level · Layer separation · Lens simulation' },
  { key: 'text', label: 'Text & Object Integration', detail: 'Position · Type · Shadow depth · Readability' },
  { key: 'environment', label: 'Environment Analysis', detail: 'Scene type · Background · Atmosphere · Materials' },
  { key: 'postprocess', label: 'Post-Processing Style', detail: 'Vignette · Clarity · Grain · Glow · Edge contrast' },
];

const PLATFORM_OPTIONS = [
  { id: 'midjourney', label: 'Midjourney', icon: '🎨', desc: 'v6 model, photorealistic, RAW style' },
  { id: 'firefly', label: 'Adobe Firefly', icon: '✨', desc: 'Cinematic, safe lighting, 8k resolution' },
  { id: 'chatgpt', label: 'ChatGPT / DALL·E 3', icon: '🤖', desc: 'Highly detailed, simple prompts' }
];

function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

export const GeneratePage: React.FC<GeneratePageProps> = ({
  userRole, freeUsesLeft, onUsed, onNavigate
}) => {
  const [thumbImage, setThumbImage] = useState<string | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbBase64, setThumbBase64] = useState<string | null>(null);
  
  const [selectedPlatform, setSelectedPlatform] = useState('midjourney');
  const [step, setStep] = useState<Step>('upload');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [thumbDragOver, setThumbDragOver] = useState(false);

  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);

  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Please upload an image file (JPG, PNG, WEBP).'); return; }
    setUploadError('');
    setThumbFile(file);
    
    // Reset cached analysis since the image changed
    setCurrentAnalysis(null);

    const reader = new FileReader();
    reader.onload = (e) => setThumbImage(e.target?.result as string);
    reader.readAsDataURL(file);

    const base64 = await imageToBase64(file);
    setThumbBase64(base64);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setThumbDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAnalysis = async (type: 'copy' | 'similar') => {
    if (!thumbFile || !thumbBase64) { setUploadError('Please drop a thumbnail image first.'); return; }
    if (!userRole) { onNavigate('signup'); return; }
    if (userRole === 'free' && freeUsesLeft <= 0) { onNavigate('pricing'); return; }

    setStep('analyze');
    setCompletedSteps([]);
    setActiveAnalysisStep(0);
    setAnalysisProgress(0);
    
    // Smooth fake UI progress
    const progressPromise = (async () => {
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setActiveAnalysisStep(i);
        await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
        setCompletedSteps(prev => [...prev, ANALYSIS_STEPS[i].key]);
        setAnalysisProgress(Math.round(((i + 1) / ANALYSIS_STEPS.length) * 100));
      }
    })();

    let analysis = currentAnalysis;
    let hasError = false;

    // Call API if not cached
    if (!analysis) {
      try {
        const res = await fetch('/.netlify/functions/analyse-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: thumbBase64, mediaType: thumbFile.type || 'image/jpeg' })
        });
        
        if (!res.ok) {
           console.error("Analysis request failed. Status:", res.status);
           hasError = true;
        } else {
           analysis = await res.json();
           setCurrentAnalysis(analysis);
        }
      } catch (err) {
        console.error(err);
        hasError = true;
      }
    }

    // Wait for the UI progress to finish if API is too fast, or wait for API if it's slow
    await progressPromise;

    if (hasError || !analysis) {
      setUploadError('Network or Analysis Error. Try again.');
      setStep('upload');
      return;
    }

    // Build the correct prompt type
    const prompt = type === 'copy' 
      ? buildCopyPrompt(analysis, selectedPlatform)
      : buildSimilarPrompt(analysis, selectedPlatform);

    setGeneratedPrompt(prompt);
    onUsed();
    setStep('result');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setThumbImage(null);
    setThumbFile(null);
    setThumbBase64(null);
    setCurrentAnalysis(null);
    setSelectedPlatform('midjourney');
    setStep('upload');
    setCompletedSteps([]);
    setAnalysisProgress(0);
    setGeneratedPrompt('');
  };

  const regenerateSimilar = () => {
    runAnalysis('similar');
  };

  const isLocked = userRole === 'free' && freeUsesLeft <= 0;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 grid-bg">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-grotesk font-bold text-3xl sm:text-4xl mb-3">
            Vision-to-Prompt Engine
          </h1>
          <p className="text-white/50">
            Drop a thumbnail to extract its visual DNA and reconstruct it block-by-block.
          </p>
          {userRole === 'free' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm">
              <span className={freeUsesLeft > 0 ? 'text-green-400' : 'text-red-400'}>●</span>
              <span className="text-white/60">
                {freeUsesLeft > 0
                  ? `${freeUsesLeft} free generation${freeUsesLeft !== 1 ? 's' : ''} remaining`
                  : 'Free trial ended — upgrade to continue'}
              </span>
              {freeUsesLeft <= 0 && (
                <button onClick={() => onNavigate('pricing')} className="ml-2 text-brand font-semibold hover:underline">
                  Upgrade →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Uploads */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thumbnail Upload */}
              <div className="glass rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5" r="3" stroke="#FF2D2D" strokeWidth="1.5"/>
                      <path d="M2 14C2 11.2 4.69 9 8 9C11.31 9 14 11.2 14 14" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-grotesk font-semibold text-white text-sm">Target Thumbnail</h3>
                    <p className="text-xs text-white/40">The image you want to reverse engineer</p>
                  </div>
                </div>

                {thumbImage ? (
                  <div className="relative group flex-1">
                    <img src={thumbImage} alt="Thumbnail" className="w-full h-full object-cover rounded-xl border border-white/5 min-h-[250px]" />
                    <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 delay-75">
                      <button
                        onClick={() => { setThumbImage(null); setThumbFile(null); setThumbBase64(null); setCurrentAnalysis(null); }}
                        className="px-5 py-2.5 bg-brand rounded-lg text-sm font-semibold text-white"
                      >
                        Replace Image
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-green-400 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      {thumbFile?.name || 'Image ready'}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div
                      className={`flex-1 upload-zone rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 border-dashed border-white/10 hover:border-brand/40 min-h-[250px] ${thumbDragOver ? 'border-brand bg-brand/5' : ''}`}
                      onClick={() => thumbInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setThumbDragOver(true); }}
                      onDragLeave={() => setThumbDragOver(false)}
                      onDrop={handleDrop}
                    >
                      <div className="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                          <path d="M10 4V13M10 4L7 7M10 4L13 7" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 16H16" stroke="#FF2D2D" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="text-base text-white/80 font-medium mb-1">Drop a thumbnail here or click to upload</p>
                      <p className="text-sm text-white/40">JPG, PNG, WEBP supported</p>
                    </div>
                    <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                        if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                        e.target.value = '';
                    }} />
                  </div>
                )}
                {uploadError && <p className="mt-3 text-sm text-red-400 font-medium">{uploadError}</p>}
              </div>
            </div>

            {/* Right Column: Style + Generate */}
            <div className="space-y-6">
              {/* Target Platform Selector */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-grotesk font-semibold text-white text-sm mb-4">Target AI Platform</h3>
                <div className="space-y-2">
                  {PLATFORM_OPTIONS.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                        selectedPlatform === platform.id
                          ? 'bg-brand/10 border-brand/40 text-white'
                          : 'border-white/5 hover:border-white/15 text-white/60 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      <div>
                        <div className="text-xs font-semibold">{platform.label}</div>
                        <div className="text-[10px] text-white/40">{platform.desc}</div>
                      </div>
                      {selectedPlatform === platform.id && (
                        <div className="ml-auto w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Buttons Block */}
              {thumbImage && (
                  <div className="glass rounded-2xl p-6">
                      <h3 className="font-grotesk font-semibold text-white text-sm mb-4">Choose Action</h3>
                      {isLocked ? (
                        <div className="rounded-xl border border-brand/20 bg-brand/5 p-5 text-center">
                          <p className="text-sm text-white/60 mb-3">Free trial exhausted. Upgrade for unlimited access.</p>
                          <button
                            onClick={() => onNavigate('pricing')}
                            className="w-full btn-primary py-2.5 rounded-lg text-sm font-bold text-white"
                          >
                            Upgrade to Pro — $2/mo
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => runAnalysis('copy')}
                                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all btn-primary hover:scale-[1.02]"
                            >
                                Copy This Thumbnail
                            </button>
                            <button
                                onClick={() => runAnalysis('similar')}
                                className="w-full py-3.5 rounded-xl text-sm font-bold text-brand transition-all border border-brand/40 hover:bg-brand/10 hover:border-brand hover:scale-[1.02]"
                            >
                                Generate Similar Style
                            </button>
                        </div>
                      )}
                  </div>
              )}
              
              {!thumbImage && (
                <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-50 border-dashed border-white/10">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    <p className="text-sm text-white/60 font-medium">Upload a thumbnail to reveal actions</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Step: Analyzing */}
        {step === 'analyze' && (
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-3xl p-8 box-border">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="font-grotesk font-bold text-2xl mb-2">Extracting Visual DNA</h2>
                <p className="text-white/50 text-sm">Decoding the image with Claude Vision engine...</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>Analysis Progress</span>
                  <span className="text-brand font-semibold">{analysisProgress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand to-red-400 rounded-full transition-all duration-500"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {ANALYSIS_STEPS.map((s, i) => {
                  const isDone = completedSteps.includes(s.key);
                  const isActive = i === activeAnalysisStep && !isDone;
                  return (
                    <div
                      key={s.key}
                      className={`rounded-xl p-4 flex items-start gap-3 transition-all ${
                        isDone ? 'glass' :
                        isActive ? 'bg-brand/10 border border-brand/30' :
                        'opacity-30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${
                        isDone ? 'bg-green-500/20' : isActive ? 'bg-brand/20' : 'bg-white/10'
                      }`}>
                        {isDone
                          ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.5 7.5L8 3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          : isActive
                          ? <div className="w-2 h-2 bg-brand rounded-full pulse-dot" />
                          : <div className="w-2 h-2 bg-white/20 rounded-full" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold mb-0.5 ${isDone ? 'text-white/80' : isActive ? 'text-brand' : 'text-white/30'}`}>
                          {s.label}
                        </div>
                        <div className="text-[11px] text-white/30 truncate">{s.detail}</div>
                      </div>
                      {isActive && (
                        <div className="text-[10px] text-brand font-medium flex-shrink-0 mt-0.5">Scanning...</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Prompt Output Column */}
            <div className="lg:col-span-3">
              <div className="glass rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-grotesk font-semibold text-white">Generated Architecture</h3>
                    <p className="text-xs text-brand mt-0.5">Optimized for {PLATFORM_OPTIONS.find(p => p.id === selectedPlatform)?.label}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-brand/10 text-brand border border-brand/30 hover:bg-brand/20'
                    }`}
                  >
                    {copied ? (
                      <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> Copied!</>
                    ) : (
                      <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="3" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M4 3V2C4 1.45 4.45 1 5 1H10C10.55 1 11 1.45 11 2V8C11 8.55 10.55 9 10 9H9" stroke="currentColor" strokeWidth="1.2"/></svg> Copy Prompt</>
                    )}
                  </button>
                </div>

                <div className="bg-black/40 rounded-xl p-5 font-mono text-[13px] text-white/80 leading-relaxed max-h-[500px] overflow-y-auto scroll-hide border border-white/5 break-words whitespace-pre-wrap flex-1">
                    {generatedPrompt}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Thumbnail Display Box */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-grotesk font-semibold text-white text-sm mb-4">Target Visual</h3>
                <div className="aspect-video rounded-xl overflow-hidden relative">
                   {thumbImage && <img src={thumbImage} alt="Thumbnail preview" className="w-full h-full object-cover"/>}
                </div>
              </div>

              {/* Action Buttons Box */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={resetAll}
                  className="w-full py-3.5 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  ← Start Over
                </button>
                <button
                  onClick={regenerateSimilar}
                  className="w-full py-3.5 rounded-xl border border-brand/30 bg-brand/5 text-sm font-semibold text-brand hover:border-brand hover:bg-brand/10 transition-all"
                >
                  Regenerate Similar Style ↻
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
