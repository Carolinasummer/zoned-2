import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{background:"rgba(255,255,255,0.38)",borderBottom:"0.5px solid rgba(255,255,255,0.6)",backdropFilter:"blur(16px)"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"17px",fontWeight:"500",color:"#4a4a7a",letterSpacing:"-0.3px"}}>
          Zoned
        </span>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" style={{fontSize:"13px",color:"#7878a8",textDecoration:"none",fontWeight:"300"}}>Features</a>
          <a href="#how" style={{fontSize:"13px",color:"#7878a8",textDecoration:"none",fontWeight:"300"}}>How it works</a>
          <Link href="/login" style={{fontSize:"13px",color:"#7878a8",textDecoration:"none",fontWeight:"300"}}>Log In</Link>
        </div>
        <Link href="/register" style={{
          fontSize:"12px",fontWeight:"500",color:"#5a5a8a",
          background:"rgba(255,255,255,0.5)",border:"0.5px solid rgba(160,160,220,0.35)",
          borderRadius:"20px",padding:"7px 18px",textDecoration:"none",transition:"all .2s"
        }}>
          Get Started
        </Link>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-12 px-6 text-center">

        {/* eyebrow */}
        <div className="inline-flex items-center gap-2 mb-8" style={{
          background:"rgba(255,255,255,0.4)",border:"0.5px solid rgba(255,255,255,0.6)",
          borderRadius:"30px",padding:"6px 16px"
        }}>
          <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#a0a0d8",display:"inline-block"}}></span>
          <span style={{fontSize:"11px",color:"#7878a8",fontWeight:"500",letterSpacing:"0.1em",textTransform:"uppercase"}}>
            AI-powered productivity · 2026
          </span>
        </div>

        {/* headline */}
        <h1 style={{
          fontFamily:"Georgia,serif",fontSize:"clamp(42px,7vw,72px)",fontWeight:"400",
          color:"#5a5a8a",letterSpacing:"-2px",lineHeight:"1.1",maxWidth:"640px",
          margin:"0 auto 16px"
        }}>
          Task planning in<br/>
          <em style={{fontStyle:"normal",color:"#7878b8"}}>Liquid Clarity.</em>
        </h1>

        <p style={{fontSize:"14px",color:"#9090b8",fontWeight:"300",lineHeight:"1.7",maxWidth:"380px",margin:"0 auto 32px"}}>
          AI breaks down your tasks, tracks where your time goes, and rewards you for getting things done.
        </p>

        {/* buttons */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <Link href="/register" style={{
            fontSize:"13px",fontWeight:"500",color:"#5a5a88",textDecoration:"none",
            background:"linear-gradient(135deg,rgba(255,205,185,0.55) 0%,rgba(185,225,245,0.55) 100%)",
            borderRadius:"30px",padding:"11px 28px",
            boxShadow:"0 0 20px rgba(180,210,245,0.35),inset 0 0 14px rgba(255,255,255,0.55)",
            outline:"0.5px solid rgba(255,255,255,0.75)",transition:"all .25s"
          }}>
            Start Planning
          </Link>
          <a href="#how" style={{
            fontSize:"13px",fontWeight:"300",color:"#8888b0",textDecoration:"none",
            background:"rgba(255,255,255,0.3)",border:"0.5px solid rgba(160,160,210,0.3)",
            borderRadius:"30px",padding:"11px 22px",transition:"all .2s"
          }}>
            See how it works
          </a>
        </div>

        {/* DASHBOARD MOCKUP */}
        <div className="max-w-3xl mx-auto" style={{
          background:"rgba(255,255,255,0.42)",border:"0.5px solid rgba(255,255,255,0.75)",
          borderRadius:"16px",padding:"24px",backdropFilter:"blur(20px)",
          boxShadow:"0 8px 40px rgba(160,160,220,0.1)"
        }}>

          {/* dash header */}
          <div className="flex items-center justify-between mb-5">
            <div className="text-left">
              <p style={{fontSize:"11px",fontWeight:"500",color:"#7878a8",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"2px"}}>
                My Tasks — Today
              </p>
              <p style={{fontSize:"11px",color:"#a0a0c0",fontWeight:"300"}}>4 active · 2 done · 180 XP earned</p>
            </div>
            <div className="flex items-center gap-2">
              <div style={{background:"rgba(255,255,255,0.35)",border:"0.5px solid rgba(220,220,240,0.45)",borderRadius:"8px",padding:"6px 12px",textAlign:"center"}}>
                <p style={{fontSize:"10px",color:"#a0a0c0",marginBottom:"1px"}}>Level</p>
                <p style={{fontSize:"14px",fontWeight:"500",color:"#6868a8"}}>4</p>
              </div>
              <div style={{background:"rgba(255,255,255,0.35)",border:"0.5px solid rgba(220,220,240,0.45)",borderRadius:"8px",padding:"6px 12px",textAlign:"center"}}>
                <p style={{fontSize:"10px",color:"#a0a0c0",marginBottom:"1px"}}>XP</p>
                <p style={{fontSize:"14px",fontWeight:"500",color:"#7898c8"}}>1240</p>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div style={{marginBottom:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
              <span style={{fontSize:"10px",color:"#a0a0c0"}}>Progress to Level 5</span>
              <span style={{fontSize:"10px",color:"#a0a0c0"}}>1240 / 2000 XP</span>
            </div>
            <div style={{height:"4px",background:"rgba(200,200,230,0.25)",borderRadius:"4px",overflow:"hidden"}}>
              <div style={{width:"62%",height:"100%",background:"linear-gradient(90deg,rgba(175,195,235,0.8),rgba(205,180,225,0.7))",borderRadius:"4px"}}></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 text-left">

            {/* TASKS */}
            <div>
              <p style={{fontSize:"10px",fontWeight:"500",color:"#a0a0c0",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"10px"}}>Tasks</p>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>

                {[
                  {dot:"#b0c8e8",name:"Design new landing page",tag:"Done",dim:false},
                  {dot:"#d8b8d8",name:"Integrate Claude API",tag:"Active",dim:false},
                  {dot:"#d8c8b0",name:"Build timer component",tag:"Active",dim:false},
                  {dot:"#c8c8d8",name:"Analytics dashboard",tag:"Planned",dim:true},
                ].map((t,i)=>(
                  <div key={i} style={{
                    display:"flex",alignItems:"center",gap:"10px",
                    padding:"8px 12px",borderRadius:"8px",
                    background:"rgba(255,255,255,0.48)",border:"0.5px solid rgba(215,215,238,0.5)"
                  }}>
                    <div style={{width:"7px",height:"7px",borderRadius:"50%",background:t.dot,flexShrink:0}}></div>
                    <span style={{fontSize:"12px",color:t.dim?"#9090b8":"#6868a0",flex:1}}>{t.name}</span>
                    <span style={{fontSize:"10px",color:"#a0a0c0",background:"rgba(200,200,230,0.3)",borderRadius:"10px",padding:"2px 8px"}}>{t.tag}</span>
                  </div>
                ))}

              </div>
            </div>

            {/* TIMELINE + TEAM */}
            <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>

              <div>
                <p style={{fontSize:"10px",fontWeight:"500",color:"#a0a0c0",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"10px"}}>Timeline</p>
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                  {[
                    {label:"Design",w:"100%",ml:"0%"},
                    {label:"Backend",w:"75%",ml:"10%"},
                    {label:"AI",w:"55%",ml:"28%"},
                    {label:"Launch",w:"20%",ml:"78%"},
                  ].map((g,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <span style={{fontSize:"10px",color:"#9090b8",width:"52px",flexShrink:0}}>{g.label}</span>
                      <div style={{flex:1,height:"5px",background:"rgba(200,200,230,0.25)",borderRadius:"3px",overflow:"hidden"}}>
                        <div style={{width:g.w,marginLeft:g.ml,height:"100%",background:"linear-gradient(90deg,rgba(175,195,235,0.7),rgba(205,180,225,0.6))",borderRadius:"3px"}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{borderTop:"0.5px solid rgba(210,210,235,0.4)",paddingTop:"16px"}}>
                <p style={{fontSize:"10px",fontWeight:"500",color:"#a0a0c0",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:"10px"}}>Recent sessions</p>
                <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                  {[
                    {name:"Landing page",time:"1h 24m",xp:"+45 XP"},
                    {name:"Claude integration",time:"0h 52m",xp:"+28 XP"},
                  ].map((s,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"11px"}}>
                      <span style={{color:"#7878a8"}}>{s.name}</span>
                      <span style={{color:"#a0a0c0"}}>{s.time}</span>
                      <span style={{color:"#9898c8",fontWeight:"500"}}>{s.xp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* bottom */}
          <div style={{marginTop:"20px",paddingTop:"16px",borderTop:"0.5px solid rgba(210,210,235,0.35)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <p style={{fontSize:"10px",color:"#b0b0c8",fontWeight:"300"}}>Zoned · AI-powered task manager</p>
            <div style={{display:"flex",gap:"5px"}}>
              {["#b8c8e8","#d0b8d8","rgba(200,200,225,0.4)"].map((c,i)=>(
                <div key={i} style={{width:"6px",height:"6px",borderRadius:"50%",background:c}}></div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p style={{fontSize:"11px",fontWeight:"500",color:"#a0a0c0",letterSpacing:"0.15em",textTransform:"uppercase",textAlign:"center",marginBottom:"16px"}}>
            What Zoned does
          </p>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(28px,4vw,40px)",fontWeight:"400",color:"#5a5a8a",textAlign:"center",letterSpacing:"-1px",marginBottom:"48px"}}>
            Everything you need to stay in the zone.
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {title:"AI Task Breakdown",desc:"Claude splits your tasks into subtasks, estimates difficulty and rewards XP automatically."},
              {title:"Time Tracker",desc:"Start a timer per task. See exactly where your hours go with session history."},
              {title:"Gamification",desc:"Earn XP, level up, and build streaks. Productivity becomes a game you want to play."},
            ].map((f,i)=>(
              <div key={i} style={{
                background:"rgba(255,255,255,0.38)",border:"0.5px solid rgba(255,255,255,0.7)",
                borderRadius:"16px",padding:"24px",backdropFilter:"blur(16px)"
              }}>
                <p style={{fontSize:"13px",fontWeight:"500",color:"#6868a8",marginBottom:"8px"}}>{f.title}</p>
                <p style={{fontSize:"12px",color:"#9090b8",lineHeight:"1.6",fontWeight:"300"}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
