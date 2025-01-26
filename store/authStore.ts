import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      access_token: null,
      isAuthenticated: false,
      setUser: (user, token) =>
        set({
          user,
          access_token: token,
          isAuthenticated: true,
        }),
      clearUser: () =>
        set({
          user: null,
          access_token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-store", // Key for localStorage, 
    }
  )
);