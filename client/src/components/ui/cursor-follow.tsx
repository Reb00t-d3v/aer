import { useEffect, useState } from "react";

export function CursorFollow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Hide cursor after 2 seconds of inactivity
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };
    
    // Add event listeners
    if (isActive) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("mouseenter", handleMouseEnter);
    }
    
    // Clean up
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearTimeout(timeout);
    };
  }, [isActive]);
  
  // Don't render on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsActive(window.innerWidth > 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  if (!isActive) return null;
  
  return (
    <div 
      className="cursor-follow" 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`, 
        opacity: isVisible ? 1 : 0 
      }}
    />
  );
}
