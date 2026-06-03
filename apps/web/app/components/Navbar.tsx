'use client';

import React from 'react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  user: { username: string; email: string } | null;
  logout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, logout }) => {
  const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={() => setView('MOVIES')}>
        🎬 BookMyShow
      </div>
      
      <nav className="navbar-menu">
        <button 
          className={`navbar-btn ${currentView === 'MOVIES' || currentView === 'MOVIE_DETAILS' || currentView === 'SEAT_SELECTION' ? 'active' : ''}`}
          onClick={() => setView('MOVIES')}
        >
          Movies
        </button>
        <button 
          className={`navbar-btn ${currentView === 'BOOKINGS' ? 'active' : ''}`}
          onClick={() => setView('BOOKINGS')}
        >
          My Bookings
        </button>
        <button 
          className={`navbar-btn ${currentView === 'ADMIN' ? 'active' : ''}`}
          onClick={() => setView('ADMIN')}
        >
          Admin Portal
        </button>
      </nav>

      {user && (
        <div className="navbar-user">
          <div className="navbar-avatar">{avatarLetter}</div>
          <span className="navbar-username">{user.username}</span>
          <button className="btn-mini-logout" onClick={logout}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
};
