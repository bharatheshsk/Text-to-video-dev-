
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { VideoPreview } from './components/VideoPreview';
import type { VoiceOption, VideoStyle, MusicMood, Scene, GeneratedClip } from './types';
import { splitTextIntoScenes, generateVideoForScene } from './services/geminiService';
import { VOICE_OPTIONS, VIDEO_STYLES, MUSIC_MOODS, LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [script, setScript] = useState<string>('');
  const [voice, setVoice] = useState<VoiceOption>(VOICE_OPTIONS[0].value);
  const [videoStyle, setVideoStyle] = useState<VideoStyle>(VIDEO_STYLES[0].value);
  const [musicMood, setMusicMood] = useState<MusicMood>(MUSIC_MOODS[0].value);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generatedClips, setGeneratedClips] = useState<GeneratedClip[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const findMatchingVoice = useCallback((voiceOption: VoiceOption): SpeechSynthesisVoice | undefined => {
    if (voices.length === 0) return undefined;
    const lowerCaseOption = voiceOption.toLowerCase();
    
    let preferredVoice = voices.find(v => v.name.toLowerCase().includes('google') && v.name.toLowerCase().includes(lowerCaseOption));
    if (preferredVoice) return preferredVoice;

    preferredVoice = voices.find(v => v.name.toLowerCase().includes(lowerCaseOption));
    if (preferredVoice) return preferredVoice;

    // FIX: Removed checks for the non-standard 'gender' property on SpeechSynthesisVoice to resolve TypeScript errors.
    // The existing name-based matching is a more portable solution.

    return voices[0];
  }, [voices]);


  const handleGenerateVideo = useCallback(async () => {
    if (!script.trim()) {
      setError("Please enter a script to generate a video.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedClips([]);
    setLoadingMessage(LOADING_MESSAGES.analyzing);

    try {
      const scenes: Scene[] = await splitTextIntoScenes(script);
      if (!scenes || scenes.length === 0) {
        throw new Error("Could not split the script into scenes.");
      }
      
      const clips: GeneratedClip[] = [];
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        setLoadingMessage(`${LOADING_MESSAGES.generating} scene ${i + 1} of ${scenes.length}... (This may take several minutes)`);
        
        const prompt = `A ${videoStyle} video of: ${scene.scene}`;
        const videoData = await generateVideoForScene(prompt);

        const narration = new SpeechSynthesisUtterance(scene.scene);
        const selectedVoice = findMatchingVoice(voice);
        if (selectedVoice) {
            narration.voice = selectedVoice;
        }

        clips.push({
          sceneText: scene.scene,
          videoUrl: videoData,
          narration,
        });
        setGeneratedClips([...clips]);
      }
      setLoadingMessage(LOADING_MESSAGES.ready);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during video generation.");
    } finally {
      setIsLoading(false);
    }
  }, [script, videoStyle, voice, findMatchingVoice]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Controls
            script={script}
            setScript={setScript}
            voice={voice}
            setVoice={setVoice}
            videoStyle={videoStyle}
            setVideoStyle={setVideoStyle}
            musicMood={musicMood}
            setMusicMood={setMusicMood}
            onGenerate={handleGenerateVideo}
            isLoading={isLoading}
          />
          <VideoPreview
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            clips={generatedClips}
            error={error}
            musicMood={musicMood}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
