"use client";
import { useState } from "react";

interface Props {
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    project: string;
    difficulty: "easy" | "medium" | "hard" | "epic";
  }) => Promise<void>;
  initial?: {
    title: string;
    description: string;
    project: string;
    difficulty: "easy" | "medium" | "hard" | "epic";
  };
}

const XP_MAP = { easy: 50, medium: 100, hard: 200, epic: 400 };
const DIFF_COLORS = {
  easy: "#7ac8a0",
  medium: "#a0b8e8",
  hard: "#c0a0e0",
  epic: "#e8a0b0",
};

export function TaskModal({ onClose, onSave, initial }: Props) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    project: initial?.project ?? "",
    difficulty: initial?.difficulty ?? "medium" as "easy" | "medium" | "hard" | "epic",
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",
      background:"rgba(100,100,150,0.15)",backdropFilter:"blur(4px)"
    }} onClick={onClose}>
      <div style={{
        background:"rgba(255,255,255,0.72)",border:"0.5px solid rgba(255,255,255,0.85)",
        backdropFilter:"blur(24px)",borderRadius:"20px",padding:"32px",
        maxWidth:"440px",width:"100%"
      }} onClick={e => e.stopPropagation()}>

        <p style={{fontFamily:"Georgia,serif",fontSize:"20px",color:"#5a5a8a",marginBottom:"24px"}}>
          {initial ? "Редагувати задачу" : "Нова задача"}
        </p>

        <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:"14px"}}>

          <div>
            <label style={{fontSize:"11px",color:"#9090b8",display:"block",marginBottom:"5px"}}>Назва *</label>
            <input
              value={form.title}
              onChange={e => setForm(f=>({...f,title:e.target.value}))}
              placeholder="Що потрібно зробити?"
              required
              style={{
                width:"100%",background:"rgba(255,255,255,0.6)",
                border:"0.5px solid rgba(180,180,220,0.4)",borderRadius:"10px",
                padding:"10px 14px",fontSize:"13px",color:"#4a4a7a",outline:"none"
              }}
            />
          </div>

          <div>
            <label style={{fontSize:"11px",color:"#9090b8",display:"block",marginBottom:"5px"}}>Опис</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f=>({...f,description:e.target.value}))}
              placeholder="Деталі задачі..."
              rows={3}
              style={{
                width:"100%",background:"rgba(255,255,255,0.6)",
                border:"0.5px solid rgba(180,180,220,0.4)",borderRadius:"10px",
                padding:"10px 14px",fontSize:"13px",color:"#4a4a7a",outline:"none",
                resize:"none",fontFamily:"inherit"
              }}
            />
          </div>

          <div>
            <label style={{fontSize:"11px",color:"#9090b8",display:"block",marginBottom:"5px"}}>Проект</label>
            <input
              value={form.project}
              onChange={e => setForm(f=>({...f,project:e.target.value}))}
              placeholder="Назва проекту"
              style={{
                width:"100%",background:"rgba(255,255,255,0.6)",
                border:"0.5px solid rgba(180,180,220,0.4)",borderRadius:"10px",
                padding:"10px 14px",fontSize:"13px",color:"#4a4a7a",outline:"none"
              }}
            />
          </div>

          <div>
            <label style={{fontSize:"11px",color:"#9090b8",display:"block",marginBottom:"8px"}}>Складність</label>
            <div style={{display:"flex",gap:"8px"}}>
              {(["easy","medium","hard","epic"] as const).map(d => (
                <button key={d} type="button"
                  onClick={() => setForm(f=>({...f,difficulty:d}))}
                  style={{
                    flex:1,padding:"8px 4px",borderRadius:"10px",fontSize:"11px",
                    fontWeight:"500",cursor:"pointer",transition:"all .2s",
                    border: form.difficulty === d
                      ? `1px solid ${DIFF_COLORS[d]}`
                      : "0.5px solid rgba(180,180,220,0.3)",
                    background: form.difficulty === d
                      ? `${DIFF_COLORS[d]}22`
                      : "rgba(255,255,255,0.4)",
                    color: form.difficulty === d ? DIFF_COLORS[d] : "#9090b8",
                  }}>
                  {d}<br/>
                  <span style={{fontSize:"10px",opacity:0.8}}>+{XP_MAP[d]} XP</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:"10px",marginTop:"8px"}}>
            <button type="button" onClick={onClose} style={{
              flex:1,padding:"10px",borderRadius:"30px",fontSize:"13px",
              color:"#9090b8",background:"rgba(255,255,255,0.4)",
              border:"0.5px solid rgba(180,180,220,0.3)",cursor:"pointer"
            }}>
              Скасувати
            </button>
            <button type="submit" disabled={loading} style={{
              flex:2,padding:"10px",borderRadius:"30px",fontSize:"13px",fontWeight:"500",
              color:"#5a5a88",border:"none",cursor:"pointer",
              background:"linear-gradient(135deg,rgba(255,205,185,0.6) 0%,rgba(185,225,245,0.6) 100%)",
              boxShadow:"0 0 20px rgba(180,210,245,0.35),inset 0 0 14px rgba(255,255,255,0.55)",
              outline:"0.5px solid rgba(255,255,255,0.75)"
            }}>
              {loading ? "..." : initial ? "Зберегти" : "Створити задачу"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
