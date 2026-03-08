import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── Tokens ─── */
const T = {
  bg:         "#f4f6fb",
  surface:    "#ffffff",
  border:     "rgba(0,0,0,0.07)",
  accent:     "#4361ee",
  accentSoft: "#eef1fd",
  green:      "#059669",
  greenSoft:  "#ecfdf5",
  red:        "#e11d48",
  redSoft:    "#fff1f2",
  amber:      "#d97706",
  amberSoft:  "#fffbeb",
  text:       "#0d1117",
  muted:      "#6b7280",
  dim:        "#9ca3af",
};

/* ─── Mission rules — each has a micro-quiz to unlock the next ─── */
const MISSIONS = [
  {
    id: 1,
    icon: "🕐",
    color: "#4361ee",
    colorSoft: "#eef1fd",
    title: "Time is Your Currency",
    rule: "Once the exam starts, the timer runs non-stop. There are no pauses, no extensions, and no mercy for late submissions. Every second counts.",
    highlight: "The timer cannot be paused once started.",
    quiz: {
      q: "What happens if you run out of time?",
      options: ["Timer pauses and waits", "Exam auto-submits immediately", "You get 5 extra minutes", "Nothing — keep going"],
      answer: 1,
      explanation: "The exam auto-submits the moment time runs out — answered or not.",
    },
  },
  {
    id: 2,
    icon: "🔒",
    color: "#7c3aed",
    colorSoft: "#f5f3ff",
    title: "One Window. No Escape.",
    rule: "Your browser is now a secure vault. Switching tabs, opening new windows, or minimizing the exam will trigger an immediate violation flag. Three flags = automatic disqualification.",
    highlight: "Tab switch = violation flag. 3 flags = disqualified.",
    quiz: {
      q: "You accidentally press Alt+Tab. What happens?",
      options: ["Nothing, you're fine", "A violation flag is recorded", "Exam pauses automatically", "Browser closes"],
      answer: 1,
      explanation: "Each tab switch or window change records a violation flag instantly.",
    },
  },
  {
    id: 3,
    icon: "👁️",
    color: "#0891b2",
    colorSoft: "#ecfeff",
    title: "AI is Watching",
    rule: "Our AI proctor monitors your webcam in real-time throughout the exam. Face away for more than 5 seconds, cover your camera, or have another person in frame — and it gets flagged.",
    highlight: "Face the camera at all times. No exceptions.",
    quiz: {
      q: "You scratch your head and look down for 7 seconds. What does the AI do?",
      options: ["Nothing, it understands", "Flags it as suspicious activity", "Pauses the exam", "Sends you a warning sound"],
      answer: 1,
      explanation: "Any face-away event longer than 5 seconds is automatically flagged.",
    },
  },
  {
    id: 4,
    icon: "📵",
    color: "#d97706",
    colorSoft: "#fffbeb",
    title: "No Outside Help",
    rule: "Copy-paste is disabled. Your keyboard shortcuts are locked. No phone, no second screen, no notes, no asking a friend. This is a test of YOUR knowledge — not Google's.",
    highlight: "Ctrl+C, Ctrl+V, and all screen-capture shortcuts are blocked.",
    quiz: {
      q: "Which of these is allowed during the exam?",
      options: ["Google search on another device", "Quick notes on your phone", "Scratch paper for rough work", "Asking a friend quietly"],
      answer: 2,
      explanation: "Physical scratch paper is the only permitted aid. All digital shortcuts are blocked.",
    },
  },
  {
    id: 5,
    icon: "📤",
    color: "#059669",
    colorSoft: "#ecfdf5",
    title: "Submit Before You Leave",
    rule: "Always click Submit before closing. If you close the browser without submitting, your attempt is marked incomplete. An incomplete attempt counts as a used attempt and cannot be retaken.",
    highlight: "Always click Submit. Closing without submitting = incomplete.",
    quiz: {
      q: "Your internet cuts out and you close the browser. What's the outcome?",
      options: ["Exam auto-saves and waits", "Attempt marked incomplete", "You can restart fresh", "Admin is notified and resets it"],
      answer: 1,
      explanation: "Closing without submitting marks the attempt incomplete — it cannot be undone.",
    },
  },
];

