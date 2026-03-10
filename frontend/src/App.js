import { useEffect } from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from "./pages/AdminDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import StudentDashboard from "./pages/Studentdashboard "
import ExamVerify from "./pages/Examverify"
import Instruction from "./pages/Instruction"
import ExamPage from "./pages/ExamPage"; 
import ExamRouter from "./pages/Examrouter";
import SQLExamPage from "./pages/SQLExamPage";
import { AppProvider } from './context/AppContext';
import CreateExam from './pages/CreateExam';
import QuestionBank from './pages/QuestionBank';
import Candidates from './pages/Candidates';
import LiveMonitoring from './pages/LiveMonitoring';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
function App() {
  // useEffect(() => {
  //   const blockKeys = (e) => {
  //     const key = e.key.toLowerCase()

  //     // Block DevTools
  //     if (key === "f12") { e.preventDefault(); e.stopPropagation() }
  //     if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) { e.preventDefault(); e.stopPropagation() }

  //     // Block Refresh
  //     if (key === "f5") { e.preventDefault(); e.stopPropagation() }
  //     if (e.ctrlKey && key === "r") { e.preventDefault(); e.stopPropagation() }
  //     if (e.ctrlKey && e.shiftKey && key === "r") { e.preventDefault(); e.stopPropagation() }

  //     // Block Copy/Paste/Cut/SelectAll
  //     if (e.ctrlKey && ["c", "v", "x", "a"].includes(key)) { e.preventDefault(); e.stopPropagation() }

  //     // Block View Source
  //     if (e.ctrlKey && key === "u") { e.preventDefault(); e.stopPropagation() }

  //     // Block Save/Print/Find
  //     if (e.ctrlKey && ["s", "p", "f"].includes(key)) { e.preventDefault(); e.stopPropagation() }

  //     // Block zoom
  //     if (e.ctrlKey && ["+", "-", "=", "0"].includes(key)) { e.preventDefault(); e.stopPropagation() }
  //   }

  //   const blockContext = (e) => e.preventDefault()
  //   const blockSelect = (e) => e.preventDefault()  // ✅ Block text selection

  //   document.addEventListener("keydown", blockKeys, true)
  //   document.addEventListener("contextmenu", blockContext, true)  // ✅ Fixed: now uses capture + stored ref
  //   document.addEventListener("selectstart", blockSelect, true)

  //   return () => {
  //     document.removeEventListener("keydown", blockKeys, true)
  //     document.removeEventListener("contextmenu", blockContext, true)  // ✅ Fixed: now properly cleaned up
  //     document.removeEventListener("selectstart", blockSelect, true)
  //   }
  // }, [])

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard/>}/>
          <Route path="/exam-verify" element={<ExamVerify/>} />
          <Route path="/instruction" element={<Instruction/>} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/exam-router" element={<ExamRouter />} />
          <Route path="/sql-exam" element={<SQLExamPage />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/live-monitoring" element={<LiveMonitoring />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App