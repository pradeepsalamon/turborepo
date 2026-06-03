'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your space...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Get first letter of username for avatar
  const avatarLetter = user.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="dashboard-avatar">{avatarLetter}</div>
          <h1 className="dashboard-title">Welcome, {user.username}!</h1>
          <p className="dashboard-email">{user.email}</p>
        </div>

        <div className="dashboard-info-section">
          <div className="info-row">
            <span className="info-label">User ID</span>
            <span className="info-value">{user.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Username</span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email Address</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="info-value" style={{ color: '#86efac' }}>● Active (Authenticated)</span>
          </div>
        </div>

        <button onClick={logout} className="btn-logout">
          Log Out Securely
        </button>
      </div>
    </div>
  );
}
