
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-gray-800 shadow-md">
    <div className="container mx-auto px-4 py-5 md:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
        Text-to-Video Creator
      </h1>
      <p className="text-center text-gray-400 mt-2">Bring your stories to life with AI-powered video generation.</p>
    </div>
  </header>
);
