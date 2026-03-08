import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── Design Tokens (Light Theme) ─── */
const T = {
  bg:         "#f4f6fb",
  surface:    "#ffffff",
  border:     "rgba(0,0,0,0.08)",
  accent:     "#4361ee",
  accentSoft: "#eef1fd",
  teal:       "#0891b2",
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

/* ─── Camera Hook ─── */
function useCamera(videoRef, active) {
  useEffect(() => {
    if (!active) return;
    let stream;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } })
      .then((s) => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => {});
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [active, videoRef]);
}

/* ─── Capture Frame ─── */
function captureFrame(videoEl) {
  const canvas = document.createElement("canvas");
  canvas.width  = videoEl?.videoWidth  || 640;
  canvas.height = videoEl?.videoHeight || 480;
  canvas.getContext("2d").drawImage(videoEl, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.92);
}

/* ─── Corner Bracket ─── */
function Corner({ pos, color }) {
  const top  = pos.includes("t");
  const left = pos.includes("l");
  return (
    <div style={{
      position: "absolute", width: 22, height: 22, pointerEvents: "none",
      top:    top  ? 10 : undefined, bottom: !top  ? 10 : undefined,
      left:   left ? 10 : undefined, right:  !left ? 10 : undefined,
      borderTop:    top  ? `2.5px solid ${color}` : "none",
      borderBottom: !top ? `2.5px solid ${color}` : "none",
      borderLeft:   left ? `2.5px solid ${color}` : "none",
      borderRight:  !left? `2.5px solid ${color}` : "none",
      borderRadius: top && left ? "3px 0 0 0" : top && !left ? "0 3px 0 0" : !top && left ? "0 0 0 3px" : "0 0 3px 0",
    }} />
  );
}

/* ─── Simulated AI Results Pool ─── */
const DUMMY_RESULTS = [
  { match: true,  confidence: 94, reason: "Face geometry and facial features match with high confidence." },
  { match: true,  confidence: 88, reason: "Identity confirmed. Minor lighting difference, but features align." },
  { match: true,  confidence: 97, reason: "Strong biometric match across key facial landmarks." },
  { match: false, confidence: 32, reason: "Face not clearly visible. Please ensure proper lighting and face the camera." },
  { match: false, confidence: 18, reason: "Could not detect a face in the live image. Please retry." },
];

