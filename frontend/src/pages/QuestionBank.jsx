import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ToastContainer from '../components/Toast';
import { useApp } from '../context/AppContext';

function AddQuestionModal({ onClose, onSave }) {
  const [form, setForm] = useState({ type: 'MCQ', difficulty: 'Medium', topic: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>Add Question</h2>
          <button className="icon-btn" onClick={onClose}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label required">Topic / Title</label>
              <input className="form-input" placeholder="e.g. Binary Search Trees" value={form.topic} onChange={e => set('topic', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Question Type</label>
                <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>MCQ</option>
                  <option>Coding</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select className="form-select" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
              </div>
            </div>
            {form.type === 'MCQ' && (
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea className="form-input" rows={3} placeholder="Enter your MCQ question..." />
              </div>
            )}
            {form.type === 'Coding' && (
              <div className="form-group">
                <label className="form-label">Problem Statement</label>
                <textarea className="code-editor-area" rows={4} placeholder="Describe the coding problem..." />
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!form.topic.trim()) return alert('Please enter a topic/title');
              onSave(form);
            }}
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuestionBank() {
  const { questions, addQuestion, deleteQuestion } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  const filtered = questions.filter(q => {
    const matchSearch = q.topic?.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || q.type === filterType;
    const matchDiff = filterDiff === 'All' || q.difficulty === filterDiff;
    return matchSearch && matchType && matchDiff;
  });

  return (
    <div style={{ marginLeft: '230px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Sidebar />
      <Navbar />
      <main style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Question Bank</h1>
          <p>{questions.length} questions total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Question
        </button>
      </div>

      <div className="panel">
        <div className="panel-header" style={{ gap: 12, flexWrap: 'wrap' }}>
          <span className="panel-title">All Questions</span>
          <div style={{ display: 'flex', gap: 10, marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ width: 200 }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ fontSize: 12, padding: '6px 10px' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option>MCQ</option>
              <option>Coding</option>
            </select>
            <select className="form-select" style={{ fontSize: 12, padding: '6px 10px' }} value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
              <option value="All">All Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Question ID</th>
                <th>Topic</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-state-icon">🔍</div>
                      No questions found.
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(q => (
                  <tr key={q.id}>
                    <td><span className="tag">{q.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{q.topic || '—'}</td>
                    <td>
                      <span className={`badge ${q.type === 'MCQ' ? 'badge-blue' : 'badge-yellow'}`}>{q.type}</span>
                    </td>
                    <td>
                      <span className={`badge ${q.difficulty === 'Hard' ? 'badge-red' : q.difficulty === 'Medium' ? 'badge-yellow' : 'badge-green'}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{q.createdDate}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm">Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteQuestion(q.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddQuestionModal
          onClose={() => setShowModal(false)}
          onSave={(q) => {
            addQuestion(q);
            setShowModal(false);
          }}
        />
      )}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
