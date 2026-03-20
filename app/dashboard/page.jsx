"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const roleConfig = {
  student: {
    color: "#63b3ed",
    bg: "rgba(56, 128, 255, 0.1)",
    border: "rgba(56, 128, 255, 0.2)",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-3.5-1.944M12 20l-7-4v-5" />
      </svg>
    ),
    cards: [
      { label: "Enrolled Courses", value: "6",    icon: "📚", trend: "+1 this sem" },
      { label: "Attendance",        value: "87%",  icon: "📋", trend: "Above average" },
      { label: "Assignments Due",   value: "3",    icon: "📝", trend: "This week" },
      { label: "CGPA",              value: "8.4",  icon: "🏆", trend: "Top 20%" },
    ],
    quickLinks: ["View Timetable", "Submit Assignment", "Check Grades", "Library Portal"],
  },
};

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔒 Protect: students only
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser || storedUser.role !== "student") {
      window.location.href = "/login";
      return;
    }
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
          .loading-screen { min-height:100vh; background:#05060f; display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; }
          .loading-inner { display:flex; flex-direction:column; align-items:center; gap:16px; }
          .loading-spinner { width:36px; height:36px; border:3px solid rgba(99,179,237,0.15); border-top-color:#63b3ed; border-radius:50%; animation:spin 0.8s linear infinite; }
          .loading-text { color:rgba(240,244,255,0.3); font-size:13px; letter-spacing:0.04em; }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
        <div className="loading-screen">
          <div className="loading-inner">
            <div className="loading-spinner" />
            <span className="loading-text">Loading your portal…</span>
          </div>
        </div>
      </>
    );
  }

  const config = roleConfig.student;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root { min-height:100vh; background:#05060f; font-family:'Sora',sans-serif; color:#f0f4ff; position:relative; overflow-x:hidden; }
        .db-root::before {
          content:''; position:fixed; inset:0; pointer-events:none;
          background-image: linear-gradient(rgba(99,179,237,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(99,179,237,0.03) 1px,transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse 100% 100% at 50% 0%,black 40%,transparent 100%);
        }
        .orb { position:fixed; border-radius:50%; filter:blur(100px); pointer-events:none; animation:pulse 10s ease-in-out infinite; }
        .orb-1 { width:500px; height:500px; background:radial-gradient(circle,rgba(56,128,255,0.1) 0%,transparent 70%); top:-150px; right:-150px; }
        .orb-2 { width:350px; height:350px; background:radial-gradient(circle,rgba(99,235,210,0.07) 0%,transparent 70%); bottom:-100px; left:-100px; animation-delay:4s; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.6;transform:scale(1.08);} }

        /* Navbar */
        .db-nav { position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:0 32px; height:64px; background:rgba(5,6,15,0.8); border-bottom:1px solid rgba(255,255,255,0.06); backdrop-filter:blur(20px); }
        .db-nav-left { display:flex; align-items:center; gap:12px; }
        .db-logo-icon { width:32px; height:32px; background:linear-gradient(135deg,#3880ff,#2563eb); border-radius:8px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(56,128,255,0.3); }
        .db-logo-text { font-family:'Space Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(240,244,255,0.6); }
        .db-logo-text span { color:#63b3ed; }
        .db-nav-right { display:flex; align-items:center; gap:16px; }
        .db-nav-date { font-family:'Space Mono',monospace; font-size:10.5px; color:rgba(240,244,255,0.2); letter-spacing:0.04em; display:none; }
        @media (min-width:640px) { .db-nav-date { display:block; } }
        .db-role-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:100px; font-size:11px; font-weight:600; font-family:'Space Mono',monospace; letter-spacing:0.08em; text-transform:uppercase; background:rgba(56,128,255,0.1); border:1px solid rgba(56,128,255,0.2); color:#63b3ed; }
        .db-logout-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:rgba(240,244,255,0.4); font-family:'Sora',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; transition:all 0.2s; }
        .db-logout-btn:hover { border-color:rgba(252,129,129,0.3); color:#fc8181; background:rgba(252,129,129,0.05); }

        /* Main */
        .db-main { max-width:1100px; margin:0 auto; padding:40px 24px 60px; }

        /* Hero */
        .db-hero { display:flex; align-items:center; gap:20px; margin-bottom:40px; animation:fadeUp 0.5s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
        .db-avatar { width:60px; height:60px; flex-shrink:0; border-radius:16px; background:linear-gradient(135deg,rgba(99,179,237,0.2),rgba(99,179,237,0.07)); border:1px solid rgba(56,128,255,0.2); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; color:#63b3ed; letter-spacing:-0.02em; box-shadow:0 0 24px rgba(99,179,237,0.14); }
        .db-greeting { font-size:13px; font-weight:400; color:rgba(240,244,255,0.35); margin-bottom:4px; letter-spacing:0.01em; }
        .db-username { font-size:26px; font-weight:700; color:#f0f4ff; letter-spacing:-0.02em; line-height:1.1; }
        .db-username span { background:linear-gradient(135deg,#63b3ed,#63ebe2); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        /* Section label */
        .db-section-label { font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(240,244,255,0.2); margin-bottom:14px; display:flex; align-items:center; gap:10px; }
        .db-section-label::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.05); }

        /* Stats cards */
        .db-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-bottom:36px; }
        @media (min-width:720px) { .db-cards { grid-template-columns:repeat(4,1fr); } }
        .db-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:20px; transition:all 0.25s ease; animation:fadeUp 0.5s ease both; position:relative; overflow:hidden; }
        .db-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(99,179,237,0.06),transparent 70%); opacity:0; transition:opacity 0.3s; }
        .db-card:hover { border-color:rgba(56,128,255,0.2); transform:translateY(-2px); }
        .db-card:hover::before { opacity:1; }
        .db-card:nth-child(1){animation-delay:0.1s;} .db-card:nth-child(2){animation-delay:0.15s;} .db-card:nth-child(3){animation-delay:0.2s;} .db-card:nth-child(4){animation-delay:0.25s;}
        .db-card-icon { font-size:22px; margin-bottom:12px; }
        .db-card-value { font-size:28px; font-weight:700; color:#f0f4ff; letter-spacing:-0.03em; margin-bottom:4px; line-height:1; }
        .db-card-label { font-size:12px; font-weight:500; color:rgba(240,244,255,0.4); margin-bottom:8px; }
        .db-card-trend { font-size:10.5px; font-family:'Space Mono',monospace; color:#63b3ed; opacity:0.7; letter-spacing:0.03em; }

        /* Bottom grid */
        .db-bottom { display:grid; grid-template-columns:1fr; gap:20px; }
        @media (min-width:720px) { .db-bottom { grid-template-columns:1fr 1fr; } }
        .db-panel { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:24px; animation:fadeUp 0.5s 0.3s ease both; }
        .db-panel-title { font-size:14px; font-weight:600; color:rgba(240,244,255,0.7); margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .db-panel-title-dot { width:6px; height:6px; border-radius:50%; background:#63b3ed; box-shadow:0 0 8px #63b3ed; }

        .db-links { display:flex; flex-direction:column; gap:8px; }
        .db-link-btn { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; color:rgba(240,244,255,0.55); font-family:'Sora',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; text-align:left; }
        .db-link-btn:hover { border-color:rgba(56,128,255,0.2); color:#63b3ed; background:rgba(56,128,255,0.07); transform:translateX(3px); }
        .db-link-arrow { opacity:0.4; transition:opacity 0.2s,transform 0.2s; }
        .db-link-btn:hover .db-link-arrow { opacity:1; transform:translateX(3px); }

        .db-activities { display:flex; flex-direction:column; gap:10px; }
        .db-activity { display:flex; align-items:flex-start; gap:12px; padding:12px 14px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:10px; }
        .db-activity-dot { width:8px; height:8px; border-radius:50%; background:#63b3ed; margin-top:4px; flex-shrink:0; box-shadow:0 0 8px rgba(99,179,237,0.55); }
        .db-activity-text { font-size:12.5px; color:rgba(240,244,255,0.5); line-height:1.5; }
        .db-activity-text strong { color:rgba(240,244,255,0.75); font-weight:600; }
        .db-activity-time { margin-left:auto; font-family:'Space Mono',monospace; font-size:10px; color:rgba(240,244,255,0.2); white-space:nowrap; flex-shrink:0; }

        .db-secure { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:40px; font-size:11px; font-family:'Space Mono',monospace; color:rgba(240,244,255,0.1); letter-spacing:0.04em; }
      `}</style>

      <div className="db-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Navbar */}
        <nav className="db-nav">
          <div className="db-nav-left">
            <div className="db-logo-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="db-logo-text"><span>CMS</span> · Portal</span>
          </div>
          <div className="db-nav-right">
            <span className="db-nav-date">{dateStr}</span>
            <div className="db-role-badge">
              {config.icon}
              student
            </div>
            <button className="db-logout-btn" onClick={handleLogout}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </nav>

        {/* Main */}
        <main className="db-main">
          {/* Greeting */}
          <div className="db-hero">
            <div className="db-avatar">{getInitials(user.name)}</div>
            <div>
              <p className="db-greeting">{getGreeting()},</p>
              <h1 className="db-username">
                <span>{user.name?.split(" ")[0]}</span>
                {user.name?.includes(" ") ? " " + user.name.split(" ").slice(1).join(" ") : ""}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <p className="db-section-label">Overview</p>
          <div className="db-cards">
            {config.cards.map((card, i) => (
              <div className="db-card" key={i}>
                <div className="db-card-icon">{card.icon}</div>
                <div className="db-card-value">{card.value}</div>
                <div className="db-card-label">{card.label}</div>
                <div className="db-card-trend">{card.trend}</div>
              </div>
            ))}
          </div>

          {/* Bottom panels */}
          <p className="db-section-label">Actions & Activity</p>
          <div className="db-bottom">
            {/* Quick Links */}
            <div className="db-panel">
              <div className="db-panel-title">
                <div className="db-panel-title-dot" />
                Quick Actions
              </div>
              <div className="db-links">
                {config.quickLinks.map((link, i) => (
                  <button className="db-link-btn" key={i}>
                    {link}
                    <svg className="db-link-arrow" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="db-panel">
              <div className="db-panel-title">
                <div className="db-panel-title-dot" />
                Recent Activity
              </div>
              <div className="db-activities">
                {[
                  { text: <><strong>Logged in</strong> successfully to campus portal</>, time: "Just now" },
                  { text: <><strong>Profile</strong> loaded from secure session</>, time: "Just now" },
                  { text: <><strong>Student</strong> dashboard session started</>, time: "Today" },
                ].map((a, i) => (
                  <div className="db-activity" key={i}>
                    <div className="db-activity-dot" />
                    <span className="db-activity-text">{a.text}</span>
                    <span className="db-activity-time">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="db-secure">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secured · College Portal · {new Date().getFullYear()}
          </div>
        </main>
      </div>
    </>
  );
}