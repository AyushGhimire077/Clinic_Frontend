import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useToastStore } from "../toaster/stores/toast.store";

interface MyJwtPayload {
  sub: string; // email
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

const base_url = import.meta.env.VITE_BACKEND_DEV_HOST as string;

//  TOKEN HELPERS

export const getTokenFromCookies = (): string | null => {
  const cookies = new Cookies();
  return cookies.get("AUTH_TOKEN") ?? null;
};

export const getDecodedToken = (): MyJwtPayload | null => {
  const token = getTokenFromCookies();
  if (!token) return null;
  return jwtDecode<MyJwtPayload>(token);
};

export const getUsernameFromCookies = () => getDecodedToken()?.sub ?? null;

export const getRoleFromCookies = () => getDecodedToken()?.role ?? null;

//  AXIOS INSTANCES

export const axios_no_auth = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axios_auth = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//  INTERCEPTORS

// RESPONSE → GLOBAL TOAST
axios_auth.interceptors.response.use(
  (response) => {
    const { message, severity } = response.data || {};

    if (message) {
      useToastStore.getState().showToast(message, severity?.toLowerCase());
    }

    return response;
  },
  (error) => {
    const msg =
      error.response?.data?.message || error.message || "Something went wrong";

    useToastStore.getState().showToast(msg, "error");

    // OPTIONAL: auto logout on 401
    if (error.response?.status === 401) {
      const cookies = new Cookies();
      cookies.remove("AUTH_TOKEN");
    }

    return Promise.reject(error);
  }
);
