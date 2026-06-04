import { apiRequest } from './api-client';
import type { User } from '../types';

export async function fetchCurrentUser() {
  return apiRequest<User>('/auth/me');
}

export async function loginUser(email: string, password: string) {
  return apiRequest<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(username: string, email: string, password: string) {
  return apiRequest<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export async function logoutUser() {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
    skipJson: true,
  });
}
