'use client';
import React from 'react';

export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`glass ${className}`} {...props} />;
}

export function Button(
  { children, className = '', ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }
) {
  return (
    <button
      className={`rounded-2xl bg-yellow-400 text-black font-semibold px-5 py-3 btn-glow hover:brightness-95 active:translate-y-[1px] disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold tracking-tight text-neutral-200">{children}</h2>;
}
