import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Journal from "./components/Journal";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />

        <Routes>
          {/* ✅ Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>

        {/* Footer */}
        <footer
          style={{
            background: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
            color: "white",
            textAlign: "center",
            padding: "30px 20px",
            marginTop: "50px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ margin: "0", fontSize: "1rem", opacity: "0.9" }}>
              © 2025 Spending Tracker - Track your expenses, achieve your goals
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
