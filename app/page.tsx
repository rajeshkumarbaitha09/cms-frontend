"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const features = [
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-3.5-1.944M12 20l-7-4v-5" />
        </svg>
      ),
      color: "#63b3ed",
      bg: "rgba(56,128,255,0.1)",
      border: "rgba(56,128,255,0.15)",
      title: "Student Analytics",
      desc: "Track attendance, grades, assignments, and performance trends in real time.",
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "#f6ad55",
      bg: "rgba(246,173,85,0.1)",
      border: "rgba(246,173,85,0.15)",
      title: "Admin Control",
      desc: "Approve registrations, manage faculty accounts, and oversee the entire system.",
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "#63ebe2",
      bg: "rgba(99,235,210,0.1)",
      border: "rgba(99,235,210,0.15)",
      title: "Teacher Dashboard",
      desc: "Schedule classes, upload materials, grade assignments and track student progress.",
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
      border: "rgba(167,139,250,0.15)",
      title: "Smart Scheduling",
      desc: "Auto-generate timetables, set reminders, and manage academic calendars effortlessly.",
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "#fc8181",
      bg: "rgba(252,129,129,0.1)",
      border: "rgba(252,129,129,0.15)",
      title: "Live Reports",
      desc: "Generate instant reports on attendance, grades, and department performance metrics.",
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: "#63ebe2",
      bg: "rgba(99,235,210,0.08)",
      border: "rgba(99,235,210,0.12)",
      title: "Secure & Role-Based",
      desc: "JWT-authenticated access with strict role separation for students, teachers, and admins.",
    },
  ];

  const stats = [
    { value: "1,200+", label: "Students Enrolled" },
    { value: "86",     label: "Faculty Members" },
    { value: "12",     label: "Departments" },
    { value: "99.9%",  label: "Uptime" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .home-root {
          min-height: 100vh;
          background: #05060f;
          font-family: 'Sora', sans-serif;
          color: #f0f4ff;
          position: relative;
          overflow-x: hidden;
        }

        /* Grid background */
        .home-root::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, black 30%, transparent 100%);
        }

        /* Orbs */
        .orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(56,128,255,0.12) 0%, transparent 70%); top: -200px; right: -200px; animation: pulse 12s ease-in-out infinite; }
        .orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(99,235,210,0.08) 0%, transparent 70%); bottom: 10%; left: -150px; animation: pulse 10s ease-in-out infinite 3s; }
        .orb-3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(246,173,85,0.07) 0%, transparent 70%); top: 40%; right: -100px; animation: pulse 14s ease-in-out infinite 6s; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(1.1);} }

        .home-content { position: relative; z-index: 1; }

        /* ── HERO ── */
        .hero {
          max-width: 900px; margin: 0 auto;
          padding: 100px 24px 80px;
          text-align: center;
          animation: fadeUp 0.7s ease both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);} }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(56,128,255,0.1);
          border: 1px solid rgba(56,128,255,0.2);
          color: #63b3ed;
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 7px 16px; border-radius: 100px;
          margin-bottom: 32px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #63b3ed;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0.2;} }

        .hero-title {
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #f0f4ff;
          margin-bottom: 24px;
        }
        .hero-title .grad {
          background: linear-gradient(135deg, #63b3ed 0%, #63ebe2 50%, #a78bfa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 18px; font-weight: 400;
          color: rgba(240,244,255,0.45);
          line-height: 1.7; max-width: 560px;
          margin: 0 auto 40px;
          letter-spacing: 0.01em;
        }

        .hero-actions {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; flex-wrap: wrap;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 12px;
          background: linear-gradient(135deg, #3880ff, #2563eb);
          color: #fff; font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 600;
          text-decoration: none; border: none;
          box-shadow: 0 6px 24px rgba(56,128,255,0.35);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(56,128,255,0.45); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          color: rgba(240,244,255,0.6);
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 500;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.25s ease;
        }
        .btn-secondary:hover {
          color: rgba(240,244,255,0.9);
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }

        /* ── STATS ── */
        .stats-section {
          max-width: 900px; margin: 0 auto;
          padding: 0 24px 80px;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .stats-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
        }
        @media (min-width: 640px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 24px 20px;
          text-align: center;
          transition: all 0.25s;
        }
        .stat-card:hover { border-color: rgba(99,179,237,0.2); transform: translateY(-2px); }
        .stat-value {
          font-size: 32px; font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f0f4ff, rgba(240,244,255,0.7));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 12px; font-weight: 500;
          color: rgba(240,244,255,0.3);
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.05em; text-transform: uppercase;
        }

        /* ── FEATURES ── */
        .features-section {
          max-width: 1100px; margin: 0 auto;
          padding: 0 24px 100px;
        }
        .section-header {
          text-align: center; margin-bottom: 48px;
          animation: fadeUp 0.6s ease both;
        }
        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(240,244,255,0.25);
          margin-bottom: 14px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .section-label::before, .section-label::after {
          content: ''; width: 40px; height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .section-title {
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 700; letter-spacing: -0.02em;
          color: #f0f4ff; margin-bottom: 12px;
        }
        .section-sub {
          font-size: 15.5px; color: rgba(240,244,255,0.35);
          max-width: 480px; margin: 0 auto; line-height: 1.6;
        }

        .features-grid {
          display: grid; grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }

        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 28px;
          transition: all 0.3s ease;
          animation: fadeUp 0.5s ease both;
          position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: ''; position: absolute; inset: 0;
          opacity: 0; transition: opacity 0.3s;
          border-radius: 20px;
        }
        .feature-card:hover { transform: translateY(-3px); }
        .feature-card:hover::before { opacity: 1; }
        .feature-card:nth-child(1){animation-delay:0.05s;}
        .feature-card:nth-child(2){animation-delay:0.1s;}
        .feature-card:nth-child(3){animation-delay:0.15s;}
        .feature-card:nth-child(4){animation-delay:0.2s;}
        .feature-card:nth-child(5){animation-delay:0.25s;}
        .feature-card:nth-child(6){animation-delay:0.3s;}

        .feature-icon-wrap {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .feature-title {
          font-size: 16px; font-weight: 700;
          color: rgba(240,244,255,0.9);
          margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .feature-desc {
          font-size: 13.5px; font-weight: 400;
          color: rgba(240,244,255,0.38);
          line-height: 1.65;
        }

        /* ── CTA ── */
        .cta-section {
          max-width: 700px; margin: 0 auto;
          padding: 0 24px 120px;
          text-align: center;
          animation: fadeUp 0.6s 0.3s ease both;
        }
        .cta-card {
          background: rgba(56,128,255,0.06);
          border: 1px solid rgba(56,128,255,0.15);
          border-radius: 28px; padding: 60px 40px;
          position: relative; overflow: hidden;
        }
        .cta-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,128,255,0.08), transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 800; letter-spacing: -0.02em;
          color: #f0f4ff; margin-bottom: 14px;
        }
        .cta-sub {
          font-size: 15px; color: rgba(240,244,255,0.4);
          margin-bottom: 32px; line-height: 1.6;
        }

        /* Footer line */
        .home-footer {
          text-align: center; padding: 0 24px 40px;
          font-family: 'Space Mono', monospace;
          font-size: 11px; color: rgba(240,244,255,0.12);
          letter-spacing: 0.06em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
      `}</style>

      <div className="home-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="home-content">

          {/* ── HERO ── */}
          <section className="hero">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Campus Management System
            </div>
            <h1 className="hero-title">
              The smarter way to run<br />
              <span className="grad">your college</span>
            </h1>
            <p className="hero-sub">
              One platform for students, teachers, and admins.
              Track performance, manage approvals, and run your campus — all in real time.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn-primary">
                Get Started Free
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </section>

          {/* ── STATS ── */}
          <section className="stats-section">
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section className="features-section">
            <div className="section-header">
              <div className="section-label">Everything you need</div>
              <h2 className="section-title">Built for every role on campus</h2>
              <p className="section-sub">
                Purpose-built tools for students, faculty, and administrators — all under one roof.
              </p>
            </div>
            <div className="features-grid">
              {features.map((f, i) => (
                <div
                  className="feature-card"
                  key={i}
                  style={{
                    borderColor: mounted ? f.border : "rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = f.border.replace("0.15","0.35")}
                  onMouseLeave={e => e.currentTarget.style.borderColor = f.border}
                >
                  <div className="feature-icon-wrap" style={{ background: f.bg, color: f.color }}>
                    {f.icon}
                  </div>
                  <div className="feature-title" style={{ color: "rgba(240,244,255,0.9)" }}>{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="cta-section">
            <div className="cta-card">
              <h2 className="cta-title">Ready to get started?</h2>
              <p className="cta-sub">
                Register as a student in seconds. Teachers and admins are set up directly by the college admin.
              </p>
              <div className="hero-actions">
                <Link href="/register" className="btn-primary">
                  Create Student Account
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link href="/login" className="btn-secondary">
                  Already have an account?
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="home-footer">
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            CollegeOS · Secured · {new Date().getFullYear()}
          </footer>

        </div>
      </div>
    </>
  );
}