'use client';

import dynamic from 'next/dynamic';

// Importar dinámicamente el juego para evitar problemas con SSR
const LimaGame = dynamic(() => import('@/components/LimaGame'), { ssr: false });

export default function Home() {
  return (
    <div className="w-full h-full fixed inset-0 bg-black overflow-hidden">
      <LimaGame />
    </div>
  );
}
