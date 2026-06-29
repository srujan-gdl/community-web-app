/**
 * Central API service layer for CotoGate Web App.
 *
 * All HTTP calls go through `apiFetch` which:
 *   - Reads VITE_API_URL from env (falls back to localhost:4000)
 *   - Injects the JWT from sessionStorage via Authorization header
 *   - Returns { data } on success or throws an ApiError on failure
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

// ---------------------------------------------------------------------------
// Core fetcher
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * @param {string} path - e.g. '/api/v1/communities'
 * @param {RequestInit} [options] - standard fetch options (method, body, etc.)
 * @returns {Promise<any>} parsed JSON response body
 * @throws {ApiError}
 */
export async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem('cotogate_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError('Network error — server unreachable.', 0, null);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? `HTTP ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------

/** POST /api/v1/auth/onboard-coto-admin */
export function onboardCotoAdmin(payload) {
  return apiFetch('/api/v1/auth/onboard-coto-admin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /api/v1/auth/onboard-resident */
export function onboardResident(payload) {
  return apiFetch('/api/v1/auth/onboard-resident', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Communities endpoints
// ---------------------------------------------------------------------------

/** GET /api/v1/communities */
export function getCommunities() {
  return apiFetch('/api/v1/communities');
}

/** POST /api/v1/communities */
export function createCommunity(payload) {
  return apiFetch('/api/v1/communities', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Units endpoints
// ---------------------------------------------------------------------------

/** GET /api/v1/communities/:communityId/units */
export function getUnits(communityId) {
  return apiFetch(`/api/v1/communities/${communityId}/units`);
}

/** POST /api/v1/communities/:communityId/units */
export function createUnit(communityId, payload) {
  return apiFetch(`/api/v1/communities/${communityId}/units`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /api/v1/units/:unitId/links */
export function linkUserToUnit(unitId, payload) {
  return apiFetch(`/api/v1/units/${unitId}/links`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
