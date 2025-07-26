"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Navigation = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Journal", href: "/journal" },
    { name: "Dashboard", href: "/dashboard" },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #722F37 0%, #8B4513 100%)",
        boxShadow: "0 4px 20px rgba(114, 47, 55, 0.3)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        {/* Logo/Title */}
        <Link
          to="/journal"
          style={{
            textDecoration: "none",
            color: "white",
            fontSize: "1.8rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #A0522D 0%, #CD853F 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            ฿
          </div>
          Spending Tracker
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              style={{
                textDecoration: "none",
                color: isActive(item.href) ? "#F5F5DC" : "rgba(255, 255, 255, 0.9)",
                fontSize: "1.1rem",
                fontWeight: isActive(item.href) ? "600" : "500",
                padding: "10px 20px",
                borderRadius: "25px",
                background: isActive(item.href) ? "rgba(255, 255, 255, 0.2)" : "transparent",
                transition: "all 0.3s ease",
                border: isActive(item.href) ? "2px solid rgba(255, 255, 255, 0.3)" : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)"
                  e.target.style.color = "#F5F5DC"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.target.style.background = "transparent"
                  e.target.style.color = "rgba(255, 255, 255, 0.9)"
                }
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "5px",
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div
          style={{
            background: "rgba(114, 47, 55, 0.95)",
            padding: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          }}
          className="mobile-nav"
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: "block",
                textDecoration: "none",
                color: isActive(item.href) ? "#F5F5DC" : "rgba(255, 255, 255, 0.9)",
                fontSize: "1.1rem",
                fontWeight: isActive(item.href) ? "600" : "500",
                padding: "15px 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navigation
