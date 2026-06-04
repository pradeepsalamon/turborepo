'use client';

import type { User, View } from '../../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  logout: () => void | Promise<void>;
}

const items: Array<{ label: string; value: View; matches: View[] }> = [
  { label: 'Movies', value: 'MOVIES', matches: ['MOVIES', 'MOVIE_DETAILS', 'SEAT_SELECTION'] },
  { label: 'My Bookings', value: 'BOOKINGS', matches: ['BOOKINGS'] },
  { label: 'Admin Portal', value: 'ADMIN', matches: ['ADMIN'] },
];

export function Navbar({ currentView, setView, user, logout }: NavbarProps) {
  const avatarLetter = user?.username?.charAt(0).toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setView('MOVIES')}
          className="text-left text-2xl font-black tracking-tight text-white"
        >
          <span className="bg-gradient-to-r from-orange-300 via-rose-200 to-sky-300 bg-clip-text text-transparent">
            BookMyShow
          </span>
        </button>

        <nav className="flex flex-wrap gap-2">
          {items.map((item) => {
            const active = item.matches.includes(currentView);

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setView(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-white text-slate-950'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-sky-500 text-sm font-bold text-white">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user.username}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/20"
            >
              Log Out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
