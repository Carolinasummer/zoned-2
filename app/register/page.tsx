"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) return setError("Мінімум 8 символів");
    if (form.password !== form.confirm) return setError("Паролі не співпадають");
    setLoading(true);
    try {
      await register(form.email, form.password);
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  if (done) return (
    <main style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{
        background:"rgba(255,255,255,0.42)",border:"0.5px solid rgba(255,255,255,0.75)",
        backdropFilter:"blur(20px)",borderRadius:"20px",padding:"40px 32px",
        maxWidth:"360px",width:"100%",textAlign:"center"
      }}>
        <p style={{fontSize:"32px",marginBottom:"12px"}}>📬</p>
        <p style={{fontFamily:"Georgia,serif",fontSize:"20px",color:"#5a5a8a",marginBottom:"8px"}}>Перевір пошту</p>
        <p style={{fontSize:"13px",color:"#9090b8",fontWeight:"300",lineHeight:"1.6"}}>
          Надіслали лист на <span style={{color:"#6868a8"}}>{form.email}</span>
        </p>
        <Link href="/login" style={{
          display:"block",marginTop:"24px",fontSize:"13px",color:"#7878b8",textDecoration:"none"
        }}>← Повернутись до входу</Link>
      </div>
    </main>
  );

  return (
    <main style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",padding:"24px"}}>

      {/* Left side — text */}
      <div style={{maxWidth:"340px",marginRight:"60px",display:"none"}} className="md:block">
        <p style={{fontSize:"11px",fontWeight:"500",color:"#a0a0c0",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"16px"}}>
          Get started
        </p>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"38px",fontWeight:"400",color:"#5a5a8a",letterSpacing:"-1px",lineHeight:"1.2",marginBottom:"16px"}}>
          Start planning in<br/><em style={{fontStyle:"normal",color:"#7878b8"}}>Liquid Clarity.</em>
        </h1>
        <p style={{fontSize:"13px",color:"#9090b8",fontWeight:"300",lineHeight:"1.7"}}>
          Create your account and let AI break down your tasks, track your time, and reward your progress.
        </p>
        <Link href="/login" style={{display:"inline-block",marginTop:"24px",fontSize:"13px",color:"#7878a8",textDecoration:"none"}}>
          Already have an account? <span style={{color:"#6868a8",borderBottom:"0.5px solid rgba(104,104,168,0.4)"}}>Log in →</span>
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
          <p style={{fontSize:"12px",color:"#a0a0c0",fontWeight:"300"}}>Створи акаунт</p>
        </div>

        <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          {[
            {label:"Email",key:"email",type:"email",placeholder:"you@example.com"},
            {label:"Пароль",key:"password",type:"password",placeholder:"Мінімум 8 символів"},
            {label:"Повтори пароль",key:"confirm",type:"password",placeholder:"Ще раз пароль"},
          ].map(f => (
            <div key={f.key}>
              <label style={{display:"block",fontSize:"11px",color:"#9090b8",marginBottom:"5px",letterSpacing:"0.02em"}}>{f.label}</label>
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
            {loading ? "..." : "Зареєструватись"}
          </button>
        </form>

        <p style={{textAlign:"center",fontSize:"12px",color:"#a0a0c0",marginTop:"20px",fontWeight:"300"}}>
          Вже маєш акаунт?{" "}
          <Link href="/login" style={{color:"#7878b8",textDecoration:"none"}}>Увійти</Link>
        </p>
      </div>
    </main>
  );
}
