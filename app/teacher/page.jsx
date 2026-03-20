"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const cards = [
  { label: "Classes Today",    value: "4",   icon: "🎓", trend: "Next at 2:00 PM" },
  { label: "Total Students",   value: "128", icon: "👥", trend: "Across 3 courses" },
  { label: "Pending Reviews",  value: "14",  icon: "📝", trend: "Assignments" },
  { label: "Avg. Class Score", value: "74%", icon: "📊", trend: "This semester" },
];

const quickLinks = [
  "Mark Attendance",
  "Upload Material",
  "Grade Assignments",
  "Schedule Class",
];

export default function TeacherPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔒 Teacher-only protection
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser || storedUser.role !== "teacher") {
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
          .loading-spinner { width:36px; height:36px; border:3px solid rgba(99,235,210,0.15); border-top-color:#63ebe2; border-radius:50%; animation:spin 0.8s linear infinite; }
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

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .tp-root { min-height:100vh; background:#05060f; font-family:'Sora',sans-serif; color:#f0f4ff; position:relative; overflow-x:hidden; }
        .tp-root::before { content:''; position:fixed; inset:0; pointer-events:none; background-image:linear-gradient(rgba(99,235,210,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,235,210,0.03) 1px,transparent 1px); background-size:48px 48px; mask-image:radial-gradient(ellipse 100% 100% at 50% 0%,black 40%,transparent 100%); }
        .orb { position:fixed; border-radius:50%; filter:blur(100px); pointer-events:none; animation:pulse 10s ease-in-out infinite; }
        .orb-1 { width:500px; height:500px; background:radial-gradient(circle,rgba(99,235,210,0.09) 0%,transparent 70%); top:-150px; right:-150px; }
        .orb-2 { width:350px; height:350px; background:radial-gradient(circle,rgba(56,128,255,0.07) 0%,transparent 70%); bottom:-100px; left:-100px; animation-delay:4s; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.6;transform:scale(1.08);} }

        /* Navbar */
        .tp-nav { position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:0 32px; height:64px; background:rgba(5,6,15,0.85); border-bottom:1px solid rgba(255,255,255,0.06); backdrop-filter:blur(20px); }
        .tp-nav-left { display:flex; align-items:center; gap:12px; }
        .tp-logo-icon { width:32px; height:32px; background:linear-gradient(135deg,#2cb5a0,#1a9080); border-radius:8px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(99,235,210,0.25); }
        .tp-logo-text { font-family:'Space Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(240,244,255,0.5); }
        .tp-logo-text span { color:#63ebe2; }
        .tp-nav-right { display:flex; align-items:center; gap:16px; }
        .tp-nav-date { font-family:'Space Mono',monospace; font-size:10.5px; color:rgba(240,244,255,0.2); letter-spacing:0.04em; display:none; }
        @media (min-width:640px) { .tp-nav-date { display:block; } }
        .tp-role-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:100px; font-size:11px; font-weight:700; font-family:'Space Mono',monospace; letter-spacing:0.08em; text-transform:uppercase; background:rgba(99,235,210,0.1); border:1px solid rgba(99,235,210,0.2); color:#63ebe2; }
        .tp-badge-dot { width:6px; height:6px; border-radius:50%; background:#63ebe2; animation:blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0.2;} }
        .tp-logout-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:rgba(240,244,255,0.4); font-family:'Sora',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; transition:all 0.2s; }
        .tp-logout-btn:hover { border-color:rgba(252,129,129,0.3); color:#fc8181; background:rgba(252,129,129,0.05); }

        /* Main */
        .tp-main { max-width:1100px; margin:0 auto; padding:40px 24px 60px; }

        /* Hero */
        .tp-hero { display:flex; align-items:center; gap:20px; margin-bottom:40px; animation:fadeUp 0.5s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
        .tp-avatar { width:60px; height:60px; flex-shrink:0; border-radius:16px; background:linear-gradient(135deg,rgba(99,235,210,0.2),rgba(99,235,210,0.06)); border:1px solid rgba(99,235,210,0.2); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; color:#63ebe2; letter-spacing:-0.02em; box-shadow:0 0 24px rgba(99,235,210,0.12); }
        .tp-greeting { font-size:13px; font-weight:400; color:rgba(240,244,255,0.35); margin-bottom:4px; letter-spacing:0.01em; }
        .tp-username { font-size:26px; font-weight:700; color:#f0f4ff; letter-spacing:-0.02em; line-height:1.1; }
        .tp-username span { background:linear-gradient(135deg,#63ebe2,#63b3ed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        /* Section label */
        .tp-section-label { font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(240,244,255,0.2); margin-bottom:14px; display:flex; align-items:center; gap:10px; }
        .tp-section-label::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.05); }

        /* Stats */
        .tp-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-bottom:36px; }
        @media (min-width:720px) { .tp-cards { grid-template-columns:repeat(4,1fr); } }
        .tp-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:20px; transition:all 0.25s ease; animation:fadeUp 0.5s ease both; position:relative; overflow:hidden; }
        .tp-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(99,235,210,0.06),transparent 70%); opacity:0; transition:opacity 0.3s; }
        .tp-card:hover { border-color:rgba(99,235,210,0.2); transform:translateY(-2px); }
        .tp-card:hover::before { opacity:1; }
        .tp-card:nth-child(1){animation-delay:0.1s;} .tp-card:nth-child(2){animation-delay:0.15s;} .tp-card:nth-child(3){animation-delay:0.2s;} .tp-card:nth-child(4){animation-delay:0.25s;}
        .tp-card-icon { font-size:22px; margin-bottom:12px; }
        .tp-card-value { font-size:28px; font-weight:700; color:#f0f4ff; letter-spacing:-0.03em; margin-bottom:4px; line-height:1; }
        .tp-card-label { font-size:12px; font-weight:500; color:rgba(240,244,255,0.4); margin-bottom:8px; }
        .tp-card-trend { font-size:10.5px; font-family:'Space Mono',monospace; color:#63ebe2; opacity:0.7; letter-spacing:0.03em; }

        /* Bottom grid */
        .tp-bottom { display:grid; grid-template-columns:1fr; gap:20px; }
        @media (min-width:720px) { .tp-bottom { grid-template-columns:1fr 1fr; } }

        /* Panels */
        .tp-panel { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:24px; animation:fadeUp 0.5s 0.3s ease both; }
        .tp-panel-title { font-size:14px; font-weight:600; color:rgba(240,244,255,0.7); margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .tp-panel-dot { width:6px; height:6px; border-radius:50%; background:#63ebe2; box-shadow:0 0 8px #63ebe2; }

        .tp-links { display:flex; flex-direction:column; gap:8px; }
        .tp-link-btn { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; color:rgba(240,244,255,0.55); font-family:'Sora',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; text-align:left; }
        .tp-link-btn:hover { border-color:rgba(99,235,210,0.2); color:#63ebe2; background:rgba(99,235,210,0.06); transform:translateX(3px); }
        .tp-link-arrow { opacity:0.4; transition:opacity 0.2s,transform 0.2s; }
        .tp-link-btn:hover .tp-link-arrow { opacity:1; transform:translateX(3px); }

        /* Schedule */
        .tp-schedule { display:flex; flex-direction:column; gap:10px; }
        .tp-schedule-item { display:flex; align-items:center; gap:14px; padding:12px 14px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:10px; transition:border-color 0.2s; }
        .tp-schedule-item:hover { border-color:rgba(99,235,210,0.12); }
        .tp-schedule-time { font-family:'Space Mono',monospace; font-size:10.5px; color:rgba(240,244,255,0.3); letter-spacing:0.04em; white-space:nowrap; width:56px; flex-shrink:0; }
        .tp-schedule-bar { width:3px; height:36px; border-radius:2px; flex-shrink:0; }
        .tp-schedule-subject { font-size:13px; font-weight:600; color:rgba(240,244,255,0.8); margin-bottom:2px; }
        .tp-schedule-meta { font-size:11px; color:rgba(240,244,255,0.3); }
        .tp-schedule-badge { margin-left:auto; font-family:'Space Mono',monospace; font-size:9.5px; font-weight:700; padding:3px 9px; border-radius:100px; letter-spacing:0.06em; text-transform:uppercase; flex-shrink:0; }

        .tp-secure { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:40px; font-size:11px; font-family:'Space Mono',monospace; color:rgba(240,244,255,0.1); letter-spacing:0.04em; }

        @media (max-width:640px) { .tp-nav { padding:0 16px; } .tp-main { padding:28px 16px 50px; } }
      `}</style>

      <div className="tp-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Navbar */}
        <nav className="tp-nav">
          <div className="tp-nav-left">
            <div className="tp-logo-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="tp-logo-text"><span>CMS</span> · Portal</span>
          </div>
          <div className="tp-nav-right">
            <span className="tp-nav-date">{dateStr}</span>
            <div className="tp-role-badge">
              <div className="tp-badge-dot" />
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Teacher
            </div>
            <button className="tp-logout-btn" onClick={handleLogout}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </nav>

        <main className="tp-main">
          {/* Hero */}
          <div className="tp-hero">
            <div className="tp-avatar">{getInitials(user.name)}</div>
            <div>
              <p className="tp-greeting">{getGreeting()},</p>
              <h1 className="tp-username">
                <span>{user.name?.split(" ")[0]}</span>
                {user.name?.includes(" ") ? " " + user.name.split(" ").slice(1).join(" ") : ""}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <p className="tp-section-label">Overview</p>
          <div className="tp-cards">
            {cards.map((card, i) => (
              <div className="tp-card" key={i}>
                <div className="tp-card-icon">{card.icon}</div>
                <div className="tp-card-value">{card.value}</div>
                <div className="tp-card-label">{card.label}</div>
                <div className="tp-card-trend">{card.trend}</div>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <p className="tp-section-label">Actions & Schedule</p>
          <div className="tp-bottom">
            {/* Quick Actions */}
            <div className="tp-panel">
              <div className="tp-panel-title">
                <div className="tp-panel-dot" />
                Quick Actions
              </div>
              <div className="tp-links">
                {quickLinks.map((link, i) => (
                  <button className="tp-link-btn" key={i}>
                    {link}
                    <svg className="tp-link-arrow" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="tp-panel">
              <div className="tp-panel-title">
                <div className="tp-panel-dot" />
                Today's Schedule
              </div>
              <div className="tp-schedule">
                {[
                  { time:"9:00 AM",  subject:"Data Structures",    meta:"Room 301 · 60 students", status:"Done",    barColor:"rgba(99,179,237,0.5)",  badgeBg:"rgba(99,179,237,0.1)",  badgeColor:"#63b3ed",  badgeBorder:"rgba(99,179,237,0.2)" },
                  { time:"11:00 AM", subject:"Algorithms",         meta:"Room 204 · 45 students", status:"Done",    barColor:"rgba(99,179,237,0.5)",  badgeBg:"rgba(99,179,237,0.1)",  badgeColor:"#63b3ed",  badgeBorder:"rgba(99,179,237,0.2)" },
                  { time:"2:00 PM",  subject:"DBMS",               meta:"Room 105 · 58 students", status:"Next",    barColor:"rgba(99,235,210,0.7)",  badgeBg:"rgba(99,235,210,0.12)", badgeColor:"#63ebe2",  badgeBorder:"rgba(99,235,210,0.25)" },
                  { time:"4:00 PM",  subject:"Computer Networks",  meta:"Room 301 · 42 students", status:"Upcoming",barColor:"rgba(255,255,255,0.15)",badgeBg:"rgba(255,255,255,0.05)",badgeColor:"rgba(240,244,255,0.35)",badgeBorder:"rgba(255,255,255,0.08)" },
                ].map((s, i) => (
                  <div className="tp-schedule-item" key={i}>
                    <span className="tp-schedule-time">{s.time}</span>
                    <div className="tp-schedule-bar" style={{ background: s.barColor }} />
                    <div>
                      <div className="tp-schedule-subject">{s.subject}</div>
                      <div className="tp-schedule-meta">{s.meta}</div>
                    </div>
                    <span className="tp-schedule-badge" style={{ background: s.badgeBg, color: s.badgeColor, border: `1px solid ${s.badgeBorder}` }}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tp-secure">
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