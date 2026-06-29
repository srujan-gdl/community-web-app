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

/**
 * Mock login simulation logic representing the backend API authentication.
 */
export function simulateLogin(email, password) {
  let user = null;

  if (email === 'superadmin@cotogate.com') {
    user = {
      id: 'usr-super',
      first_name: 'Super',
      last_name: 'Admin',
      name: 'Super Admin',
      email: 'superadmin@cotogate.com',
      role: 'super_admin',
      must_change_password: password === 'admin123'
    };
  } else if (email === 'admin@cotogate.com') {
    user = {
      id: 'usr-coto',
      first_name: 'Alex',
      last_name: 'Ramos',
      name: 'Alex Ramos',
      email: 'admin@cotogate.com',
      role: 'coto_admin',
      managed_community_id: 'comm-1',
      must_change_password: password === 'admin123'
    };
  } else if (email === 'guard@cotogate.com') {
    user = {
      id: 'usr-guard',
      first_name: 'Guardia',
      last_name: 'Robles',
      name: 'Guardia Robles',
      email: 'guard@cotogate.com',
      role: 'guard',
      must_change_password: password === 'guard123'
    };
  } else if (email === 'resident@cotogate.com') {
    user = {
      id: 'usr-resident',
      first_name: 'Carlos',
      last_name: 'Perez',
      name: 'Carlos Perez',
      email: 'resident@cotogate.com',
      role: 'resident_owner',
      must_change_password: password === 'resident123'
    };
  }

  const isValidPassword =
    password === 'admin123' ||
    password === 'guard123' ||
    password === 'resident123' ||
    password === 'permanent123';

  if (user && isValidPassword) {
    return { success: true, user };
  }
  return { success: false, errorKey: 'login.error.invalid' };
}