/* ─── Particle burst on correct answer ─── */
function Burst({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((i) => {
        const angle = (i / 12) * 360;
        const dist  = 60 + Math.random() * 40;
        const size  = 4 + Math.random() * 5;
        const colors = ["#4361ee","#059669","#d97706","#e11d48","#7c3aed","#0891b2"];
        return (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: size, height: size,
            borderRadius: "50%",
            background: colors[i % colors.length],
            animation: `burst-${i} 0.6s ease-out forwards`,
            transform: "translate(-50%,-50%)",
          }} />
        );
      })}
      <style>{particles.map((i) => {
        const angle = (i / 12) * 360;
        const rad   = angle * Math.PI / 180;
        const dx    = Math.cos(rad) * (60 + i * 3);
        const dy    = Math.sin(rad) * (60 + i * 3);
        return `@keyframes burst-${i} { 0%{transform:translate(-50%,-50%) scale(1);opacity:1} 100%{transform:translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0);opacity:0} }`;
      }).join("")}</style>
    </div>
  );
}

/* ─── Progress bar ─── */
function ProgressBar({ total, current }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 99,
          background: i < current ? T.accent : i === current ? `linear-gradient(90deg, ${T.accent}, #a5b4fc)` : "#e5e7eb",
          transition: "background 0.4s ease",
          position: "relative", overflow: "hidden",
        }}>
          {i === current && (
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
              animation: "shimmer-bar 1.5s infinite",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Single Mission Slide ─── */
function MissionSlide({ mission, index, total, onComplete, isActive }) {
  const [phase,     setPhase]     = useState("reveal");   // reveal | quiz | correct | wrong
  const [selected,  setSelected]  = useState(null);
  const [burst,     setBurst]     = useState(false);
  const [wrongShake,setWrongShake]= useState(false);
  const [tries,     setTries]     = useState(0);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    if (isActive) {
      setMounted(false);
      const t = setTimeout(() => setMounted(true), 60);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  const handleAnswer = (idx) => {
    if (phase === "correct") return;
    setSelected(idx);
    if (idx === mission.quiz.answer) {
      setPhase("correct");
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    } else {
      setPhase("wrong");
      setWrongShake(true);
      setTries(t => t + 1);
      setTimeout(() => {
        setWrongShake(false);
        setPhase("quiz");
        setSelected(null);
      }, 900);
    }
  };

  const slideIn = {
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
  };

  return (
    <div style={{ ...slideIn }}>
      {/* Rule card */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
        marginBottom: 16,
        position: "relative",
      }}>
        {/* Colored top accent bar */}
        <div style={{
          height: 5,
          background: `linear-gradient(90deg, ${mission.color}, ${mission.color}88)`,
        }} />

        <div style={{ padding: "24px 26px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: mission.colorSoft,
              border: `1px solid ${mission.color}22`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
            }}>
              {mission.icon}
            </div>
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "2px",
                color: mission.color, marginBottom: 5,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                RULE {String(index + 1).padStart(2, "0")} OF {String(total).padStart(2, "0")}
              </div>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 19, fontWeight: 800,
                color: T.text, letterSpacing: "-0.5px",
                lineHeight: 1.15,
              }}>
                {mission.title}
              </h3>
            </div>
          </div>

          {/* Rule text */}
          <p style={{
            fontSize: 14, color: T.muted, lineHeight: 1.75,
            marginBottom: 16,
          }}>
            {mission.rule}
          </p>

          {/* Highlight pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: mission.colorSoft,
            border: `1px solid ${mission.color}25`,
            borderRadius: 12, padding: "10px 14px",
            marginBottom: 4,
          }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color: mission.color,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {mission.highlight}
            </span>
          </div>
        </div>
      </div>

      {/* Quiz card */}
      <div style={{
        background: T.surface,
        border: `1px solid ${phase === "correct" ? `${T.green}40` : T.border}`,
        borderRadius: 20,
        padding: "22px 24px",
        boxShadow: phase === "correct"
          ? `0 4px 24px rgba(5,150,105,0.1)`
          : "0 4px 32px rgba(0,0,0,0.05)",
        transition: "border-color 0.3s, box-shadow 0.3s",
        position: "relative",
        animation: wrongShake ? "shake 0.4s ease" : "none",
      }}>
        <Burst active={burst} />

        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
            fontFamily: "'JetBrains Mono', monospace",
            color: phase === "correct" ? T.green : T.accent,
            background: phase === "correct" ? T.greenSoft : T.accentSoft,
            border: `1px solid ${phase === "correct" ? T.green : T.accent}25`,
            borderRadius: 100, padding: "3px 10px",
          }}>
            {phase === "correct" ? "✓ CORRECT" : "QUICK CHECK"}
          </span>
          {tries > 0 && phase !== "correct" && (
            <span style={{
              fontSize: 10, color: T.red,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {tries} wrong attempt{tries > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <p style={{
          fontSize: 14, fontWeight: 600, color: T.text,
          marginBottom: 14, lineHeight: 1.5,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {mission.quiz.q}
        </p>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {mission.quiz.options.map((opt, i) => {
            const isCorrect = i === mission.quiz.answer;
            const isSelected = selected === i;

            let bgColor = "#f8f9fc";
            let borderColor = T.border;
            let textColor = T.text;
            let leftBar = "transparent";

            if (phase === "correct") {
              if (isCorrect) {
                bgColor = T.greenSoft;
                borderColor = `${T.green}40`;
                textColor = T.green;
                leftBar = T.green;
              } else {
                textColor = T.dim;
              }
            } else if (isSelected && phase === "wrong") {
              bgColor = T.redSoft;
              borderColor = `${T.red}40`;
              textColor = T.red;
              leftBar = T.red;
            }

            return (
              <button
                key={i}
                onClick={() => phase !== "correct" && handleAnswer(i)}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "11px 14px",
                  borderRadius: 11,
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  color: textColor,
                  fontSize: 13, fontWeight: 500,
                  cursor: phase === "correct" ? "default" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                  borderLeft: leftBar !== "transparent" ? `3px solid ${leftBar}` : `1px solid ${borderColor}`,
                }}
                onMouseEnter={e => {
                  if (phase !== "correct") {
                    e.currentTarget.style.background = mission.colorSoft;
                    e.currentTarget.style.borderColor = `${mission.color}35`;
                  }
                }}
                onMouseLeave={e => {
                  if (phase !== "correct") {
                    e.currentTarget.style.background = bgColor;
                    e.currentTarget.style.borderColor = borderColor;
                  }
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: phase === "correct" && isCorrect ? T.green
                             : isSelected && phase === "wrong" ? T.red
                             : "#e5e7eb",
                  color: (phase === "correct" && isCorrect) || (isSelected && phase === "wrong") ? "#fff" : T.muted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  transition: "all 0.2s",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {phase === "correct" && isCorrect ? "✓"
                   : isSelected && phase === "wrong" ? "✗"
                   : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation after correct */}
        {phase === "correct" && (
          <div style={{
            marginTop: 14,
            background: T.greenSoft,
            border: `1px solid ${T.green}25`,
            borderRadius: 10, padding: "10px 14px",
            animation: "fadeUp 0.4s ease",
          }}>
            <p style={{ fontSize: 12, color: T.green, lineHeight: 1.6, fontWeight: 500 }}>
              💡 {mission.quiz.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {phase === "correct" && (
          <button
            onClick={onComplete}
            style={{
              marginTop: 16, width: "100%", padding: "13px",
              borderRadius: 11, border: "none",
              background: `linear-gradient(135deg, ${mission.color}, ${mission.color}cc)`,
              color: "#fff", fontWeight: 700, fontSize: 14,
              fontFamily: "'Syne', sans-serif", cursor: "pointer",
              boxShadow: `0 4px 16px ${mission.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              animation: "fadeUp 0.35s ease",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${mission.color}45`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 16px ${mission.color}35`;
            }}
          >
            {index + 1 < total ? `Got it — Rule ${index + 2} →` : "Final Step — Take the Oath →"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Final Oath Screen ─── */
function OathScreen({ exam, onProceed }) {
  const [signed,   setSigned]   = useState(false);
  const [ripple,   setRipple]   = useState(false);
  const [nameInput,setNameInput]= useState("");
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const handleSign = () => {
    if (nameInput.trim().length < 2) return;
    setRipple(true);
    setTimeout(() => { setRipple(false); setSigned(true); }, 600);
  };

  const fadeIn = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.55s ease 60ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) 60ms",
  };

  if (signed) {
    return (
      <div style={{
        background: T.surface, border: `1px solid rgba(5,150,105,0.3)`,
        borderRadius: 22, padding: 32,
        boxShadow: "0 8px 40px rgba(5,150,105,0.12)",
        textAlign: "center", animation: "fadeUp 0.5s ease",
      }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: "pop 0.5s ease" }}>🎯</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 24,
          fontWeight: 800, color: T.text, letterSpacing: "-0.8px",
          marginBottom: 10,
        }}>
          You're Cleared to Compete
        </h2>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>
          Your integrity pledge has been recorded.<br/>
          Good luck, <strong style={{ color: T.text }}>{nameInput}</strong>. Make it count.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          {["5 Rules Read ✅", "Quiz Passed ✅", "Oath Signed ✅"].map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 700,
              background: T.greenSoft, color: T.green,
              border: `1px solid ${T.green}25`,
              borderRadius: 100, padding: "4px 12px",
              fontFamily: "'JetBrains Mono', monospace",
            }}>{tag}</span>
          ))}
        </div>
        <button
          onClick={onProceed}
          style={{
            width: "100%", padding: "15px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${T.green}, #047857)`,
            color: "#fff", fontWeight: 800, fontSize: 16,
            fontFamily: "'Syne', sans-serif", cursor: "pointer",
            boxShadow: "0 6px 20px rgba(5,150,105,0.4)",
            letterSpacing: "-0.3px",
          }}
        >
          🚀 Begin Exam
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...fadeIn }}>
      {/* Oath card */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
        marginBottom: 16,
      }}>
        <div style={{ height: 5, background: "linear-gradient(90deg, #4361ee, #7c3aed, #059669)" }} />
        <div style={{ padding: "28px 28px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🤝</div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 22,
              fontWeight: 800, color: T.text, letterSpacing: "-0.7px",
              marginBottom: 8,
            }}>
              The Integrity Oath
            </h3>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>
              You've read all 5 rules. Now make it official.
            </p>
          </div>

          {/* Oath text */}
          <div style={{
            background: "#f8f9fc",
            border: `1px solid ${T.border}`,
            borderRadius: 14, padding: "18px 20px",
            marginBottom: 22, position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -10, left: 20,
              fontSize: 48, color: "#e5e7eb", fontFamily: "Georgia, serif",
              lineHeight: 1, pointerEvents: "none",
            }}>"</div>
            <p style={{
              fontSize: 13.5, color: T.text, lineHeight: 1.85,
              fontStyle: "italic", paddingTop: 8,
            }}>
              I, <strong style={{ color: T.accent }}>{nameInput || "___________"}</strong>, confirm that I have
              read and understood all exam rules. I will not use any unauthorised
              resources, switch tabs, or attempt to deceive the AI proctoring system.
              I understand that any violation may result in immediate disqualification.
            </p>
          </div>

          {/* Name input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 11, fontWeight: 700, color: T.muted,
              display: "block", marginBottom: 7, letterSpacing: "0.5px",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              TYPE YOUR FULL NAME TO SIGN
            </label>
            <input
              type="text"
              placeholder="e.g. Arjun Sharma"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              style={{
                width: "100%", padding: "13px 16px",
                borderRadius: 11, border: `1px solid ${T.border}`,
                background: "#f8f9fc", color: T.text,
                fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={e => {
                e.target.style.borderColor = "rgba(67,97,238,0.4)";
                e.target.style.boxShadow = "0 0 0 3px rgba(67,97,238,0.1)";
              }}
              onBlur={e => {
                e.target.style.borderColor = T.border;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Sign button */}
          <button
            onClick={handleSign}
            disabled={nameInput.trim().length < 2}
            style={{
              width: "100%", padding: "14px",
              borderRadius: 11, border: "none",
              background: nameInput.trim().length >= 2
                ? `linear-gradient(135deg, #4361ee, #3451d1)`
                : "#e5e7eb",
              color: nameInput.trim().length >= 2 ? "#fff" : T.dim,
              fontWeight: 800, fontSize: 15,
              fontFamily: "'Syne', sans-serif",
              cursor: nameInput.trim().length >= 2 ? "pointer" : "not-allowed",
              boxShadow: nameInput.trim().length >= 2
                ? "0 4px 16px rgba(67,97,238,0.35)"
                : "none",
              transition: "all 0.25s",
              letterSpacing: "-0.3px",
              position: "relative", overflow: "hidden",
            }}
          >
            {ripple && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(255,255,255,0.25)",
                animation: "ripple-fill 0.5s ease",
              }} />
            )}
            ✍️ Sign & Proceed to Exam
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN — Instruction.jsx
══════════════════════════════════════════════════════════ */
export default function Instruction() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exam }  = location.state || {};

  const [current, setCurrent]   = useState(0);
  const [completed, setCompleted] = useState([]); // indices of completed missions
  const [phase,     setPhase]    = useState("intro"); // intro | missions | oath
  const [mounted,   setMounted]  = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const handleMissionComplete = () => {
    setCompleted(prev => [...prev, current]);
    if (current + 1 >= MISSIONS.length) {
      setPhase("oath");
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleProceed = () => {
    navigate("/exam", { state: { exam } });
  };

  const progress = phase === "oath" ? MISSIONS.length : current;

  const introFade = {
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body, #root { min-height: 100vh; margin: 0; padding: 0; }
        body { background: #f4f6fb !important; }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes pop         { 0%{transform:scale(.7);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes shake       { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-7px)} 40%,80%{transform:translateX(7px)} }
        @keyframes shimmer-bar { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes ripple-fill { from{opacity:1} to{opacity:0} }
        @keyframes orb-float   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,-12px)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'DM Sans', sans-serif",
        color: T.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 16px 60px",
        position: "relative",
      }}>
        {/* Solid bg layer — ensures no white flash */}
        <div style={{ position: "fixed", inset: 0, background: T.bg, zIndex: -3, pointerEvents: "none" }} />
        {/* Grid */}
        <div style={{
          position: "fixed", inset: 0, zIndex: -2,
          backgroundImage: "linear-gradient(rgba(67,97,238,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(67,97,238,0.04) 1px,transparent 1px)",
          backgroundSize: "52px 52px", pointerEvents: "none",
        }} />
        {/* Orb 1 */}
        <div style={{
          position: "fixed", top: "-5%", left: "5%", zIndex: -1,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(67,97,238,0.11) 0%, transparent 65%)",
          filter: "blur(60px)", pointerEvents: "none",
          animation: "orb-float 9s ease-in-out infinite",
        }} />
        {/* Orb 2 */}
        <div style={{
          position: "fixed", bottom: "0%", right: "0%", zIndex: -1,
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ width: "100%", maxWidth: 520, zIndex: 1, paddingTop: 40, position: "relative" }}>

          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 28, ...introFade,
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "#fff", border: `1px solid ${T.border}`,
                color: T.muted, cursor: "pointer", fontSize: 16,
                width: 36, height: 36, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >←</button>

            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 10, color: T.dim, fontWeight: 700,
                letterSpacing: "1.5px", fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 2,
              }}>EXAM BRIEFING</div>
              <div style={{
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Syne', sans-serif", color: T.text,
                letterSpacing: "-0.3px",
              }}>
                {exam?.exam || "Data Structures Assessment"}
              </div>
            </div>

            <div style={{
              background: T.accentSoft, border: `1px solid rgba(67,97,238,0.2)`,
              borderRadius: 100, padding: "4px 12px",
              fontSize: 10, color: T.accent, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px",
            }}>
              {completed.length}/{MISSIONS.length} DONE
            </div>
          </div>

          {/* Progress bar */}
          <div style={introFade}>
            <ProgressBar total={MISSIONS.length} current={progress} />
          </div>

          {/* INTRO phase */}
          {phase === "intro" && (
            <div style={{ ...introFade }}>
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 22, overflow: "hidden",
                boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
                marginBottom: 16,
              }}>
                <div style={{ height: 5, background: "linear-gradient(90deg, #4361ee, #7c3aed, #059669, #d97706, #0891b2)" }} />
                <div style={{ padding: "36px 28px", textAlign: "center" }}>
                  <div style={{ fontSize: 52, marginBottom: 16, animation: "pop 0.6s ease" }}>📋</div>
                  <h1 style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 26,
                    fontWeight: 800, color: T.text, letterSpacing: "-1px",
                    marginBottom: 14, lineHeight: 1.15,
                  }}>
                    Before You Begin
                  </h1>
                  <p style={{
                    fontSize: 14, color: T.muted, lineHeight: 1.75,
                    marginBottom: 24, maxWidth: 380, margin: "0 auto 24px",
                  }}>
                    Most students skip these rules — then blame them when things go wrong.
                    <strong style={{ color: T.text }}> We made it impossible to skip.</strong>
                  </p>

                  {/* How it works */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10, marginBottom: 28,
                  }}>
                    {[
                      { icon: "📖", label: "Read", desc: "5 rules explained simply" },
                      { icon: "🧠", label: "Prove", desc: "Quick quiz on each rule" },
                      { icon: "✍️", label: "Sign", desc: "Take the integrity oath" },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: "#f8f9fc", border: `1px solid ${T.border}`,
                        borderRadius: 14, padding: "14px 10px",
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(12px)",
                        transition: `opacity 0.5s ease ${200 + i * 100}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${200 + i * 100}ms`,
                      }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                        <div style={{
                          fontSize: 12, fontWeight: 700, color: T.text,
                          fontFamily: "'Syne', sans-serif", marginBottom: 3,
                        }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: T.dim }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Rule preview pills */}
                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: 7,
                    justifyContent: "center", marginBottom: 28,
                  }}>
                    {MISSIONS.map((m, i) => (
                      <span key={i} style={{
                        fontSize: 11, fontWeight: 600, padding: "5px 12px",
                        borderRadius: 100,
                        background: m.colorSoft, color: m.color,
                        border: `1px solid ${m.color}25`,
                        opacity: mounted ? 1 : 0,
                        transition: `opacity 0.4s ease ${400 + i * 80}ms`,
                      }}>
                        {m.icon} {m.title}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setPhase("missions")}
                    style={{
                      width: "100%", padding: "15px",
                      borderRadius: 12, border: "none",
                      background: `linear-gradient(135deg, #4361ee, #3451d1)`,
                      color: "#fff", fontWeight: 800, fontSize: 16,
                      fontFamily: "'Syne', sans-serif", cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(67,97,238,0.35)",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    Start Mission Briefing →
                  </button>

                  <p style={{ fontSize: 11, color: T.dim, marginTop: 12 }}>
                    Takes ~2 minutes · Cannot be skipped
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MISSIONS phase */}
          {phase === "missions" && (
            <MissionSlide
              key={current}
              mission={MISSIONS[current]}
              index={current}
              total={MISSIONS.length}
              onComplete={handleMissionComplete}
              isActive={true}
            />
          )}

          {/* OATH phase */}
          {phase === "oath" && (
            <OathScreen exam={exam} onProceed={handleProceed} />
          )}

        </div>
      </div>
    </>
  );
}