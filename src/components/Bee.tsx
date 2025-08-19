'use client';
export default function Bee({ size=140 }: { size?: number }) {
  return (
    <div className="relative inline-block">
      <img src="/bee.png" alt="EcoBee" width={size} height={size}
           className="rounded-[28%] object-contain"/>
      {/* 触角光晕 */}
      <span className="pointer-events-none absolute -top-2 left-1/3 h-5 w-5 rounded-full bg-yellow-400/70 blur-[6px]" />
      <span className="pointer-events-none absolute -top-2 right-1/3 h-5 w-5 rounded-full bg-yellow-400/70 blur-[6px]" />
    </div>
  );
}
