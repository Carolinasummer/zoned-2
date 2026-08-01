"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getTasks } from "@/lib/tasks";
import { getRecentSessions, formatDuration } from "@/lib/timer";
import { useTimer } from "@/contexts/TimerContext";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.42)",
  border: "0.5px solid rgba(255,255,255,0.75)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
};

export default function TimerPage() {
  const router = useRouter();
  const { state, elapsedMs, remainingMs, start, pause, resume, reset, finishNow, setSettings } = useTimer();

  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [pickerMode, setPickerMode] = useState<"pomodoro" | "stopwatch">("pomodoro");
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);

  const loadSessions = useCallback(async (userId: string) => {
    try {
      const s = await getRecentSessions(userId);
      setSessions(s || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    async function init() {
      const u = await getUser();
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      const tks = await getTasks(u.id);
      setTasks((tks || []).filter((t: any) => t.status !== "done"));
      await loadSessions(u.id);
      setLoading(false);
    }
    init();
  }, [router, loadSessions]);

  // Показуємо тост із XP, коли робоча фаза Pomodoro завершується сама
  useEffect(() => {
    if (state.lastPhaseXp && state.lastPhaseXp > 0) {
      setXpToast(state.lastPhaseXp);
      if (user) loadSessions(user.id);
      const t = setTimeout(() => setXpToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [state.lastPhaseXp, user, loadSessions]);

  const isActive = !!state.sessionId || state.running;

  async function handleStart() {
    if (!user) return;
    const task = tasks.find((t) => t.id === selectedTaskId);
    setSettings(workMin, breakMin);
    await start({
      userId: user.id,
      mode: pickerMode,
      taskId: selectedTaskId || null,
      taskTitle: task?.title ?? null,
    });
  }

  async function handleFinish() {
    if (!user) return;
    const xp = await finishNow(user.id);
    if (xp > 0) {
      setXpToast(xp);
      setTimeout(() => setXpToast(null), 4000);
    }
    await loadSessions(user.id);
  }

  async function handleReset() {
    if (!user) return;
    await reset(user.id);
    await loadSessions(user.id);
  }

  const displayMs = isActive ? (state.mode === "pomodoro" ? remainingMs : elapsedMs) : (pickerMode === "pomodoro" ? workMin * 60_000 : 0);
  const seconds = Math.max(Math.floor(displayMs / 1000), 0);

  const phaseDurationSec = (state.phase === "work" ? workMin : breakMin) * 60;
  const progressPercent = isActive && state.mode === "pomodoro"
    ? Math.min(100, Math.round(((phaseDurationSec - seconds) / phaseDurationSec) * 100))
    : 0;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#9090b8", fontSize: "14px" }}>Завантаження...</p>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <p style={{ fontFamily: "Georgia,serif", fontSize: "26px", color: "#5a5a8a", letterSpacing: "-0.5px" }}>Таймер</p>
            <p style={{ fontSize: "12px", color: "#9090b8" }}>Фокусуйся й заробляй XP</p>
          </div>
          <Link href="/dashboard" style={{ fontSize: "13px", color: "#7878b8", textDecoration: "none" }}>
            ← Дашборд
          </Link>
        </div>

        {xpToast && (
          <div style={{
            ...glass,
            padding: "12px 20px",
            marginBottom: "16px",
            textAlign: "center",
            color: "#5a8a6a",
            fontSize: "13px",
            fontWeight: 500,
          }}>
            🎉 +{xpToast} XP за фокус-сесію!
          </div>
        )}

        {/* Основна картка таймера */}
        <div style={{ ...glass, padding: "36px 32px", marginBottom: "20px", textAlign: "center" }}>
          {!isActive && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
              {(["pomodoro", "stopwatch"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPickerMode(m)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: pickerMode === m ? "1px solid rgba(150,180,240,0.6)" : "0.5px solid rgba(180,180,220,0.3)",
                    background: pickerMode === m ? "rgba(150,180,240,0.18)" : "rgba(255,255,255,0.4)",
                    color: pickerMode === m ? "#5a5a8a" : "#9090b8",
                  }}
                >
                  {m === "pomodoro" ? "Pomodoro" : "Секундомір"}
                </button>
              ))}
            </div>
          )}

          {/* Кільце прогресу */}
          <div style={{ position: "relative", width: "220px", height: "220px", margin: "0 auto 24px" }}>
            <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="110" cy="110" r="98" fill="none" stroke="rgba(200,200,230,0.35)" strokeWidth="10" />
              {isActive && state.mode === "pomodoro" && (
                <circle
                  cx="110" cy="110" r="98" fill="none"
                  stroke={state.phase === "work" ? "url(#gradWork)" : "url(#gradBreak)"}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 98}
                  strokeDashoffset={2 * Math.PI * 98 * (1 - progressPercent / 100)}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              )}
              {isActive && state.mode === "stopwatch" && (
                <circle
                  cx="110" cy="110" r="98" fill="none"
                  stroke="url(#gradWork)"
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 98}
                  strokeDashoffset={2 * Math.PI * 98 * 0.25}
                  style={{ opacity: 0.7 }}
                />
              )}
              <defs>
                <linearGradient id="gradWork" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffcdb9" />
                  <stop offset="100%" stopColor="#b9e1f5" />
                </linearGradient>
                <linearGradient id="gradBreak" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#96dcbe" />
                  <stop offset="100%" stopColor="#b9e1f5" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "Georgia,serif", fontSize: "40px", color: "#4a4a7a" }}>{formatDuration(seconds)}</p>
              {isActive && (
                <p style={{ fontSize: "11px", color: "#9090b8", marginTop: "4px" }}>
                  {state.mode === "pomodoro" ? (state.phase === "work" ? "🎯 Фокус" : "☕ Перерва") : "⏱️ Йде запис"}
                  {state.taskTitle ? ` · ${state.taskTitle}` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Вибір задачі та налаштування — тільки коли таймер не запущений */}
          {!isActive && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "320px", margin: "0 auto 20px" }}>
              <div style={{ textAlign: "left" }}>
                <label style={{ fontSize: "11px", color: "#9090b8", display: "block", marginBottom: "5px" }}>
                  Прив'язати до задачі (необов'язково)
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.6)",
                    border: "0.5px solid rgba(180,180,220,0.4)", borderRadius: "10px",
                    padding: "10px 14px", fontSize: "13px", color: "#4a4a7a", outline: "none",
                  }}
                >
                  <option value="">Без задачі — просто фокус-сесія</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              {pickerMode === "pomodoro" && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <label style={{ fontSize: "11px", color: "#9090b8", display: "block", marginBottom: "5px" }}>Робота (хв)</label>
                    <input
                      type="number" min={1} max={120} value={workMin}
                      onChange={(e) => setWorkMin(Math.max(1, Number(e.target.value) || 1))}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.6)",
                        border: "0.5px solid rgba(180,180,220,0.4)", borderRadius: "10px",
                        padding: "10px 14px", fontSize: "13px", color: "#4a4a7a", outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <label style={{ fontSize: "11px", color: "#9090b8", display: "block", marginBottom: "5px" }}>Перерва (хв)</label>
                    <input
                      type="number" min={1} max={60} value={breakMin}
                      onChange={(e) => setBreakMin(Math.max(1, Number(e.target.value) || 1))}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.6)",
                        border: "0.5px solid rgba(180,180,220,0.4)", borderRadius: "10px",
                        padding: "10px 14px", fontSize: "13px", color: "#4a4a7a", outline: "none",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Кнопки керування */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {!isActive ? (
              <button onClick={handleStart} style={{
                padding: "12px 32px", borderRadius: "30px", fontSize: "13px", fontWeight: 500,
                color: "#5a5a88", border: "none", cursor: "pointer",
                background: "linear-gradient(135deg,rgba(255,205,185,0.6) 0%,rgba(185,225,245,0.6) 100%)",
                boxShadow: "0 0 20px rgba(180,210,245,0.35),inset 0 0 14px rgba(255,255,255,0.55)",
                outline: "0.5px solid rgba(255,255,255,0.75)",
              }}>
                ▶ Почати
              </button>
            ) : (
              <>
                <button onClick={() => (state.running ? pause() : resume(user.id))} style={{
                  padding: "12px 24px", borderRadius: "30px", fontSize: "13px", fontWeight: 500,
                  color: "#5a5a8a", background: "rgba(255,255,255,0.5)",
                  border: "0.5px solid rgba(180,180,220,0.4)", cursor: "pointer",
                }}>
                  {state.running ? "❚❚ Пауза" : "▶ Продовжити"}
                </button>
                <button onClick={handleFinish} style={{
                  padding: "12px 24px", borderRadius: "30px", fontSize: "13px", fontWeight: 500,
                  color: "#5a5a88", border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg,rgba(255,205,185,0.6) 0%,rgba(185,225,245,0.6) 100%)",
                  boxShadow: "0 0 16px rgba(180,210,245,0.3)",
                }}>
                  ✓ Завершити
                </button>
                <button onClick={handleReset} style={{
                  padding: "12px 18px", borderRadius: "30px", fontSize: "13px",
                  color: "#c08a8a", background: "rgba(255,255,255,0.4)",
                  border: "0.5px solid rgba(220,180,180,0.4)", cursor: "pointer",
                }}>
                  Скинути
                </button>
              </>
            )}
          </div>
        </div>

        {/* Історія сесій */}
        <div style={{ ...glass, padding: "24px 28px" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "16px", color: "#5a5a8a", marginBottom: "14px" }}>
            Останні сесії
          </p>
          {sessions.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#a0a0c0", textAlign: "center", padding: "16px 0" }}>
              Ще немає завершених сесій
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sessions.map((s: any) => (
                <div key={s.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", background: "rgba(255,255,255,0.35)", borderRadius: "12px",
                  fontSize: "12px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{s.mode === "pomodoro" ? (s.phase === "work" ? "🎯" : "☕") : "⏱️"}</span>
                    <span style={{ color: "#5a5a7a" }}>{s.tasks?.title || "Без задачі"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#9090b8" }}>
                    <span>{formatDuration(s.duration || 0)}</span>
                    {s.xp_awarded > 0 && <span style={{ color: "#7ac89a" }}>+{s.xp_awarded} XP</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
