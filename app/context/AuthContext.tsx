import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchProfile,
  loginUser,
  registerUser,
  setAuthToken,
} from "../services/api";

const TOKEN_KEY = "medinfo_token";

type AuthUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  createdAt?: string;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  initializing: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(TOKEN_KEY);
        if (!mounted) return;

        if (saved) {
          setAuthToken(saved);
          setToken(saved);
          const profile = await fetchProfile().catch(() => null);
          setUser(profile?.user ?? null);
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await loginUser({ email, password });
    const newToken = data?.token;
    if (!newToken) throw new Error("Login failed.");

    setAuthToken(newToken);
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(data?.user ?? null);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    await registerUser({ name, email, password });
    await signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, initializing, signIn, signUp, signOut }),
    [token, user, initializing, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

