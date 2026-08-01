"use client";
import { supabase } from "./supabase";

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export function xpForNextLevel(level: number) {
  return level * 500;
}

export function xpProgress(xpTotal: number, level: number) {
  const prevLevelXp = (level - 1) * 500;
  const nextLevelXp = level * 500;
  const current = xpTotal - prevLevelXp;
  const needed = nextLevelXp - prevLevelXp;
  return Math.min(Math.round((current / needed) * 100), 100);
}
