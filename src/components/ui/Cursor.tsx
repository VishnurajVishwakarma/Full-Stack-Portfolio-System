import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';

const emptySubscribe = () => () => {};

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const show = () => setHidden(false);
    const hide = () => setHidden(true);
    
    window.addEventListener('mousemove', fn);
    window.addEventListener('mouseenter', show);
    window.addEventListener('mouseleave', hide);
    return () => {
      window.removeEventListener('mousemove', fn);
      window.removeEventListener('mouseenter', show);
      window.removeEventListener('mouseleave', hide);
    };
  }, []);

  if (!isMounted || hidden) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00f0ff]/50 mix-blend-screen pointer-events-none z-[100]"
      animate={{ x: position.x - 16, y: position.y - 16 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
    />
  );
}
