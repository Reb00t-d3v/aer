import { useEffect, useState } from "react";

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState({ width: '160px', height: '160px', opacity: '0.2' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Only add mousemove event listener if not on mobile
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
        
        // Check if over interactive element
        const target = e.target as HTMLElement;
        const isInteractive = 
          target.tagName.toLowerCase() === 'a' || 
          target.tagName.toLowerCase() === 'button' ||
          target.closest('a') ||
          target.closest('button');
        
        if (isInteractive) {
          setSize({
            width: '60px',
            height: '60px',
            opacity: '0.4'
          });
        } else {
          setSize({
            width: '160px',
            height: '160px',
            opacity: '0.2'
          });
        }
      };
      
      // Show cursor after a slight delay to prevent initial jump
      setTimeout(() => setVisible(true), 100);
      
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', checkMobile);
      };
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  if (isMobile || !visible) return null;

  return (
    <div 
      className="cursor-circle fixed w-40 h-40 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        opacity: size.opacity,
        transition: 'transform 0.1s ease-out, width 0.3s ease, height 0.3s ease, opacity 0.5s ease'
      }}
    />
  );
};

export default CursorFollower;
