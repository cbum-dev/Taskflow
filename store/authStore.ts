import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null, 
  accessToken: null,
  isAuthenticated: false, 

  setUser: (user, token) =>
    set(() => ({
      user,
      accessToken: token,
      isAuthenticated: true,
    })),
  clearUser: () =>
    set(() => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    })),
}));
