"use client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  project: string | null;
  status: string;
  difficulty: string | null;
  xp_reward: number | null;
  time_spent: number;
}

interface Props {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

const DIFF_COLORS: Record<string, string> = {
  easy: "#7ac8a0",
  medium: "#a0b8e8",
  hard: "#c0a0e0",
  epic: "#e8a0b0",
};

const STATUS_LABELS: Record<string, string> = {
  created: "Нова",
  active: "Активна",
  in_progress: "В процесі",
  paused: "Пауза",
  done: "Готово",
};

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}г ${m}хв`;
  return `${m}хв`;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: Props) {
  const isDone = task.status === "done";
  const diffColor = task.difficulty ? DIFF_COLORS[task.difficulty] : "#a0a0c0";

  return (
    <div style={{
      background:"rgba(255,255,255,0.42)",border:"0.5px solid rgba(255,255,255,0.75)",
      backdropFilter:"blur(16px)",borderRadius:"16px",padding:"18px 20px",
      opacity: isDone ? 0.6 : 1,transition:"all .2s"
    }}>

      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"12px"}}>
        <div style={{flex:1,minWidth:0}}>

          {/* title row */}
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
            {!isDone && (
              <button onClick={onComplete} title="Завершити" style={{
                width:"16px",height:"16px",borderRadius:"50%",flexShrink:0,
                border:`1px solid ${diffColor}`,background:"transparent",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",
                color:diffColor,transition:"all .2s"
              }}>✓</button>
            )}
            {isDone && (
              <div style={{
                width:"16px",height:"16px",borderRadius:"50%",flexShrink:0,
                background:diffColor,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:"9px",color:"white"
              }}>✓</div>
            )}
            <p style={{
              fontSize:"13px",fontWeight:"500",color: isDone ? "#a0a0c0" : "#5a5a8a",
              textDecoration: isDone ? "line-through" : "none",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
            }}>{task.title}</p>
          </div>

          {task.description && (
            <p style={{fontSize:"12px",color:"#9090b8",fontWeight:"300",lineHeight:"1.5",marginBottom:"8px",marginLeft:"24px"}}>
              {task.description}
            </p>
          )}

          {/* tags */}
          <div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap",marginLeft:"24px"}}>
            {task.project && (
              <span style={{fontSize:"10px",color:"#8888b0",background:"rgba(200,200,230,0.3)",borderRadius:"20px",padding:"2px 8px"}}>
                {task.project}
              </span>
            )}
            {task.difficulty && (
              <span style={{fontSize:"10px",color:diffColor,background:`${diffColor}18`,borderRadius:"20px",padding:"2px 8px"}}>
                {task.difficulty} · +{task.xp_reward} XP
              </span>
            )}
            <span style={{fontSize:"10px",color:"#a0a0c0",background:"rgba(200,200,230,0.2)",borderRadius:"20px",padding:"2px 8px"}}>
              {STATUS_LABELS[task.status] ?? task.status}
            </span>
            {task.time_spent > 0 && (
              <span style={{fontSize:"10px",color:"#a0a0c0"}}>
                ⏱ {formatTime(task.time_spent)}
              </span>
            )}
          </div>
        </div>

        {/* actions */}
        <div style={{display:"flex",gap:"4px",flexShrink:0}}>
          {!isDone && (
            <button onClick={onEdit} style={{
              fontSize:"11px",color:"#9090b8",background:"rgba(255,255,255,0.5)",
              border:"0.5px solid rgba(180,180,220,0.3)",borderRadius:"8px",
              padding:"5px 10px",cursor:"pointer"
            }}>Ред.</button>
          )}
          <button onClick={onDelete} style={{
            fontSize:"11px",color:"#c09090",background:"rgba(255,240,240,0.5)",
            border:"0.5px solid rgba(220,180,180,0.3)",borderRadius:"8px",
            padding:"5px 10px",cursor:"pointer"
          }}>✕</button>
        </div>
      </div>
    </div>
  );
}
