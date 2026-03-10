import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ToastContainer from '../components/Toast';

const reportData = [
  { id: 1, name: 'Priya Sharma', exam: 'Java Backend Assessment', mcq: 82, coding: 75, final: 79, result: 'Pass' },
  { id: 2, name: 'Rahul Verma', exam: 'Python Data Science Test', mcq: 45, coding: 30, final: 38, result: 'Fail' },
  { id: 3, name: 'Anjali Nair', exam: 'SQL Database Fundamentals', mcq: 90, coding: 88, final: 89, result: 'Pass' },
  { id: 4, name: 'Sneha Reddy', exam: 'Java Backend Assessment', mcq: 72, coding: 68, final: 70, result: 'Pass' },
  { id: 5, name: 'Anil Kumar', exam: 'C++ Systems Programming', mcq: 40, coding: 35, final: 38, result: 'Fail' },
  { id: 6, name: 'Divya Pillai', exam: 'Python Data Science Test', mcq: 88, coding: 92, final: 90, result: 'Pass' },
  { id: 7, name: 'Suresh Babu', exam: 'SQL Database Fundamentals', mcq: 55, coding: 48, final: 52, result: 'Fail' },
  { id: 8, name: 'Meena Iyer', exam: 'Java Backend Assessment', mcq: 78, coding: 80, final: 79, result: 'Pass' },
  { id: 9, name: 'Vikram Singh', exam: 'Full Stack Developer Cert', mcq: 42, coding: 38, final: 40, result: 'Fail' },
  { id: 10, name: 'Karan Mehta', exam: 'Full Stack Developer Cert', mcq: 85, coding: 78, final: 82, result: 'Pass' },
];

export default function Reports() {
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState('All');
  const [filterExam, setFilterExam] = useState('All');

  const exams = [...new Set(reportData.map(r => r.exam))];

  const filtered = reportData.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(q) || r.exam.toLowerCase().includes(q);
    const matchResult = filterResult === 'All' || r.result === filterResult;
    const matchExam = filterExam === 'All' || r.exam === filterExam;
    return matchSearch && matchResult && matchExam;
  });

  const passCount = filtered.filter(r => r.result === 'Pass').length;
  const failCount = filtered.filter(r => r.result === 'Fail').length;
  const avgFinal = filtered.length > 0
    ? (filtered.reduce((a, r) => a + r.final, 0) / filtered.length).toFixed(1)
    : 0;

  const handleExport = () => {
    const headers = ['Name', 'Exam', 'MCQ Score', 'Coding Score', 'Final Score', 'Result'];
    const rows = filtered.map(r => [r.name, r.exam, r.mcq, r.coding, r.final, r.result]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginLeft: '230px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Sidebar />
      <Navbar />
      <main style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports</h1>
          <p>Exam results and performance analytics</p>
        </div>
        <button className="btn btn-success" onClick={handleExport}>
          ⬇ Export CSV
        </button>
      </div>

      <div className="stat-cards-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card stat-card-accent">
          <div className="stat-card-label">Total Records</div>
          <div className="stat-card-value">{filtered.length}</div>
        </div>
        <div className="stat-card stat-card-accent-green">
          <div className="stat-card-label">Passed</div>
          <div className="stat-card-value">{passCount}</div>
          <div className="stat-card-desc">{filtered.length ? ((passCount / filtered.length) * 100).toFixed(0) : 0}% pass rate</div>
        </div>
        <div className="stat-card stat-card-accent-red">
          <div className="stat-card-label">Failed</div>
          <div className="stat-card-value">{failCount}</div>
        </div>
        <div className="stat-card stat-card-accent">
          <div className="stat-card-label">Average Score</div>
          <div className="stat-card-value">{avgFinal}</div>
          <div className="stat-card-desc">Out of 100</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="panel-title">Exam Results</span>
          <div style={{ display: 'flex', gap: 10, marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div className="search-bar">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ fontSize: 12, padding: '6px 10px' }} value={filterExam} onChange={e => setFilterExam(e.target.value)}>
              <option value="All">All Exams</option>
              {exams.map(e => <option key={e}>{e}</option>)}
            </select>
            <select className="form-select" style={{ fontSize: 12, padding: '6px 10px' }} value={filterResult} onChange={e => setFilterResult(e.target.value)}>
              <option value="All">Pass & Fail</option>
              <option>Pass</option>
              <option>Fail</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate Name</th>
                <th>Exam</th>
                <th>MCQ Score</th>
                <th>Coding Score</th>
                <th>Final Score</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{r.name}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{r.exam}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${r.mcq}%`, height: '100%', background: r.mcq >= 60 ? '#16a34a' : '#dc2626', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.mcq}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${r.coding}%`, height: '100%', background: r.coding >= 60 ? '#16a34a' : '#dc2626', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.coding}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14,
                      color: r.final >= 60 ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                      {r.final}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${r.result === 'Pass' ? 'badge-green' : 'badge-red'}`}>
                      {r.result === 'Pass' ? '✓ Pass' : '✗ Fail'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
