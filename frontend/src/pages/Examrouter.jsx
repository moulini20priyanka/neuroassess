/**
 * ExamRouter.jsx
 * Drop this wherever you render your exam flow.
 * 
 * Usage in your App.jsx / routing:
 *   import ExamRouter from "./ExamRouter";
 *   <Route path="/exam" element={<ExamRouter />} />
 * 
 * Or use standalone:
 *   import ExamRouter from "./ExamRouter";
 *   export default function App() { return <ExamRouter />; }
 */

import { useState } from "react";
import ExamPage    from "./ExamPage";
import SQLExamPage from "./SQLExamPage";

export default function ExamRouter() {
  const [round, setRound] = useState("mcq"); // "mcq" | "sql"

  const handleNavigate = (target) => {
    if (target === "sql")   setRound("sql");
    if (target === "lobby") window.location.assign("/");   // adjust to your lobby route
    if (target === "mcq")   setRound("mcq");
  };

  if (round === "sql") return <SQLExamPage onNavigate={handleNavigate} />;
  return <ExamPage onNavigate={handleNavigate} />;
}