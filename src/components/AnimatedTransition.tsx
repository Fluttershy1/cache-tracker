import React, { useEffect, useState } from 'react';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition; 