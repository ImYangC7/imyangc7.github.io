'use client';

import { useEffect, useRef } from 'react';

const MAP_SCRIPT_ID = 'mapmyvisitors';
const MAP_SCRIPT_SRC = 'https://mapmyvisitors.com/map.js?d=EeGT-Tlz_HMIXRAKprJ0fN3DlkZE1zzRVnUGhVyP9F4&cl=ffffff&w=a';

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
    <section className="fade-in-up mb-6 w-full">
      <h2 className="text-sm font-semibold text-primary mb-2">{title}</h2>
      <div
        ref={containerRef}
        className="flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-2 shadow-sm [&_canvas]:max-h-full [&_canvas]:max-w-full [&_iframe]:max-h-full [&_iframe]:max-w-full [&_img]:max-h-full [&_img]:max-w-full [&_object]:max-h-full [&_object]:max-w-full"
      />
    </section>
  );
}
