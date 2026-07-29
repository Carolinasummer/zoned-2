"use client";
import { supabase } from "./supabase";

export const register = (email: string, password: string) =>
  supabase.auth.signUp({ email, password }).then(({ error }) => { if (error) throw error; });

export const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password }).then(({ error }) => { if (error) throw error; });

export const logout = () =>
  supabase.auth.signOut();

export const getUser = () =>
  supabase.auth.getUser().then(({ data }) => data.user);
