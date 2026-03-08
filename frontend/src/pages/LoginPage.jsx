import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const T = {
  bg: "#f8f9fc",
  surface: "#ffffff",
  border: "rgba(0,0,0,0.08)",
  borderFocus: "rgba(67,97,238,0.4)",
  accent: "#4361ee",
  accentEnd: "#3451d1",
  teal: "#059669",
  red: "#e11d48",
  text: "#0f1117",
  muted: "#6b7280",
  dim: "#9ca3af",
  inputBg: "#f8f9fc",
};

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get("role") || "student";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [focused, setFocused] = useState("");

  const valid = form.email.includes("@") && form.password.length >= 4;

  const handleLogin = () => {
    setLoading(true);
    setErr("");
    setTimeout(() => {
      if (role === "student" && form.email === "student@neuro.edu" && form.password === "1234") {
        navigate("/student-dashboard"); return;
      }
      if (role === "admin" && form.email === "admin@neuro.edu" && form.password === "admin123") {
        navigate("/admin-dashboard"); return;
      }
      if (role === "recruiter" && form.email === "recruiter@neuro.edu" && form.password === "rec123") {
        navigate("/recruiter-dashboard"); return;
      }
      setErr("Invalid credentials");
      setLoading(false);
    }, 800);
  };

  const roleColors = {
    admin:     { bg: "#eef1fd", color: "#4361ee", dot: "#4361ee" },
    recruiter: { bg: "#ecfdf5", color: "#059669", dot: "#059669" },
    student:   { bg: "#fffbeb", color: "#d97706", dot: "#d97706" },
  };
  const rc = roleColors[role] || roleColors.student;

  return (
    <div style={styles.root}>
      {/* Subtle background blobs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.grid} />

      <div style={{ width: "100%", maxWidth: 420, zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 16,
            background: rc.bg,
            border: `1px solid ${rc.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
            margin: "0 auto 14px",
            boxShadow: `0 4px 16px ${rc.color}18`,
          }}>⚡</div>

          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: T.text,
            letterSpacing: "-0.5px",
          }}>
            NeuroAssess
          </div>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            background: rc.bg,
            border: `1px solid ${rc.color}28`,
            borderRadius: 100,
            padding: "4px 12px",
          }}>
            <div style={{
              width: 6, height: 6,
              borderRadius: "50%",
              background: rc.dot,
            }} />
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: rc.color,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}>
              {role} Portal
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={styles.card}>

          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: T.text,
            letterSpacing: "-0.5px",
            marginBottom: 6,
          }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 28 }}>
            Sign in to your {role} account to continue
          </p>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder={
                role === "admin" ? "admin@neuro.edu"
                : role === "recruiter" ? "recruiter@neuro.edu"
                : "student@neuro.edu"
              }
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              style={{
                ...styles.input,
                borderColor: focused === "email" ? T.borderFocus : T.border,
                boxShadow: focused === "email" ? `0 0 0 3px rgba(67,97,238,0.1)` : "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ ...styles.label, marginBottom: 0 }}>Password</label>
              <span style={{ fontSize: 12, color: T.accent, cursor: "pointer" }}>Forgot password?</span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              style={{
                ...styles.input,
                borderColor: focused === "password" ? T.borderFocus : T.border,
                boxShadow: focused === "password" ? `0 0 0 3px rgba(67,97,238,0.1)` : "none",
              }}
            />
          </div>

          {/* Error */}
          {err && (
            <div style={{
              fontSize: 13,
              color: T.red,
              marginBottom: 16,
              padding: "10px 14px",
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span>⚠️</span> {err}
            </div>
          )}

          {/* Login Button */}
          <button
            style={{
              ...styles.btn,
              opacity: (!valid || loading) ? 0.45 : 1,
              cursor: (!valid || loading) ? "not-allowed" : "pointer",
            }}
            disabled={!valid || loading}
            onClick={handleLogin}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={styles.spinner} /> Signing in...
              </span>
            ) : "Sign In →"}
          </button>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, margin: "22px 0 18px",
          }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 11, color: T.dim, fontWeight: 500 }}>DEMO ACCOUNTS</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          {/* Demo credentials */}
          <div style={{
            background: "#f8f9fc",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 10,
            padding: "12px 14px",
          }}>
            {[
              { r: "Student",   e: "student@neuro.edu",   p: "1234",     color: "#d97706", bg: "#fffbeb" },
              { r: "Admin",     e: "admin@neuro.edu",     p: "admin123", color: "#4361ee", bg: "#eef1fd" },
              { r: "Recruiter", e: "recruiter@neuro.edu", p: "rec123",   color: "#059669", bg: "#ecfdf5" },
            ].map((d) => (
              <div key={d.r} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 0",
                borderBottom: d.r !== "Recruiter" ? "1px solid rgba(0,0,0,0.05)" : "none",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: d.color,
                  background: d.bg, borderRadius: 6,
                  padding: "2px 7px", minWidth: 60, textAlign: "center",
                }}>
                  {d.r}
                </span>
                <span style={{ fontSize: 11, color: T.muted, fontFamily: "monospace", flex: 1 }}>
                  {d.e}
                </span>
                <span style={{
                  fontSize: 11, fontFamily: "monospace",
                  color: T.dim, background: "#fff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderRadius: 5, padding: "1px 7px",
                }}>
                  {d.p}
                </span>
              </div>
            ))}
          </div>

          {/* Back */}
          <p
            style={{
              marginTop: 20,
              fontSize: 13,
              textAlign: "center",
              cursor: "pointer",
              color: T.muted,
              transition: "color 0.2s",
            }}
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </p>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: T.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
    color: T.text,
  },
  orb1: {
    position: "fixed",
    top: "0%",
    left: "5%",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(67,97,238,0.07) 0%, transparent 70%)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    bottom: "5%",
    right: "5%",
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(114,9,183,0.05) 0%, transparent 70%)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(67,97,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(67,97,238,0.04) 1px, transparent 1px)",
    backgroundSize: "52px 52px",
    pointerEvents: "none",
  },
  card: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: T.muted,
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${T.border}`,
    background: T.inputBg,
    color: T.text,
    outline: "none",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "13px",
    borderRadius: 10,
    border: "none",
    background: `linear-gradient(135deg, ${T.accent}, ${T.accentEnd})`,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 14px rgba(67,97,238,0.35)",
    transition: "opacity 0.2s, box-shadow 0.2s",
  },
  spinner: {
    display: "inline-block",
    width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};