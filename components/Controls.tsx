
import React from 'react';
import type { VoiceOption, VideoStyle, MusicMood } from '../types';
import { VOICE_OPTIONS, VIDEO_STYLES, MUSIC_MOODS } from '../constants';
import { GenerateIcon } from './icons/GenerateIcon';

interface ControlsProps {
  script: string;
  setScript: (script: string) => void;
  voice: VoiceOption;
  setVoice: (voice: VoiceOption) => void;
  videoStyle: VideoStyle;
  setVideoStyle: (style: VideoStyle) => void;
  musicMood: MusicMood;
  setMusicMood: (mood: MusicMood) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  script,
  setScript,
  voice,
  setVoice,
  videoStyle,
  setVideoStyle,
  musicMood,
  setMusicMood,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
      <div>
        <label htmlFor="script" className="block text-lg font-semibold mb-2 text-gray-300">
          Your Script
        </label>
        <textarea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste or type your story here. The AI will break it into scenes automatically."
          className="w-full h-48 p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="voice" className="block text-sm font-medium mb-1 text-gray-400">Voice</label>
          <select
            id="voice"
            value={voice}
            onChange={(e) => setVoice(e.target.value as VoiceOption)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {VOICE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="videoStyle" className="block text-sm font-medium mb-1 text-gray-400">Video Style</label>
          <select
            id="videoStyle"
            value={videoStyle}
            onChange={(e) => setVideoStyle(e.target.value as VideoStyle)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {VIDEO_STYLES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="musicMood" className="block text-sm font-medium mb-1 text-gray-400">Music Mood</label>
          <select
            id="musicMood"
            value={musicMood}
            onChange={(e) => setMusicMood(e.target.value as MusicMood)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {MUSIC_MOODS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        <GenerateIcon />
        {isLoading ? 'Generating...' : 'Generate Video'}
      </button>
    </div>
  );
};
