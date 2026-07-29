 // @ts-nocheck "use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
import { getTasks, createTask, updateTask, deleteTask, completeTask } from "@/lib/tasks";
import { getUserProfile, xpProgress } from "@/lib/user";
import { TaskModal } from "@/components/TaskModal";
import { TaskCard } from "@/components/TaskCard";
import type { User } from "@supabase/supabase-js";

type Task = Awaited<ReturnType<typeof getTasks>>[number];
type Filter = "all" | "active" | "done";

const XP_MAP = { easy: 50, medium: 100, hard: 200, epic: 400 };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{xp_total:number;level:number;username:string|null} | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (userId: string) => {
    const [t, p] = await Promise.all([getTasks(userId), getUserProfile(userId)]);
    setTasks(t);
    setProfile(p);
  }, []);

  useEffect(() => {
    getUser().then(u => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      loadData(u.id).finally(() => setLoading(false));
    });
  }, [router, loadData]);

  async function handleCreate(form: { title: string; description: string; project: string; difficulty: "easy"|"medium"|"hard"|"epic" }) {
    if (!user) return;
    await createTask({
      user_id: user.id,
      title: form.title,
      description: form.description || null,
      project: form.project || null,
      difficulty: form.difficulty,
      xp_reward: XP_MAP[form.difficulty],
      status: "active",
    });
    await loadData(user.id);
  }

  async function handleEdit(form: { title: string; description: string; project: string; difficulty: "easy"|"medium"|"hard"|"epic" }) {
    if (!editTask) return;
    await updateTask((editTask as any)?.id, {
      title: form.title,
      description: form.description || null,
      project: form.project || null,
      difficulty: form.difficulty,
      xp_reward: XP_MAP[form.difficulty],
    });
    await loadData(user!.id);
    setEditTask(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити задачу?")) return;
    await deleteTask(id);
    setTasks(t => t.filter(x => x.id !== id));
  }

  async function handleComplete(task: Task) {
    if (!user || task.status === "done") return;
    await completeTask(task.id, task.xp_reward ?? 50, user.id);
    await loadData(user.id);
  }

  const filtered = tasks.filter(t => {
    if (filter === "active") return t.status !== "done";
    if (filter === "done") return t.status === "done";
    return true;
  });

  const progress = profile ? xpProgress(profile.xp_total, profile.level) : 0;
  const doneTasks = tasks.filter(t => t.status === "done").length;

  if (loading) return (
    <main style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center"}}>
      <p style={{color:"#a0a0c0",fontSize:"13px"}}>Завантаження...</p>
    </main>
  );

  return (
    <main style={{minHeight:"100vh",padding:"24px 20px"}}>

      {/* NAVBAR */}
      <nav style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        background:"rgba(255,255,255,0.38)",border:"0.5px solid rgba(255,255,255,0.6)",
        backdropFilter:"blur(16px)",borderRadius:"14px",padding:"12px 20px",
        marginBottom:"24px",maxWidth:"860px",margin:"0 auto 24px"
      }}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"17px",color:"#5a5a8a"}}>Zoned</span>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <span style={{fontSize:"12px",color:"#9090b8"}}>{user?.email}</span>
          <button onClick={() => logout().then(() => router.push("/"))} style={{
            fontSize:"12px",color:"#a0a0c0",background:"rgba(255,255,255,0.4)",
            border:"0.5px solid rgba(180,180,220,0.3)",borderRadius:"20px",
            padding:"5px 14px",cursor:"pointer"
          }}>Вийти</button>
        </div>
      </nav>

      <div style={{maxWidth:"860px",margin:"0 auto"}}>

        {/* XP CARD */}
        <div style={{
          background:"rgba(255,255,255,0.42)",border:"0.5px solid rgba(255,255,255,0.75)",
          backdropFilter:"blur(20px)",borderRadius:"16px",padding:"20px 24px",
          marginBottom:"16px",display:"flex",alignItems:"center",gap:"24px"
        }}>
          <div>
            <p style={{fontSize:"11px",color:"#a0a0c0",marginBottom:"2px",letterSpacing:"0.05em",textTransform:"uppercase"}}>Рівень</p>
            <p style={{fontFamily:"Georgia,serif",fontSize:"28px",color:"#6868a8",lineHeight:1}}>{profile?.level ?? 1}</p>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
              <span style={{fontSize:"11px",color:"#9090b8"}}>
                Привіт, {profile?.username ?? user?.email?.split("@")[0]}!
              </span>
              <span style={{fontSize:"11px",color:"#a0a0c0"}}>{profile?.xp_total ?? 0} XP</span>
            </div>
            <div style={{height:"5px",background:"rgba(200,200,230,0.25)",borderRadius:"4px",overflow:"hidden"}}>
              <div style={{
                width:`${progress}%`,height:"100%",borderRadius:"4px",
                background:"linear-gradient(90deg,rgba(175,195,235,0.8),rgba(205,180,225,0.7))",
                transition:"width .5s ease"
              }}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"5px"}}>
              <span style={{fontSize:"10px",color:"#b0b0c8"}}>до рівня {(profile?.level ?? 1) + 1}</span>
              <span style={{fontSize:"10px",color:"#b0b0c8"}}>{doneTasks} задач виконано</span>
            </div>
          </div>
        </div>

        {/* TASKS HEADER */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
          <div style={{display:"flex",gap:"6px"}}>
            {(["all","active","done"] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontSize:"12px",padding:"5px 14px",borderRadius:"20px",cursor:"pointer",
                fontWeight: filter===f ? "500" : "300",
                color: filter===f ? "#6868a8" : "#a0a0c0",
                background: filter===f ? "rgba(200,200,240,0.35)" : "rgba(255,255,255,0.3)",
                border: filter===f ? "0.5px solid rgba(160,160,220,0.4)" : "0.5px solid transparent",
                transition:"all .2s"
              }}>
                {{all:"Всі",active:"Активні",done:"Виконані"}[f]}
                <span style={{marginLeft:"5px",fontSize:"10px",opacity:0.6}}>
                  {f==="all" ? tasks.length : f==="done" ? tasks.filter(t=>t.status==="done").length : tasks.filter(t=>t.status!=="done").length}
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} style={{
            fontSize:"13px",fontWeight:"500",color:"#5a5a88",cursor:"pointer",
            background:"linear-gradient(135deg,rgba(255,205,185,0.55) 0%,rgba(185,225,245,0.55) 100%)",
            borderRadius:"30px",padding:"8px 20px",border:"none",
            boxShadow:"0 0 16px rgba(180,210,245,0.3),inset 0 0 10px rgba(255,255,255,0.5)",
            outline:"0.5px solid rgba(255,255,255,0.75)"
          }}>
            + Нова задача
          </button>
        </div>

        {/* TASK LIST */}
        {filtered.length === 0 ? (
          <div style={{
            background:"rgba(255,255,255,0.38)",border:"0.5px solid rgba(255,255,255,0.7)",
            backdropFilter:"blur(16px)",borderRadius:"16px",padding:"48px",textAlign:"center"
          }}>
            <p style={{fontSize:"24px",marginBottom:"8px"}}>✦</p>
            <p style={{fontSize:"13px",color:"#9090b8",fontWeight:"300"}}>
              {filter==="done" ? "Ще немає виконаних задач" : "Додай свою першу задачу"}
            </p>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => setEditTask(task)}
                onDelete={() => handleDelete(task.id)}
                onComplete={() => handleComplete(task)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
        />
      )}
      {editTask && (
        <TaskModal
          onClose={() => setEditTask(null)}
          onSave={handleEdit}
          initial={{
            title: editTask.title,
            description: editTask.description ?? "",
            project: editTask.project ?? "",
            difficulty: (editTask.difficulty as "easy"|"medium"|"hard"|"epic") ?? "medium",
          }}
        />
      )}
    </main>
  );
}
