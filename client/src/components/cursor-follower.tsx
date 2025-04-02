import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    // Add event listener
    document.addEventListener("mousemove", updatePosition);
    
    return () => {
      document.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  return (
    <>
      {/* Only a large purple circle - pure CSS implementation */}
      <div
        className="pointer-events-none fixed w-[450px] h-[450px] rounded-full z-[9999]"
        style={{
          left: position.x - 225,
          top: position.y - 225,
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(139, 92, 246, 0.3) 30%, rgba(139, 92, 246, 0) 70%)',
          filter: 'blur(45px)',
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      />
    </>
  );
};

export default CursorFollower;
