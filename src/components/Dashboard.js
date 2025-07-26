"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import LineChartComponent from "./LineChartComponent"
import PieChartComponent from "./PieChartComponent"
import { getSpendingEntries } from "../utils/LocalStorageHelpers"

dayjs.extend(isoWeek)

const Dashboard = () => {
  const [view, setView] = useState("weekly")
  const [entries, setEntries] = useState([])
  const [lineChartData, setLineChartData] = useState({})
  const [pieChartData, setPieChartData] = useState({})
  const [totalSpending, setTotalSpending] = useState(0)
  const [selectedPeriodTotal, setSelectedPeriodTotal] = useState(0)
  const [categoryBreakdown, setCategoryBreakdown] = useState([])

  useEffect(() => {
    const loadedEntries = getSpendingEntries()
    setEntries(loadedEntries)
  }, [])

  useEffect(() => {
    if (entries.length === 0) {
      setLineChartData({})
      setPieChartData({})
      setTotalSpending(0)
      setSelectedPeriodTotal(0)
      setCategoryBreakdown([])
      return
    }

    // Calculate total spending
    const total = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0)
    setTotalSpending(total)

    // Calculate period-specific total based on view
    let periodTotal = 0
    const now = dayjs()

    switch (view) {
      case "daily":
        const today = now.format("YYYY-MM-DD")
        periodTotal = entries
          .filter((entry) => entry.date === today)
          .reduce((sum, entry) => sum + (entry.amount || 0), 0)
        break
      case "weekly":
        const currentWeek = now.isoWeek()
        const currentYear = now.year()
        periodTotal = entries
          .filter((entry) => {
            const entryDate = dayjs(entry.date)
            return entryDate.isoWeek() === currentWeek && entryDate.year() === currentYear
          })
          .reduce((sum, entry) => sum + (entry.amount || 0), 0)
        break
      case "monthly":
        const currentMonth = now.format("YYYY-MM")
        periodTotal = entries
          .filter((entry) => dayjs(entry.date).format("YYYY-MM") === currentMonth)
          .reduce((sum, entry) => sum + (entry.amount || 0), 0)
        break
    }
    setSelectedPeriodTotal(periodTotal)

    // Prepare line chart data
    const grouped = groupByPeriod(entries, view)
    setLineChartData(grouped)

    // Prepare pie chart data
    const categoryTotals = {}
    entries.forEach((entry) => {
      if (entry.category && entry.amount) {
        categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount
      }
    })
    setPieChartData(categoryTotals)

    // Prepare category breakdown
    const breakdown = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
    setCategoryBreakdown(breakdown)
  }, [entries, view])

  const groupByPeriod = (entries, period) => {
    const result = {}
    entries.forEach((entry) => {
      if (!entry.date || !entry.amount) return
      const date = dayjs(entry.date)
      let key
      switch (period) {
        case "daily":
          key = date.format("YYYY-MM-DD")
          break
        case "weekly":
          key = `${date.year()}-W${date.isoWeek().toString().padStart(2, "0")}`
          break
        case "monthly":
          key = date.format("YYYY-MM")
          break
        default:
          key = date.format("YYYY-MM-DD")
      }
      result[key] = (result[key] || 0) + entry.amount
    })
    return result
  }

  const getPeriodLabel = () => {
    switch (view) {
      case "daily":
        return "Today"
      case "weekly":
        return "This Week"
      case "monthly":
        return "This Month"
      default:
        return "This Period"
    }
  }

  return (
    <div
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #faf7f5 0%, #f1ede8 100%)", padding: "20px" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px",
          paddingTop: "20px",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#722F37" }}>Analytics Dashboard</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setView("daily")}
            style={{
              padding: "10px 20px",
              border: `2px solid ${view === "daily" ? "#722F37" : "#E8D5D1"}`,
              background: view === "daily" ? "#722F37" : "white",
              color: view === "daily" ? "white" : "#722F37",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Daily
          </button>
          <button
            onClick={() => setView("weekly")}
            style={{
              padding: "10px 20px",
              border: `2px solid ${view === "weekly" ? "#722F37" : "#E8D5D1"}`,
              background: view === "weekly" ? "#722F37" : "white",
              color: view === "weekly" ? "white" : "#722F37",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            style={{
              padding: "10px 20px",
              border: `2px solid ${view === "monthly" ? "#722F37" : "#E8D5D1"}`,
              background: view === "monthly" ? "#722F37" : "white",
              color: view === "monthly" ? "white" : "#722F37",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #722F37 0%, #8B4513 100%)",
            color: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(114, 47, 55, 0.2)",
            border: "none",
          }}
        >
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "10px" }}>
            ฿{totalSpending.toFixed(2)}
          </div>
          <div style={{ fontSize: "1.1rem", opacity: "0.9" }}>Total Spending (All Time)</div>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #A0522D 0%, #CD853F 100%)",
            color: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(160, 82, 45, 0.2)",
            border: "none",
          }}
        >
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "10px" }}>
            ฿{selectedPeriodTotal.toFixed(2)}
          </div>
          <div style={{ fontSize: "1.1rem", opacity: "0.9" }}>{getPeriodLabel()}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "30px",
          marginBottom: "40px",
        }}
      >
        {/* Line Chart */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(114, 47, 55, 0.1)",
            overflow: "hidden",
            border: "1px solid #E8D5D1",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #722F37 0%, #8B4513 100%)",
              color: "white",
              padding: "25px",
              borderBottom: "none",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0", marginBottom: "5px" }}>
              Spending Over Time ({view})
            </h3>
            <p style={{ margin: "0", opacity: "0.9" }}>Track your spending patterns</p>
          </div>
          <div style={{ padding: "30px" }}>
            <div style={{ height: "400px" }}>
              <LineChartComponent data={lineChartData} view={view} />
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(114, 47, 55, 0.1)",
            overflow: "hidden",
            border: "1px solid #E8D5D1",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #A0522D 0%, #CD853F 100%)",
              color: "white",
              padding: "25px",
              borderBottom: "none",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0", marginBottom: "5px" }}>
              Spending by Category
            </h3>
            <p style={{ margin: "0", opacity: "0.9" }}>See where your money goes</p>
          </div>
          <div style={{ padding: "30px" }}>
            <div style={{ height: "400px" }}>
              <PieChartComponent data={pieChartData} total={totalSpending} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(114, 47, 55, 0.1)",
          overflow: "hidden",
          border: "1px solid #E8D5D1",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
            color: "white",
            padding: "25px",
            borderBottom: "none",
          }}
        >
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0", marginBottom: "5px" }}>
            Category Breakdown
          </h3>
          <p style={{ margin: "0", opacity: "0.9" }}>Detailed spending analysis by category</p>
        </div>
        <div style={{ padding: "30px" }}>
          {categoryBreakdown.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#722F37", marginBottom: "10px" }}>
                No spending data available
              </h3>
              <p style={{ color: "#8B4513", fontSize: "1.1rem" }}>
                Add some entries in the Journal to see your analytics and spending breakdown
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "1rem",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #E8D5D1" }}>
                    <th style={{ padding: "15px", textAlign: "left", color: "#722F37", fontWeight: "600" }}>
                      Category
                    </th>
                    <th style={{ padding: "15px", textAlign: "right", color: "#722F37", fontWeight: "600" }}>Amount</th>
                    <th style={{ padding: "15px", textAlign: "right", color: "#722F37", fontWeight: "600" }}>
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.map((item, index) => (
                    <tr
                      key={item.category}
                      style={{
                        borderBottom: "1px solid #F5F5DC",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#FEFCF8")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      <td style={{ padding: "15px", fontWeight: "600", color: "#722F37" }}>{item.category}</td>
                      <td style={{ padding: "15px", textAlign: "right", fontWeight: "600", color: "#8B4513" }}>
                        ฿{item.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: "15px", textAlign: "right" }}>
                        <span
                          style={{
                            padding: "6px 12px",
                            background: "linear-gradient(135deg, #F0E6D2 0%, #E8D5D1 100%)",
                            color: "#722F37",
                            borderRadius: "15px",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            border: "1px solid #D2B48C",
                          }}
                        >
                          {item.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
