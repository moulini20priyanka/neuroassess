import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EXAM_TYPES = {
  SKILL_CERTIFICATE: "Skill Certificate",
  PLACEMENT: "Placement"
};

const SIDEBAR_MENU = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "candidates", label: "Candidates", icon: "👥" },
  { id: "reports", label: "Reports", icon: "📈" },
  { id: "exam-requests", label: "Exam Requests", icon: "📋" }
];

// Detailed Reports Data
const DETAILED_REPORTS = [
  {
    examName: "Skill Certificate",
    totalQuestions: 50,
    duration: "120 mins",
    difficulty: "Intermediate",
    avgScore: 78.5,
    passRate: 85,
    topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
    questionsBreakdown: [
      { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
      { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
      { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
      { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
    ],
    completionTime: "98 mins",
    topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
    commonMistakes: ["Event handling", "State management"]
  },
  {
    examName: "Placement",
    totalQuestions: 45,
    duration: "110 mins",
    difficulty: "Advanced",
    avgScore: 72.3,
    passRate: 75,
    topics: ["Node.js", "Express", "MongoDB", "APIs"],
    questionsBreakdown: [
      { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
      { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
      { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
      { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
    ],
    completionTime: "105 mins",
    topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
    commonMistakes: ["Async/await patterns", "Middleware implementation"]
  }
];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [analysisReports, setAnalysisReports] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState(70);
  const [selectedExamType, setSelectedExamType] = useState("ALL");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examRequestForm, setExamRequestForm] = useState({
    jobRole: "",
    assessmentPattern: "",
    duration: "",
    specifications: ""
  });
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);
  const [selectedDashboardReportIndex, setSelectedDashboardReportIndex] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    qualified: 0,
    notQualified: 0,
    byExamType: {}
  });

  // Mock data - Replace with API call later
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        studentName: "Raj Kumar",
        email: "raj@example.com",
        examType: EXAM_TYPES.SKILL_CERTIFICATE,
        marks: 85,
        totalMarks: 100,
        percentage: 85,
        status: "Completed"
      },
      {
        id: 2,
        studentName: "Priya Singh",
        email: "priya@example.com",
        examType: EXAM_TYPES.PLACEMENT,
        marks: 78,
        totalMarks: 100,
        percentage: 78,
        status: "Completed"
      },
      {
        id: 3,
        studentName: "Amit Patel",
        email: "amit@example.com",
        examType: EXAM_TYPES.PLACEMENT,
        marks: 92,
        totalMarks: 100,
        percentage: 92,
        status: "Completed"
      },
      {
        id: 4,
        studentName: "Anjali Verma",
        email: "anjali@example.com",
        examType: EXAM_TYPES.SKILL_CERTIFICATE,
        marks: 65,
        totalMarks: 100,
        percentage: 65,
        status: "Completed"
      },
      {
        id: 5,
        studentName: "Vikram Singh",
        email: "vikram@example.com",
        examType: EXAM_TYPES.SKILL_CERTIFICATE,
        marks: 88,
        totalMarks: 100,
        percentage: 88,
        status: "Completed"
      },
      {
        id: 6,
        studentName: "Neha Gupta",
        email: "neha@example.com",
        examType: EXAM_TYPES.PLACEMENT,
        marks: 75,
        totalMarks: 100,
        percentage: 75,
        status: "Completed"
      }
    ];
    
    setAnalysisReports(mockReports);
  }, []);

  // Filter and calculate statistics
  useEffect(() => {
    let filtered = analysisReports;

    // Filter by exam type
    if (selectedExamType !== "ALL") {
      filtered = filtered.filter(report => report.examType === selectedExamType);
    }

    // Filter by criteria (percentage)
    const qualified = filtered.filter(report => report.percentage >= selectedCriteria);
    const notQualified = filtered.filter(report => report.percentage < selectedCriteria);

    setFilteredStudents({
      qualified,
      notQualified
    });

    // Calculate statistics
    const byExamType = {};
    Object.values(EXAM_TYPES).forEach(type => {
      const typeReports = analysisReports.filter(r => r.examType === type);
      byExamType[type] = {
        total: typeReports.length,
        qualified: typeReports.filter(r => r.percentage >= selectedCriteria).length,
        avg: typeReports.length > 0 
          ? (typeReports.reduce((sum, r) => sum + r.percentage, 0) / typeReports.length).toFixed(2)
          : 0
      };
    });

    setDashboardStats({
      totalStudents: analysisReports.length,
      qualified: qualified.length,
      notQualified: notQualified.length,
      byExamType
    });
  }, [analysisReports, selectedCriteria, selectedExamType]);

  return (
    <div style={styles.mainContainer}>
      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        ...(!sidebarOpen && { position: "absolute", zIndex: 999 })
      }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <div style={styles.logoBadge}>NA</div>
            <div style={styles.logoText}>
              <h3 style={styles.logoTitle}>NeuroAssess</h3>
              <p style={styles.logoSubtitle}>Recruiter Portal</p>
            </div>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          <p style={styles.navSectionTitle}>MAIN</p>
          {SIDEBAR_MENU.map(item => (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(activeMenu === item.id && styles.navItemActive)
              }}
              onClick={() => setActiveMenu(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <button
            style={styles.logoutButton}
            onClick={() => navigate("/")}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          style={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        {/* Top Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.menuToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>Overview of your ongoing recruitment drives and candidates</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.welcomeText}>Welcome, Jane Doe</div>
          </div>
        </header>

        {/* Main Content Area */}
        <div style={styles.content}>
          {/* Dashboard View */}
          {activeMenu === "dashboard" && (
            <>
              {selectedDashboardReportIndex !== null ? (
                // Detailed Dashboard Report View
                <div>
                  <button
                    style={styles.backBtn}
                    onClick={() => setSelectedDashboardReportIndex(null)}
                  >
                    ← Back to Dashboard
                  </button>

                  <div style={styles.detailedReportCard}>
                    <div style={styles.reportHeader}>
                      <div>
                        <h4 style={styles.reportTitle}>{DETAILED_REPORTS[selectedDashboardReportIndex]?.examName}</h4>
                        <p style={styles.reportMeta}>
                          {DETAILED_REPORTS[selectedDashboardReportIndex]?.totalQuestions} Questions | {DETAILED_REPORTS[selectedDashboardReportIndex]?.duration} | {DETAILED_REPORTS[selectedDashboardReportIndex]?.difficulty}
                        </p>
                      </div>
                      <div style={styles.reportStats}>
                        <div style={styles.reportStat}>
                          <span style={styles.reportStatLabel}>Avg Score</span>
                          <span style={styles.reportStatValue}>{DETAILED_REPORTS[selectedDashboardReportIndex]?.avgScore}%</span>
                        </div>
                        <div style={styles.reportStat}>
                          <span style={styles.reportStatLabel}>Pass Rate</span>
                          <span style={{ ...styles.reportStatValue, color: "#10b981" }}>{DETAILED_REPORTS[selectedDashboardReportIndex]?.passRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.reportBody}>
                      {/* Topics */}
                      <div style={styles.reportSection}>
                        <h5 style={styles.reportSectionTitle}>Topics Covered</h5>
                        <div style={styles.topicsList}>
                          {DETAILED_REPORTS[selectedDashboardReportIndex]?.topics.map((topic, i) => (
                            <span key={i} style={styles.topicTag}>{topic}</span>
                          ))}
                        </div>
                      </div>

                      {/* Questions Breakdown */}
                      <div style={styles.reportSection}>
                        <h5 style={styles.reportSectionTitle}>Performance by Topic</h5>
                        {DETAILED_REPORTS[selectedDashboardReportIndex]?.questionsBreakdown.map((item, i) => (
                          <div key={i} style={styles.breakdownItem}>
                            <div style={styles.breakdownLabel}>
                              <span style={styles.breakdownTopic}>{item.topic}</span>
                              <span style={styles.breakdownScore}>{item.correct}/{item.total}</span>
                            </div>
                            <div style={styles.progressBar}>
                              <div style={{
                                ...styles.progressFill,
                                width: `${item.percentage}%`,
                                backgroundColor: item.percentage >= 85 ? "#10b981" : item.percentage >= 70 ? "#3b82f6" : "#ef4444"
                              }}></div>
                            </div>
                            <span style={styles.percentageText}>{item.percentage}%</span>
                          </div>
                        ))}
                      </div>

                      {/* Top Performers */}
                      <div style={styles.reportSection}>
                        <h5 style={styles.reportSectionTitle}>Top Performers</h5>
                        <ul style={styles.performersList}>
                          {DETAILED_REPORTS[selectedDashboardReportIndex]?.topPerformers.map((performer, i) => (
                            <li key={i} style={styles.performerItem}>🏆 {performer}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Common Mistakes */}
                      <div style={styles.reportSection}>
                        <h5 style={styles.reportSectionTitle}>Common Mistakes</h5>
                        <ul style={styles.mistakesList}>
                          {DETAILED_REPORTS[selectedDashboardReportIndex]?.commonMistakes.map((mistake, i) => (
                            <li key={i} style={styles.mistakeItem}>⚠️ {mistake}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Quick Stats */}
                      <div style={styles.quickStatsRow}>
                        <div style={styles.quickStat}>
                          <span style={styles.quickStatLabel}>Completion Time</span>
                          <span style={styles.quickStatValue}>{DETAILED_REPORTS[selectedDashboardReportIndex]?.completionTime}</span>
                        </div>
                        <div style={styles.quickStat}>
                          <span style={styles.quickStatLabel}>Avg Duration</span>
                          <span style={styles.quickStatValue}>{DETAILED_REPORTS[selectedDashboardReportIndex]?.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.reportFooter}>
                      <button style={styles.reportBtn}>📥 Download Full Report</button>
                      <button style={{ ...styles.reportBtn, backgroundColor: "#6b7280" }}>📤 Share Report</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Criteria & Filter Section */}
                  <div style={styles.filterSection}>
                    <div style={styles.filterCard}>
                      <label style={styles.label}>Qualification Criteria</label>
                      <div style={styles.criteriaButtons}>
                        {[70, 75, 80].map(criteria => (
                          <button
                            key={criteria}
                            style={{
                              ...styles.criteriaBtn,
                              ...{
                                backgroundColor: selectedCriteria === criteria ? "#3b82f6" : "#e5e7eb",
                                color: selectedCriteria === criteria ? "#fff" : "#374151"
                              }
                            }}
                            onClick={() => setSelectedCriteria(criteria)}
                          >
                            {criteria}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={styles.filterCard}>
                      <label style={styles.label}>Filter by Exam Type</label>
                      <select
                        style={styles.select}
                        value={selectedExamType}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                      >
                        <option value="ALL">All Exams</option>
                        {Object.values(EXAM_TYPES).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Statistics Cards */}
                  <div style={styles.statsGrid}>
                    <div style={{ ...styles.statCard, borderLeftColor: "#3b82f6" }}>
                      <div style={styles.statCardContent}>
                        <p style={styles.statLabel}>Total Assessed</p>
                        <h2 style={{ ...styles.statValue, color: "#3b82f6" }}>
                          {dashboardStats.totalStudents}
                        </h2>
                      </div>
                      <div style={styles.statIcon}>📊</div>
                    </div>

                    <div style={{ ...styles.statCard, borderLeftColor: "#10b981" }}>
                      <div style={styles.statCardContent}>
                        <p style={styles.statLabel}>Shortlisted Candidates</p>
                        <h2 style={{ ...styles.statValue, color: "#10b981" }}>
                          {dashboardStats.qualified}
                        </h2>
                      </div>
                      <div style={styles.statIcon}>✓</div>
                    </div>

                    <div style={{ ...styles.statCard, borderLeftColor: "#f59e0b" }}>
                      <div style={styles.statCardContent}>
                        <p style={styles.statLabel}>Pending Interviews</p>
                        <h2 style={{ ...styles.statValue, color: "#f59e0b" }}>
                          {dashboardStats.notQualified}
                        </h2>
                      </div>
                      <div style={styles.statIcon}>⏱️</div>
                    </div>
                  </div>

                  {/* Exam Type Statistics */}
                  <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Statistics by Exam Type</h2>
                    <div style={styles.examStatsGrid}>
                      {Object.entries(dashboardStats.byExamType).map(([type, stats], idx) => (
                        <div key={type} style={styles.examStatCard}>
                          <h4 style={styles.examTypeTitle}>{type}</h4>
                          <div style={styles.examStatDetail}>
                            <span>Total</span>
                            <span style={styles.statBold}>{stats.total}</span>
                          </div>
                          <div style={styles.examStatDetail}>
                            <span>Qualified</span>
                            <span style={{ ...styles.statBold, color: "#10b981" }}>{stats.qualified}</span>
                          </div>
                          <div style={styles.examStatDetail}>
                            <span>Average</span>
                            <span style={styles.statBold}>{stats.avg}%</span>
                          </div>
                          <button 
                            style={styles.viewReportBtn}
                            onClick={() => setSelectedDashboardReportIndex(idx)}
                          >
                            View Detailed Report
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Recent Activity</h2>
                    <div style={styles.activityList}>
                      {[
                        { text: "Exam request 'Frontend Engineer' approved by Admin.", time: "2 hours ago" },
                        { text: "15 new candidates completed the 'Backend Node.js' assessment.", time: "5 hours ago" },
                        { text: "Interview scheduled with candidate Alex Johnson for tomorrow.", time: "1 day ago" }
                      ].map((activity, idx) => (
                        <div key={idx} style={styles.activityItem}>
                          <div style={styles.activityDot}></div>
                          <div style={styles.activityContent}>
                            <p style={styles.activityText}>{activity.text}</p>
                            <span style={styles.activityTime}>{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Candidates & Reports View */}
          {activeMenu === "candidates" && (
            <>
              <div style={styles.filterSection}>
                <div style={styles.filterCard}>
                  <label style={styles.label}>Qualification Criteria</label>
                  <div style={styles.criteriaButtons}>
                    {[70, 75, 80].map(criteria => (
                      <button
                        key={criteria}
                        style={{
                          ...styles.criteriaBtn,
                          ...{
                            backgroundColor: selectedCriteria === criteria ? "#3b82f6" : "#e5e7eb",
                            color: selectedCriteria === criteria ? "#fff" : "#374151"
                          }
                        }}
                        onClick={() => setSelectedCriteria(criteria)}
                      >
                        {criteria}%
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.filterCard}>
                  <label style={styles.label}>Filter by Exam Type</label>
                  <select
                    style={styles.select}
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                  >
                    <option value="ALL">All Exams</option>
                    {Object.values(EXAM_TYPES).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Candidates Summary */}
              <div style={styles.statsGrid}>
                <div style={{ ...styles.statCard, borderLeftColor: "#10b981" }}>
                  <div style={styles.statCardContent}>
                    <p style={styles.statLabel}>Total Candidates</p>
                    <h2 style={{ ...styles.statValue, color: "#10b981" }}>
                      {dashboardStats.totalStudents}
                    </h2>
                  </div>
                  <div style={styles.statIcon}>👥</div>
                </div>

                <div style={{ ...styles.statCard, borderLeftColor: "#3b82f6" }}>
                  <div style={styles.statCardContent}>
                    <p style={styles.statLabel}>Shortlisted</p>
                    <h2 style={{ ...styles.statValue, color: "#3b82f6" }}>
                      {dashboardStats.qualified}
                    </h2>
                  </div>
                  <div style={styles.statIcon}>⭐</div>
                </div>

                <div style={{ ...styles.statCard, borderLeftColor: "#ef4444" }}>
                  <div style={styles.statCardContent}>
                    <p style={styles.statLabel}>Not Qualified</p>
                    <h2 style={{ ...styles.statValue, color: "#ef4444" }}>
                      {dashboardStats.notQualified}
                    </h2>
                  </div>
                  <div style={styles.statIcon}>⚠️</div>
                </div>
              </div>

              {/* Shortlisted Candidates Table */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>✓ Shortlisted Candidates (≥{selectedCriteria}%)</h2>
                {filteredStudents.qualified && filteredStudents.qualified.length > 0 ? (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeader}>
                          <th style={styles.th}>Candidate Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Exam Type</th>
                          <th style={styles.th}>Score</th>
                          <th style={styles.th}>Percentage</th>
                          <th style={styles.th}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.qualified.map(student => (
                          <tr key={student.id} style={styles.tableRow}>
                            <td style={styles.td}>{student.studentName}</td>
                            <td style={styles.td}>{student.email}</td>
                            <td style={styles.td}>
                              <span style={styles.badge}>{student.examType}</span>
                            </td>
                            <td style={styles.td}>{student.marks}/{student.totalMarks}</td>
                            <td style={styles.td}>
                              <span style={{ ...styles.percentBadge, backgroundColor: "#d1fae5", color: "#065f46" }}>
                                {student.percentage}%
                              </span>
                            </td>
                            <td style={styles.td}>
                              <button 
                                style={styles.actionBtn}
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowGoogleForm(true);
                                }}
                              >
                                Schedule Interview
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={styles.noData}>No shortlisted candidates found</p>
                )}
              </div>

              {/* Not Qualified Candidates Table */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>⚠️ Review Candidates (Less than {selectedCriteria}%)</h2>
                {filteredStudents.notQualified && filteredStudents.notQualified.length > 0 ? (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeader}>
                          <th style={styles.th}>Candidate Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Exam Type</th>
                          <th style={styles.th}>Score</th>
                          <th style={styles.th}>Percentage</th>
                          <th style={styles.th}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.notQualified.map(student => (
                          <tr key={student.id} style={styles.tableRow}>
                            <td style={styles.td}>{student.studentName}</td>
                            <td style={styles.td}>{student.email}</td>
                            <td style={styles.td}>
                              <span style={styles.badge}>{student.examType}</span>
                            </td>
                            <td style={styles.td}>{student.marks}/{student.totalMarks}</td>
                            <td style={styles.td}>
                              <span style={{ ...styles.percentBadge, backgroundColor: "#fee2e2", color: "#7f1d1d" }}>
                                {student.percentage}%
                              </span>
                            </td>
                            <td style={styles.td}>
                              <button style={{ ...styles.actionBtn, backgroundColor: "#fca5a5", color: "#7f1d1d" }}>Request Retake</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={styles.noData}>No review candidates found</p>
                )}
              </div>
            </>
          )}

          {/* Exam Reports View */}
          {activeMenu === "reports" && (
            <>
              <div style={{ ...styles.filterCard, marginBottom: "30px" }}>
                <label style={styles.label}>Filter by Exam Type</label>
                <select
                  style={styles.select}
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                >
                  <option value="ALL">All Exams</option>
                  {Object.values(EXAM_TYPES).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Exam Reports Summary */}
              <div style={styles.examStatsGrid}>
                {Object.entries(dashboardStats.byExamType).map(([type, stats]) => (
                  <div key={type} style={styles.examReportCard}>
                    <div style={styles.examReportHeader}>
                      <h4 style={styles.examReportTitle}>{type}</h4>
                      <span style={styles.examReportBadge}>{stats.total} Candidates</span>
                    </div>
                    <div style={styles.examReportContent}>
                      <div style={styles.examReportMetric}>
                        <span style={styles.metricLabel}>Total Assessments</span>
                        <span style={styles.metricValue}>{stats.total}</span>
                      </div>
                      <div style={styles.examReportMetric}>
                        <span style={styles.metricLabel}>Pass Rate</span>
                        <span style={{ ...styles.metricValue, color: "#10b981" }}>
                          {stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div style={styles.examReportMetric}>
                        <span style={styles.metricLabel}>Average Score</span>
                        <span style={styles.metricValue}>{stats.avg}%</span>
                      </div>
                      <button style={styles.viewReportBtn}>View Detailed Report</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exam Request Details */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Pending Exam Requests</h2>
                <div style={styles.requestsList}>
                  {[
                    { exam: "Frontend Engineer", status: "Approved", date: "2 days ago", candidates: 12 },
                    { exam: "Backend Node.js", status: "Pending", date: "3 days ago", candidates: 8 },
                    { exam: "Full Stack Developer", status: "Approved", date: "1 week ago", candidates: 15 }
                  ].map((request, idx) => (
                    <div key={idx} style={styles.requestCard}>
                      <div style={styles.requestCardLeft}>
                        <h5 style={styles.requestTitle}>{request.exam}</h5>
                        <span style={styles.requestMeta}>
                          {request.candidates} candidates | Requested {request.date}
                        </span>
                      </div>
                      <div style={styles.requestCardRight}>
                        <span style={{
                          ...styles.requestStatus,
                          backgroundColor: request.status === "Approved" ? "#d1fae5" : "#fef3c7",
                          color: request.status === "Approved" ? "#065f46" : "#92400e"
                        }}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Exam Reports */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Detailed Exam Reports</h2>
                {selectedReportIndex === null ? (
                  <div style={styles.examReportsListGrid}>
                    {[
                      {
                        examName: "Frontend Engineer",
                        totalQuestions: 50,
                        duration: "120 mins",
                        difficulty: "Intermediate",
                        avgScore: 78.5,
                        passRate: 85,
                        topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                        questionsBreakdown: [
                          { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                          { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                          { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                          { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                        ],
                        completionTime: "98 mins",
                        topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                        commonMistakes: ["Event handling", "State management"]
                      },
                      {
                        examName: "Backend Node.js",
                        totalQuestions: 45,
                        duration: "110 mins",
                        difficulty: "Advanced",
                        avgScore: 72.3,
                        passRate: 75,
                        topics: ["Node.js", "Express", "MongoDB", "APIs"],
                        questionsBreakdown: [
                          { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                          { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                          { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                          { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                        ],
                        completionTime: "105 mins",
                        topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                        commonMistakes: ["Async/await patterns", "Middleware implementation"]
                      },
                      {
                        examName: "Full Stack Developer",
                        totalQuestions: 60,
                        duration: "150 mins",
                        difficulty: "Advanced",
                        avgScore: 75.8,
                        passRate: 80,
                        topics: ["Frontend", "Backend", "Database", "DevOps"],
                        questionsBreakdown: [
                          { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                          { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                          { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                          { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                        ],
                        completionTime: "142 mins",
                        topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                        commonMistakes: ["Database optimization", "Container orchestration"]
                      }
                    ].map((report, idx) => (
                      <div key={idx} style={styles.examReportListItem}>
                        <div style={styles.examReportListHeader}>
                          <div>
                            <h4 style={styles.examReportListTitle}>{report.examName}</h4>
                            <p style={styles.examReportListMeta}>
                              {report.totalQuestions} Questions | {report.duration} | {report.difficulty}
                            </p>
                          </div>
                          <div style={styles.examReportListStats}>
                            <div style={styles.examReportListStat}>
                              <span style={styles.examReportListLabel}>Avg Score</span>
                              <span style={styles.examReportListValue}>{report.avgScore}%</span>
                            </div>
                            <div style={styles.examReportListStat}>
                              <span style={styles.examReportListLabel}>Pass Rate</span>
                              <span style={{ ...styles.examReportListValue, color: "#10b981" }}>{report.passRate}%</span>
                            </div>
                          </div>
                        </div>
                        <button
                          style={styles.viewDetailedBtn}
                          onClick={() => setSelectedReportIndex(idx)}
                        >
                          View Detailed Report
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button
                      style={styles.backBtn}
                      onClick={() => setSelectedReportIndex(null)}
                    >
                      ← Back to Reports
                    </button>
                    {[
                      {
                        examName: "Frontend Engineer",
                        totalQuestions: 50,
                        duration: "120 mins",
                        difficulty: "Intermediate",
                        avgScore: 78.5,
                        passRate: 85,
                        topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                        questionsBreakdown: [
                          { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                          { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                          { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                          { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                        ],
                        completionTime: "98 mins",
                        topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                        commonMistakes: ["Event handling", "State management"]
                      },
                      {
                        examName: "Backend Node.js",
                        totalQuestions: 45,
                        duration: "110 mins",
                        difficulty: "Advanced",
                        avgScore: 72.3,
                        passRate: 75,
                        topics: ["Node.js", "Express", "MongoDB", "APIs"],
                        questionsBreakdown: [
                          { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                          { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                          { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                          { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                        ],
                        completionTime: "105 mins",
                        topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                        commonMistakes: ["Async/await patterns", "Middleware implementation"]
                      },
                      {
                        examName: "Full Stack Developer",
                        totalQuestions: 60,
                        duration: "150 mins",
                        difficulty: "Advanced",
                        avgScore: 75.8,
                        passRate: 80,
                        topics: ["Frontend", "Backend", "Database", "DevOps"],
                        questionsBreakdown: [
                          { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                          { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                          { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                          { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                        ],
                        completionTime: "142 mins",
                        topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                        commonMistakes: ["Database optimization", "Container orchestration"]
                      }
                    ][selectedReportIndex] && (
                      <div style={styles.detailedReportCard}>
                        <div style={styles.reportHeader}>
                          <div>
                            <h4 style={styles.reportTitle}>{[
                              {
                                examName: "Frontend Engineer",
                                totalQuestions: 50,
                                duration: "120 mins",
                                difficulty: "Intermediate",
                                avgScore: 78.5,
                                passRate: 85,
                                topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                questionsBreakdown: [
                                  { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                  { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                  { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                  { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                ],
                                completionTime: "98 mins",
                                topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                commonMistakes: ["Event handling", "State management"]
                              },
                              {
                                examName: "Backend Node.js",
                                totalQuestions: 45,
                                duration: "110 mins",
                                difficulty: "Advanced",
                                avgScore: 72.3,
                                passRate: 75,
                                topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                questionsBreakdown: [
                                  { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                  { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                  { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                  { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                ],
                                completionTime: "105 mins",
                                topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                commonMistakes: ["Async/await patterns", "Middleware implementation"]
                              },
                              {
                                examName: "Full Stack Developer",
                                totalQuestions: 60,
                                duration: "150 mins",
                                difficulty: "Advanced",
                                avgScore: 75.8,
                                passRate: 80,
                                topics: ["Frontend", "Backend", "Database", "DevOps"],
                                questionsBreakdown: [
                                  { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                  { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                  { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                  { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                ],
                                completionTime: "142 mins",
                                topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                commonMistakes: ["Database optimization", "Container orchestration"]
                              }
                            ][selectedReportIndex]?.examName}</h4>
                            <p style={styles.reportMeta}>
                              {[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.totalQuestions} Questions | {[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.duration} | {[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.difficulty}
                            </p>
                          </div>
                          <div style={styles.reportStats}>
                            <div style={styles.reportStat}>
                              <span style={styles.reportStatLabel}>Avg Score</span>
                              <span style={styles.reportStatValue}>{[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.avgScore}%</span>
                            </div>
                            <div style={styles.reportStat}>
                              <span style={styles.reportStatLabel}>Pass Rate</span>
                              <span style={{ ...styles.reportStatValue, color: "#10b981" }}>{[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.passRate}%</span>
                            </div>
                          </div>
                        </div>

                        <div style={styles.reportBody}>
                          {/* Topics */}
                          <div style={styles.reportSection}>
                            <h5 style={styles.reportSectionTitle}>Topics Covered</h5>
                            <div style={styles.topicsList}>
                              {[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.topics.map((topic, i) => (
                                <span key={i} style={styles.topicTag}>{topic}</span>
                              ))}
                            </div>
                          </div>

                          {/* Questions Breakdown */}
                          <div style={styles.reportSection}>
                            <h5 style={styles.reportSectionTitle}>Performance by Topic</h5>
                            {[
                              {
                                examName: "Frontend Engineer",
                                totalQuestions: 50,
                                duration: "120 mins",
                                difficulty: "Intermediate",
                                avgScore: 78.5,
                                passRate: 85,
                                topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                questionsBreakdown: [
                                  { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                  { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                  { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                  { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                ],
                                completionTime: "98 mins",
                                topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                commonMistakes: ["Event handling", "State management"]
                              },
                              {
                                examName: "Backend Node.js",
                                totalQuestions: 45,
                                duration: "110 mins",
                                difficulty: "Advanced",
                                avgScore: 72.3,
                                passRate: 75,
                                topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                questionsBreakdown: [
                                  { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                  { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                  { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                  { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                ],
                                completionTime: "105 mins",
                                topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                commonMistakes: ["Async/await patterns", "Middleware implementation"]
                              },
                              {
                                examName: "Full Stack Developer",
                                totalQuestions: 60,
                                duration: "150 mins",
                                difficulty: "Advanced",
                                avgScore: 75.8,
                                passRate: 80,
                                topics: ["Frontend", "Backend", "Database", "DevOps"],
                                questionsBreakdown: [
                                  { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                  { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                  { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                  { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                ],
                                completionTime: "142 mins",
                                topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                commonMistakes: ["Database optimization", "Container orchestration"]
                              }
                            ][selectedReportIndex]?.questionsBreakdown.map((item, i) => (
                              <div key={i} style={styles.breakdownItem}>
                                <div style={styles.breakdownLabel}>
                                  <span style={styles.breakdownTopic}>{item.topic}</span>
                                  <span style={styles.breakdownScore}>{item.correct}/{item.total}</span>
                                </div>
                                <div style={styles.progressBar}>
                                  <div style={{
                                    ...styles.progressFill,
                                    width: `${item.percentage}%`,
                                    backgroundColor: item.percentage >= 85 ? "#10b981" : item.percentage >= 70 ? "#3b82f6" : "#ef4444"
                                  }}></div>
                                </div>
                                <span style={styles.percentageText}>{item.percentage}%</span>
                              </div>
                            ))}
                          </div>

                          {/* Top Performers */}
                          <div style={styles.reportSection}>
                            <h5 style={styles.reportSectionTitle}>Top Performers</h5>
                            <ul style={styles.performersList}>
                              {[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.topPerformers.map((performer, i) => (
                                <li key={i} style={styles.performerItem}>🏆 {performer}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Common Mistakes */}
                          <div style={styles.reportSection}>
                            <h5 style={styles.reportSectionTitle}>Common Mistakes</h5>
                            <ul style={styles.mistakesList}>
                              {[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.commonMistakes.map((mistake, i) => (
                                <li key={i} style={styles.mistakeItem}>⚠️ {mistake}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Quick Stats */}
                          <div style={styles.quickStatsRow}>
                            <div style={styles.quickStat}>
                              <span style={styles.quickStatLabel}>Completion Time</span>
                              <span style={styles.quickStatValue}>{[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.completionTime}</span>
                            </div>
                            <div style={styles.quickStat}>
                              <span style={styles.quickStatLabel}>Avg Duration</span>
                              <span style={styles.quickStatValue}>{[
                                {
                                  examName: "Frontend Engineer",
                                  totalQuestions: 50,
                                  duration: "120 mins",
                                  difficulty: "Intermediate",
                                  avgScore: 78.5,
                                  passRate: 85,
                                  topics: ["HTML/CSS", "JavaScript", "React", "UI/UX"],
                                  questionsBreakdown: [
                                    { topic: "React Concepts", correct: 18, total: 20, percentage: 90 },
                                    { topic: "JavaScript ES6+", correct: 15, total: 18, percentage: 83 },
                                    { topic: "CSS & Styling", correct: 12, total: 15, percentage: 80 },
                                    { topic: "DOM Manipulation", correct: 14, total: 17, percentage: 82 }
                                  ],
                                  completionTime: "98 mins",
                                  topPerformers: ["Raj Kumar (92%)", "Vikram Singh (88%)"],
                                  commonMistakes: ["Event handling", "State management"]
                                },
                                {
                                  examName: "Backend Node.js",
                                  totalQuestions: 45,
                                  duration: "110 mins",
                                  difficulty: "Advanced",
                                  avgScore: 72.3,
                                  passRate: 75,
                                  topics: ["Node.js", "Express", "MongoDB", "APIs"],
                                  questionsBreakdown: [
                                    { topic: "Express.js", correct: 15, total: 18, percentage: 83 },
                                    { topic: "MongoDB Queries", correct: 12, total: 15, percentage: 80 },
                                    { topic: "RESTful APIs", correct: 13, total: 16, percentage: 81 },
                                    { topic: "Authentication", correct: 10, total: 14, percentage: 71 }
                                  ],
                                  completionTime: "105 mins",
                                  topPerformers: ["Amit Patel (89%)", "Priya Singh (86%)"],
                                  commonMistakes: ["Async/await patterns", "Middleware implementation"]
                                },
                                {
                                  examName: "Full Stack Developer",
                                  totalQuestions: 60,
                                  duration: "150 mins",
                                  difficulty: "Advanced",
                                  avgScore: 75.8,
                                  passRate: 80,
                                  topics: ["Frontend", "Backend", "Database", "DevOps"],
                                  questionsBreakdown: [
                                    { topic: "Frontend Stack", correct: 22, total: 25, percentage: 88 },
                                    { topic: "Backend Development", correct: 19, total: 23, percentage: 83 },
                                    { topic: "Database Design", correct: 15, total: 18, percentage: 83 },
                                    { topic: "DevOps & Deployment", correct: 12, total: 15, percentage: 80 }
                                  ],
                                  completionTime: "142 mins",
                                  topPerformers: ["Neha Gupta (91%)", "Raj Kumar (89%)"],
                                  commonMistakes: ["Database optimization", "Container orchestration"]
                                }
                              ][selectedReportIndex]?.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div style={styles.reportFooter}>
                          <button style={styles.reportBtn}>Download Full Report</button>
                          <button style={{ ...styles.reportBtn, backgroundColor: "#6b7280" }}>Share Report</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Detailed Exam Statistics */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Detailed Exam Analytics</h2>
                <div style={styles.analyticsGrid}>
                  {[
                    { 
                      label: "Highest Score", 
                      value: "98%", 
                      color: "#10b981",
                      lightColor: "#d1fae5",
                      description: "Outstanding Performance"
                    },
                    { 
                      label: "Lowest Score", 
                      value: "45%", 
                      color: "#ef4444",
                      lightColor: "#fee2e2",
                      description: "Needs Support"
                    },
                    { 
                      label: "Average Duration", 
                      value: "45 mins", 
                      color: "#3b82f6",
                      lightColor: "#dbeafe",
                      description: "Exam Completion Time"
                    },
                    { 
                      label: "Completion Rate", 
                      value: "94%", 
                      color: "#8b5cf6",
                      lightColor: "#ede9fe",
                      description: "Test Completion"
                    }
                  ].map((stat, idx) => (
                    <div key={idx} style={styles.analyticsCard}>
                      <div style={{
                        ...styles.analyticsCardIcon,
                        backgroundColor: stat.lightColor,
                        borderLeftColor: stat.color
                      }}>
                        <div style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: stat.color,
                          margin: "0 auto"
                        }}></div>
                      </div>
                      <p style={styles.analyticsLabel}>{stat.label}</p>
                      <h3 style={{ ...styles.analyticsValue, color: stat.color }}>{stat.value}</h3>
                      <p style={styles.analyticsDescription}>{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Exam Requests View */}
          {activeMenu === "exam-requests" && (
            <>
              <div style={styles.examRequestsContainer}>
                {/* New Exam Request Form */}
                <div style={styles.examRequestsLeft}>
                  <h2 style={styles.sectionTitle}>New Exam Request</h2>
                  <div style={styles.formSection}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Target Job Role</label>
                      <input
                        type="text"
                        placeholder="e.g., Senior Full Stack Engineer"
                        style={styles.formInput}
                        value={examRequestForm.jobRole}
                        onChange={(e) => setExamRequestForm({ ...examRequestForm, jobRole: e.target.value })}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Assessment Pattern</label>
                      <select
                        style={styles.formInput}
                        value={examRequestForm.assessmentPattern}
                        onChange={(e) => setExamRequestForm({ ...examRequestForm, assessmentPattern: e.target.value })}
                      >
                        <option value="">Select modules</option>
                        <option value="technical">Technical Skills</option>
                        <option value="behavioral">Behavioral Assessment</option>
                        <option value="aptitude">Aptitude Test</option>
                        <option value="combined">Combined Assessment</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Total Duration (minutes)</label>
                      <input
                        type="number"
                        placeholder="e.g., 120"
                        style={styles.formInput}
                        value={examRequestForm.duration}
                        onChange={(e) => setExamRequestForm({ ...examRequestForm, duration: e.target.value })}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Additional Specifications</label>
                      <textarea
                        placeholder="e.g., Require strict proctoring, webcam required..."
                        style={{ ...styles.formInput, minHeight: "100px", fontFamily: "inherit" }}
                        value={examRequestForm.specifications}
                        onChange={(e) => setExamRequestForm({ ...examRequestForm, specifications: e.target.value })}
                      />
                    </div>

                    <button style={styles.submitBtn}>📝 Submit Request</button>
                  </div>
                </div>

                {/* Recent Requests History */}
                <div style={styles.examRequestsRight}>
                  <h2 style={styles.sectionTitle}>Recent Requests History</h2>
                  <div style={styles.requestsHistoryTable}>
                    <table style={styles.historyTable}>
                      <thead>
                        <tr style={styles.historyTableHeader}>
                          <th style={styles.historyTh}>Request ID</th>
                          <th style={styles.historyTh}>Job Role</th>
                          <th style={styles.historyTh}>Exam Pattern</th>
                          <th style={styles.historyTh}>Duration (mins)</th>
                          <th style={styles.historyTh}>Date Requested</th>
                          <th style={styles.historyTh}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: "REQ-001", role: "Frontend Developer", pattern: "Attitude Best Coding", duration: 90, date: "2023-10-12", status: "APPROVED" },
                          { id: "REQ-002", role: "Data Scientist", pattern: "Python scripting Statistics MCQ", duration: 120, date: "2023-10-14", status: "PENDING" },
                          { id: "REQ-003", role: "DevOps Engineer", pattern: "Cloud Infrastructure", duration: 100, date: "2023-10-15", status: "APPROVED" }
                        ].map((request, idx) => (
                          <tr key={idx} style={styles.historyTableRow}>
                            <td style={styles.historyTd}>{request.id}</td>
                            <td style={styles.historyTd}>{request.role}</td>
                            <td style={styles.historyTd}>{request.pattern}</td>
                            <td style={styles.historyTd}>{request.duration}</td>
                            <td style={styles.historyTd}>{request.date}</td>
                            <td style={styles.historyTd}>
                              <span style={{
                                ...styles.statusBadge,
                                backgroundColor: request.status === "APPROVED" ? "#d1fae5" : "#fef3c7",
                                color: request.status === "APPROVED" ? "#065f46" : "#92400e"
                              }}>
                                {request.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Google Form Modal for Interview Scheduling */}
          {showGoogleForm && selectedStudent && (
            <div style={styles.modalOverlay} onClick={() => setShowGoogleForm(false)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Schedule Interview - {selectedStudent.studentName}</h2>
                  <button 
                    style={styles.closeBtn}
                    onClick={() => setShowGoogleForm(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div style={styles.modalBody}>
                  <div style={styles.candidateInfo}>
                    <h4 style={styles.candidateInfoTitle}>Candidate Details</h4>
                    <div style={styles.candidateDetail}>
                      <span style={styles.detailLabel}>Name:</span>
                      <span>{selectedStudent.studentName}</span>
                    </div>
                    <div style={styles.candidateDetail}>
                      <span style={styles.detailLabel}>Email:</span>
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div style={styles.candidateDetail}>
                      <span style={styles.detailLabel}>Score:</span>
                      <span>{selectedStudent.percentage}%</span>
                    </div>
                    <div style={styles.candidateDetail}>
                      <span style={styles.detailLabel}>Exam Type:</span>
                      <span>{selectedStudent.examType}</span>
                    </div>
                  </div>

                  <div style={styles.googleFormContainer}>
                    <h4 style={styles.googleFormTitle}>Interview Scheduling Form</h4>
                    <p style={styles.googleFormSubtext}>
                      Google Form will open in a new link to schedule the interview
                    </p>
                    <div style={styles.formFields}>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Interview Date</label>
                        <input type="date" style={styles.formInput} />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Interview Time</label>
                        <input type="time" style={styles.formInput} />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Interview Type</label>
                        <select style={styles.formInput}>
                          <option>Technical Round</option>
                          <option>HR Round</option>
                          <option>Final Round</option>
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Interviewer Email</label>
                        <input type="email" placeholder="interviewer@company.com" style={styles.formInput} />
                      </div>
                    </div>

                    <div style={styles.modalActions}>
                      <button 
                        style={styles.primaryBtn}
                        onClick={() => {
                          window.open("https://forms.google.com/", "_blank");
                        }}
                      >
                        📝 Open Google Form
                      </button>
                      <button 
                        style={styles.secondaryBtn}
                        onClick={() => setShowGoogleForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },

  // Sidebar Styles
  sidebar: {
    width: "280px",
    backgroundColor: "#f3f4f6",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
    transition: "transform 0.3s ease",
    zIndex: 1000,
    "@media (maxWidth: 768px)": {
      position: "fixed",
      width: "280px",
      height: "100vh"
    }
  },

  sidebarOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    display: "none"
  },

  sidebarHeader: {
    padding: "24px 20px",
    borderBottom: "1px solid #e5e7eb"
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  logoBadge: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px"
  },

  logoText: {
    flex: 1
  },

  logoTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827"
  },

  logoSubtitle: {
    margin: "2px 0 0 0",
    fontSize: "12px",
    color: "#9ca3af"
  },

  sidebarNav: {
    flex: 1,
    padding: "20px 0",
    overflow: "auto"
  },

  navSectionTitle: {
    margin: "0 20px 12px 20px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  navItem: {
    width: "100%",
    padding: "12px 20px",
    border: "none",
    backgroundColor: "transparent",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s ease",
    borderLeft: "3px solid transparent"
  },

  navItemActive: {
    backgroundColor: "#e0e7ff",
    color: "#3b82f6",
    borderLeftColor: "#3b82f6"
  },

  navIcon: {
    fontSize: "18px"
  },

  sidebarFooter: {
    padding: "20px",
    borderTop: "1px solid #e5e7eb"
  },

  logoutButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease"
  },

  // Content Styles
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto"
  },

  header: {
    padding: "24px 40px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    sticky: "top",
    zIndex: 100
  },

  headerLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px"
  },

  menuToggle: {
    display: "none",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "20px"
  },

  pageTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827"
  },

  pageSubtitle: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#6b7280"
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },

  welcomeText: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500"
  },

  content: {
    padding: "32px 40px",
    flex: 1
  },

  filterSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "32px"
  },

  filterCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },

  label: {
    display: "block",
    marginBottom: "12px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151"
  },

  criteriaButtons: {
    display: "flex",
    gap: "10px"
  },

  criteriaBtn: {
    flex: 1,
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease"
  },

  select: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "inherit"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "32px"
  },

  statCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    borderLeft: "4px solid #3b82f6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    transition: "box-shadow 0.2s ease"
  },

  statCardContent: {
    flex: 1
  },

  statLabel: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  statValue: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700"
  },

  statIcon: {
    fontSize: "32px",
    marginLeft: "16px"
  },

  section: {
    marginBottom: "32px"
  },

  sectionTitle: {
    margin: "0 0 20px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827"
  },

  examStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
  },

  examStatCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },

  examTypeTitle: {
    margin: "0 0 15px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827"
  },

  examStatDetail: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: "12px",
    fontSize: "13px",
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb"
  },

  statBold: {
    fontWeight: "700",
    color: "#111827"
  },

  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflowX: "auto",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px"
  },

  tableHeader: {
    backgroundColor: "#f9fafb",
    borderBottom: "2px solid #e5e7eb"
  },

  th: {
    padding: "16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s"
  },

  td: {
    padding: "16px",
    color: "#374151"
  },

  badge: {
    backgroundColor: "#dbeafe",
    color: "#0c4a6e",
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600"
  },

  percentBadge: {
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block"
  },

  statusBadge: {
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  },

  noData: {
    padding: "30px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "14px",
    backgroundColor: "#fff",
    borderRadius: "12px"
  },

  activityList: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },

  activityItem: {
    display: "flex",
    gap: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb"
  },

  activityDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    marginTop: "6px",
    flexShrink: 0
  },

  activityContent: {
    flex: 1
  },

  activityText: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    color: "#374151",
    fontWeight: "500"
  },

  activityTime: {
    fontSize: "12px",
    color: "#9ca3af"
  },

  actionBtn: {
    padding: "6px 16px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  },

  examReportCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    transition: "box-shadow 0.2s ease"
  },

  examReportHeader: {
    padding: "16px 20px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  examReportTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827"
  },

  examReportBadge: {
    backgroundColor: "#dbeafe",
    color: "#0c4a6e",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600"
  },

  examReportContent: {
    padding: "20px"
  },

  examReportMetric: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb"
  },

  metricLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500"
  },

  metricValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827"
  },

  viewReportBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    marginTop: "16px",
    transition: "background-color 0.2s ease"
  },

  requestsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  requestCard: {
    backgroundColor: "#fff",
    padding: "16px 20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "box-shadow 0.2s ease"
  },

  requestCardLeft: {
    flex: 1
  },

  requestTitle: {
    margin: "0 0 6px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827"
  },

  requestMeta: {
    fontSize: "12px",
    color: "#9ca3af"
  },

  requestCardRight: {
    marginLeft: "20px"
  },

  requestStatus: {
    padding: "6px 14px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },

  analyticsCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease"
  },

  analyticsCardIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    borderLeft: "4px solid",
    transition: "all 0.2s ease"
  },

  analyticsIcon: {
    fontSize: "32px",
    display: "block",
    marginBottom: "12px"
  },

  analyticsLabel: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  analyticsValue: {
    margin: "0 0 6px 0",
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827"
  },

  analyticsDescription: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af",
    fontStyle: "italic"
  },

  backBtn: {
    padding: "10px 16px",
    backgroundColor: "#e5e7eb",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "24px",
    transition: "all 0.2s ease"
  },

  examReportsListGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px"
  },

  examReportListItem: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },

  examReportListHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px"
  },

  examReportListTitle: {
    margin: "0 0 6px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827"
  },

  examReportListMeta: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af"
  },

  examReportListStats: {
    display: "flex",
    gap: "20px",
    textAlign: "right"
  },

  examReportListStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },

  examReportListLabel: {
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  examReportListValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#3b82f6",
    marginTop: "4px"
  },

  viewDetailedBtn: {
    width: "100%",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  },

  detailedReportsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px"
  },

  detailedReportCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
    transition: "box-shadow 0.2s ease"
  },

  reportHeader: {
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },

  reportTitle: {
    margin: "0 0 6px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827"
  },

  reportMeta: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af"
  },

  reportStats: {
    display: "flex",
    gap: "20px",
    textAlign: "right"
  },

  reportStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },

  reportStatLabel: {
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  reportStatValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#3b82f6",
    marginTop: "4px"
  },

  reportBody: {
    padding: "20px"
  },

  reportSection: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb"
  },

  reportSectionTitle: {
    margin: "0 0 12px 0",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  topicsList: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },

  topicTag: {
    backgroundColor: "#dbeafe",
    color: "#0c4a6e",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },

  breakdownItem: {
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f3f4f6"
  },

  breakdownLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },

  breakdownTopic: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151"
  },

  breakdownScore: {
    fontSize: "12px",
    color: "#9ca3af"
  },

  progressBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e5e7eb",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "4px"
  },

  progressFill: {
    height: "100%",
    transition: "width 0.3s ease"
  },

  percentageText: {
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: "600"
  },

  performersList: {
    margin: 0,
    padding: "0 0 0 20px",
    listStyle: "none"
  },

  performerItem: {
    fontSize: "13px",
    color: "#374151",
    marginBottom: "8px",
    fontWeight: "500"
  },

  mistakesList: {
    margin: 0,
    padding: "0 0 0 20px",
    listStyle: "none"
  },

  mistakeItem: {
    fontSize: "13px",
    color: "#374151",
    marginBottom: "8px",
    fontWeight: "500"
  },

  quickStatsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: 0
  },

  quickStat: {
    display: "flex",
    flexDirection: "column"
  },

  quickStatLabel: {
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  quickStatValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    marginTop: "4px"
  },

  reportFooter: {
    padding: "16px 20px",
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "12px"
  },

  reportBtn: {
    flex: 1,
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  },

  examRequestsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "30px"
  },

  examRequestsLeft: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },

  examRequestsRight: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },

  formSection: {
    marginTop: "20px"
  },

  formGroup: {
    marginBottom: "16px"
  },

  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151"
  },

  formInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    color: "#374151",
    boxSizing: "border-box"
  },

  submitBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    marginTop: "20px",
    transition: "background-color 0.2s ease"
  },

  requestsHistoryTable: {
    marginTop: "20px",
    overflowX: "auto"
  },

  historyTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px"
  },

  historyTableHeader: {
    backgroundColor: "#f9fafb",
    borderBottom: "2px solid #e5e7eb"
  },

  historyTh: {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  historyTableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s"
  },

  historyTd: {
    padding: "12px",
    color: "#374151",
    fontSize: "12px"
  },

  /* Modal Styles */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
  },

  modalHeader: {
    padding: "24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb"
  },

  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827"
  },

  closeBtn: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6b7280",
    padding: 0,
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  modalBody: {
    padding: "24px"
  },

  candidateInfo: {
    backgroundColor: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px"
  },

  candidateInfoTitle: {
    margin: "0 0 12px 0",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  candidateDetail: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: "8px",
    marginBottom: "8px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px"
  },

  detailLabel: {
    fontWeight: "600",
    color: "#6b7280"
  },

  googleFormContainer: {
    marginTop: "20px"
  },

  googleFormTitle: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151"
  },

  googleFormSubtext: {
    margin: "0 0 16px 0",
    fontSize: "12px",
    color: "#9ca3af"
  },

  formFields: {
    marginBottom: "20px"
  },

  modalActions: {
    display: "flex",
    gap: "12px",
    marginTop: "20px"
  },

  primaryBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  },

  secondaryBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#e5e7eb",
    color: "#374151",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "background-color 0.2s ease"
  }
};

export default RecruiterDashboard;



