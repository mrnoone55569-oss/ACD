import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<number[]>([]);

  useEffect(() => {
    setFlakes(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {flakes.map(i => (
        <div
          key={i}
          className="snowflake absolute top-0 text-white opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 10}px`
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
