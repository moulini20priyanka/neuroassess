import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   PROFESSIONAL SVG ICON LIBRARY
───────────────────────────────────────────── */
const IconShield = ({ size = 28, color = "#fff", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);
const IconBriefcase = ({ size = 28, color = "#fff", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <path d="M2 12h20"/>
  </svg>
);
const IconGradCap = ({ size = 28, color = "#fff", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 8.5 12 15 2 8.5 12 2"/>
    <polyline points="6 11.5 6 17 12 20 18 17 18 11.5"/>
  </svg>
);
const IconLock = ({ size = 22, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconCpu = ({ size = 22, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);
const IconMonitor = ({ size = 22, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <polyline points="8 21 12 17 16 21"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);
const IconZap = ({ size = 22, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconEye = ({ size = 22, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconBarChart = ({ size = 22, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconArrowRight = ({ size = 14, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h8M8 4l3 3-3 3"/>
  </svg>
);
const IconHexagon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="white">
    <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,700;12..96,800&family=Cabinet+Grotesk:wght@300;400;500;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #3d5af1;
    --blue-light: #eef0fe;
    --blue-mid: #c7cefb;
    --green: #0ea472;
    --green-light: #e6f7f1;
    --amber: #f59e0b;
    --amber-light: #fef3c7;
    --purple: #7c3aed;
    --ink: #0c0f1a;
    --ink-60: #5a6070;
    --ink-30: #b0b6c3;
    --surface: #f4f5fb;
    --white: #ffffff;
    --border: rgba(0,0,0,0.07);
    --radius-xl: 28px;
    --radius-lg: 18px;
    --radius-md: 12px;
    --shadow-card: 0 2px 16px rgba(61,90,241,0.06), 0 1px 4px rgba(0,0,0,0.04);
    --shadow-hover: 0 20px 60px rgba(61,90,241,0.13), 0 4px 16px rgba(0,0,0,0.06);
    --font-display: 'Bricolage Grotesque', sans-serif;
    --font-body: 'Cabinet Grotesk', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }

  .na2-root {
    font-family: var(--font-body);
    background: var(--surface);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── CANVAS PARTICLES ── */
  .na2-canvas-bg {
    position: fixed; inset: 0; z-index: 0;
    pointer-events: none; opacity: 0.55;
  }

  /* ── FLOATING ORBS ── */
  .na2-orbs { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .na2-orb { position: absolute; border-radius: 50%; filter: blur(90px); animation: orbFloat var(--dur,18s) ease-in-out infinite; animation-delay: var(--delay,0s); }
  .na2-orb-1 { width:500px;height:500px;background:rgba(61,90,241,0.09);top:-100px;left:-100px;--dur:20s; }
  .na2-orb-2 { width:400px;height:400px;background:rgba(124,58,237,0.07);top:30%;right:-80px;--dur:25s;--delay:-8s; }
  .na2-orb-3 { width:350px;height:350px;background:rgba(14,164,114,0.06);bottom:20%;left:10%;--dur:22s;--delay:-5s; }
  .na2-orb-4 { width:300px;height:300px;background:rgba(245,158,11,0.05);bottom:-80px;right:15%;--dur:28s;--delay:-12s; }
  @keyframes orbFloat {
    0%,100% { transform:translate(0,0) scale(1); }
    33% { transform:translate(30px,-40px) scale(1.06); }
    66% { transform:translate(-20px,30px) scale(0.97); }
  }

  /* ── NAVBAR ── */
  .na2-nav {
    position:fixed;top:0;left:0;right:0;z-index:200;
    display:flex;align-items:center;justify-content:space-between;
    padding:0 48px;height:66px;
    background:rgba(244,245,251,0.85);
    backdrop-filter:blur(20px) saturate(180%);
    border-bottom:1px solid rgba(61,90,241,0.08);
    animation:navSlide 0.7s cubic-bezier(.22,.68,0,1) both;
  }
  @keyframes navSlide { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
  .na2-logo {
    font-family:var(--font-display);font-weight:800;font-size:19px;
    letter-spacing:-0.6px;color:var(--ink);
    display:flex;align-items:center;gap:10px;text-decoration:none;
  }
  .na2-logo-mark {
    width:32px;height:32px;
    background:linear-gradient(135deg,var(--blue) 0%,var(--purple) 100%);
    border-radius:9px;display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 12px rgba(61,90,241,0.35);position:relative;overflow:hidden;
  }
  .na2-logo-mark::after { content:'';position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,255,255,0.3) 0%,transparent 60%); }
  .na2-logo-mark-icon { position:relative;z-index:1; }
  .na2-nav-links { display:flex;gap:4px;list-style:none; }
  .na2-nav-links a {
    color:var(--ink-60);text-decoration:none;font-size:14px;font-weight:500;
    padding:6px 14px;border-radius:8px;transition:color 0.2s,background 0.2s;
  }
  .na2-nav-links a:hover { color:var(--blue);background:var(--blue-light); }
  .na2-nav-cta {
    display:flex;align-items:center;gap:8px;
    background:var(--ink);color:#fff;border:none;
    padding:9px 20px;border-radius:10px;
    font-size:14px;font-weight:600;cursor:pointer;
    font-family:var(--font-body);letter-spacing:-0.2px;
    transition:background 0.2s,transform 0.15s,box-shadow 0.2s;
  }
  .na2-nav-cta:hover { background:#1a1e2e;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,0.2); }
  .na2-nav-cta .cta-arrow { transition:transform 0.2s; display:flex; align-items:center; }
  .na2-nav-cta:hover .cta-arrow { transform:translateX(3px); }

  /* ── HERO ── */
  .na2-hero {
    min-height:100vh;display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    text-align:center;padding:130px 24px 80px;
    position:relative;z-index:1;
  }
  .na2-hero-pill {
    display:inline-flex;align-items:center;gap:10px;
    background:var(--white);border:1.5px solid var(--blue-mid);
    border-radius:100px;padding:7px 18px 7px 8px;
    margin-bottom:32px;box-shadow:0 2px 12px rgba(61,90,241,0.1);
    animation:fadeUp 0.6s 0.2s cubic-bezier(.22,.68,0,1) both;
  }
  .na2-pill-badge {
    background:linear-gradient(135deg,var(--blue),var(--purple));
    color:#fff;font-size:10px;font-weight:700;
    letter-spacing:0.8px;text-transform:uppercase;
    padding:4px 10px;border-radius:100px;
  }
  .na2-pill-text { font-size:13px;font-weight:500;color:var(--blue); }
  .na2-hero-headline {
    font-family:var(--font-display);
    font-size:clamp(42px,6.5vw,80px);font-weight:800;
    line-height:1.02;letter-spacing:-3px;color:var(--ink);
    max-width:860px;margin-bottom:24px;
    animation:fadeUp 0.7s 0.3s cubic-bezier(.22,.68,0,1) both;
  }
  .na2-hero-headline .grad {
    background:linear-gradient(135deg,var(--blue) 0%,var(--purple) 50%,#a855f7 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    background-size:200% 200%;animation:gradShift 4s ease-in-out infinite alternate;
  }
  @keyframes gradShift { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }
  .na2-hero-sub {
    font-size:17px;font-weight:400;color:var(--ink-60);
    max-width:500px;line-height:1.75;margin-bottom:56px;
    animation:fadeUp 0.7s 0.4s cubic-bezier(.22,.68,0,1) both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  /* ── ROLE CARDS ── */
  .na2-role-row {
    display:flex;gap:20px;flex-wrap:wrap;justify-content:center;
    position:relative;z-index:1;
    animation:fadeUp 0.8s 0.5s cubic-bezier(.22,.68,0,1) both;
  }
  .na2-role-card {
    width:230px;background:var(--white);
    border-radius:var(--radius-xl);padding:0 0 24px;
    cursor:pointer;position:relative;
    box-shadow:var(--shadow-card);
    border:1.5px solid rgba(0,0,0,0.05);
    transition:transform 0.4s cubic-bezier(.22,.68,0,1.15),box-shadow 0.4s,border-color 0.3s;
    overflow:hidden;
  }
  .na2-role-card:hover { transform:translateY(-12px) scale(1.02);box-shadow:var(--shadow-hover); }
  .na2-card-header {
    height:110px;display:flex;align-items:center;justify-content:center;
    position:relative;overflow:hidden;
  }
  .na2-card-header-bg { position:absolute;inset:0;background:var(--card-bg);opacity:0.1; }
  .na2-card-header-pattern {
    position:absolute;inset:0;
    background-image:
      linear-gradient(var(--card-color) 1px,transparent 1px),
      linear-gradient(90deg,var(--card-color) 1px,transparent 1px);
    background-size:22px 22px;
    opacity:0.07;
  }
  .na2-card-icon-3d {
    width:72px;height:72px;border-radius:20px;background:var(--card-color);
    display:flex;align-items:center;justify-content:center;
    position:relative;z-index:1;
    box-shadow:
      0 1px 0 rgba(255,255,255,0.45) inset,
      -2px -2px 6px rgba(255,255,255,0.2) inset,
      3px 3px 0 var(--card-side),
      0 6px 0 var(--card-bottom),
      0 12px 30px var(--card-shadow);
    transition:transform 0.4s cubic-bezier(.22,.68,0,1.2),box-shadow 0.4s;
  }
  .na2-card-icon-3d::before {
    content:'';position:absolute;inset:0;border-radius:20px;
    background:linear-gradient(145deg,rgba(255,255,255,0.35) 0%,transparent 55%);
    pointer-events:none;
  }
  .na2-role-card:hover .na2-card-icon-3d {
    transform:translateY(-8px) rotate(-5deg);
    box-shadow:
      0 1px 0 rgba(255,255,255,0.45) inset,
      -2px -2px 6px rgba(255,255,255,0.2) inset,
      3px 3px 0 var(--card-side),
      0 6px 0 var(--card-bottom),
      0 24px 40px var(--card-shadow);
  }
  .card-icon-svg {
    position:relative;z-index:1;
    transition:transform 0.3s;
    display:flex;align-items:center;justify-content:center;
  }
  .na2-role-card:hover .card-icon-svg { transform:scale(1.12); }

  .na2-card-accent {
    height:2px;border-radius:100px;background:var(--card-color);
    margin:0 22px 16px;
    transform:scaleX(0.25);transform-origin:left;
    transition:transform 0.45s cubic-bezier(.22,.68,0,1.2);opacity:0.4;
  }
  .na2-role-card:hover .na2-card-accent { transform:scaleX(1);opacity:1; }
  .na2-card-body { padding:0 22px 0; }
  .na2-card-body h3 {
    font-family:var(--font-display);font-size:16px;font-weight:700;
    color:var(--ink);margin-bottom:6px;letter-spacing:-0.3px;
  }
  .na2-card-body p { font-size:12.5px;color:var(--ink-30);line-height:1.6;margin-bottom:18px; }
  .na2-card-btn {
    width:100%;padding:11px 0;border-radius:12px;border:none;
    font-size:13px;font-weight:700;cursor:pointer;
    font-family:var(--font-body);letter-spacing:0.1px;
    display:flex;align-items:center;justify-content:center;gap:8px;
    transition:transform 0.2s,box-shadow 0.2s,filter 0.2s;
    position:relative;overflow:hidden;
  }
  .na2-card-btn:hover { transform:translateY(-2px);filter:brightness(1.06); }
  .na2-card-btn .btn-arrow { transition:transform 0.2s;display:flex;align-items:center; }
  .na2-card-btn:hover .btn-arrow { transform:translateX(4px); }

  .card-admin    { --card-color:#3d5af1;--card-side:#2342d4;--card-bottom:#1a33bb;--card-shadow:rgba(61,90,241,0.45);--card-bg:#3d5af1; }
  .card-recruiter{ --card-color:#0ea472;--card-side:#0a7a55;--card-bottom:#086644;--card-shadow:rgba(14,164,114,0.4);--card-bg:#0ea472; }
  .card-student  { --card-color:#f59e0b;--card-side:#d97706;--card-bottom:#b45309;--card-shadow:rgba(245,158,11,0.4);--card-bg:#f59e0b; }
  .btn-admin     { background:var(--blue);color:#fff; }
  .btn-recruiter { background:var(--green);color:#fff; }
  .btn-student   { background:var(--amber);color:#fff; }

  /* ── STATS ── */
  .na2-stats {
    background:var(--white);
    border-top:1px solid var(--border);border-bottom:1px solid var(--border);
    position:relative;z-index:1;
  }
  .na2-stats-inner {
    display:flex;justify-content:center;
    flex-wrap:wrap;padding:44px 0;
  }
  .na2-stat-item {
    display:flex;flex-direction:column;align-items:center;
    padding:0 60px;border-right:1px solid var(--border);
  }
  .na2-stat-item:last-child { border-right:none; }
  .na2-stat-num {
    font-family:var(--font-display);font-size:44px;font-weight:800;
    letter-spacing:-2.5px;line-height:1;color:var(--ink);margin-bottom:6px;
  }
  .na2-stat-num .accent { color:var(--blue); }
  .na2-stat-label { font-size:13px;color:var(--ink-30);font-weight:500; }

  /* ── WHY ── */
  .na2-why { padding:110px 48px;max-width:1200px;margin:0 auto;position:relative;z-index:1; }
  .na2-section-eyebrow {
    display:inline-flex;align-items:center;gap:8px;
    font-size:11px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;color:var(--blue);margin-bottom:16px;
  }
  .na2-section-eyebrow::before { content:'';width:20px;height:2px;background:var(--blue);border-radius:2px; }
  .na2-section-title {
    font-family:var(--font-display);
    font-size:clamp(28px,3.8vw,46px);font-weight:800;letter-spacing:-2px;
    color:var(--ink);max-width:560px;line-height:1.1;margin-bottom:60px;
  }
  .na2-why-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:16px; }
  .na2-why-card {
    background:var(--white);border:1.5px solid var(--border);
    border-radius:var(--radius-lg);padding:32px 26px;
    transition:transform 0.35s cubic-bezier(.22,.68,0,1.1),border-color 0.3s,box-shadow 0.35s;
    position:relative;overflow:hidden;
  }
  .na2-why-card::after {
    content:'';position:absolute;bottom:0;left:0;right:0;height:3px;
    background:var(--wa,var(--blue));
    transform:scaleX(0);transform-origin:left;
    transition:transform 0.4s cubic-bezier(.22,.68,0,1.2);
  }
  .na2-why-card:hover { transform:translateY(-6px);border-color:rgba(61,90,241,0.2);box-shadow:0 12px 40px rgba(61,90,241,0.08); }
  .na2-why-card:hover::after { transform:scaleX(1); }
  .na2-why-card:nth-child(1){--wa:var(--blue)}
  .na2-why-card:nth-child(2){--wa:var(--purple)}
  .na2-why-card:nth-child(3){--wa:var(--green)}
  .na2-why-card:nth-child(4){--wa:var(--amber)}
  .na2-why-icon {
    width:52px;height:52px;border-radius:14px;
    display:flex;align-items:center;justify-content:center;
    margin-bottom:20px;position:relative;overflow:hidden;
  }
  .na2-why-icon::before { content:'';position:absolute;inset:0;background:var(--ib);border-radius:inherit; }
  .na2-why-icon svg { position:relative;z-index:1; }
  .na2-why-icon-1{--ib:linear-gradient(135deg,rgba(61,90,241,0.12),rgba(61,90,241,0.05))}
  .na2-why-icon-2{--ib:linear-gradient(135deg,rgba(124,58,237,0.12),rgba(124,58,237,0.05))}
  .na2-why-icon-3{--ib:linear-gradient(135deg,rgba(14,164,114,0.12),rgba(14,164,114,0.05))}
  .na2-why-icon-4{--ib:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.05))}
  .na2-why-card h4 {
    font-family:var(--font-display);font-size:15px;font-weight:700;
    color:var(--ink);margin-bottom:10px;letter-spacing:-0.3px;
  }
  .na2-why-card p { font-size:13.5px;color:var(--ink-60);line-height:1.7; }

  /* ── FEATURES ── */
  .na2-features { padding:0 48px 110px;max-width:1200px;margin:0 auto;position:relative;z-index:1; }
  .na2-features-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:16px; }
  .na2-feat-card {
    background:var(--white);border:1.5px solid var(--border);
    border-radius:var(--radius-lg);padding:28px;
    transition:transform 0.35s cubic-bezier(.22,.68,0,1.1),border-color 0.3s,box-shadow 0.35s;
    position:relative;overflow:hidden;
  }
  .na2-feat-card:first-child { grid-column:span 2;display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center; }
  .na2-feat-card:hover { transform:translateY(-5px);border-color:rgba(61,90,241,0.2);box-shadow:0 12px 40px rgba(61,90,241,0.08); }

  .na2-feat-visual {
    height:160px;background:var(--blue-light);
    border-radius:var(--radius-md);
    display:flex;align-items:center;justify-content:center;
    position:relative;overflow:hidden;
  }
  .scan-bar {
    position:absolute;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,var(--blue),transparent);
    animation:scanAnim 2.5s linear infinite;
  }
  @keyframes scanAnim {
    from{top:0;opacity:0} 10%{opacity:1} 90%{opacity:1} to{top:100%;opacity:0}
  }
  .face-box {
    width:80px;height:80px;border:2px solid var(--blue);
    border-radius:8px;position:relative;
    animation:facePulse 2s ease-in-out infinite;
  }
  @keyframes facePulse {
    0%,100%{box-shadow:0 0 0 0 rgba(61,90,241,0.4)}
    50%{box-shadow:0 0 0 10px rgba(61,90,241,0)}
  }
  .face-box::before,.face-box::after {
    content:'';position:absolute;width:12px;height:12px;
    border-color:var(--blue);border-style:solid;
  }
  .face-box::before { top:-4px;left:-4px;border-width:2px 0 0 2px; }
  .face-box::after { bottom:-4px;right:-4px;border-width:0 2px 2px 0; }
  .face-center-dot {
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%);
    width:6px;height:6px;border-radius:50%;
    background:var(--blue);opacity:0.6;
  }

  .dot-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:10px;padding:20px; }
  .dot-grid span {
    width:6px;height:6px;border-radius:50%;background:var(--blue);display:block;
    animation:dotPop 1.5s ease-in-out infinite;
  }
  .dot-grid span:nth-child(odd){animation-delay:0.2s}
  .dot-grid span:nth-child(3n){animation-delay:0.4s;background:var(--purple)}
  @keyframes dotPop {
    0%,100%{opacity:0.2;transform:scale(0.7)} 50%{opacity:1;transform:scale(1.2)}
  }

  .bar-chart { display:flex;align-items:flex-end;gap:8px;height:80px;padding:0 10px; }
  .bar-item {
    flex:1;border-radius:4px 4px 0 0;
    background:linear-gradient(180deg,var(--green),rgba(14,164,114,0.3));
    animation:barGrow 1.5s cubic-bezier(.22,.68,0,1) both;
    transform-origin:bottom;
  }
  @keyframes barGrow { from{transform:scaleY(0);opacity:0} to{transform:scaleY(1);opacity:1} }

  /* Infra visual — animated rings */
  .infra-visual {
    width:100px;height:100px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    position:relative;flex-shrink:0;
  }
  .infra-ring {
    position:absolute;border-radius:50%;
    border:1.5px solid rgba(245,158,11,0.3);
    animation:ringPulse 2s ease-in-out infinite;
  }
  .infra-ring-1 { width:100%;height:100%;animation-delay:0s; }
  .infra-ring-2 { width:72%;height:72%;animation-delay:0.4s; }
  .infra-ring-3 { width:46%;height:46%;animation-delay:0.8s; }
  @keyframes ringPulse {
    0%,100%{opacity:0.3;transform:scale(1)}
    50%{opacity:1;transform:scale(1.05)}
  }
  .infra-center {
    width:42px;height:42px;border-radius:50%;
    background:linear-gradient(135deg,#fef3c7,#fde68a);
    display:flex;align-items:center;justify-content:center;
    position:relative;z-index:1;
    box-shadow:0 4px 12px rgba(245,158,11,0.3);
  }

  .na2-feat-content h3 {
    font-family:var(--font-display);font-size:20px;font-weight:800;
    color:var(--ink);letter-spacing:-0.5px;margin-bottom:10px;
  }
  .na2-feat-content p { font-size:14px;color:var(--ink-60);line-height:1.7;margin-bottom:16px; }
  .na2-feat-tag {
    display:inline-flex;align-items:center;gap:6px;
    font-size:11px;font-weight:700;letter-spacing:0.4px;
    padding:5px 12px;border-radius:100px;
    background:var(--blue-light);color:var(--blue);border:1px solid var(--blue-mid);
  }
  .na2-feat-tag svg { flex-shrink:0; }

  /* ── CTA ── */
  .na2-cta {
    margin:0 32px 32px;border-radius:28px;
    background:linear-gradient(135deg,#0c0f1a 0%,#1a1f3a 100%);
    padding:100px 48px;text-align:center;
    position:relative;overflow:hidden;z-index:1;
  }
  .na2-cta-glow {
    position:absolute;inset:0;
    background:
      radial-gradient(ellipse 50% 60% at 20% 50%,rgba(61,90,241,0.2) 0%,transparent 60%),
      radial-gradient(ellipse 40% 50% at 80% 50%,rgba(124,58,237,0.14) 0%,transparent 60%);
    pointer-events:none;
  }
  .na2-cta-dots {
    position:absolute;inset:0;
    background-image:radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px);
    background-size:28px 28px;pointer-events:none;
  }
  .na2-cta h2 {
    font-family:var(--font-display);font-size:clamp(30px,4vw,52px);
    font-weight:800;letter-spacing:-2px;color:#fff;margin-bottom:16px;
    position:relative;z-index:1;
  }
  .na2-cta h2 span {
    background:linear-gradient(135deg,#7ca8ff,#c084fc);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .na2-cta > p { font-size:16px;color:rgba(255,255,255,0.42);margin-bottom:44px;position:relative;z-index:1; }
  .na2-cta-btns { display:flex;gap:12px;justify-content:center;position:relative;z-index:1; }
  .na2-btn-prim {
    display:flex;align-items:center;gap:8px;
    background:linear-gradient(135deg,var(--blue),var(--purple));
    color:#fff;border:none;padding:14px 32px;border-radius:12px;
    font-size:15px;font-weight:700;cursor:pointer;
    font-family:var(--font-body);
    transition:transform 0.2s,box-shadow 0.2s;
    box-shadow:0 4px 20px rgba(61,90,241,0.4);
  }
  .na2-btn-prim:hover { transform:translateY(-2px);box-shadow:0 8px 32px rgba(61,90,241,0.5); }
  .na2-btn-prim .prim-arrow { transition:transform 0.2s;display:flex;align-items:center; }
  .na2-btn-prim:hover .prim-arrow { transform:translateX(4px); }
  .na2-btn-ghost {
    background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);
    border:1px solid rgba(255,255,255,0.12);padding:14px 32px;border-radius:12px;
    font-size:15px;font-weight:500;cursor:pointer;
    font-family:var(--font-body);
    transition:background 0.2s,border-color 0.2s,color 0.2s;backdrop-filter:blur(8px);
  }
  .na2-btn-ghost:hover { background:rgba(255,255,255,0.13);border-color:rgba(255,255,255,0.25);color:#fff; }

  /* ── FOOTER ── */
  .na2-footer {
    background:var(--white);border-top:1px solid var(--border);
    padding:28px 48px;display:flex;align-items:center;justify-content:space-between;
    position:relative;z-index:1;
  }
  .na2-footer-logo {
    font-family:var(--font-display);font-weight:700;font-size:14px;
    color:var(--ink-30);display:flex;align-items:center;gap:8px;
  }
  .na2-footer-mark {
    width:20px;height:20px;
    background:linear-gradient(135deg,#3d5af1,#7c3aed);
    border-radius:6px;display:flex;align-items:center;justify-content:center;
  }
  .na2-footer p { font-size:13px;color:var(--ink-30); }

  /* ── SCROLL REVEAL ── */
  .reveal { opacity:0;transform:translateY(30px);transition:opacity 0.7s cubic-bezier(.22,.68,0,1),transform 0.7s cubic-bezier(.22,.68,0,1); }
  .reveal.visible { opacity:1;transform:translateY(0); }
  .reveal-delay-1{transition-delay:0.1s}
  .reveal-delay-2{transition-delay:0.2s}
  .reveal-delay-3{transition-delay:0.3s}
  .reveal-delay-4{transition-delay:0.4s}

  @media (max-width:900px) {
    .na2-nav{padding:0 24px}.na2-nav-links{display:none}
    .na2-why{padding:60px 24px}.na2-why-grid{grid-template-columns:repeat(2,1fr)}
    .na2-features{padding:0 24px 80px}.na2-features-grid{grid-template-columns:1fr}
    .na2-feat-card:first-child{grid-column:span 1;grid-template-columns:1fr}
    .na2-stats-inner{flex-wrap:wrap}
    .na2-stat-item{padding:24px 32px;border-right:none;border-bottom:1px solid var(--border);width:50%}
    .na2-cta{margin:0 16px 16px;padding:80px 24px}
    .na2-footer{flex-direction:column;gap:12px;text-align:center;padding:24px}
  }
  @media (max-width:600px) {
    .na2-why-grid{grid-template-columns:1fr}
    .na2-role-row{flex-direction:column;align-items:center}
    .na2-hero-headline{letter-spacing:-2px}
    .na2-cta-btns{flex-direction:column;align-items:center}
  }
`;

/* ─────────────────────────────────────────────
   FLOATING PARTICLES CANVAS
───────────────────────────────────────────── */
function FloatingParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.35 + 0.08,
      color: ["61,90,241", "124,58,237", "14,164,114"][Math.floor(Math.random() * 3)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(61,90,241,${0.035 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="na2-canvas-bg" />;
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const dur = 1600, step = 16;
        const inc = target / (dur / step);
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + inc, target);
          setVal(target < 10 ? parseFloat(cur.toFixed(1)) : Math.round(cur));
          if (cur >= target) clearInterval(t);
        }, step);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{target < 10 ? val.toFixed(1) : val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  useScrollReveal();

  // ✅ useNavigate instead of window.location.href
  const navigate = useNavigate();
  const go = (path) => navigate(path);

  const roles = [
    {
      cls: "card-admin", btnCls: "btn-admin", btnText: "Admin Login", path: "/login?role=admin",
      label: "Admin", desc: "Create exams, configure rules, and generate detailed reports.",
      icon: <IconShield size={28} color="#fff" />,
    },
    {
      cls: "card-recruiter", btnCls: "btn-recruiter", btnText: "Recruiter Login", path: "/login?role=recruiter",
      label: "Recruiter", desc: "Browse candidate results and shortlist top performers.",
      icon: <IconBriefcase size={28} color="#fff" />,
    },
    {
      cls: "card-student", btnCls: "btn-student", btnText: "Student Login", path: "/login?role=student",
      label: "Student", desc: "Access your assigned exams and submit securely.",
      icon: <IconGradCap size={28} color="#fff" />,
    },
  ];

  const whyCards = [
    { cls: "na2-why-icon-1", color: "#3d5af1", icon: <IconLock size={22} color="#3d5af1" />, title: "Zero Compromise Security", body: "Lock-down browser prevents tab switching, copy-paste, and unauthorized access throughout every exam session." },
    { cls: "na2-why-icon-2", color: "#7c3aed", icon: <IconCpu size={22} color="#7c3aed" />, title: "AI Proctoring Engine", body: "Real-time face detection and behavior tracking flags anomalies automatically, keeping integrity protected." },
    { cls: "na2-why-icon-3", color: "#0ea472", icon: <IconMonitor size={22} color="#0ea472" />, title: "Live Candidate Monitoring", body: "Admins see every candidate's status, webcam feed, and flagged events on a live dashboard as they happen." },
    { cls: "na2-why-icon-4", color: "#f59e0b", icon: <IconZap size={22} color="#f59e0b" />, title: "Scales Effortlessly", body: "Cloud-native infrastructure handles thousands of simultaneous candidates with consistent performance and zero downtime." },
  ];

  const stats = [
    { target: 50000, suffix: "+", label: "Candidates Assessed" },
    { target: 1200, suffix: "+", label: "Active Organizations" },
    { target: 99.9, suffix: "%", label: "Uptime SLA" },
    { target: 4, suffix: "M+", label: "Questions Delivered" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="na2-root">
        <FloatingParticles />
        <div className="na2-orbs">
          <div className="na2-orb na2-orb-1" />
          <div className="na2-orb na2-orb-2" />
          <div className="na2-orb na2-orb-3" />
          <div className="na2-orb na2-orb-4" />
        </div>

        {/* ── NAVBAR ── */}
        <nav className="na2-nav">
          <div className="na2-logo">
            <div className="na2-logo-mark">
              <span className="na2-logo-mark-icon"><IconHexagon size={15} /></span>
            </div>
            NeuroAssess
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="na2-hero">
          <div className="na2-hero-pill">
            <span className="na2-pill-badge">New</span>
            <span className="na2-pill-text">AI-Powered Examination Platform</span>
          </div>
          <h1 className="na2-hero-headline">
            Exams that are<br />
            <span className="grad">Secure. Smart. Fair.</span>
          </h1>

          {/* Role cards */}
          <div className="na2-role-row">
            {roles.map(({ cls, icon, label, desc, btnCls, btnText, path }) => (
              <div key={label} className={`na2-role-card ${cls}`}>
                <div className="na2-card-header">
                  <div className="na2-card-header-bg" />
                  <div className="na2-card-header-pattern" />
                  <div className="na2-card-icon-3d">
                    <span className="card-icon-svg">{icon}</span>
                  </div>
                </div>
                <div className="na2-card-accent" />
                <div className="na2-card-body">
                  <h3>{label}</h3>
                  <p>{desc}</p>
                  {/* ✅ Calls go(path) which uses useNavigate */}
                  <button className={`na2-card-btn ${btnCls}`} onClick={() => go(path)}>
                    {btnText}
                    <span className="btn-arrow"><IconArrowRight size={13} color="#fff" /></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY ── */}
        <section className="na2-why">
          <div className="reveal na2-section-eyebrow">Why NeuroAssess</div>
          <h2 className="reveal na2-section-title">Built for the future of fair assessment</h2>
          <div className="na2-why-grid">
            {whyCards.map(({ cls, icon, title, body }, i) => (
              <div key={title} className={`na2-why-card reveal reveal-delay-${i + 1}`}>
                <div className={`na2-why-icon ${cls}`}>{icon}</div>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="na2-features">
          <div className="reveal na2-section-eyebrow">Platform Features</div>
          <h2 className="reveal na2-section-title" style={{ marginBottom: 36 }}>Everything you need, nothing you don't</h2>
          <div className="na2-features-grid">

            {/* AI Proctoring — wide */}
            <div className="na2-feat-card reveal">
              <div className="na2-feat-visual">
                <div className="scan-bar" />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div className="face-box">
                    <div className="face-center-dot" />
                  </div>
                </div>
              </div>
              <div className="na2-feat-content">
                <h3>AI Proctoring</h3>
                <p>Our computer vision model continuously monitors each candidate's webcam feed, flagging suspicious behavior such as looking away, multiple faces, or device switching — all in real time.</p>
                <span className="na2-feat-tag">
                  <IconEye size={11} color="#3d5af1" strokeWidth={2.5} />
                  Core Feature
                </span>
              </div>
            </div>

            {/* Secure Browser */}
            <div className="na2-feat-card reveal reveal-delay-1">
              <div className="na2-feat-visual" style={{ background: "#f3f0ff", height: 130 }}>
                <div className="dot-grid">
                  {Array.from({ length: 25 }, (_, i) => <span key={i} />)}
                </div>
              </div>
              <div className="na2-feat-content" style={{ marginTop: 20 }}>
                <h3>Secure Browser</h3>
                <p>Candidates are locked into a controlled environment that prevents external resource access, copy-paste, and screen sharing.</p>
                <span className="na2-feat-tag" style={{ background: "#f3f0ff", color: "#7c3aed", borderColor: "#d8cfff" }}>
                  <IconLock size={11} color="#7c3aed" strokeWidth={2.5} />
                  Security
                </span>
              </div>
            </div>

            {/* Smart Reporting */}
            <div className="na2-feat-card reveal reveal-delay-2">
              <div className="na2-feat-visual" style={{ background: "#f0faf6", height: 130 }}>
                <div className="bar-chart">
                  {[55, 80, 40, 95, 70, 60, 85].map((h, i) => (
                    <div key={i} className="bar-item" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
              <div className="na2-feat-content" style={{ marginTop: 20 }}>
                <h3>Smart Reporting</h3>
                <p>Auto-generated analytics with score distributions, integrity flags, time-per-question, and recruiter-ready export formats.</p>
                <span className="na2-feat-tag" style={{ background: "#e6f7f1", color: "#0ea472", borderColor: "#a7e6d0" }}>
                  <IconBarChart size={11} color="#0ea472" strokeWidth={2.5} />
                  Analytics
                </span>
              </div>
            </div>

            {/* Fast & Reliable — wide */}
            <div className="na2-feat-card reveal reveal-delay-3" style={{ gridColumn: "span 2" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
                <div className="na2-feat-content" style={{ flex: 1 }}>
                  <h3>Fast &amp; Reliable</h3>
                  <p>99.9% uptime SLA backed by multi-region cloud deployment. Auto-scales to any load without manual intervention — no matter how many candidates join simultaneously.</p>
                  <span className="na2-feat-tag" style={{ background: "#fef3c7", color: "#d97706", borderColor: "#fde68a" }}>
                    <IconZap size={11} color="#d97706" strokeWidth={2.5} />
                    Infrastructure
                  </span>
                </div>
                <div className="infra-visual">
                  <div className="infra-ring infra-ring-1" />
                  <div className="infra-ring infra-ring-2" />
                  <div className="infra-ring infra-ring-3" />
                  <div className="infra-center">
                    <IconZap size={18} color="#d97706" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="na2-footer">
          <div className="na2-footer-logo">
            <div className="na2-footer-mark">
              <IconHexagon size={10} />
            </div>
            NeuroAssess
          </div>
          <p>© 2026 NeuroAssess — Secure Online Examination Platform</p>
        </footer>
      </div>
    </>
  );
}