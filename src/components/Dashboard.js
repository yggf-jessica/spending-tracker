"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import { LineChartComponent } from "./LineChartComponent"
import { PieChartComponent } from "./PieChartComponent"
import { getSpendingEntries } from "../utils/LocalStorageHelpers"

dayjs.extend(isoWeek)

const Dashboard = () => {
  const [view, setView] = useState("weekly")
  const [entries, setEntries] = useState([])
  const [lineChartData, setLineChartData] = useState({})
  const [pieChartData, setPieChartData] = useState({})
  const [totalSpending, setTotalSpending] = useState(0)
  const [selectedMonthTotal, setSelectedMonthTotal] = useState(0)
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
      setSelectedMonthTotal(0)
      setCategoryBreakdown([])
      return
    }

    // Calculate total spending
    const total = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0)
    setTotalSpending(total)

    // Calculate current month total
    const currentMonth = dayjs().format("YYYY-MM")
    const monthTotal = entries
      .filter((entry) => dayjs(entry.date).format("YYYY-MM") === currentMonth)
      .reduce((sum, entry) => sum + (entry.amount || 0), 0)
    setSelectedMonthTotal(monthTotal)

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

  return (
    <div className="container">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={() => setView("daily")} className={`btn btn-outline ${view === "daily" ? "active" : ""}`}>
            Daily
          </button>
          <button onClick={() => setView("weekly")} className={`btn btn-outline ${view === "weekly" ? "active" : ""}`}>
            Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`btn btn-outline ${view === "monthly" ? "active" : ""}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 mb-8">
        <div className="card summary-card primary">
          <div className="card-content">
            <div className="summary-value">${totalSpending.toFixed(2)}</div>
            <div className="summary-label">Total Spending (All Time)</div>
          </div>
        </div>
        <div className="card summary-card success">
          <div className="card-content">
            <div className="summary-value">${selectedMonthTotal.toFixed(2)}</div>
            <div className="summary-label">This Month</div>
          </div>
        </div>
        <div className="card summary-card warning">
          <div className="card-content">
            <div className="summary-value">{entries.length}</div>
            <div className="summary-label">Total Entries</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-8">
        {/* Line Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Spending Over Time ({view})</h3>
            <p className="card-description">Track your spending patterns</p>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <LineChartComponent data={lineChartData} view={view} />
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Spending by Category</h3>
            <p className="card-description">See where your money goes</p>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <PieChartComponent data={pieChartData} total={totalSpending} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Category Breakdown</h3>
          <p className="card-description">Detailed spending analysis by category</p>
        </div>
        <div className="card-content">
          {categoryBreakdown.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3>No spending data available</h3>
              <p>Add some entries in the Journal to see your analytics and spending breakdown!</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.map((item, index) => (
                    <tr key={item.category}>
                      <td className="font-semibold">{item.category}</td>
                      <td className="text-right font-semibold">${item.amount.toFixed(2)}</td>
                      <td className="text-right">
                        <span className="badge badge-primary">{item.percentage}%</span>
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
