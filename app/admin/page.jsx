"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("approvals");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const token = typeof window !== "undefined" && localStorage.getItem("token");

  // 🔒 Admin-only protection
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "admin") {
      window.location.href = "/login";
      return;
    }
    setAdminUser(user);
    fetchUsers();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/pending-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to fetch pending users.", "error");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id, name) => {
    setActionLoading((p) => ({ ...p, [id]: "approve" }));
    try {
      await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(`${name} has been approved.`, "success");
      fetchUsers();
    } catch {
      showToast("Approval failed. Try again.", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: null }));
    }
  };

  const rejectUser = async (id, name) => {
    setActionLoading((p) => ({ ...p, [id]: "reject" }));
    try {
      await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(`${name} has been rejected.`, "error");
      fetchUsers();
    } catch {
      showToast("Rejection failed. Try again.", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: null }));
    }
  };

  const createTeacher = async (e) => {
    e.preventDefault();
    setTeacherLoading(true);
    try {
      await fetch("http://localhost:5000/api/admin/create-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      showToast(`Teacher "${form.name}" created successfully.`, "success");
      setForm({ name: "", email: "", password: "" });
    } catch {
      showToast("Failed to create teacher. Try again.", "error");
    } finally {
      setTeacherLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = {
    student: { color: "#63b3ed", bg: "rgba(56,128,255,0.1)",  border: "rgba(56,128,255,0.2)" },
    teacher: { color: "#63ebe2", bg: "rgba(99,235,210,0.1)",  border: "rgba(99,235,210,0.2)" },
    admin:   { color: "#f6ad55", bg: "rgba(246,173,85,0.1)",  border: "rgba(246,173,85,0.2)" },
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ap-root { min-height:100vh; background:#05060f; font-family:'Sora',sans-serif; color:#f0f4ff; position:relative; overflow-x:hidden; }
        .ap-root::before { content:''; position:fixed; inset:0; pointer-events:none; background-image:linear-gradient(rgba(99,179,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.03) 1px,transparent 1px); background-size:48px 48px; mask-image:radial-gradient(ellipse 100% 80% at 50% 0%,black 40%,transparent 100%); }
        .orb { position:fixed; border-radius:50%; filter:blur(100px); pointer-events:none; animation:pulse 10s ease-in-out infinite; }
        .orb-1 { width:500px; height:500px; background:radial-gradient(circle,rgba(246,173,85,0.08) 0%,transparent 70%); top:-150px; right:-150px; }
        .orb-2 { width:350px; height:350px; background:radial-gradient(circle,rgba(56,128,255,0.07) 0%,transparent 70%); bottom:-100px; left:-100px; animation-delay:4s; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.08);} }

        .ap-nav { position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:0 32px; height:64px; background:rgba(5,6,15,0.85); border-bottom:1px solid rgba(255,255,255,0.06); backdrop-filter:blur(20px); }
        .ap-nav-left { display:flex; align-items:center; gap:12px; }
        .ap-logo-icon { width:32px; height:32px; background:linear-gradient(135deg,#f6ad55,#ed8936); border-radius:8px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(246,173,85,0.3); }
        .ap-logo-text { font-family:'Space Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(240,244,255,0.5); }
        .ap-logo-text span { color:#f6ad55; }
        .ap-nav-right { display:flex; align-items:center; gap:12px; }
        .ap-admin-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:100px; font-size:11px; font-weight:700; font-family:'Space Mono',monospace; letter-spacing:0.08em; text-transform:uppercase; background:rgba(246,173,85,0.1); border:1px solid rgba(246,173,85,0.2); color:#f6ad55; }
        .ap-badge-dot { width:6px; height:6px; border-radius:50%; background:#f6ad55; animation:blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0.2;} }
        .ap-logout-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:rgba(240,244,255,0.4); font-family:'Sora',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; transition:all 0.2s; }
        .ap-logout-btn:hover { border-color:rgba(252,129,129,0.3); color:#fc8181; background:rgba(252,129,129,0.05); }

        .ap-toast { position:fixed; bottom:28px; right:28px; z-index:100; display:flex; align-items:center; gap:10px; padding:13px 18px; border-radius:12px; font-size:13px; font-weight:500; backdrop-filter:blur(20px); max-width:320px; animation:toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both; box-shadow:0 8px 32px rgba(0,0,0,0.4); }
        .ap-toast.success { background:rgba(99,235,210,0.1); border:1px solid rgba(99,235,210,0.25); color:#63ebe2; }
        .ap-toast.error   { background:rgba(252,129,129,0.1); border:1px solid rgba(252,129,129,0.25); color:#fc8181; }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px) scale(0.96);}to{opacity:1;transform:translateY(0) scale(1);} }

        .ap-main { max-width:1100px; margin:0 auto; padding:40px 24px 60px; }
        .ap-page-header { margin-bottom:32px; animation:fadeUp 0.5s ease both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
        .ap-breadcrumb { font-family:'Space Mono',monospace; font-size:10px; color:rgba(240,244,255,0.2); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
        .ap-page-title { font-size:26px; font-weight:700; letter-spacing:-0.02em; color:#f0f4ff; margin-bottom:5px; }
        .ap-page-title span { background:linear-gradient(135deg,#f6ad55,#ed8936); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .ap-page-sub { font-size:13.5px; color:rgba(240,244,255,0.3); }

        .ap-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:32px; animation:fadeUp 0.5s 0.1s ease both; }
        .ap-stat-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:18px 20px; display:flex; align-items:center; gap:14px; }
        .ap-stat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
        .ap-stat-value { font-size:22px; font-weight:700; letter-spacing:-0.03em; color:#f0f4ff; line-height:1; margin-bottom:3px; }
        .ap-stat-label { font-size:11.5px; color:rgba(240,244,255,0.35); }

        .ap-tabs { display:flex; gap:4px; margin-bottom:28px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:4px; width:fit-content; animation:fadeUp 0.5s 0.15s ease both; }
        .ap-tab { display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:9px; border:1px solid transparent; font-family:'Sora',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; color:rgba(240,244,255,0.4); background:transparent; }
        .ap-tab.active { background:rgba(246,173,85,0.12); color:#f6ad55; border-color:rgba(246,173,85,0.2); }
        .ap-tab:not(.active):hover { color:rgba(240,244,255,0.7); background:rgba(255,255,255,0.04); }
        .ap-tab-count { font-family:'Space Mono',monospace; font-size:10px; font-weight:700; background:rgba(246,173,85,0.15); color:#f6ad55; padding:1px 7px; border-radius:100px; }
        .ap-tab:not(.active) .ap-tab-count { background:rgba(255,255,255,0.06); color:rgba(240,244,255,0.3); }

        .ap-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; flex-wrap:wrap; animation:fadeUp 0.5s 0.2s ease both; }
        .ap-section-label { font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(240,244,255,0.2); }
        .ap-count-pill { background:rgba(246,173,85,0.12); border:1px solid rgba(246,173,85,0.2); color:#f6ad55; border-radius:100px; padding:2px 8px; font-size:10px; font-weight:700; }
        .ap-search-wrap { position:relative; }
        .ap-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:rgba(240,244,255,0.25); pointer-events:none; display:flex; }
        .ap-search { padding:9px 14px 9px 36px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; color:#f0f4ff; font-family:'Sora',sans-serif; font-size:13px; outline:none; transition:all 0.2s; width:220px; }
        .ap-search::placeholder { color:rgba(240,244,255,0.2); }
        .ap-search:focus { border-color:rgba(246,173,85,0.35); background:rgba(246,173,85,0.04); box-shadow:0 0 0 3px rgba(246,173,85,0.06); }
        .ap-refresh-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; color:rgba(240,244,255,0.4); font-family:'Sora',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; transition:all 0.2s; }
        .ap-refresh-btn:hover { border-color:rgba(246,173,85,0.3); color:#f6ad55; background:rgba(246,173,85,0.05); }

        .ap-table-wrap { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:16px; overflow:hidden; animation:fadeUp 0.5s 0.25s ease both; }
        .ap-table { width:100%; border-collapse:collapse; }
        .ap-thead { background:rgba(255,255,255,0.03); }
        .ap-th { padding:13px 20px; text-align:left; font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(240,244,255,0.25); border-bottom:1px solid rgba(255,255,255,0.05); }
        .ap-tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.18s; animation:fadeUp 0.4s ease both; }
        .ap-tr:last-child { border-bottom:none; }
        .ap-tr:hover { background:rgba(255,255,255,0.02); }
        .ap-td { padding:14px 20px; vertical-align:middle; }
        .ap-user-cell { display:flex; align-items:center; gap:12px; }
        .ap-user-avatar { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
        .ap-user-name { font-size:13.5px; font-weight:600; color:rgba(240,244,255,0.85); margin-bottom:2px; }
        .ap-user-email { font-size:11.5px; color:rgba(240,244,255,0.3); font-family:'Space Mono',monospace; }
        .ap-role-badge { display:inline-flex; align-items:center; padding:4px 10px; border-radius:100px; font-size:10.5px; font-weight:600; font-family:'Space Mono',monospace; letter-spacing:0.06em; text-transform:capitalize; }
        .ap-status-pending { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-size:10.5px; font-weight:600; font-family:'Space Mono',monospace; letter-spacing:0.06em; text-transform:uppercase; background:rgba(246,173,85,0.1); border:1px solid rgba(246,173,85,0.2); color:#f6ad55; }
        .ap-status-dot { width:5px; height:5px; border-radius:50%; background:#f6ad55; animation:blink 1.5s ease-in-out infinite; }
        .ap-actions { display:flex; align-items:center; gap:8px; }
        .ap-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; font-family:'Sora',sans-serif; font-size:12px; font-weight:600; cursor:pointer; border:1px solid; transition:all 0.2s; white-space:nowrap; }
        .ap-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .ap-btn-approve { background:rgba(99,235,210,0.08); border-color:rgba(99,235,210,0.2); color:#63ebe2; }
        .ap-btn-approve:hover:not(:disabled) { background:rgba(99,235,210,0.15); border-color:rgba(99,235,210,0.4); transform:translateY(-1px); box-shadow:0 4px 12px rgba(99,235,210,0.15); }
        .ap-btn-reject { background:rgba(252,129,129,0.08); border-color:rgba(252,129,129,0.2); color:#fc8181; }
        .ap-btn-reject:hover:not(:disabled) { background:rgba(252,129,129,0.15); border-color:rgba(252,129,129,0.4); transform:translateY(-1px); box-shadow:0 4px 12px rgba(252,129,129,0.15); }
        .btn-spinner { width:12px; height:12px; border:2px solid rgba(255,255,255,0.2); border-top-color:currentColor; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg);} }
        .ap-empty { padding:60px 20px; display:flex; flex-direction:column; align-items:center; gap:14px; color:rgba(240,244,255,0.25); }
        .ap-empty-icon { width:48px; height:48px; border-radius:14px; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; font-size:22px; }
        .ap-empty-title { font-size:14px; font-weight:600; color:rgba(240,244,255,0.4); }
        .ap-empty-sub { font-size:12.5px; text-align:center; line-height:1.5; }
        .ap-loading-row td { padding:48px 20px; text-align:center; }
        .ap-loading-inner { display:flex; flex-direction:column; align-items:center; gap:12px; }
        .ap-loading-spinner { width:28px; height:28px; border:3px solid rgba(246,173,85,0.15); border-top-color:#f6ad55; border-radius:50%; animation:spin 0.8s linear infinite; }
        .ap-loading-text { font-size:12.5px; color:rgba(240,244,255,0.25); font-family:'Space Mono',monospace; letter-spacing:0.04em; }

        .ct-wrap { animation:fadeUp 0.5s 0.2s ease both; }
        .ct-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        @media (max-width:720px) { .ct-grid { grid-template-columns:1fr; } }
        .ct-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:32px; }
        .ct-card-title { font-size:15px; font-weight:600; color:rgba(240,244,255,0.75); margin-bottom:6px; display:flex; align-items:center; gap:8px; }
        .ct-card-title-dot { width:7px; height:7px; border-radius:50%; background:#63ebe2; box-shadow:0 0 8px #63ebe2; }
        .ct-card-sub { font-size:12.5px; color:rgba(240,244,255,0.25); margin-bottom:28px; line-height:1.6; }
        .ct-field-group { display:flex; flex-direction:column; gap:18px; margin-bottom:24px; }
        .ct-field-label { font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(240,244,255,0.3); margin-bottom:6px; }
        .ct-field-wrap { position:relative; }
        .ct-field-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(240,244,255,0.22); pointer-events:none; display:flex; transition:color 0.2s; }
        .ct-field-wrap:focus-within .ct-field-icon { color:#63ebe2; }
        .ct-input { width:100%; padding:13px 14px 13px 42px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; color:#f0f4ff; font-family:'Sora',sans-serif; font-size:14px; outline:none; transition:all 0.2s; }
        .ct-input::placeholder { color:rgba(240,244,255,0.2); }
        .ct-input:focus { border-color:rgba(99,235,210,0.4); background:rgba(99,235,210,0.04); box-shadow:0 0 0 3px rgba(99,235,210,0.07); }
        .ct-pw-toggle { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(240,244,255,0.3); cursor:pointer; padding:4px; display:flex; transition:color 0.2s; }
        .ct-pw-toggle:hover { color:rgba(240,244,255,0.7); }
        .ct-submit { width:100%; padding:14px; background:linear-gradient(135deg,#2cb5a0,#1a9080); border:none; border-radius:12px; color:#fff; font-family:'Sora',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.25s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 20px rgba(99,235,210,0.2); }
        .ct-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(99,235,210,0.3); }
        .ct-submit:disabled { opacity:0.6; cursor:not-allowed; }
        .ct-info-panel { display:flex; flex-direction:column; gap:14px; }
        .ct-info-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:18px 20px; display:flex; gap:14px; align-items:flex-start; }
        .ct-info-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:16px; }
        .ct-info-title { font-size:12.5px; font-weight:600; color:rgba(240,244,255,0.6); margin-bottom:4px; }
        .ct-info-text { font-size:11.5px; color:rgba(240,244,255,0.3); line-height:1.5; }

        .ap-secure { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:40px; font-size:11px; font-family:'Space Mono',monospace; color:rgba(240,244,255,0.1); letter-spacing:0.04em; }

        @media (max-width:700px) {
          .ap-stats { grid-template-columns:1fr; }
          .ap-th:nth-child(3),.ap-td:nth-child(3),.ap-th:nth-child(4),.ap-td:nth-child(4) { display:none; }
          .ap-search { width:160px; }
          .ap-nav { padding:0 16px; }
          .ap-main { padding:28px 16px 50px; }
        }
      `}</style>

      <div className="ap-root">
        <div className="orb orb-1" /><div className="orb orb-2" />

        {toast && (
          <div className={`ap-toast ${toast.type}`}>
            {toast.type === "success"
              ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
            {toast.message}
          </div>
        )}

        <nav className="ap-nav">
          <div className="ap-nav-left">
            <div className="ap-logo-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="ap-logo-text"><span>CMS</span> · Admin</span>
          </div>
          <div className="ap-nav-right">
            <div className="ap-admin-badge"><div className="ap-badge-dot" />{adminUser?.name || "Admin"}</div>
            <button className="ap-logout-btn" onClick={handleLogout}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </nav>

        <main className="ap-main">
          <div className="ap-page-header">
            <div className="ap-breadcrumb">
              <span>CMS</span>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span style={{ color:"#f6ad55" }}>Admin Panel</span>
            </div>
            <h1 className="ap-page-title">Admin <span>Panel</span></h1>
            <p className="ap-page-sub">Manage user approvals and faculty accounts</p>
          </div>

          <div className="ap-stats">
            {[
              { icon:"⏳", bg:"rgba(246,173,85,0.1)",  label:"Pending Approvals", value: users.length },
              { icon:"🎓", bg:"rgba(56,128,255,0.1)",  label:"Students Pending",  value: users.filter(u=>u.role==="student").length },
              { icon:"📋", bg:"rgba(99,235,210,0.1)",  label:"Teachers Pending",  value: users.filter(u=>u.role==="teacher").length },
            ].map((s,i) => (
              <div className="ap-stat-card" key={i}>
                <div className="ap-stat-icon" style={{ background:s.bg }}>{s.icon}</div>
                <div><div className="ap-stat-value">{loading?"—":s.value}</div><div className="ap-stat-label">{s.label}</div></div>
              </div>
            ))}
          </div>

          <div className="ap-tabs">
            <button className={`ap-tab ${activeTab==="approvals"?"active":""}`} onClick={()=>setActiveTab("approvals")}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Pending Approvals
              <span className="ap-tab-count">{users.length}</span>
            </button>
            <button className={`ap-tab ${activeTab==="teacher"?"active":""}`} onClick={()=>setActiveTab("teacher")}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create Teacher
            </button>
          </div>

          {activeTab === "approvals" && (
            <>
              <div className="ap-toolbar">
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <span className="ap-section-label">Pending Requests</span>
                  {!loading && <span className="ap-count-pill">{filtered.length}</span>}
                </div>
                <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                  <div className="ap-search-wrap">
                    <span className="ap-search-icon"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg></span>
                    <input className="ap-search" placeholder="Search by name or email…" value={search} onChange={(e)=>setSearch(e.target.value)} />
                  </div>
                  <button className="ap-refresh-btn" onClick={fetchUsers}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                  </button>
                </div>
              </div>
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead className="ap-thead">
                    <tr><th className="ap-th">User</th><th className="ap-th">Role</th><th className="ap-th">Status</th><th className="ap-th">Registered</th><th className="ap-th">Actions</th></tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="ap-loading-row"><td colSpan={5}><div className="ap-loading-inner"><div className="ap-loading-spinner" /><span className="ap-loading-text">Fetching pending users…</span></div></td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={5}><div className="ap-empty"><div className="ap-empty-icon">🎉</div><div className="ap-empty-title">{search?"No results found":"No pending approvals"}</div><div className="ap-empty-sub">{search?`No users match "${search}"`:"All registration requests have been reviewed"}</div></div></td></tr>
                    ) : filtered.map((u,idx) => {
                      const rc = roleColor[u.role] || roleColor.student;
                      const isActing = actionLoading[u._id];
                      return (
                        <tr className="ap-tr" key={u._id} style={{animationDelay:`${idx*0.05}s`}}>
                          <td className="ap-td"><div className="ap-user-cell"><div className="ap-user-avatar" style={{background:rc.bg,color:rc.color,border:`1px solid ${rc.border}`}}>{getInitials(u.name)}</div><div><div className="ap-user-name">{u.name}</div><div className="ap-user-email">{u.email}</div></div></div></td>
                          <td className="ap-td"><span className="ap-role-badge" style={{background:rc.bg,border:`1px solid ${rc.border}`,color:rc.color}}>{u.role||"student"}</span></td>
                          <td className="ap-td"><span className="ap-status-pending"><span className="ap-status-dot" />Pending</span></td>
                          <td className="ap-td" style={{color:"rgba(240,244,255,0.3)",fontSize:"12px",fontFamily:"'Space Mono',monospace"}}>{u.createdAt?new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"}</td>
                          <td className="ap-td"><div className="ap-actions">
                            <button className="ap-btn ap-btn-approve" onClick={()=>approveUser(u._id,u.name)} disabled={!!isActing}>{isActing==="approve"?<span className="btn-spinner"/>:<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}Approve</button>
                            <button className="ap-btn ap-btn-reject" onClick={()=>rejectUser(u._id,u.name)} disabled={!!isActing}>{isActing==="reject"?<span className="btn-spinner"/>:<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>}Reject</button>
                          </div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "teacher" && (
            <div className="ct-wrap">
              <div className="ct-grid">
                <div className="ct-card">
                  <div className="ct-card-title"><div className="ct-card-title-dot" />Create Faculty Account</div>
                  <p className="ct-card-sub">Add a new teacher to the campus portal. They can log in immediately after creation.</p>
                  <form onSubmit={createTeacher}>
                    <div className="ct-field-group">
                      <div><div className="ct-field-label">Full Name</div><div className="ct-field-wrap"><input className="ct-input" placeholder="e.g. Dr. Priya Sharma" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required /><span className="ct-field-icon"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></span></div></div>
                      <div><div className="ct-field-label">College Email</div><div className="ct-field-wrap"><input className="ct-input" type="email" placeholder="teacher@college.edu" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required /><span className="ct-field-icon"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></span></div></div>
                      <div><div className="ct-field-label">Temporary Password</div><div className="ct-field-wrap"><input className="ct-input" type={showPassword?"text":"password"} placeholder="Set a secure password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required /><span className="ct-field-icon"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span><button type="button" className="ct-pw-toggle" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>:<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>}</button></div></div>
                    </div>
                    <button type="submit" className="ct-submit" disabled={teacherLoading}>{teacherLoading?<><span className="btn-spinner"/>Creating Account…</>:<><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>Create Teacher Account</>}</button>
                  </form>
                </div>
                <div className="ct-info-panel">
                  {[
                    { icon:"🔐", bg:"rgba(99,235,210,0.1)",  title:"Admin-only action",    text:"Only admins can create teacher accounts directly. Teachers bypass the approval queue." },
                    { icon:"⚡", bg:"rgba(56,128,255,0.1)",  title:"Immediate access",      text:"The teacher can log in right after creation using the credentials you set here." },
                    { icon:"🔑", bg:"rgba(246,173,85,0.1)",  title:"Set a strong password", text:"Share credentials securely. Advise the teacher to change their password on first login." },
                    { icon:"🎓", bg:"rgba(167,139,250,0.1)", title:"Role auto-assigned",     text:"Accounts created here are automatically assigned the 'teacher' role in the system." },
                  ].map((info,i) => (
                    <div className="ct-info-card" key={i}><div className="ct-info-icon" style={{background:info.bg}}>{info.icon}</div><div><div className="ct-info-title">{info.title}</div><div className="ct-info-text">{info.text}</div></div></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="ap-secure">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Secured · College Portal · {new Date().getFullYear()}
          </div>
        </main>
      </div>
    </>
  );
}