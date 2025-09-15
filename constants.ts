
import type { Option, VoiceOption, VideoStyle, MusicMood } from './types';

export const VOICE_OPTIONS: Option<VoiceOption>[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

export const VIDEO_STYLES: Option<VideoStyle>[] = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'animated', label: 'Animated' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'educational', label: 'Educational' },
];

export const MUSIC_MOODS: Option<MusicMood>[] = [
  { value: 'happy', label: 'Happy' },
  { value: 'calm', label: 'Calm' },
  { value: 'suspenseful', label: 'Suspenseful' },
  { value: 'epic', label: 'Epic' },
  { value: 'sad', label: 'Sad' },
];

export const LOADING_MESSAGES = {
    analyzing: "Analyzing your script...",
    generating: "Generating video for",
    stitching: "Stitching scenes together...",
    ready: "Your video is ready!",
};
