"use client";
import { supabase } from "./supabase";
import type { Database } from "@/types/database";

type SessionInsert = Database["public"]["Tables"]["timer_sessions"]["Insert"];
type TimerMode = "pomodoro" | "stopwatch";
type TimerPhase = "work" | "break";

// 1 хвилина зосередженої роботи = 2 XP, максимум 60 XP за одну сесію
const XP_PER_MINUTE = 2;
const MAX_SESSION_XP = 60;

export async function startTimerSession(params: {
  userId: string;
  taskId: string | null;
  mode: TimerMode;
  phase: TimerPhase;
}) {
  const payload: SessionInsert = {
    user_id: params.userId,
    task_id: params.taskId,
    mode: params.mode,
    phase: params.phase,
    started_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("timer_sessions")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Завершує сесію: записує тривалість, і якщо це робоча (не break) фаза -
// нараховує XP та додає час до time_spent задачі (якщо є)
export async function finishTimerSession(params: {
  sessionId: string;
  userId: string;
  taskId: string | null;
  durationSeconds: number;
  phase: TimerPhase;
}) {
  const { sessionId, userId, taskId, durationSeconds, phase } = params;
  const xpEarned =
    phase === "work"
      ? Math.min(Math.floor(durationSeconds / 60) * XP_PER_MINUTE, MAX_SESSION_XP)
      : 0;

  const { error: sessionErr } = await supabase
    .from("timer_sessions")
    .update({
      ended_at: new Date().toISOString(),
      duration: durationSeconds,
      xp_awarded: xpEarned,
    })
    .eq("id", sessionId);
  if (sessionErr) throw sessionErr;

  if (taskId && durationSeconds > 0) {
    const { data: task } = await supabase
      .from("tasks")
      .select("time_spent")
      .eq("id", taskId)
      .single();
    if (task) {
      await supabase
        .from("tasks")
        .update({ time_spent: (task.time_spent || 0) + durationSeconds })
        .eq("id", taskId);
    }
  }

  if (xpEarned > 0) {
    const { data: user } = await supabase
      .from("users")
      .select("xp_total, level")
      .eq("id", userId)
      .single();
    if (user) {
      const newXp = user.xp_total + xpEarned;
      const newLevel = Math.floor(newXp / 500) + 1;
      await supabase
        .from("users")
        .update({ xp_total: newXp, level: newLevel })
        .eq("id", userId);
    }
  }

  return xpEarned;
}

export async function getRecentSessions(userId: string, limit = 8) {
  const { data, error } = await supabase
    .from("timer_sessions")
    .select("*, tasks(title)")
    .eq("user_id", userId)
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
