"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
import { getTasks, createTask, updateTask, deleteTask, completeTask } from "@/lib/tasks";
import { getUserProfile, xpProgress } from "@/lib/user";
import { TaskModal } from "@/components/TaskModal";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<any>(null);

  const loadData = useCallback(async (userId: string) => {
    try {
      const [prof, tks] = await Promise.all([
        getUserProfile(userId),
        getTasks(userId),
      ]);
      setProfile(prof);
      setTasks(tks || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    async function init() {
      const u = await getUser();
      if (!u) {
        router.push("/auth");
        return;
      }
      setUser(u);
      await loadData(u.id);
      setLoading(false);
    }
    init();
  }, [router, loadData]);

  async function handleLogout() {
    await logout();
    router.push("/auth");
  }

  async function handleCreateTask(form: { title: string; description: string; project: string; difficulty: "easy" | "medium" | "hard" | "epic" }) {
    if (!user) return;
    const newTask = await createTask({
      user_id: user.id,
      title: form.title,
      description: form.description || null,
      project: form.project || null,
      difficulty: form.difficulty,
    });
    if (newTask) setTasks((prev: any[]) => [newTask, ...prev]);
  }

  async function handleEdit(form: { title: string; description: string; project: string; difficulty: "easy" | "medium" | "hard" | "epic" }) {
    if (!editTask) return;
    const updated = await updateTask((editTask as any)?.id, {
      title: form.title,
      description: form.description || null,
      project: form.project || null,
      difficulty: form.difficulty,
    });
    if (updated) {
      setTasks((prev: any[]) => prev.map((t: any) => (t.id === updated.id ? updated : t)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити задачу?")) return;
    await deleteTask(id);
    setTasks((prev: any[]) => prev.filter((x: any) => x.id !== id));
  }

  async function handleComplete(task: any) {
    if (!user || task?.status === "done") return;
    await completeTask(task?.id, task?.xp_reward ?? 50);
    await loadData(user.id);
  }

  const filtered = tasks.filter((t: any) => {
    if (filter === "active") return t.status !== "done";
    if (filter === "done") return t.status === "done";
    return true;
  });

  const progress = profile ? xpProgress(profile.xp, profile.level) : { current: 0, needed: 100, percent: 0 };

  if (loading) return <div className="p-8 text-center text-zinc-400">Завантаження...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Дашборд</h1>
            <p className="text-zinc-400 text-sm">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg">
            Вийти
          </button>
        </header>

        {profile && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>Рівень: {profile.level}</span>
              <span>{progress.current} / {progress.needed} XP</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2">
            {["all", "active", "done"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize ${filter === f ? "bg-indigo-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
              >
                {f === "all" ? "Всі" : f === "active" ? "Активні" : "Виконані"}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setEditTask(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg"
          >
            + Нова задача
          </button>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">Немає задач</p>
          ) : (
            filtered.map((t: any) => (
              <div key={t.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.status === "done"}
                    onChange={() => handleComplete(t)}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                  <div>
                    <h3 className={`font-medium ${t.status === "done" ? "line-through text-zinc-500" : ""}`}>{t.title}</h3>
                    {t.description && <p className="text-sm text-zinc-400">{t.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditTask(t);
                      setIsModalOpen(true);
                    }}
                    className="text-xs px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-xs px-2.5 py-1.5 bg-red-950/50 hover:bg-red-900/50 text-red-400 rounded-md"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editTask ? handleEdit : handleCreateTask}
        initialData={editTask}
      />
    </div>
  );
}