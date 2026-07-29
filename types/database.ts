export type Difficulty = "easy" | "medium" | "hard" | "epic";
export type TaskStatus = "created" | "active" | "in_progress" | "paused" | "done";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; username: string | null; xp_total: number; level: number; telegram_id: number | null; language: string; created_at: string };
        Insert: { id: string; username?: string | null; xp_total?: number; level?: number; telegram_id?: number | null; language?: string };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      tasks: {
        Row: { id: string; user_id: string; title: string; description: string | null; project: string | null; status: TaskStatus; difficulty: Difficulty | null; xp_reward: number | null; subtasks: {title:string;done:boolean}[]; time_spent: number; notes: string | null; created_at: string; completed_at: string | null };
        Insert: { id?: string; user_id: string; title: string; description?: string | null; project?: string | null; status?: TaskStatus; difficulty?: Difficulty | null; xp_reward?: number | null; subtasks?: {title:string;done:boolean}[]; time_spent?: number; notes?: string | null; completed_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
      };
      timer_sessions: {
        Row: { id: string; task_id: string; user_id: string; started_at: string; ended_at: string | null; duration: number | null };
        Insert: { id?: string; task_id: string; user_id: string; started_at?: string; ended_at?: string | null; duration?: number | null };
        Update: Partial<Database["public"]["Tables"]["timer_sessions"]["Insert"]>;
      };
    };
  };
}
