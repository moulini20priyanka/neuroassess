import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Design Tokens ─────────────────────────────────────── */
const T = {
  bg:       "#f4f6fb",
  sidebar:  "#ffffff",
  card:     "#ffffff",
  border:   "rgba(0,0,0,0.07)",
  text:     "#0d1117",
  muted:    "#6b7280",
  dim:      "#9ca3af",
  accent:   "#4361ee",
  accentSoft:"#eef1fd",
  green:    "#059669",
  greenSoft:"#ecfdf5",
  amber:    "#d97706",
  amberSoft:"#fffbeb",
  red:      "#e11d48",
  redSoft:  "#fff1f2",
  live:     "#16a34a",
  liveSoft: "#dcfce7",
};

/* ─── Data ───────────────────────────────────────────────── */
const EXAMS = [
  {
    id: 1,
    exam: "Data Structures Assessment",
    company: "Amazon",
    companyColor: "#f97316",
    companyBg: "#fff7ed",
    logo: "A",
    duration: "90 min",
    questions: 45,
    date: "Today 2:00 PM",
    status: "live",
    difficulty: "Hard",
    diffColor: "#e11d48",
    diffBg: "#fff1f2",
    tags: ["DSA", "Algorithms"],
  },
  {
    id: 2,
    exam: "Backend Developer Test",
    company: "Google",
    companyColor: "#4361ee",
    companyBg: "#eef1fd",
    logo: "G",
    duration: "60 min",
    questions: 30,
    date: "Tomorrow 10:00 AM",
    status: "assigned",
    difficulty: "Medium",
    diffColor: "#d97706",
    diffBg: "#fffbeb",
    tags: ["Node.js", "SQL"],
  },
  {
    id: 3,
    exam: "System Design Round",
    company: "Microsoft",
    companyColor: "#059669",
    companyBg: "#ecfdf5",
    logo: "M",
    duration: "75 min",
    questions: 20,
    date: "Mar 10",
    status: "upcoming",
    difficulty: "Hard",
    diffColor: "#e11d48",
    diffBg: "#fff1f2",
    tags: ["Architecture", "Scalability"],
  },

];

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard",  active: true  },
  { icon: "📊", label: "Results",    active: false },
];

/* ─── Status config ──────────────────────────────────────── */
const STATUS = {
  live:      { label: "LIVE",        color: T.live,   bg: T.liveSoft  },
  assigned:  { label: "ASSIGNED",    color: T.accent, bg: T.accentSoft},
  upcoming:  { label: "YET TO START",color: T.amber,  bg: T.amberSoft },
  completed: { label: "COMPLETED",   color: T.muted,  bg: "#f3f4f6"   },
};

/* ─── Animated counter ───────────────────────────────────── */
function useCounter(target, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const dur = 1200;
      const frame = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(t);
  }, [target]);
  return val;
}

