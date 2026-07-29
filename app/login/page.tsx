"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch {
      setError("Невірний email або пароль");
      setLoading(false);
    }
  }

  return (
    <main style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",padding:"24px"}}>

      {/* Left side */}
      <div style={{maxWidth:"340px",marginRight:"60px"}} className="hidden md:block">
        <p style={{fontSize:"11px",fontWeight:"500",color:"#a0a0c0",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"16px"}}>
          Welcome back
        </p>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"38px",fontWeight:"400",color:"#5a5a8a",letterSpacing:"-1px",lineHeight:"1.2",marginBottom:"16px"}}>
          Back in the<br/><em style={{fontStyle:"normal",color:"#7878b8"}}>zone.</em>
        </h1>
        <p style={{fontSize:"13px",color:"#9090b8",fontWeight:"300",lineHeight:"1.7"}}>
          Your tasks, timer and progress are waiting for you.
        </p>
        <Link href="/register" style={{display:"inline-block",marginTop:"24px",fontSize:"13px",color:"#7878a8",textDecoration:"none"}}>
          No account yet? <span style={{color:"#6868a8",borderBottom:"0.5px solid rgba(104,104,168,0.4)"}}>Sign up →</span>
        </Link>
      </div>

      {/* Form card */}
      <div style={{
        background:"rgba(255,255,255,0.42)",border:"0.5px solid rgba(255,255,255,0.75)",
        backdropFilter:"blur(20px)",borderRadius:"20px",padding:"36px 32px",
        maxWidth:"360px",width:"100%"
      }}>
        <div style={{marginBottom:"28px"}}>
          <p style={{fontFamily:"Georgia,serif",fontSize:"22px",fontWeight:"400",color:"#5a5a8a",letterSpacing:"-0.5px",marginBottom:"4px"}}>
            Zoned
          </p>
          <p style={{fontSize:"12px",color:"#a0a0c0",fontWeight:"300"}}>Вхід в акаунт</p>
        </div>

        <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          {[
            {label:"Email",key:"email",type:"email",placeholder:"you@example.com"},
            {label:"Пароль",key:"password",type:"password",placeholder:"Твій пароль"},
          ].map(f => (
            <div key={f.key}>
              <label style={{display:"block",fontSize:"11px",color:"#9090b8",marginBottom:"5px"}}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={set(f.key)}
                required
                style={{
                  width:"100%",background:"rgba(255,255,255,0.55)",
                  border:"0.5px solid rgba(180,180,220,0.4)",borderRadius:"10px",
                  padding:"10px 14px",fontSize:"13px",color:"#4a4a7a",outline:"none",
                  transition:"all .2s"
                }}
              />
            </div>
          ))}

          {error && <p style={{fontSize:"11px",color:"#c07080"}}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            marginTop:"4px",
            background:"linear-gradient(135deg,rgba(255,205,185,0.6) 0%,rgba(185,225,245,0.6) 100%)",
            borderRadius:"30px",padding:"11px",fontSize:"13px",fontWeight:"500",
            color:"#5a5a88",border:"none",cursor:"pointer",
            boxShadow:"0 0 20px rgba(180,210,245,0.35),inset 0 0 14px rgba(255,255,255,0.55)",
            outline:"0.5px solid rgba(255,255,255,0.75)",transition:"all .25s",
            opacity:loading?0.7:1
          }}>
            {loading ? "..." : "Увійти"}
          </button>
        </form>

        <p style={{textAlign:"center",fontSize:"12px",color:"#a0a0c0",marginTop:"20px",fontWeight:"300"}}>
          Немає акаунту?{" "}
          <Link href="/register" style={{color:"#7878b8",textDecoration:"none"}}>Зареєструватись</Link>
        </p>
      </div>
    </main>
  );
}
