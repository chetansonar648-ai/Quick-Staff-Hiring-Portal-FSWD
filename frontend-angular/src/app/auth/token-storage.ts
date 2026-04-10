export function getAuthToken(): string | null {
  // React stores token under `token` and also maintains `qs_token` in some flows.
  // We accept both to match behavior.
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('qs_token') ||
    null
  );
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token);
  localStorage.setItem('qs_token', token);
}

export function setSessionUser(user: unknown): void {
  const json = JSON.stringify(user);
  localStorage.setItem('user', json);
  localStorage.setItem('qs_user', json);
  if (user && typeof user === 'object' && user !== null && 'role' in user) {
    const r = (user as { role?: unknown }).role;
    if (typeof r === 'string' && r.length > 0) {
      localStorage.setItem('role', r);
    }
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('qs_token');
  localStorage.removeItem('user');
  localStorage.removeItem('qs_user');
  localStorage.removeItem('role');
}

