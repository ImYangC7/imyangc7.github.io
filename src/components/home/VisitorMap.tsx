'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MAP_SCRIPT_ID = 'mapmyvisitors';
const MAP_SCRIPT_SRC = '//mapmyvisitors.com/map.js?d=EeGT-Tlz_HMIXRAKprJ0fN3DlkZE1zzRVnUGhVyP9F4&cl=ffffff&w=a';

export default function VisitorMap({ title = 'Visitor Map' }: { title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (container.querySelector(`#${MAP_SCRIPT_ID}`)) return;

    const script = document.createElement('script');
    script.id = MAP_SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = MAP_SCRIPT_SRC;
    script.async = true;

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="flex flex-col items-center"
    >
      <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
      <div
        ref={containerRef}
        className="w-full max-w-2xl rounded-xl border border-neutral-200 dark:border-neutral-700/60 bg-neutral-50 dark:bg-neutral-900 shadow-sm p-3"
      />
    </motion.section>
  );
}
