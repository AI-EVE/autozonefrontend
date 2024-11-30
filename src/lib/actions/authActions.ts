"use server";

import { z } from "zod";
import { LoginFormSchema, signUpProps, TokenData, User } from "../types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkTokenExpiration } from "@lib/helper";

export async function loginUser(loginData: z.infer<typeof LoginFormSchema>) {
  const response = await fetch(`${process.env.API_URL}/api/Account/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) return { data: null, error: "Invalid login credentials." };

  const token = await response.json();

  const getCookies = cookies();
  getCookies.set("auto-zone-token", token.token);

  return { data: token, error: null };
}

export async function getCurrentUser(): Promise<User | null> {
  const getCookies = cookies();
  const token = getCookies.get("auto-zone-token")?.value || "";

  if (!token) return null;

  const user = jwtDecode(token) as TokenData;

  const hasExpired = checkTokenExpiration(user);

  if (hasExpired) return null;

  return user;
}
export async function signUp({
  email,
  username,
  password,
  token,
}: signUpProps) {
  if (!token)
    return {
      data: null,
      error: "You are not authroized to do this action, Please login first.",
    };
  const res = await fetch(`${process.env.API_URL}/api/Account/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok)
    return {
      data: null,
      error: `Something went wrong with the signup process.`,
    };

  // const data = await res.json();
  redirect("/login");
}

export async function logoutUser() {
  const getCookies = cookies();
  const token = getCookies.get("auto-zone-token")?.value || "";

  if (!token) throw new Error("The user is already logged out");
  const response = await fetch(`${process.env.API_URL}/api/Account/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok)
    return {
      data: null,
      error: "something went wrong with the logout process",
    };
  getCookies.delete("auto-zone-token");

  redirect("/login");
  const data = await response.json();
}

export async function car() {}
