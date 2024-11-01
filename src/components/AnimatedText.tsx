import React, { useState, useEffect } from 'react';

const words = ['Innovative', 'Intelligent', 'Intuitive'];

const AnimatedText: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-accent">
      {words[index]}
    </span>
  );
};

export default AnimatedText;