/* ─── Live timer ─────────────────────────────────────────── */
function LiveTimer() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setS(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      color: T.live,
      background: T.liveSoft,
      border: `1px solid ${T.live}30`,
      borderRadius: 6,
      padding: "2px 8px",
      letterSpacing: "1px",
    }}>
      {mm}:{ss}
    </span>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [filter, setFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
 

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);


  const filtered = filter === "all"
    ? EXAMS
    : EXAMS.filter(e => e.status === filter);

  const startExam = (exam) => navigate("/exam-verify", { state: { exam } });

  const fade = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.5s ease ${delay}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes live-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
        @keyframes shimmer     { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes gradient-x  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes score-fill  { from{width:0} to{width:var(--w)} }
        @keyframes orb-float   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12px,-10px)} }
        @keyframes card-in     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes badge-ping  {
          0%  { transform:scale(1);   opacity:1; }
          75% { transform:scale(2.2); opacity:0; }
          100%{ transform:scale(2.2); opacity:0; }
        }

        .na-sidebar-item {
          display:flex; align-items:center; gap:12px;
          padding:11px 16px; border-radius:12px;
          cursor:pointer; font-size:14px; font-weight:500;
          font-family:'DM Sans',sans-serif;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          color: ${T.muted};
          user-select:none;
        }
        .na-sidebar-item:hover  { background:${T.accentSoft}; color:${T.accent}; transform:translateX(3px); }
        .na-sidebar-item.active { background:${T.accentSoft}; color:${T.accent}; font-weight:600; }

        .na-filter-btn {
          padding: 7px 16px; border-radius:100px; border:none;
          font-size:12px; font-weight:600; cursor:pointer;
          font-family:'DM Sans',sans-serif; letter-spacing:0.3px;
          transition: all 0.2s;
        }
        .na-filter-btn.on  { background:${T.accent}; color:#fff; box-shadow:0 4px 12px rgba(67,97,238,0.3); }
        .na-filter-btn.off { background:#fff; color:${T.muted}; border:1px solid ${T.border}; }
        .na-filter-btn.off:hover { border-color:${T.accent}; color:${T.accent}; }

        .na-exam-card {
          background:#fff;
          border:1px solid ${T.border};
          border-radius:18px;
          padding:24px;
          display:flex; flex-direction:column; gap:0;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s, border-color 0.2s;
          position:relative; overflow:hidden;
          cursor:default;
        }
        .na-exam-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(67,97,238,0.1);
          border-color: rgba(67,97,238,0.2);
        }
        .na-exam-card.live-card {
          border-color: rgba(22,163,74,0.25);
          box-shadow: 0 0 0 3px rgba(22,163,74,0.06);
        }
        .na-exam-card.live-card::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:3px;
          background: linear-gradient(90deg, ${T.live}, #4ade80, ${T.live});
          background-size:200% 100%;
          animation: shimmer 2.5s linear infinite;
        }

        .na-start-btn {
          width:100%; padding:12px; border:none; border-radius:11px;
          background: linear-gradient(135deg, #4361ee, #3451d1);
          color:#fff; font-weight:700; font-size:14px;
          font-family:'Syne',sans-serif; letter-spacing:-0.2px;
          cursor:pointer; margin-top:18px;
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(67,97,238,0.35);
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .na-start-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 24px rgba(67,97,238,0.45);
        }
        .na-start-btn:active { transform:scale(0.98); }

        .na-tag {
          display:inline-block; padding:3px 9px; border-radius:6px;
          font-size:11px; font-weight:600; letter-spacing:0.3px;
          background:${T.accentSoft}; color:${T.accent};
          font-family:'DM Sans',sans-serif;
        }

        .na-stat-card {
          background:#fff; border:1px solid ${T.border};
          border-radius:16px; padding:20px 22px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .na-stat-card:hover {
          transform:translateY(-3px);
          box-shadow:0 8px 24px rgba(0,0,0,0.07);
        }

        .na-score-bar-fill {
          height:100%; border-radius:100px;
          background:linear-gradient(90deg, #4361ee, #7209b7);
          animation: score-fill 1.2s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .na-live-dot {
          display:inline-block; width:8px; height:8px;
          border-radius:50%; background:${T.live}; position:relative;
        }
        .na-live-dot::after {
          content:''; position:absolute; inset:0;
          border-radius:50%; background:${T.live};
          animation: badge-ping 1.4s cubic-bezier(0,0,.2,1) infinite;
        }

        .na-brand-text {
          background: linear-gradient(270deg, #4361ee, #7209b7, #4361ee);
          background-size:400% 400%;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation: gradient-x 5s ease infinite;
        }

        .na-avatar {
          width:38px; height:38px; border-radius:12px;
          background: linear-gradient(135deg,${T.accentSoft},#eef1fd);
          border:1px solid rgba(67,97,238,0.18);
          display:flex; align-items:center; justify-content:center;
          font-size:16px; font-weight:700; color:${T.accent};
          font-family:'Syne',sans-serif;
        }
      `}</style>

      <div style={{
        display: "flex", minHeight: "100vh",
        background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text,
      }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 230, flexShrink: 0,
          background: T.sidebar,
          borderRight: `1px solid ${T.border}`,
          display: "flex", flexDirection: "column",
          padding: "28px 16px",
          ...fade(0),
        }}>
          {/* Logo */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "0 8px", marginBottom: 36,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: T.accentSoft,
              border: `1px solid rgba(67,97,238,0.2)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>⚡</div>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 17, fontWeight: 800,
              letterSpacing: "-0.5px",
            }}>
              <span className="na-brand-text">NeuroAssess</span>
            </span>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, color: T.dim,
              letterSpacing: "1.5px", padding: "0 8px", marginBottom: 8,
              fontFamily: "'JetBrains Mono', monospace",
            }}>NAVIGATION</div>

            {NAV_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`na-sidebar-item${activeNav === i ? " active" : ""}`}
                onClick={() => setActiveNav(i)}
                style={{
                  ...fade(i * 60),
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>

          {/* User profile at bottom */}
          <div style={{
            borderTop: `1px solid ${T.border}`,
            paddingTop: 16, display: "flex", alignItems: "center", gap: 10,
            ...fade(400),
          }}>
            <div className="na-avatar">S</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Alex Kumar</div>
              <div style={{ fontSize: 11, color: T.dim }}>Student</div>
            </div>
            <div style={{
              marginLeft: "auto", cursor: "pointer",
              fontSize: 16, color: T.dim,
            }}>⋯</div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>

          {/* Top bar */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", marginBottom: 36,
            ...fade(100),
          }}>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: T.dim,
                letterSpacing: "1.5px", textTransform: "uppercase",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 6,
              }}>
                Good morning 👋
              </div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28, fontWeight: 800,
                letterSpacing: "-1px", color: T.text,
                lineHeight: 1.1,
              }}>
                Your Dashboard
              </h1>
            </div>

            {/* Notification + search area */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                background: "#fff", border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "9px 14px",
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, color: T.dim,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                🔍 <span>Search exams...</span>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#fff", border: `1px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", position: "relative",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                🔔
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  width: 8, height: 8, borderRadius: "50%",
                  background: T.red, border: "2px solid #fff",
                }} />
              </div>
            </div>
          </div>

        
          {/* ── FILTER BAR ── */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 20,
            ...fade(300),
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {["all", "live", "assigned", "upcoming", "completed"].map((f) => (
                <button
                  key={f}
                  className={`na-filter-btn ${filter === f ? "on" : "off"}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All Exams" : STATUS[f]?.label || f}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: T.dim }}>
              Showing <strong style={{ color: T.text }}>{filtered.length}</strong> exam{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* ── EXAM CARDS GRID ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 18,
          }}>
            {filtered.map((exam, idx) => {
              const st = STATUS[exam.status];
              const isLive = exam.status === "live";
              const isDone = exam.status === "completed";

              return (
                <div
                  key={exam.id}
                  className={`na-exam-card${isLive ? " live-card" : ""}`}
                  style={{
                    opacity: mounted ? 1 : 0,
                    animation: mounted ? `card-in 0.5s cubic-bezier(0.22,1,0.36,1) ${100 + idx * 80}ms both` : "none",
                  }}
                  onMouseEnter={() => setHoveredCard(exam.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card top */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    {/* Company logo */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 13,
                      background: exam.companyBg,
                      border: `1px solid ${exam.companyColor}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800, fontSize: 18,
                      color: exam.companyColor,
                      flexShrink: 0,
                    }}>
                      {exam.logo}
                    </div>

                    {/* Status badge */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: st.bg,
                      border: `1px solid ${st.color}30`,
                      borderRadius: 100, padding: "5px 11px",
                    }}>
                      {isLive && <div className="na-live-dot" style={{ width: 6, height: 6 }} />}
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: st.color,
                        letterSpacing: "1px", fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {st.label}
                      </span>
                    </div>
                  </div>

                  {/* Exam title */}
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 16, fontWeight: 700,
                    color: isDone ? T.muted : T.text,
                    letterSpacing: "-0.3px",
                    lineHeight: 1.3, marginBottom: 4,
                  }}>
                    {exam.exam}
                  </h3>

                  {/* Company name */}
                  <div style={{
                    fontSize: 13, color: exam.companyColor,
                    fontWeight: 600, marginBottom: 16,
                  }}>
                    🏢 {exam.company}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                    {exam.tags.map(tag => (
                      <span key={tag} className="na-tag">{tag}</span>
                    ))}
                    <span style={{
                      display: "inline-block", padding: "3px 9px", borderRadius: 6,
                      fontSize: 11, fontWeight: 600, letterSpacing: "0.3px",
                      background: exam.diffBg, color: exam.diffColor,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {exam.difficulty}
                    </span>
                  </div>

                  {/* Info row */}
                  <div style={{
                    display: "flex", gap: 16,
                    padding: "12px 0",
                    borderTop: `1px solid ${T.border}`,
                    borderBottom: `1px solid ${T.border}`,
                    marginBottom: 16,
                  }}>
                    {[
                      { icon: "⏱", val: exam.duration },
                      { icon: "📝", val: `${exam.questions} Qs` },
                      { icon: "📅", val: exam.date },
                    ].map((info, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: 15, marginBottom: 2 }}>{info.icon}</div>
                        <div style={{
                          fontSize: 11, color: T.muted, fontWeight: 600,
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.3px",
                        }}>
                          {info.val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live timer */}
                  {isLive && (
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: 4,
                    }}>
                      <span style={{ fontSize: 12, color: T.muted }}>Session running</span>
                      <LiveTimer />
                    </div>
                  )}

                  {/* Score bar for completed */}
                  {isDone && exam.score && (
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: T.muted }}>Your Score</span>
                        <span style={{
                          fontSize: 13, fontWeight: 700, color: T.accent,
                          fontFamily: "'Syne', sans-serif",
                        }}>
                          {exam.score}%
                        </span>
                      </div>
                      <div style={{
                        height: 6, background: T.accentSoft,
                        borderRadius: 100, overflow: "hidden",
                      }}>
                        <div
                          className="na-score-bar-fill"
                          style={{ "--w": `${exam.score}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA button */}
                  {isLive && (
                    <button
                      className="na-start-btn"
                      onClick={() => startExam(exam)}
                    >
                      <span style={{ animation: "live-pulse 1.5s infinite" }}>🔴</span>
                      Start Exam Now
                      <span style={{
                        transition: "transform 0.2s",
                        transform: hoveredCard === exam.id ? "translateX(4px)" : "translateX(0)",
                        display: "inline-block",
                      }}>→</span>
                    </button>
                  )}

                  {exam.status === "assigned" && (
                    <button
                      className="na-start-btn"
                      style={{
                        background: "linear-gradient(135deg, #059669, #047857)",
                        boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
                        marginTop: 18,
                      }}
                      onClick={() => startExam(exam)}
                    >
                      Join Exam →
                    </button>
                  )}

                  {isDone && (
                    <button
                      className="na-start-btn"
                      style={{
                        background: "linear-gradient(135deg, #6b7280, #4b5563)",
                        boxShadow: "0 4px 14px rgba(107,114,128,0.25)",
                        marginTop: 0,
                      }}
                    >
                      View Report →
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              ...fade(100),
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 8,
              }}>
                No exams found
              </div>
              <div style={{ fontSize: 14, color: T.dim }}>
                No exams match the selected filter.
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}