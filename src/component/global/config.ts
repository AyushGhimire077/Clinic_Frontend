import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface MyJwtPayload {
  sub: string; // email
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

const base_url = import.meta.env.VITE_BACKEND_DEV_HOST as string;

export const getTokenFromCookies = (): string | null => {
  const cookies = new Cookies();
  return cookies.get("AUTH_TOKEN") ?? null;
};

export const getDecodedToken = (): MyJwtPayload | null => {
  const token = getTokenFromCookies();
  if (!token) return null;
  return jwtDecode<MyJwtPayload>(token);
};

export const getUsernameFromCookies = () => {
  const decoded = getDecodedToken();
  return decoded?.sub ?? null;
};

export const getRoleFromCookies = () => {
  const decoded = getDecodedToken();
  return decoded?.role ?? null;
};

//  Public API (No Auth)
export const axios_no_auth = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Authenticated API (Token added dynamically)
export const axios_auth = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
