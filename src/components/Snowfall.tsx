import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<Array<{
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const generateFlakes = () => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 8 + 4,
        duration: Math.random() * 8 + 12,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.6 + 0.4
      }));
    };
    
    setFlakes(generateFlakes());
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {flakes.map(flake => (
        <div
          key={flake.id}
          className="snowflake absolute text-white animate-pulse"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`
          }}
        >
          ❄️
        </div>
      ))}
      
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Snowfall;
