"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  const roleConfig = {
    student: { color: "#63b3ed", bg: "rgba(56,128,255,0.1)", border: "rgba(56,128,255,0.2)", label: "Student", href: "/dashboard" },
    teacher: { color: "#63ebe2", bg: "rgba(99,235,210,0.1)", border: "rgba(99,235,210,0.2)", label: "Teacher", href: "/teacher" },
    admin:   { color: "#f6ad55", bg: "rgba(246,173,85,0.1)",  border: "rgba(246,173,85,0.2)",  label: "Admin",   href: "/admin" },
  };

  const rc = user ? (roleConfig[user.role] || roleConfig.student) : null;

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const navLinks = [
    { href: "/", label: "Home" },
    ...(!user ? [
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ] : []),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          font-family: 'Sora', sans-serif;
          transition: all 0.3s ease;
        }
        .nav-root.scrolled {
          background: rgba(5,6,15,0.92);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(24px);
          box-shadow: 0 4px 32px rgba(0,0,0,0.3);
        }
        .nav-root:not(.scrolled) {
          background: rgba(5,6,15,0.6);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
        }

        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* Logo */
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #3880ff, #2563eb);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(56,128,255,0.35);
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-family: 'Space Mono', monospace;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(240,244,255,0.85);
        }
        .nav-logo-text span { color: #63b3ed; }

        /* Center links */
        .nav-links {
          display: none;
          align-items: center; gap: 4px;
        }
        @media (min-width: 768px) { .nav-links { display: flex; } }

        .nav-link {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13.5px; font-weight: 500;
          color: rgba(240,244,255,0.45);
          text-decoration: none;
          transition: all 0.2s;
          letter-spacing: 0.01em;
          border: 1px solid transparent;
        }
        .nav-link:hover {
          color: rgba(240,244,255,0.85);
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.07);
        }
        .nav-link.active {
          color: #63b3ed;
          background: rgba(56,128,255,0.08);
          border-color: rgba(56,128,255,0.15);
        }

        /* Right side */
        .nav-right {
          display: flex; align-items: center; gap: 10px;
        }

        /* Role badge */
        .nav-role-badge {
          display: none;
          align-items: center; gap: 7px;
          padding: 5px 12px; border-radius: 100px;
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none;
          transition: all 0.2s;
        }
        @media (min-width: 768px) { .nav-role-badge { display: inline-flex; } }
        .nav-role-badge:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .nav-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0.2;} }

        /* User avatar */
        .nav-avatar {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }

        /* Auth buttons */
        .nav-btn-login {
          padding: 7px 16px; border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(240,244,255,0.55);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          transition: all 0.2s;
          display: none;
        }
        @media (min-width: 640px) { .nav-btn-login { display: block; } }
        .nav-btn-login:hover {
          color: rgba(240,244,255,0.85);
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.07);
        }

        .nav-btn-register {
          padding: 7px 16px; border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #3880ff, #2563eb);
          border: none;
          box-shadow: 0 4px 14px rgba(56,128,255,0.3);
          transition: all 0.2s;
          display: none;
        }
        @media (min-width: 640px) { .nav-btn-register { display: block; } }
        .nav-btn-register:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(56,128,255,0.4);
        }

        /* Logout */
        .nav-logout {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 13px; border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 12.5px; font-weight: 500;
          color: rgba(240,244,255,0.35);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-logout:hover {
          color: #fc8181;
          border-color: rgba(252,129,129,0.25);
          background: rgba(252,129,129,0.05);
        }

        /* Divider */
        .nav-divider {
          width: 1px; height: 20px;
          background: rgba(255,255,255,0.08);
          display: none;
        }
        @media (min-width: 768px) { .nav-divider { display: block; } }

        /* Mobile menu button */
        .nav-hamburger {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 5px; width: 36px; height: 36px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; cursor: pointer;
          transition: all 0.2s;
        }
        .nav-hamburger:hover { background: rgba(255,255,255,0.07); }
        @media (min-width: 768px) { .nav-hamburger { display: none; } }
        .ham-line {
          width: 16px; height: 1.5px;
          background: rgba(240,244,255,0.5);
          border-radius: 2px;
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .nav-hamburger.open .ham-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open .ham-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile drawer */
        .nav-mobile {
          display: none;
          position: fixed; top: 64px; left: 0; right: 0;
          background: rgba(5,6,15,0.97);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(24px);
          padding: 16px 24px 24px;
          flex-direction: column; gap: 8px;
          animation: slideDown 0.2s ease both;
        }
        .nav-mobile.open { display: flex; }
        @media (min-width: 768px) { .nav-mobile { display: none !important; } }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }

        .mob-link {
          padding: 11px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500;
          color: rgba(240,244,255,0.5);
          text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .mob-link:hover, .mob-link.active {
          color: rgba(240,244,255,0.9);
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.07);
        }
        .mob-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
        .mob-logout {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px; border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 500;
          color: rgba(252,129,129,0.7);
          background: none; border: 1px solid transparent;
          cursor: pointer; text-align: left; width: 100%;
          transition: all 0.2s;
        }
        .mob-logout:hover {
          color: #fc8181;
          background: rgba(252,129,129,0.05);
          border-color: rgba(252,129,129,0.15);
        }
        .mob-role-row {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          text-decoration: none; margin-bottom: 4px;
        }
        .mob-role-info { display: flex; flex-direction: column; gap: 2px; }
        .mob-role-name { font-size: 13.5px; font-weight: 600; color: rgba(240,244,255,0.8); }
        .mob-role-sub { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
      `}</style>

      {/* Spacer so page content doesn't hide behind fixed nav */}
      <div style={{ height: 64 }} />

      <nav className={`nav-root${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="nav-logo-text"><span>College</span>OS</span>
          </Link>

          {/* Center nav links */}
          <div className="nav-links">
            <Link href="/" className={`nav-link${pathname === "/" ? " active" : ""}`}>Home</Link>
            {!user && (
              <>
                <Link href="/login" className={`nav-link${pathname === "/login" ? " active" : ""}`}>Login</Link>
                <Link href="/register" className={`nav-link${pathname === "/register" ? " active" : ""}`}>Register</Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="nav-right">
            {user && rc ? (
              <>
                {/* Role portal link */}
                <Link
                  href={rc.href}
                  className="nav-role-badge"
                  style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color }}
                >
                  <span className="nav-badge-dot" style={{ background: rc.color }} />
                  {rc.label} Portal
                </Link>

                <div className="nav-divider" />

                {/* Avatar */}
                <div
                  className="nav-avatar"
                  style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}
                >
                  {getInitials(user.name)}
                </div>

                {/* Logout */}
                <button className="nav-logout" onClick={logout}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-btn-login">Sign In</Link>
                <Link href="/register" className="nav-btn-register">Get Started</Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className={`nav-hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="ham-line" />
              <span className="ham-line" />
              <span className="ham-line" />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`nav-mobile${menuOpen ? " open" : ""}`}>
          {user && rc ? (
            <>
              {/* User info row */}
              <Link href={rc.href} className="mob-role-row">
                <div
                  className="nav-avatar"
                  style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, width: 40, height: 40, borderRadius: 12 }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="mob-role-info">
                  <span className="mob-role-name">{user.name}</span>
                  <span className="mob-role-sub" style={{ color: rc.color }}>{rc.label} · {rc.href}</span>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={`mob-link${pathname === "/login" ? " active" : ""}`}>Login</Link>
              <Link href="/register" className={`mob-link${pathname === "/register" ? " active" : ""}`}>Register</Link>
            </>
          )}

          <Link href="/" className={`mob-link${pathname === "/" ? " active" : ""}`}>Home</Link>

          {user && (
            <>
              <div className="mob-divider" />
              <button className="mob-logout" onClick={logout}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}