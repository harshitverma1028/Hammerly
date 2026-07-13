import { create } from "zustand";
import api from "../services/api";

const storedUser = localStorage.getItem("auction_user");

const useAuthStore = create((set, get) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("auction_token") || null,
  loading: false,

  register: async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("auction_token", data.token);
    localStorage.setItem("auction_user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data.user;
  },

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("auction_token", data.token);
    localStorage.setItem("auction_user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data.user;
  },

  logout: () => {
    localStorage.removeItem("auction_token");
    localStorage.removeItem("auction_user");
    set({ user: null, token: null });
  },

  updateUser: (user) => {
    localStorage.setItem("auction_user", JSON.stringify(user));
    set({ user });
  },

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === "admin",
}));

export default useAuthStore;
