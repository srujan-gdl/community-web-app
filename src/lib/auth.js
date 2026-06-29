/**
 * Password strength calculation utility.
 * Returns score, label key for translation, and theme-compatible status color.
 */
export function getPasswordStrength(pass) {
  if (!pass) {
    return { score: 0, labelKey: '', color: 'bg-slate-200 dark:bg-slate-700' };
  }
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) {
    return { score, labelKey: 'weak', color: 'bg-red-500' };
  }
  if (score <= 3) {
    return { score, labelKey: 'medium', color: 'bg-amber-500' };
  }
  return { score, labelKey: 'strong', color: 'bg-emerald-500' };
}

// ---------------------------------------------------------------------------
// Real API integration
// ---------------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

/**
 * Calls POST /api/v1/auth/login on the backend.
 *
 * On success returns:  { success: true, token: string, user: object }
 * On 400/401 returns:  { success: false, errorKey: string }
 * On network error:    { success: false, errorKey: 'login.error.network' }
 *
 * The `user` shape mirrors the backend response (see README §Login):
 *   { id, first_name, last_name, email, role, must_change_password, communities[] }
 */
export async function loginWithApi(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // Parse JSON regardless — the backend always returns a JSON body.
    const data = await response.json();

    if (response.ok) {
      // Store the JWT so subsequent requests can include it.
      sessionStorage.setItem('cotogate_token', data.token);
      return { success: true, token: data.token, user: data.user };
    }

    // 400 Missing fields or 401 Invalid credentials
    if (response.status === 401 || response.status === 400) {
      return { success: false, errorKey: 'login.error.invalid' };
    }

    // Any other unexpected HTTP error
    return { success: false, errorKey: 'login.error.server' };
  } catch {
    // Fetch itself threw — backend is unreachable (CORS, network, server down)
    return { success: false, errorKey: 'login.error.network' };
  }
}

// ---------------------------------------------------------------------------
// Mock (kept for unit tests and offline development fallback)
// ---------------------------------------------------------------------------

/**
 * Offline mock that mirrors the loginWithApi response shape.
 * Used by unit tests and as a fallback when VITE_API_URL is not set.
 */
export function simulateLogin(email, password) {
  let user = null;

  if (email === 'superadmin@cotogate.com') {
    user = {
      id: 'usr-super',
      first_name: 'Super',
      last_name: 'Admin',
      email: 'superadmin@cotogate.com',
      role: 'super_admin',
      must_change_password: password === 'admin123',
      communities: []
    };
  } else if (email === 'admin@cotogate.com') {
    user = {
      id: 'usr-coto',
      first_name: 'Alex',
      last_name: 'Ramos',
      email: 'admin@cotogate.com',
      role: 'coto_admin',
      managed_community_id: 'comm-1',
      must_change_password: password === 'admin123',
      communities: []
    };
  } else if (email === 'guard@cotogate.com') {
    user = {
      id: 'usr-guard',
      first_name: 'Guardia',
      last_name: 'Robles',
      email: 'guard@cotogate.com',
      role: 'guard',
      must_change_password: password === 'guard123',
      communities: []
    };
  } else if (email === 'resident@cotogate.com') {
    user = {
      id: 'usr-resident',
      first_name: 'Carlos',
      last_name: 'Perez',
      email: 'resident@cotogate.com',
      role: 'resident_owner',
      must_change_password: password === 'resident123',
      communities: []
    };
  }

  const isValidPassword =
    password === 'admin123' ||
    password === 'guard123' ||
    password === 'resident123' ||
    password === 'permanent123';

  if (user && isValidPassword) {
    return { success: true, token: 'mock-jwt-token', user };
  }
  return { success: false, errorKey: 'login.error.invalid' };
}
