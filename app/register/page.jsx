"use client";
import { useState } from "react";
import { registerUser } from "../../services/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      alert("Registered! Wait for admin approval");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cms-root {
          min-height: 100vh;
          background: #05060f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .cms-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99, 179, 237, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 179, 237, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: pulse 8s ease-in-out infinite;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(56, 128, 255, 0.15) 0%, transparent 70%);
          top: -100px; left: -100px;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(99, 235, 210, 0.1) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation-delay: 3s;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .cms-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 44px 40px;
          backdrop-filter: blur(20px);
          position: relative;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          box-shadow:
            0 0 0 1px rgba(99, 179, 237, 0.06),
            0 40px 80px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .cms-header { text-align: center; margin-bottom: 32px; }
        .cms-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(56, 128, 255, 0.1);
          border: 1px solid rgba(56, 128, 255, 0.2);
          color: #63b3ed;
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .cms-badge-dot {
          width: 6px; height: 6px; background: #63b3ed;
          border-radius: 50%; animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .cms-title {
          font-size: 28px; font-weight: 700; color: #f0f4ff;
          letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 8px;
        }
        .cms-title span {
          background: linear-gradient(135deg, #63b3ed, #63ebe2);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cms-subtitle { font-size: 13.5px; color: rgba(240,244,255,0.35); font-weight: 400; }

        /* Student notice */
        .student-notice {
          display: flex; align-items: center; gap: 12px;
          background: rgba(56, 128, 255, 0.06);
          border: 1px solid rgba(99, 179, 237, 0.12);
          border-radius: 12px; padding: 14px 16px;
          margin-bottom: 28px;
          animation: fadeIn 0.5s 0.2s ease both;
        }
        .notice-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          background: rgba(99, 179, 237, 0.1);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #63b3ed;
        }
        .notice-text { font-size: 12.5px; color: rgba(240,244,255,0.4); line-height: 1.45; }
        .notice-text strong {
          display: block; color: rgba(240,244,255,0.75);
          font-weight: 600; font-size: 13px; margin-bottom: 2px;
        }

        /* Divider */
        .cms-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .cms-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .cms-divider-text {
          font-size: 11px; font-family: 'Space Mono', monospace;
          color: rgba(240,244,255,0.2); letter-spacing: 0.05em; text-transform: uppercase;
        }

        /* Fields */
        .field-group { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .field-wrap { position: relative; animation: fadeIn 0.4s ease both; }
        .field-wrap:nth-child(1) { animation-delay: 0.1s; }
        .field-wrap:nth-child(2) { animation-delay: 0.2s; }
        .field-wrap:nth-child(3) { animation-delay: 0.3s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .field-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: rgba(240,244,255,0.25); pointer-events: none; display: flex; transition: color 0.2s;
        }
        .field-wrap:focus-within .field-icon { color: #63b3ed; }
        .cms-input {
          width: 100%; padding: 14px 16px 14px 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; color: #f0f4ff;
          font-family: 'Sora', sans-serif; font-size: 14px;
          outline: none; transition: all 0.2s ease; letter-spacing: 0.01em;
        }
        .cms-input::placeholder { color: rgba(240,244,255,0.2); }
        .cms-input:focus {
          border-color: rgba(99, 179, 237, 0.45);
          background: rgba(56, 128, 255, 0.06);
          box-shadow: 0 0 0 3px rgba(56, 128, 255, 0.08);
        }
        .pw-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(240,244,255,0.3);
          cursor: pointer; padding: 4px; display: flex; align-items: center; transition: color 0.2s;
        }
        .pw-toggle:hover { color: rgba(240,244,255,0.7); }

        /* Approval notice */
        .approval-notice {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(246, 173, 85, 0.06);
          border: 1px solid rgba(246, 173, 85, 0.15);
          border-radius: 10px; padding: 12px 14px;
          margin-bottom: 20px;
          animation: fadeIn 0.5s 0.35s ease both;
        }
        .approval-icon { color: #f6ad55; flex-shrink: 0; margin-top: 1px; }
        .approval-text { font-size: 12px; color: rgba(240,244,255,0.4); line-height: 1.55; }
        .approval-text strong { color: #f6ad55; font-weight: 600; }

        /* Submit */
        .cms-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #3880ff, #2563eb);
          border: none; border-radius: 12px;
          color: #fff; font-family: 'Sora', sans-serif;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          letter-spacing: 0.01em; transition: all 0.25s ease;
          position: relative; overflow: hidden;
          box-shadow: 0 4px 20px rgba(56, 128, 255, 0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .cms-submit::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .cms-submit:hover::before { opacity: 1; }
        .cms-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(56, 128, 255, 0.4); }
        .cms-submit:active { transform: translateY(0); }
        .cms-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .cms-footer { margin-top: 24px; text-align: center; font-size: 13px; color: rgba(240,244,255,0.3); }
        .cms-footer a { color: #63b3ed; font-weight: 500; text-decoration: none; transition: color 0.2s; }
        .cms-footer a:hover { color: #90cdf4; }
        .cms-secure {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin-top: 20px;
          font-size: 11px; font-family: 'Space Mono', monospace;
          color: rgba(240,244,255,0.15); letter-spacing: 0.04em;
        }
      `}</style>

      <div className="cms-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="cms-card">
          {/* Header */}
          <div className="cms-header">
            <div className="cms-badge">
              <div className="cms-badge-dot" />
              Campus Management System
            </div>
            <h1 className="cms-title">
              Create your <span>account</span>
            </h1>
            <p className="cms-subtitle">Student self-registration portal</p>
          </div>

          {/* Student-only notice */}
          <div className="student-notice">
            <div className="notice-icon">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-3.5-1.944M12 20l-7-4v-5" />
              </svg>
            </div>
            <div className="notice-text">
              <strong>Student Registration Only</strong>
              This form is for students. Teachers are added directly by the admin.
            </div>
          </div>

          <div className="cms-divider">
            <div className="cms-divider-line" />
            <span className="cms-divider-text">Your Details</span>
            <div className="cms-divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              {/* Name */}
              <div className="field-wrap">
                <input
                  className="cms-input"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <span className="field-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>

              {/* Email */}
              <div className="field-wrap">
                <input
                  className="cms-input"
                  type="email"
                  placeholder="College Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <span className="field-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>

              {/* Password */}
              <div className="field-wrap">
                <input
                  className="cms-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <span className="field-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Approval warning */}
            <div className="approval-notice">
              <span className="approval-icon">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </span>
              <p className="approval-text">
                <strong>Pending Approval — </strong>
                Your account will be reviewed by an admin before you can access the portal.
              </p>
            </div>

            <button type="submit" className="cms-submit" disabled={loading}>
              {loading ? (
                <><span className="spinner" />Submitting…</>
              ) : (
                <>
                  Register as Student
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="cms-footer">
            Already have an account?{" "}
            <a href="/login">Sign in here</a>
          </div>

          <div className="cms-secure">
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secured · College Portal
          </div>
        </div>
      </div>
    </>
  );
}