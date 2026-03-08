import { useEffect } from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"  // ✅ FIXED missing imports
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from "./pages/AdminDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import StudentDashboard from "./pages/Studentdashboard "
import ExamVerify from "./pages/Examverify"
import Instruction from "./pages/Instruction"

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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard/>}/>
        <Route path="/exam-verify" element={<ExamVerify/>} />
        <Route path="/instruction" element={<Instruction/>} />


      </Routes>
    </Router>
  )
}

export default App