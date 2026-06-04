import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_26%),linear-gradient(180deg,_#020617,_#0f172a)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-white/8 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.65)] backdrop-blur">
        <div className="mb-8">
          <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
            Book My Show
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
