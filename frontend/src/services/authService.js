// authService.js
//
// REAL IMPLEMENTATION — calls the EngiLearn backend at VITE_API_URL.
// Signatures kept identical to the earlier mock so nothing that calls
// these functions needed to change.

import api from './api';

export async function login({ email, password }) {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return { success: true, token: data.token, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function register({ name, email, password, department }) {
  try {
    const { data } = await api.post('/auth/register', { name, email, password, department });
    return { success: true, token: data.token, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getMe() {
  try {
    const { data } = await api.get('/auth/me');
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateMe(updates) {
  try {
    const { data } = await api.patch('/users/me', updates);
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function logout() {
  // No server-side session to invalidate with a plain JWT — clearing the
  // stored token (done by AuthContext) is the entire logout.
  return { success: true };
}
