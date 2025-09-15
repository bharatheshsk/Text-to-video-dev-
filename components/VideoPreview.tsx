
import React, { useState, useEffect, useRef } from 'react';
import type { GeneratedClip, MusicMood } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface VideoPreviewProps {
  isLoading: boolean;
  loadingMessage: string;
  clips: GeneratedClip[];
  error: string | null;
  musicMood: MusicMood;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
        <svg className="animate-spin h-12 w-12 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

export const VideoPreview: React.FC<VideoPreviewProps> = ({ isLoading, loadingMessage, clips, error, musicMood }) => {
    const [currentClipIndex, setCurrentClipIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleVideoEnd = () => {
            if (currentClipIndex < clips.length - 1) {
                setCurrentClipIndex(prev => prev + 1);
            } else {
                setIsPlaying(false);
                setCurrentClipIndex(0); // Loop back to start
            }
        };

        videoElement.addEventListener('ended', handleVideoEnd);
        return () => videoElement.removeEventListener('ended', handleVideoEnd);
    }, [currentClipIndex, clips.length]);

    useEffect(() => {
        if (isPlaying && videoRef.current) {
            videoRef.current.play().catch(e => console.error("Playback failed:", e));
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(clips[currentClipIndex].narration);
        } else if (!isPlaying && videoRef.current) {
            videoRef.current.pause();
            window.speechSynthesis.cancel();
        }
    }, [isPlaying, currentClipIndex, clips]);

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleClipSelect = (index: number) => {
        setCurrentClipIndex(index);
        setIsPlaying(true);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="text-lg mt-4 text-gray-300">{loadingMessage}</p>
                    {clips.length > 0 && (
                        <div className="mt-4 text-sm text-gray-400">
                           <p>Clips are being generated one by one. You can preview them below as they complete.</p>
                        </div>
                    )}
                </div>
            );
        }
        if (error) {
            return <p className="text-red-400 text-center">{error}</p>;
        }
        if (clips.length === 0) {
            return <p className="text-gray-400 text-center">Your generated video will appear here.</p>;
        }
        return (
            <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                    <video ref={videoRef} key={clips[currentClipIndex].videoUrl} src={clips[currentClipIndex].videoUrl} className="w-full h-full object-contain" controls={false}></video>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-center text-white">
                        {/* FIX: Corrected typo from `currentClip-Index` to `currentClipIndex`. */}
                        <p className="font-mono text-sm md:text-base">{clips[currentClipIndex].sceneText}</p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handlePlayPause} className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors">
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        <div className="text-sm text-gray-400">Clip {currentClipIndex + 1} / {clips.length}</div>
                    </div>
                    <div className="text-sm text-gray-400 capitalize">
                        Music Mood: <span className="font-semibold text-indigo-300">{musicMood}</span>
                    </div>
                </div>

                <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Scenes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {clips.map((clip, index) => (
                            <div key={index} className="relative group cursor-pointer" onClick={() => handleClipSelect(index)}>
                                <video src={clip.videoUrl} className={`w-full aspect-video object-cover rounded-md border-2 ${index === currentClipIndex ? 'border-indigo-500' : 'border-transparent group-hover:border-gray-500'}`}></video>
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayIcon className="w-8 h-8"/>
                                </div>
                                <a href={clip.videoUrl} download={`scene_${index + 1}.mp4`} onClick={e => e.stopPropagation()} className="absolute top-1 right-1 p-1.5 bg-gray-800 bg-opacity-60 rounded-full text-white hover:bg-opacity-90 transition-all opacity-0 group-hover:opacity-100">
                                    <DownloadIcon className="w-4 h-4" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg min-h-[30rem] flex items-center justify-center">
            {renderContent()}
        </div>
    );
};
