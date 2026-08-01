"use client";
import Link from "next/link";
import { useTimer } from "@/contexts/TimerContext";
import { formatDuration } from "@/lib/timer";

interface Props {
  userId: string;
}

export function TimerWidget({ userId }: Props) {
  const { state, elapsedMs, remainingMs, pause, resume } = useTimer();

  if (!state.sessionId && !state.running) return null;

  const displayMs = state.mode === "pomodoro" ? remainingMs : elapsedMs;
  const seconds = Math.floor(displayMs / 1000);

  return (
    <Link
      href="/timer"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "rgba(255,255,255,0.55)",
        border: "0.5px solid rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        borderRadius: "999px",
        padding: "10px 18px 10px 10px",
        boxShadow: "0 8px 30px rgba(120,120,180,0.25)",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            state.phase === "break"
              ? "linear-gradient(135deg,rgba(150,220,190,0.6) 0%,rgba(185,225,245,0.6) 100%)"
              : "linear-gradient(135deg,rgba(255,205,185,0.6) 0%,rgba(185,225,245,0.6) 100%)",
          fontSize: "16px",
        }}
      >
        {state.running ? "⏱️" : "⏸️"}
      </div>
      <div>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", color: "#5a5a8a", lineHeight: 1.2 }}>
          {formatDuration(Math.max(seconds, 0))}
        </p>
        <p style={{ fontSize: "10px", color: "#9090b8", lineHeight: 1.3, maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {state.mode === "pomodoro" ? (state.phase === "work" ? "Фокус" : "Перерва") : "Секундомір"}
          {state.taskTitle ? ` · ${state.taskTitle}` : ""}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (state.running) pause();
          else resume(userId);
        }}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "0.5px solid rgba(180,180,220,0.4)",
          background: "rgba(255,255,255,0.6)",
          color: "#7878b8",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        {state.running ? "❚❚" : "▶"}
      </button>
    </Link>
  );
}
