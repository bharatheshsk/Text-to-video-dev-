
export type VoiceOption = 'male' | 'female';
export type VideoStyle = 'realistic' | 'animated' | 'cinematic' | 'storytelling' | 'educational';
export type MusicMood = 'happy' | 'calm' | 'suspenseful' | 'epic' | 'sad';

export interface Option<T> {
  value: T;
  label: string;
}

export interface Scene {
    scene: string;
}

export interface GeneratedClip {
    sceneText: string;
    videoUrl: string;
    narration: SpeechSynthesisUtterance;
}
