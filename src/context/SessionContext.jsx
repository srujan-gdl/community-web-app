import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * SessionContext
 * Holds the authenticated user and JWT token for the current session.
 * On mount, restores session from sessionStorage so page refreshes don't log the user out.
 * On logout, clears both in-memory state and sessionStorage.
 */
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore session on mount (survives page refresh within same tab)
  useEffect(() => {
    try {
      const token = sessionStorage.getItem('cotogate_token');
      const userJson = sessionStorage.getItem('cotogate_user');
      if (token && userJson) {
        setAuthToken(token);
        setCurrentUser(JSON.parse(userJson));
      }
    } catch {
      // Corrupted storage — start fresh
      sessionStorage.removeItem('cotogate_token');
      sessionStorage.removeItem('cotogate_user');
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setSession = useCallback((user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    sessionStorage.setItem('cotogate_token', token);
    sessionStorage.setItem('cotogate_user', JSON.stringify(user));
  }, []);

  const clearSession = useCallback(() => {
    setCurrentUser(null);
    setAuthToken(null);
    sessionStorage.removeItem('cotogate_token');
    sessionStorage.removeItem('cotogate_user');
  }, []);

  return (
    <SessionContext.Provider value={{ currentUser, authToken, setSession, clearSession, isHydrated }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
}
