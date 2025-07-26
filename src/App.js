import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import Journal from "./components/Journal"
import "./App.css"

function Navigation() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          💰 Spending Tracker
        </Link>
        <div className="navbar-nav">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link to="/journal" className={`nav-link ${isActive("/journal") ? "active" : ""}`}>
            Journal
          </Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div style={{ padding: "32px 0" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
