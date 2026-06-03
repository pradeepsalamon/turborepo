'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { user, loading, register, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const regResult = await register(username, email, password);
      
      if (regResult.success) {
        setSuccess(true);
        // Automatically log user in after successful registration
        const logResult = await login(email, password);
        if (!logResult.success) {
          setError('Registration succeeded, but auto-login failed. Please log in manually.');
          setSubmitting(false);
        }
      } else {
        setError(regResult.error || 'Registration failed');
        setSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Get started with a new account today</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">Account created! Logging in...</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
