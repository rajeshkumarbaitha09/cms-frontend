"use client";
import { useState } from "react";
import { loginUser } from "../../services/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🔥 Role-based redirect
        if (data.user.role === "admin") {
          router.push("/admin");
        } else if (data.user.role === "teacher") {
          router.push("/teacher");
        } else {
          router.push("/dashboard");
        }
      } else {
        // ✅ Show server message (e.g. "Wait for admin approval")
        setError(data.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleDestinations = [
    { role: "Student", icon: "🎓", path: "/dashboard", color: "#63b3ed" },
    { role: "Teacher", icon: "📋", path: "/teacher",   color: "#63ebe2" },
    { role: "Admin",   icon: "🛡️", path: "/admin",     color: "#f6ad55" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cms-root { min-height:100vh; background:#05060f; display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; padding:24px; position:relative; overflow:hidden; }
        .cms-root::before { content:''; position:absolute; inset:0; background-image:linear-gradient(rgba(99,179,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.04) 1px,transparent 1px); background-size:48px 48px; mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,black 30%,transparent 100%); }
        .orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; animation:pulse 8s ease-in-out infinite; }
        .orb-1 { width:400px; height:400px; background:radial-gradient(circle,rgba(56,128,255,0.15) 0%,transparent 70%); top:-100px; right:-100px; }
        .orb-2 { width:300px; height:300px; background:radial-gradient(circle,rgba(99,235,210,0.1) 0%,transparent 70%); bottom:-80px; left:-80px; animation-delay:3s; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.6;transform:scale(1.1);} }

        .cms-card { width:100%; max-width:440px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:44px 40px; backdrop-filter:blur(20px); position:relative; animation:slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both; box-shadow:0 0 0 1px rgba(99,179,237,0.06),0 40px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08); }
        @keyframes slideUp { from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);} }

        .cms-header { text-align:center; margin-bottom:32px; }
        .cms-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(56,128,255,0.1); border:1px solid rgba(56,128,255,0.2); color:#63b3ed; font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; padding:6px 14px; border-radius:100px; margin-bottom:20px; }
        .cms-badge-dot { width:6px; height:6px; background:#63b3ed; border-radius:50%; animation:blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0.3;} }
        .cms-title { font-size:28px; font-weight:700; color:#f0f4ff; letter-spacing:-0.02em; line-height:1.1; margin-bottom:8px; }
        .cms-title span { background:linear-gradient(135deg,#63b3ed,#63ebe2); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .cms-subtitle { font-size:13.5px; color:rgba(240,244,255,0.35); font-weight:400; }

        /* Role redirect pills */
        .role-redirects-label { font-family:'Space Mono',monospace; font-size:9.5px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(240,244,255,0.2); margin-bottom:8px; text-align:center; }
        .role-redirects { display:flex; gap:6px; margin-bottom:24px; animation:fadeIn 0.5s 0.2s ease both; }
        .role-redirect-pill { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:10px; }
        .role-redirect-emoji { font-size:15px; }
        .role-redirect-name { font-family:'Space Mono',monospace; font-size:9px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; }
        .role-redirect-path { font-size:9.5px; color:rgba(240,244,255,0.2); font-family:'Space Mono',monospace; }

        .cms-divider { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .cms-divider-line { flex:1; height:1px; background:rgba(255,255,255,0.06); }
        .cms-divider-text { font-size:11px; font-family:'Space Mono',monospace; color:rgba(240,244,255,0.18); letter-spacing:0.05em; text-transform:uppercase; }

        .field-group { display:flex; flex-direction:column; gap:14px; margin-bottom:10px; }
        .field-wrap { position:relative; animation:fadeIn 0.4s ease both; }
        .field-wrap:nth-child(1){animation-delay:0.15s;} .field-wrap:nth-child(2){animation-delay:0.25s;}
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);} }
        .field-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:rgba(240,244,255,0.25); pointer-events:none; display:flex; transition:color 0.2s; }
        .field-wrap:focus-within .field-icon { color:#63b3ed; }
        .cms-input { width:100%; padding:14px 16px 14px 44px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; color:#f0f4ff; font-family:'Sora',sans-serif; font-size:14px; outline:none; transition:all 0.2s ease; letter-spacing:0.01em; }
        .cms-input::placeholder { color:rgba(240,244,255,0.2); }
        .cms-input:focus { border-color:rgba(99,179,237,0.45); background:rgba(56,128,255,0.06); box-shadow:0 0 0 3px rgba(56,128,255,0.08); }
        .cms-input.has-error { border-color:rgba(252,129,129,0.4); background:rgba(252,129,129,0.04); }
        .pw-toggle { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(240,244,255,0.3); cursor:pointer; padding:4px; display:flex; transition:color 0.2s; }
        .pw-toggle:hover { color:rgba(240,244,255,0.7); }

        .forgot-row { display:flex; justify-content:flex-end; margin:10px 0 22px; }
        .forgot-link { font-size:12.5px; color:#63b3ed; text-decoration:none; font-weight:500; transition:color 0.2s; }
        .forgot-link:hover { color:#90cdf4; }

        /* Error — handles both "wrong password" and "wait for approval" */
        .error-msg { display:flex; align-items:flex-start; gap:8px; background:rgba(252,129,129,0.08); border:1px solid rgba(252,129,129,0.2); border-radius:10px; padding:11px 14px; color:#fc8181; font-size:12.5px; font-weight:500; margin-bottom:18px; animation:shake 0.4s ease; line-height:1.5; }
        .error-msg.approval { background:rgba(246,173,85,0.08); border-color:rgba(246,173,85,0.2); color:#f6ad55; animation:fadeIn 0.3s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0);}20%{transform:translateX(-6px);}40%{transform:translateX(6px);}60%{transform:translateX(-4px);}80%{transform:translateX(4px);} }

        .cms-submit { width:100%; padding:15px; background:linear-gradient(135deg,#3880ff,#2563eb); border:none; border-radius:12px; color:#fff; font-family:'Sora',sans-serif; font-size:14.5px; font-weight:600; cursor:pointer; letter-spacing:0.01em; transition:all 0.25s ease; position:relative; overflow:hidden; box-shadow:0 4px 20px rgba(56,128,255,0.3); display:flex; align-items:center; justify-content:center; gap:8px; }
        .cms-submit::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent); opacity:0; transition:opacity 0.2s; }
        .cms-submit:hover::before { opacity:1; }
        .cms-submit:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(56,128,255,0.4); }
        .cms-submit:active { transform:translateY(0); }
        .cms-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg);} }

        .cms-footer-divider { display:flex; align-items:center; gap:12px; margin:24px 0; }
        .cms-footer-divider-line { flex:1; height:1px; background:rgba(255,255,255,0.06); }
        .cms-footer-divider-text { font-size:11px; font-family:'Space Mono',monospace; color:rgba(240,244,255,0.18); letter-spacing:0.05em; text-transform:uppercase; }
        .cms-footer { text-align:center; font-size:13px; color:rgba(240,244,255,0.3); }
        .cms-footer a { color:#63b3ed; font-weight:500; text-decoration:none; transition:color 0.2s; }
        .cms-footer a:hover { color:#90cdf4; }
        .cms-secure { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:20px; font-size:11px; font-family:'Space Mono',monospace; color:rgba(240,244,255,0.15); letter-spacing:0.04em; }
      `}</style>

      <div className="cms-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="cms-card">
          <div className="cms-header">
            <div className="cms-badge"><div className="cms-badge-dot" />Campus Management System</div>
            <h1 className="cms-title">Welcome <span>back</span></h1>
            <p className="cms-subtitle">Sign in to access your campus portal</p>
          </div>

          <p className="role-redirects-label">You'll be redirected to</p>
          <div className="role-redirects">
            {roleDestinations.map((r) => (
              <div className="role-redirect-pill" key={r.role} style={{ borderColor:`${r.color}18` }}>
                <span className="role-redirect-emoji">{r.icon}</span>
                <span className="role-redirect-name" style={{ color:r.color }}>{r.role}</span>
                <span className="role-redirect-path">{r.path}</span>
              </div>
            ))}
          </div>

          <div className="cms-divider">
            <div className="cms-divider-line" />
            <span className="cms-divider-text">Sign In</span>
            <div className="cms-divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            {/* ✅ Shows "Wait for admin approval" or any server message */}
            {error && (
              <div className={`error-msg ${error.toLowerCase().includes("approval") || error.toLowerCase().includes("wait") || error.toLowerCase().includes("pending") ? "approval" : ""}`}>
                {error.toLowerCase().includes("approval") || error.toLowerCase().includes("wait") || error.toLowerCase().includes("pending") ? (
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0,marginTop:1}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                ) : (
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0,marginTop:1}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {error}
              </div>
            )}

            <div className="field-group">
              <div className="field-wrap">
                <input className={`cms-input${error ? " has-error" : ""}`} type="email" placeholder="College Email Address" value={form.email} onChange={(e) => { setError(""); setForm({ ...form, email: e.target.value }); }} required />
                <span className="field-icon"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
              </div>
              <div className="field-wrap">
                <input className={`cms-input${error ? " has-error" : ""}`} type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => { setError(""); setForm({ ...form, password: e.target.value }); }} required />
                <span className="field-icon"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></span>
                <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="forgot-row">
              <a href="/forgot-password" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="cms-submit" disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Signing in…</>
              ) : (
                <>Sign In <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
              )}
            </button>
          </form>

          <div className="cms-footer-divider">
            <div className="cms-footer-divider-line" />
            <span className="cms-footer-divider-text">New here?</span>
            <div className="cms-footer-divider-line" />
          </div>
          <div className="cms-footer">Don't have an account?{" "}<a href="/register">Create one now</a></div>
          <div className="cms-secure">
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Secured · College Portal
          </div>
        </div>
      </div>
    </>
  );
}