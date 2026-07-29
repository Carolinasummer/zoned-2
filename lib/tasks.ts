"use client";
import { supabase } from "./supabase";
import type { Database } from "@/types/database";

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTask(task: TaskInsert) {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: TaskUpdate) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function completeTask(id: string, xpReward: number, userId: string) {
  // Позначаємо задачу як done
  await updateTask(id, {
    status: "done",
    completed_at: new Date().toISOString(),
  });

  // Додаємо XP юзеру
  const { data: user } = await supabase
    .from("users")
    .select("xp_total, level")
    .eq("id", userId)
    .single();

  if (user) {
    const newXp = user.xp_total + xpReward;
    const newLevel = Math.floor(newXp / 500) + 1;
    await supabase
      .from("users")
      .update({ xp_total: newXp, level: newLevel })
      .eq("id", userId);
  }
}
