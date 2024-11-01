import React, { useState, useEffect } from 'react';

const words = ['Revolutionise', 'Transform', 'Innovate', 'Accelerate', 'Elevate'];

const AnimatedHeroTitle: React.FC = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentIndex = wordIndex % words.length;
      const fullWord = words[currentIndex];

      if (!isDeleting) {
        setCurrentWord(fullWord.substring(0, currentWord.length + 1));
        setTypingSpeed(150);
      } else {
        setCurrentWord(fullWord.substring(0, currentWord.length - 1));
        setTypingSpeed(75);
      }

      if (!isDeleting && currentWord === fullWord) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentWord === '') {
        setIsDeleting(false);
        setWordIndex((prev) => prev + 1);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, wordIndex, typingSpeed]);

  return (
    <h1 className="font-rubik-mono text-hero-title mb-6 text-center">
      <span className="text-gray-800">
        <span className="typewriter-word">{currentWord}</span>
      </span>
      <br />
      <span className="text-gray-800">Your Business with</span>
      <br />
      <span className="inline-block bg-gray-800 text-accent px-2 py-1 mt-2">AI Automation</span>
    </h1>
  );
};

export default AnimatedHeroTitle;