function getSimulatedResult() {
  // 80% chance of success for demo purposes
  const pool = Math.random() < 0.8
    ? DUMMY_RESULTS.filter(r => r.match)
    : DUMMY_RESULTS.filter(r => !r.match);
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ══════════════════════════════════════════════════════════
   STEP 1 — ID Card Scan
══════════════════════════════════════════════════════════ */
function IDCardScan({ onNext }) {
  const videoRef = useRef(null);
  const [ready,    setReady]    = useState(false);
  const [captured, setCaptured] = useState(null);
  const [tick,     setTick]     = useState(null);
  const [camError, setCamError] = useState(false);

  useEffect(() => {
    if (captured) return;
    let stream;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } })
      .then((s) => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => setCamError(true));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [captured]);

  const startCountdown = () => {
    let c = 3;
    setTick(c);
    const id = setInterval(() => {
      c--;
      if (c === 0) {
        clearInterval(id);
        setTick(null);
        // If no real camera, use a placeholder data URL
        const frame = videoRef.current?.readyState > 0
          ? captureFrame(videoRef.current)
          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        setCaptured(frame);
      } else {
        setTick(c);
      }
    }, 1000);
  };

  return (
    <div style={styles.card}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>🪪</div>
      <h2 style={styles.h2}>Scan Your ID Card</h2>
      <p style={styles.sub}>
        Hold your college ID card up to the webcam. Align it within the frame, then tap Capture.
      </p>

      <div style={styles.camBox}>
        {!captured ? (
          <>
            {camError ? (
              <div style={{
                width: "100%", height: "100%", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 10,
                background: "#f8f9fc",
              }}>
                <span style={{ fontSize: 36 }}>📷</span>
                <span style={{ fontSize: 12, color: T.muted, textAlign: "center", padding: "0 20px" }}>
                  Camera not available.<br/>Click capture to simulate.
                </span>
              </div>
            ) : (
              <video
                ref={videoRef} autoPlay muted playsInline
                onCanPlay={() => setReady(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
            {["tl","tr","bl","br"].map((p) => <Corner key={p} pos={p} color={T.accent} />)}
            <div style={styles.scanLine} />
            <div style={styles.guideText}>ALIGN ID CARD HERE</div>
            {tick !== null && (
              <div style={styles.countdownOverlay}>{tick}</div>
            )}
          </>
        ) : (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {captured.length > 100 ? (
              <img src={captured} alt="id" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%", display: "flex",
                alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 8, background: "#f0fdf4",
              }}>
                <span style={{ fontSize: 36 }}>🪪</span>
                <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>ID Captured (Simulated)</span>
              </div>
            )}
            <div style={styles.capturedBadge}>✓ CAPTURED</div>
          </div>
        )}
      </div>

      {!captured ? (
        <button
          style={{ ...styles.btn, ...(!ready && !camError || tick !== null ? styles.btnDisabled : {}) }}
          disabled={tick !== null}
          onClick={startCountdown}
        >
          {tick !== null ? `Capturing in ${tick}…` : "📸  Capture ID Card"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...styles.btn, ...styles.ghostBtn, flex: 1 }} onClick={() => setCaptured(null)}>
            ↩ Retake
          </button>
          <button style={{ ...styles.btn, flex: 2 }} onClick={() => onNext(captured)}>
            Looks Good → Face Scan
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 2 — Face Scan + Simulated AI Comparison
══════════════════════════════════════════════════════════ */
function FaceScan({ idCapture, onVerified, onFail }) {
  const videoRef = useRef(null);
  const [phase,    setPhase]    = useState("align");
  const [faceImg,  setFaceImg]  = useState(null);
  const [result,   setResult]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [camError, setCamError] = useState(false);
  const [analysisDots, setAnalysisDots] = useState("");

  useEffect(() => {
    if (phase !== "align" && phase !== "scanning") return;
    let stream;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => setCamError(true));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [phase]);

  // Animated dots during comparing
  useEffect(() => {
    if (phase !== "comparing") return;
    let i = 0;
    const iv = setInterval(() => { i++; setAnalysisDots(".".repeat((i % 3) + 1)); }, 400);
    return () => clearInterval(iv);
  }, [phase]);

  const startScan = () => {
    setPhase("scanning");
    let p = 0;
    const iv = setInterval(() => {
      p += 2.2;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        const frame = videoRef.current?.readyState > 0
          ? captureFrame(videoRef.current)
          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        setFaceImg(frame);
        setPhase("comparing");
        runSimulatedAI();
      }
    }, 55);
  };

  const runSimulatedAI = () => {
    // Simulated analysis steps shown to user
    setTimeout(() => {
      const res = getSimulatedResult();
      setResult(res);
      setPhase("done");
    }, 2800); // realistic delay
  };

  const retry = () => {
    setPhase("align");
    setResult(null);
    setFaceImg(null);
    setProgress(0);
    setAnalysisDots("");
  };

  const borderColor =
    phase === "done"
      ? result?.match ? T.green : T.red
      : phase === "scanning" || phase === "comparing"
        ? T.accent
        : T.border;

  const ANALYSIS_STEPS = [
    "Detecting facial landmarks…",
    "Comparing biometric features…",
    "Running identity cross-check…",
    "Calculating confidence score…",
  ];

  return (
    <div style={styles.card}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>
        {phase === "done" && result?.match ? "✅" : phase === "done" ? "❌" : "👁️"}
      </div>
      <h2 style={styles.h2}>
        {phase === "done" && result?.match  ? "Identity Confirmed!"  :
         phase === "done"                   ? "Verification Failed"  :
         phase === "comparing"              ? `Analyzing Face${analysisDots}` :
         phase === "scanning"               ? "Scanning Face…"       :
                                             "Live Face Scan"}
      </h2>
      <p style={styles.sub}>
        {phase === "align"     && "Look directly at the camera. Ensure your face is well-lit and centred."}
        {phase === "scanning"  && "Hold still — capturing biometric data…"}
        {phase === "comparing" && "AI model is comparing your face with the ID card image…"}
        {phase === "done"      && result?.reason}
      </p>

      {/* Split preview */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        {/* ID thumb */}
        <div style={{ flex: 1 }}>
          <div style={styles.camLabel}>ID CARD</div>
          <div style={{
            borderRadius: 10, overflow: "hidden", aspectRatio: "4/3",
            border: `1px solid ${T.border}`, background: "#f8f9fc",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {idCapture && idCapture.length > 200 ? (
              <img src={idCapture} alt="id" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ textAlign: "center", padding: 12 }}>
                <span style={{ fontSize: 28 }}>🪪</span>
                <div style={{ fontSize: 10, color: T.dim, marginTop: 4 }}>Simulated</div>
              </div>
            )}
          </div>
        </div>

        {/* Live cam */}
        <div style={{ flex: 1 }}>
          <div style={styles.camLabel}>LIVE FACE</div>
          <div style={{
            borderRadius: 10, overflow: "hidden", aspectRatio: "4/3",
            position: "relative", background: "#f8f9fc",
            border: `1.5px solid ${borderColor}`,
            boxShadow: phase !== "align" ? `0 0 16px ${borderColor}33` : "none",
            transition: "border-color .4s, box-shadow .4s",
          }}>
            {phase === "align" || phase === "scanning" ? (
              camError ? (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 28 }}>📷</span>
                  <span style={{ fontSize: 10, color: T.dim }}>Simulated</span>
                </div>
              ) : (
                <video ref={videoRef} autoPlay muted playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff" }}>
                <span style={{ fontSize: 28 }}>👤</span>
              </div>
            )}

            {phase === "scanning" && <div style={styles.scanLine} />}

            {phase === "comparing" && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(67,97,238,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={styles.spinner} />
              </div>
            )}

            {phase === "done" && (
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                background: result?.match ? "rgba(5,150,105,0.1)" : "rgba(225,29,72,0.1)",
              }}>
                <span style={{ fontSize: 32, animation: "pop .4s ease" }}>
                  {result?.match ? "✅" : "❌"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulated analysis log during comparing */}
      {phase === "comparing" && (
        <div style={{
          background: "#f8f9fc", border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "12px 14px", marginBottom: 16,
        }}>
          {ANALYSIS_STEPS.map((step, i) => (
            <SimulatedLogLine key={i} text={step} delay={i * 650} />
          ))}
        </div>
      )}

      {/* Scan progress */}
      {phase === "scanning" && (
        <div style={styles.progressTrack}>
          <div style={{
            ...styles.progressFill,
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${T.accent}, ${T.teal})`,
          }} />
        </div>
      )}

      {/* Confidence bar */}
      {phase === "done" && result && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              color: T.muted, letterSpacing: "1px",
            }}>
              MATCH CONFIDENCE
            </span>
            <span style={{
              fontSize: 13, fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              color: result.match ? T.green : T.red,
            }}>
              {result.confidence}%
            </span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{
              ...styles.progressFill,
              width: `${result.confidence}%`,
              background: result.match
                ? `linear-gradient(90deg, ${T.green}, #34d399)`
                : `linear-gradient(90deg, ${T.red}, #fb7185)`,
              transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
            }} />
          </div>

          {/* Simulated AI badge */}
          <div style={{
            marginTop: 10, display: "flex", alignItems: "center", gap: 6,
            background: T.accentSoft, border: `1px solid rgba(67,97,238,0.15)`,
            borderRadius: 8, padding: "7px 12px",
          }}>
            <span style={{ fontSize: 13 }}>🤖</span>
            <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>
              Simulated AI — Demo Mode
            </span>
            <span style={{ fontSize: 11, color: T.muted, marginLeft: "auto" }}>
              Results are randomized
            </span>
          </div>
        </div>
      )}

      {/* CTAs */}
      {phase === "align" && (
        <button style={styles.btn} onClick={startScan}>🔍  Start Face Scan</button>
      )}
      {phase === "done" && result?.match && (
        <button
          style={{ ...styles.btn, background: `linear-gradient(135deg, ${T.green}, #047857)` }}
          onClick={onVerified}
        >
          ✅  Enter Exam →
        </button>
      )}
      {phase === "done" && !result?.match && (
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...styles.btn, ...styles.ghostBtn, flex: 1 }} onClick={retry}>
            ↩ Retry
          </button>
          <button
            style={{ ...styles.btn, background: `linear-gradient(135deg, ${T.red}, #be123c)`, flex: 2 }}
            onClick={onFail}
          >
            Contact Admin
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Simulated log line that fades in after a delay ─── */
function SimulatedLogLine({ text, delay }) {
  const [visible, setVisible] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true),          delay);
    const t2 = setTimeout(() => setDone(true),   delay + 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);

  if (!visible) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "4px 0", animation: "fadeUp 0.3s ease",
    }}>
      <span style={{ fontSize: 11 }}>
        {done ? "✅" : <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", border: `2px solid ${T.accent}`, borderTopColor: "transparent", animation: "spin 0.7s linear infinite", verticalAlign: "middle" }} />}
      </span>
      <span style={{
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        color: done ? T.muted : T.text, letterSpacing: "0.3px",
      }}>
        {text}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP 3 — Exam Ready
══════════════════════════════════════════════════════════ */
function ExamReady({ exam }) {
  const navigate    = useNavigate();
  const [countdown, setCountdown] = useState(null);

  const handleStart = () => {
    let c = 3;
    setCountdown(c);
    const iv = setInterval(() => {
      c--;
      if (c === 0) {
        clearInterval(iv);
        // navigate immediately — don't set null first (avoids white flash)
        navigate("/instruction", { state: { exam } });
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  return (
    <div style={{
      ...styles.card,
      border: `1px solid rgba(5,150,105,0.3)`,
      boxShadow: `0 8px 40px rgba(5,150,105,0.1)`,
    }}>
      {countdown !== null ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          {/* key on the wrapper div so React remounts + re-animates each tick */}
          <div key={countdown} style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 88, fontWeight: 900,
            color: T.accent, letterSpacing: "-6px",
            animation: "pop .35s cubic-bezier(0.22,1,0.36,1)",
            lineHeight: 1,
          }}>{countdown}</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 14, letterSpacing: "0.5px" }}>
            Loading instructions…
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center", fontSize: 44, marginBottom: 12, animation: "pop .5s ease" }}>🎯</div>
          <div style={{
            textAlign: "center", fontSize: 10, color: T.green,
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px",
            marginBottom: 10, fontWeight: 600,
          }}>
            IDENTITY VERIFIED — CLEARED TO PROCEED
          </div>
          <h2 style={{ ...styles.h2, textAlign: "center" }}>Ready to Begin?</h2>
          <p style={{ ...styles.sub, textAlign: "center", marginBottom: 22 }}>
            {exam?.exam || "Data Structures Assessment"}
          </p>

          {/* Info grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 10, marginBottom: 20,
          }}>
            {[
              ["Duration",   exam?.duration   || "90 min"],
              ["Questions",  `${exam?.questions || 45} Qs`],
              ["Company",    exam?.company     || "Amazon"],
              ["Difficulty", exam?.difficulty  || "Hard"],
              ["Date",       exam?.date        || "Today"],
              ["Proctoring", "AI Active ✅"],
            ].map(([k, v]) => (
              <div key={k} style={{
                background: "#f8f9fc", border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{
                  fontSize: 9, color: T.dim,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "1px", marginBottom: 4, fontWeight: 600,
                }}>
                  {k.toUpperCase()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div style={{
            background: T.amberSoft, border: `1px solid rgba(217,119,6,0.25)`,
            borderRadius: 10, padding: "10px 14px", marginBottom: 20,
          }}>
            <p style={{ fontSize: 12, color: T.amber, lineHeight: 1.7 }}>
              ⚠️ Once started: tab switching, copy-paste, and window minimizing are disabled. AI proctoring monitors your face throughout.
            </p>
          </div>

          <button
            style={{
              ...styles.btn,
              background: `linear-gradient(135deg, ${T.green}, #047857)`,
              fontSize: 15, padding: "14px 0",
              boxShadow: `0 4px 16px rgba(5,150,105,0.35)`,
            }}
            onClick={handleStart}
          >
            🚀  Start Exam Now
          </button>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN — ExamVerify
══════════════════════════════════════════════════════════ */
export default function ExamVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exam }  = location.state || {};

  const [step,      setStep]      = useState(0);
  const [idCapture, setIdCapture] = useState(null);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const stepLabels = ["Scan ID Card", "Face Scan"];

  const fade = {
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.5s ease 80ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) 80ms",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body, #root { min-height: 100vh; margin: 0; padding: 0; }
        body { background: #f4f6fb !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes scanV  { 0%{top:-2px} 100%{top:100%} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pop    { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
        @keyframes shimmer{ 0%{background-position:-400px 0} 100%{background-position:400px 0} }
      `}</style>

      <div style={styles.root}>
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.grid} />

        <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 1, ...fade }}>

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 26,
          }}>
            <button
              onClick={() => navigate("/student-dashboard")}
              style={{
                background: "#fff", border: `1px solid ${T.border}`,
                color: T.muted, cursor: "pointer", fontSize: 18,
                width: 36, height: 36, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                transition: "background 0.2s",
              }}
            >
              ←
            </button>
            <div>
              <div style={{
                fontSize: 10, color: T.dim,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "1.5px", marginBottom: 3, fontWeight: 600,
              }}>
                IDENTITY VERIFICATION
              </div>
              <div style={{
                fontSize: 16, fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                color: T.text, letterSpacing: "-0.3px",
              }}>
                {exam?.exam || "Exam Verification"}
              </div>
            </div>

            {/* Demo mode tag */}
            <div style={{
              marginLeft: "auto",
              background: T.amberSoft, border: `1px solid rgba(217,119,6,0.25)`,
              borderRadius: 100, padding: "4px 12px",
              fontSize: 10, color: T.amber,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600, letterSpacing: "0.5px",
            }}>
              DEMO MODE
            </div>
          </div>

          {/* Step indicator */}
          {step < 2 && (
            <div style={{
              background: "#fff", border: `1px solid ${T.border}`,
              borderRadius: 14, padding: "16px 20px",
              display: "flex", alignItems: "center",
              marginBottom: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              {stepLabels.map((label, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: i === 0 ? 1 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: i < step ? T.green : i === step ? T.accent : "#f3f4f6",
                      border: `2px solid ${i < step ? T.green : i === step ? T.accent : T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                      color: i <= step ? "#fff" : T.dim,
                      boxShadow: i === step ? `0 0 0 4px rgba(67,97,238,0.12)` : "none",
                      transition: "all .35s",
                    }}>
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span style={{
                      fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "1px", whiteSpace: "nowrap",
                      fontWeight: 600,
                      color: i === step ? T.accent : i < step ? T.green : T.dim,
                    }}>
                      {label.toUpperCase()}
                    </span>
                  </div>
                  {i === 0 && (
                    <div style={{
                      flex: 1, height: 2, margin: "0 10px", marginTop: -16,
                      borderRadius: 99,
                      background: step > 0
                        ? `linear-gradient(90deg, ${T.green}, #34d399)`
                        : "#e5e7eb",
                      transition: "background .5s",
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          {step === 0 && (
            <IDCardScan onNext={(img) => { setIdCapture(img); setStep(1); }} />
          )}
          {step === 1 && (
            <FaceScan
              idCapture={idCapture}
              onVerified={() => setStep(2)}
              onFail={() => alert("Please contact your exam administrator.")}
            />
          )}
          {step === 2 && <ExamReady exam={exam} />}
        </div>
      </div>
    </>
  );
}

/* ─── Styles ─── */
const styles = {
  root: {
    minHeight: "100vh",
    background: T.bg,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "28px 16px",
    fontFamily: "'DM Sans', sans-serif",
    color: T.text,
    position: "relative",
  },
  orb1: {
    position: "fixed", top: "0%", left: "5%",
    width: 380, height: 380, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(67,97,238,0.08) 0%, transparent 70%)",
    filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
  },
  orb2: {
    position: "fixed", bottom: "5%", right: "5%",
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(8,145,178,0.07) 0%, transparent 70%)",
    filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage: `linear-gradient(rgba(67,97,238,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(67,97,238,0.035) 1px,transparent 1px)`,
    backgroundSize: "52px 52px", pointerEvents: "none", zIndex: 0,
  },
  card: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 18, padding: 26,
    boxShadow: "0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
  },
  h2: {
    fontSize: 20, fontWeight: 800, marginBottom: 6,
    letterSpacing: "-0.5px",
    fontFamily: "'Syne', sans-serif", color: T.text,
  },
  sub: { fontSize: 13, color: T.muted, marginBottom: 18, lineHeight: 1.65 },
  camBox: {
    position: "relative", width: "100%", aspectRatio: "4/3",
    background: "#f0f4ff", borderRadius: 12, overflow: "hidden",
    marginBottom: 16, border: `1px solid ${T.border}`,
  },
  scanLine: {
    position: "absolute", left: 0, right: 0, height: 2,
    background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
    animation: "scanV 2.2s linear infinite",
    boxShadow: `0 0 8px ${T.accent}66`,
    pointerEvents: "none",
  },
  guideText: {
    position: "absolute", bottom: 12, left: 0, right: 0,
    textAlign: "center", fontSize: 9,
    fontFamily: "'JetBrains Mono', monospace",
    color: T.accent, letterSpacing: "1.5px", fontWeight: 600,
    pointerEvents: "none",
  },
  countdownOverlay: {
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(248,249,252,0.75)", backdropFilter: "blur(4px)",
    fontSize: 80, fontWeight: 900,
    fontFamily: "'Syne', sans-serif",
    color: T.accent,
  },
  capturedBadge: {
    position: "absolute", top: 10, right: 10,
    background: T.green, color: "#fff",
    fontSize: 10, fontWeight: 700, letterSpacing: "1px",
    padding: "3px 10px", borderRadius: 99,
    fontFamily: "'JetBrains Mono', monospace",
  },
  camLabel: {
    fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "1.5px", color: T.dim,
    marginBottom: 5, fontWeight: 600,
  },
  spinner: {
    width: 28, height: 28,
    border: `3px solid rgba(67,97,238,0.15)`,
    borderTopColor: T.accent,
    borderRadius: "50%", animation: "spin .7s linear infinite",
  },
  progressTrack: {
    background: "#e5e7eb", borderRadius: 99, height: 6,
    overflow: "hidden", marginBottom: 16,
  },
  progressFill: { height: "100%", borderRadius: 99, transition: "width .08s linear" },
  btn: {
    width: "100%", padding: "13px 0", borderRadius: 11, border: "none",
    background: `linear-gradient(135deg, ${T.accent}, #3451d1)`,
    color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Syne', sans-serif", letterSpacing: "-0.2px",
    boxShadow: "0 4px 14px rgba(67,97,238,0.3)",
    transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
  },
  btnDisabled: { opacity: .4, cursor: "not-allowed" },
  ghostBtn: {
    background: "#fff",
    border: `1px solid ${T.border}`,
    color: T.muted,
    boxShadow: "none",
  },
};