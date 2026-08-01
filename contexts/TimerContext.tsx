"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { startTimerSession, finishTimerSession } from "@/lib/timer";

type TimerMode = "pomodoro" | "stopwatch";
type TimerPhase = "work" | "break";

interface TimerState {
  running: boolean;
  mode: TimerMode;
  phase: TimerPhase;
  taskId: string | null;
  taskTitle: string | null;
  sessionId: string | null;
  startEpoch: number | null; // Date.now() коли поточний відрізок почався
  accumulatedMs: number; // накопичено до поточного відрізка (через паузи)
  workMinutes: number;
  breakMinutes: number;
  userId: string | null;
  lastPhaseXp: number | null; // XP, зароблений останньою завершеною work-фазою (для тоста в UI)
}

const STORAGE_KEY = "zoned_timer_state_v1";

const defaultState: TimerState = {
  running: false,
  mode: "pomodoro",
  phase: "work",
  taskId: null,
  taskTitle: null,
  sessionId: null,
  startEpoch: null,
  accumulatedMs: 0,
  workMinutes: 25,
  breakMinutes: 5,
  userId: null,
  lastPhaseXp: null,
};

interface TimerContextValue {
  state: TimerState;
  elapsedMs: number;
  remainingMs: number; // тільки для pomodoro
  start: (opts: { userId: string; mode: TimerMode; taskId?: string | null; taskTitle?: string | null }) => Promise<void>;
  pause: () => void;
  resume: (userId: string) => Promise<void>;
  reset: (userId: string) => Promise<void>;
  finishNow: (userId: string) => Promise<number>; // повертає зароблений XP
  setSettings: (workMinutes: number, breakMinutes: number) => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TimerState>(defaultState);
  const [, forceTick] = useState(0);
  const loaded = useRef(false);

  // Завантаження стану з localStorage при старті
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    loaded.current = true;
  }, []);

  // Збереження стану при кожній зміні
  useEffect(() => {
    if (!loaded.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Тік раз на секунду, поки таймер запущений
  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [state.running]);

  const elapsedMs =
    state.accumulatedMs + (state.running && state.startEpoch ? Date.now() - state.startEpoch : 0);

  const phaseDurationMs =
    state.phase === "work" ? state.workMinutes * 60_000 : state.breakMinutes * 60_000;
  const remainingMs = Math.max(phaseDurationMs - elapsedMs, 0);

  const start = useCallback(
    async (opts: { userId: string; mode: TimerMode; taskId?: string | null; taskTitle?: string | null }) => {
      const session = await startTimerSession({
        userId: opts.userId,
        taskId: opts.taskId ?? null,
        mode: opts.mode,
        phase: "work",
      });
      setState({
        ...defaultState,
        mode: opts.mode,
        phase: "work",
        taskId: opts.taskId ?? null,
        taskTitle: opts.taskTitle ?? null,
        sessionId: session.id,
        running: true,
        startEpoch: Date.now(),
        accumulatedMs: 0,
        workMinutes: state.workMinutes,
        breakMinutes: state.breakMinutes,
        userId: opts.userId,
      });
    },
    [state.workMinutes, state.breakMinutes]
  );

  const pause = useCallback(() => {
    setState((s) => {
      if (!s.running || !s.startEpoch) return s;
      return {
        ...s,
        running: false,
        accumulatedMs: s.accumulatedMs + (Date.now() - s.startEpoch),
        startEpoch: null,
      };
    });
  }, []);

  const resume = useCallback(async (_userId: string) => {
    setState((s) => ({ ...s, running: true, startEpoch: Date.now() }));
  }, []);

  const reset = useCallback(async (userId: string) => {
    if (state.sessionId && elapsedMs > 2000) {
      await finishTimerSession({
        sessionId: state.sessionId,
        userId,
        taskId: state.taskId,
        durationSeconds: Math.floor(elapsedMs / 1000),
        phase: state.phase,
      });
    }
    setState((s) => ({ ...defaultState, workMinutes: s.workMinutes, breakMinutes: s.breakMinutes }));
    localStorage.removeItem(STORAGE_KEY);
  }, [state.sessionId, state.taskId, state.phase, elapsedMs]);

  const finishNow = useCallback(
    async (userId: string) => {
      if (!state.sessionId) return 0;
      const xp = await finishTimerSession({
        sessionId: state.sessionId,
        userId,
        taskId: state.taskId,
        durationSeconds: Math.floor(elapsedMs / 1000),
        phase: state.phase,
      });
      setState((s) => ({ ...defaultState, workMinutes: s.workMinutes, breakMinutes: s.breakMinutes }));
      localStorage.removeItem(STORAGE_KEY);
      return xp;
    },
    [state.sessionId, state.taskId, state.phase, elapsedMs]
  );

  const setSettings = useCallback((workMinutes: number, breakMinutes: number) => {
    setState((s) => ({ ...s, workMinutes, breakMinutes }));
  }, []);

  // Автоперехід фази Pomodoro, коли час вийшов
  useEffect(() => {
    if (state.mode !== "pomodoro" || !state.running) return;
    if (remainingMs <= 0) {
      (async () => {
        let earnedXp: number | null = null;
        if (state.sessionId && state.userId) {
          try {
            const xp = await finishTimerSession({
              sessionId: state.sessionId,
              userId: state.userId,
              taskId: state.taskId,
              durationSeconds: Math.floor(elapsedMs / 1000),
              phase: state.phase,
            });
            if (state.phase === "work") earnedXp = xp;
          } catch {}
        }
        const nextPhase = state.phase === "work" ? "break" : "work";
        let nextSessionId: string | null = null;
        if (state.userId) {
          try {
            const s = await startTimerSession({
              userId: state.userId,
              taskId: state.taskId,
              mode: "pomodoro",
              phase: nextPhase,
            });
            nextSessionId = s.id;
          } catch {}
        }
        setState((s) => ({
          ...s,
          phase: nextPhase,
          accumulatedMs: 0,
          startEpoch: Date.now(),
          sessionId: nextSessionId,
          lastPhaseXp: earnedXp,
        }));
      })();
    }
  }, [remainingMs, state.mode, state.running, state.sessionId, state.taskId, state.phase, state.userId, elapsedMs]);

  return (
    <TimerContext.Provider
      value={{ state, elapsedMs, remainingMs, start, pause, resume, reset, finishNow, setSettings }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer має використовуватись всередині TimerProvider");
  return ctx;
}
