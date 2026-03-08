import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .na-root {
    font-family: 'DM Sans', sans-serif;
    background: #f8f9fc;
    color: #0f1117;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* NAVBAR */
  .na-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 48px;
    background: rgba(248,249,252,0.88);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
  }
  .na-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.5px;
    color: #0f1117;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .na-logo-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4361ee;
    box-shadow: 0 0 10px rgba(67,97,238,0.5);
  }
  .na-nav-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }
  .na-nav-links a {
    color: #6b7280;
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    transition: color 0.2s;
  }
  .na-nav-links a:hover { color: #0f1117; }
  .na-nav-cta {
    background: #4361ee;
    color: #fff;
    border: none;
    padding: 9px 22px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .na-nav-cta:hover {
    background: #3451d1;
    box-shadow: 0 4px 16px rgba(67,97,238,0.35);
  }

  /* HERO */
  .na-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 140px 24px 80px;
    position: relative;
  }
  .na-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 50% -10%, rgba(67,97,238,0.1) 0%, transparent 65%),
      radial-gradient(ellipse 40% 30% at 85% 70%, rgba(114,9,183,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .na-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(67,97,238,0.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(67,97,238,0.055) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%);
    pointer-events: none;
  }
  .na-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(67,97,238,0.08);
    border: 1px solid rgba(67,97,238,0.22);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 500;
    color: #4361ee;
    letter-spacing: 0.5px;
    margin-bottom: 28px;
    position: relative;
    z-index: 1;
  }
  .na-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #4361ee;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.35; transform: scale(1.5); }
  }
  .na-hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 6vw, 68px);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -2.5px;
    max-width: 820px;
    margin-bottom: 22px;
    position: relative;
    z-index: 1;
    color: #0f1117;
  }
  .na-hero h1 span {
    background: linear-gradient(135deg, #4361ee 0%, #7209b7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .na-hero > p {
    font-size: 17px;
    font-weight: 300;
    color: #6b7280;
    max-width: 520px;
    line-height: 1.7;
    margin-bottom: 52px;
    position: relative;
    z-index: 1;
  }

  /* ROLE CARDS */
  .na-role-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    z-index: 1;
  }
  .na-role-card {
    width: 220px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 18px;
    padding: 28px 22px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  .na-role-card:hover {
    transform: translateY(-6px);
    border-color: rgba(67,97,238,0.25);
    box-shadow: 0 12px 32px rgba(67,97,238,0.12);
  }
  .na-role-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin: 0 auto 16px;
  }
  .na-role-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #0f1117;
    margin-bottom: 8px;
  }
  .na-role-card p {
    font-size: 12.5px;
    color: #9ca3af;
    line-height: 1.55;
    margin-bottom: 20px;
  }
  .na-role-btn {
    width: 100%;
    padding: 9px 0;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: filter 0.2s, transform 0.1s;
  }
  .na-role-btn:hover { filter: brightness(0.95); }
  .na-role-btn:active { transform: scale(0.98); }
  .btn-admin     { background: #eef1fd; color: #4361ee; }
  .btn-recruiter { background: #ecfdf5; color: #059669; }
  .btn-student   { background: #fffbeb; color: #d97706; }

  /* STATS */
  .na-stats {
    background: #fff;
    border-top: 1px solid rgba(0,0,0,0.06);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    padding: 44px 48px;
    display: flex;
    justify-content: center;
    gap: 80px;
    flex-wrap: wrap;
  }
  .na-stat { text-align: center; }
  .na-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -2px;
    color: #0f1117;
    line-height: 1;
    margin-bottom: 6px;
  }
  .na-stat-num span { color: #4361ee; }
  .na-stat-label { font-size: 13px; color: #9ca3af; }

  /* WHY WE EXIST */
  .na-why {
    padding: 100px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .na-section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #4361ee;
    margin-bottom: 14px;
  }
  .na-section-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(26px, 3.5vw, 42px);
    font-weight: 800;
    letter-spacing: -1.5px;
    color: #0f1117;
    max-width: 560px;
    line-height: 1.12;
    margin-bottom: 56px;
  }
  .na-why-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: #e5e7eb;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }
  .na-why-card {
    background: #fff;
    padding: 36px 28px;
    transition: background 0.25s;
  }
  .na-why-card:hover { background: #f8f9fc; }
  .na-why-illus {
    height: 72px;
    margin-bottom: 22px;
    display: flex;
    align-items: flex-end;
  }
  .na-why-card h4 {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #0f1117;
    margin-bottom: 10px;
    line-height: 1.25;
  }
  .na-why-card p {
    font-size: 13.5px;
    color: #6b7280;
    line-height: 1.65;
  }

  /* FEATURES */
  .na-features {
    padding: 80px 48px 100px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .na-features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .na-feat-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 30px 30px 26px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .na-feat-card:hover {
    border-color: rgba(67,97,238,0.3);
    box-shadow: 0 6px 24px rgba(67,97,238,0.08);
  }
  .na-feat-card:first-child { grid-column: span 2; }
  .na-feat-top {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
  }
  .na-feat-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: #eef1fd;
    border: 1px solid rgba(67,97,238,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .na-feat-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #0f1117;
    letter-spacing: -0.3px;
  }
  .na-feat-card p {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.65;
    max-width: 500px;
  }
  .na-feat-tag {
    display: inline-block;
    margin-top: 14px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #4361ee;
    background: #eef1fd;
    border: 1px solid rgba(67,97,238,0.18);
    border-radius: 100px;
    padding: 3px 10px;
  }

  /* CTA — dark contrast band */
  .na-cta {
    background: #0f1117;
    padding: 100px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .na-cta-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 55% 65% at 50% 110%, rgba(67,97,238,0.22) 0%, transparent 65%);
    pointer-events: none;
  }
  .na-cta-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }
  .na-cta h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -1.5px;
    color: #fff;
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
  }
  .na-cta > p {
    font-size: 16px;
    color: rgba(255,255,255,0.42);
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
  }
  .na-cta-btns {
    display: flex;
    gap: 12px;
    justify-content: center;
    position: relative;
    z-index: 1;
  }
  .btn-primary {
    background: #4361ee;
    color: #fff;
    border: none;
    padding: 14px 32px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .btn-primary:hover {
    background: #3451d1;
    box-shadow: 0 0 28px rgba(67,97,238,0.45);
  }
  .btn-ghost {
    background: transparent;
    color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.15);
    padding: 14px 32px;
    border-radius: 10px;
    font-size: 15px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.4); color: #fff; }

  /* FOOTER */
  .na-footer {
    background: #fff;
    border-top: 1px solid #e5e7eb;
    padding: 26px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .na-footer-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #9ca3af;
    display: flex; align-items: center; gap: 8px;
  }
  .na-footer p { font-size: 13px; color: #9ca3af; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .na-nav { padding: 16px 24px; }
    .na-nav-links { display: none; }
    .na-why { padding: 60px 24px; }
    .na-why-grid { grid-template-columns: repeat(2, 1fr); }
    .na-features { padding: 60px 24px; }
    .na-features-grid { grid-template-columns: 1fr; }
    .na-feat-card:first-child { grid-column: span 1; }
    .na-stats { gap: 40px; padding: 36px 24px; }
    .na-cta { padding: 80px 24px; }
    .na-footer { flex-direction: column; gap: 12px; text-align: center; padding: 24px; }
  }
  @media (max-width: 600px) {
    .na-why-grid { grid-template-columns: 1fr; }
    .na-role-grid { flex-direction: column; align-items: center; }
  }
`;

const IllusSecure = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect x="8" y="14" width="40" height="32" rx="6" stroke="#4361ee" strokeWidth="1.5" fill="rgba(67,97,238,0.07)"/>
    <path d="M28 22 L28 30 M28 30 L22 35 M28 30 L34 35" stroke="#4361ee" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="28" cy="20" r="3" stroke="#4361ee" strokeWidth="1.5"/>
    <rect x="16" y="8" width="24" height="8" rx="2" stroke="rgba(67,97,238,0.35)" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
);
const IllusAI = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="10" stroke="#7209b7" strokeWidth="1.5" fill="rgba(114,9,183,0.07)"/>
    <circle cx="28" cy="28" r="3" fill="#7209b7"/>
    {[0,60,120,180,240,300].map((deg, i) => {
      const r = 22, rad = (deg * Math.PI) / 180;
      return <line key={i} x1="28" y1="28" x2={28 + r*Math.cos(rad)} y2={28 + r*Math.sin(rad)} stroke="rgba(114,9,183,0.2)" strokeWidth="1" strokeDasharray="2 3"/>;
    })}
    {[0,60,120,180,240,300].map((deg, i) => {
      const r = 22, rad = (deg * Math.PI) / 180;
      return <circle key={i} cx={28 + r*Math.cos(rad)} cy={28 + r*Math.sin(rad)} r="2.5" fill="rgba(114,9,183,0.5)"/>;
    })}
  </svg>
);
const IllusMonitor = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect x="6" y="10" width="44" height="30" rx="5" stroke="#059669" strokeWidth="1.5" fill="rgba(5,150,105,0.06)"/>
    <polyline points="10,32 18,22 26,28 34,18 46,26" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="24" y1="40" x2="32" y2="40" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="28" y1="40" x2="28" y2="46" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="34" cy="18" r="3" fill="rgba(5,150,105,0.25)" stroke="#059669" strokeWidth="1"/>
  </svg>
);
const IllusScale = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <rect x="8" y="30" width="10" height="18" rx="2" fill="rgba(217,119,6,0.1)" stroke="#d97706" strokeWidth="1.2"/>
    <rect x="23" y="22" width="10" height="26" rx="2" fill="rgba(217,119,6,0.1)" stroke="#d97706" strokeWidth="1.2"/>
    <rect x="38" y="12" width="10" height="36" rx="2" fill="rgba(217,119,6,0.15)" stroke="#d97706" strokeWidth="1.2"/>
    <path d="M10 24 L26 18 L42 8" stroke="rgba(217,119,6,0.35)" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
);

function LandingPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState({ exams: 0, users: 0, uptime: 0 });

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    const frame = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);

      if (p < 1) requestAnimationFrame(frame);
    };
    const t = setTimeout(() => requestAnimationFrame(frame), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="na-root">

        {/* NAVBAR */}
        <nav className="na-nav">
          <div className="na-logo">
            <div className="na-logo-dot" />
            NeuroAssess
          </div>
          <button className="na-nav-cta" onClick={() => navigate("/login?role=admin")}>
            Get Started
          </button>
        </nav>

        {/* HERO */}
        <section className="na-hero">
          <div className="na-hero-bg" />
          <div className="na-hero-grid" />
          <div className="na-badge">
            <div className="na-badge-dot" />
            AI-Powered Examination Platform
          </div>
          <h1>
            Secure Exams<br />
          </h1>
          <p>
            Conduct online assessments with AI-based face tracking, secure browser environments,
            and real-time candidate monitoring — all in one platform.
          </p>
          <div className="na-role-grid">
            <div className="na-role-card">
              <div className="na-role-icon" style={{ background: '#eef1fd', border: '1px solid rgba(67,97,238,0.18)' }}>🛡️</div>
              <h3>Admin</h3>
              <p>Create exams, configure rules, and generate detailed reports.</p>
              <button className="na-role-btn btn-admin" onClick={() => navigate("/login?role=admin")}>Admin Login →</button>
            </div>
            <div className="na-role-card">
              <div className="na-role-icon" style={{ background: '#ecfdf5', border: '1px solid rgba(5,150,105,0.18)' }}>💼</div>
              <h3>Recruiter</h3>
              <p>Browse candidate results and shortlist top performers.</p>
              <button className="na-role-btn btn-recruiter" onClick={() => navigate("/login?role=recruiter")}>Recruiter Login →</button>
            </div>
            <div className="na-role-card">
              <div className="na-role-icon" style={{ background: '#fffbeb', border: '1px solid rgba(217,119,6,0.18)' }}>🎓</div>
              <h3>Student</h3>
              <p>Access your assigned exams and submit securely.</p>
              <button className="na-role-btn btn-student" onClick={() => navigate("/login?role=student")}>Student Login →</button>
            </div>
          </div>
        </section>

        

        {/* WHY WE EXIST */}
        <section className="na-why">
          <div className="na-section-label">Why NeuroAssess</div>
          <h2 className="na-section-heading">Built for the future of fair assessment</h2>
          <div className="na-why-grid">
            <div className="na-why-card">
              <div className="na-why-illus"><IllusSecure /></div>
              <h4>Zero Compromise Security</h4>
              <p>Lock-down browser prevents tab switching, copy-paste, and unauthorized access throughout every exam session.</p>
            </div>
            <div className="na-why-card">
              <div className="na-why-illus"><IllusAI /></div>
              <h4>AI Proctoring Engine</h4>
              <p>Real-time face detection and behavior tracking flags anomalies automatically, keeping integrity protected.</p>
            </div>
            <div className="na-why-card">
              <div className="na-why-illus"><IllusMonitor /></div>
              <h4>Live Candidate Monitoring</h4>
              <p>Admins see every candidate's status, webcam feed, and flagged events on a live dashboard as they happen.</p>
            </div>
            <div className="na-why-card">
              <div className="na-why-illus"><IllusScale /></div>
              <h4>Scales Effortlessly</h4>
              <p>Cloud-native infrastructure handles thousands of simultaneous candidates with consistent performance and zero downtime.</p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="na-features">
          <div className="na-section-label">Platform Features</div>
          <h2 className="na-section-heading" style={{ marginBottom: '32px' }}>Everything you need, nothing you don't</h2>
          <div className="na-features-grid">
            <div className="na-feat-card">
              <div className="na-feat-top">
                <div className="na-feat-icon">🤖</div>
                <h3>AI Proctoring</h3>
              </div>
              <p>Our computer vision model continuously monitors each candidate's webcam feed, flagging suspicious behavior such as looking away, multiple faces, or device switching — all in real time.</p>
              <span className="na-feat-tag">Core Feature</span>
            </div>
            <div className="na-feat-card">
              <div className="na-feat-top">
                <div className="na-feat-icon">🔒</div>
                <h3>Secure Browser</h3>
              </div>
              <p>Candidates are locked into a controlled environment that prevents external resource access, copy-paste, and screen sharing.</p>
              <span className="na-feat-tag">Security</span>
            </div>
            <div className="na-feat-card">
              <div className="na-feat-top">
                <div className="na-feat-icon">📊</div>
                <h3>Smart Reporting</h3>
              </div>
              <p>Auto-generated analytics with score distributions, integrity flags, time-per-question, and recruiter-ready export formats.</p>
              <span className="na-feat-tag">Analytics</span>
            </div>
            <div className="na-feat-card">
              <div className="na-feat-top">
                <div className="na-feat-icon">⚡</div>
                <h3>Fast & Reliable</h3>
              </div>
              <p>99.9% uptime SLA backed by multi-region cloud deployment. Auto-scales to any load without manual intervention.</p>
              <span className="na-feat-tag">Infrastructure</span>
            </div>
          </div>
        </section>

       

        {/* FOOTER */}
        <footer className="na-footer">
          <div className="na-footer-logo">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4361ee' }} />
            NeuroAssess
          </div>
          <p>© 2026 NeuroAssess — Secure Online Examination Platform</p>
        </footer>

      </div>
    </>
  );
}

export default LandingPage;