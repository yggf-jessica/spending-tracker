"use client"

import { useState, useEffect } from "react"
import categoriesData from "../data/spending_data.json"
import {
  getSpendingEntries,
  saveSpendingEntries,
  getCustomCategories,
  saveCustomCategories,
  generateId,
} from "../utils/LocalStorageHelpers"

function Journal() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load categories
    const customCategories = getCustomCategories()
    const defaultCategories = categoriesData.map((c) => c.category)
    const allCategories = [...defaultCategories, ...customCategories]
    setCategories(allCategories)

    // Load entries
    const loadedEntries = getSpendingEntries()
    setEntries(loadedEntries)
  }

  const addEntry = async () => {
    if (!date || !category || !amount) {
      alert("Please fill in all fields")
      return
    }

    const numAmount = Number.parseFloat(amount)
    if (numAmount <= 0) {
      alert("Please enter a valid amount greater than 0")
      return
    }

    setIsLoading(true)

    const newEntry = {
      id: generateId(),
      date,
      category,
      amount: numAmount,
      createdAt: new Date().toISOString(),
    }

    const updatedEntries = [...entries, newEntry]

    if (saveSpendingEntries(updatedEntries)) {
      setEntries(updatedEntries)
      // Reset form
      setDate(new Date().toISOString().split("T")[0])
      setCategory("")
      setAmount("")
      alert("Entry saved successfully! ✅")
    } else {
      alert("Error saving entry. Please try again.")
    }

    setIsLoading(false)
  }

  const deleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const updatedEntries = entries.filter((entry) => entry.id !== id)
      if (saveSpendingEntries(updatedEntries)) {
        setEntries(updatedEntries)
      } else {
        alert("Error deleting entry. Please try again.")
      }
    }
  }

  const addCustomCategory = () => {
    if (!customCategory.trim()) {
      alert("Please enter a category name")
      return
    }

    const trimmedCategory = customCategory.trim()

    if (categories.includes(trimmedCategory)) {
      alert("Category already exists!")
      return
    }

    const customCategories = getCustomCategories()
    const updatedCustomCategories = [...customCategories, trimmedCategory]

    if (saveCustomCategories(updatedCustomCategories)) {
      setCategories([...categories, trimmedCategory])
      setCustomCategory("")
      alert("Category added successfully! ✅")
    } else {
      alert("Error adding category. Please try again.")
    }
  }

  const recentEntries = entries
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 10)

  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Journal Entry</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 mb-8">
        {/* Add Entry Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Add New Entry</h3>
            <p className="card-description">Record your spending</p>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
              />
            </div>

            <button onClick={addEntry} disabled={isLoading} className="btn btn-primary" style={{ width: "100%" }}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Adding...
                </>
              ) : (
                "Add Entry"
              )}
            </button>
          </div>
        </div>

        {/* Add Custom Category */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Manage Categories</h3>
            <p className="card-description">Add custom spending categories</p>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label className="form-label">Add New Category</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button onClick={addCustomCategory} className="btn btn-success">
                  Add
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Available Categories ({categories.length})</label>
              <div
                style={{
                  maxHeight: "160px",
                  overflowY: "auto",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                }}
              >
                <div className="flex" style={{ flexWrap: "wrap", gap: "8px" }}>
                  {categories.map((cat) => (
                    <span key={cat} className="badge">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Entries</h3>
          <p className="card-description">Your latest spending records</p>
        </div>
        <div className="card-content">
          {recentEntries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No entries yet</h3>
              <p>Add your first spending entry above to get started tracking your expenses!</p>
            </div>
          ) : (
            <div>
              {recentEntries.map((entry) => (
                <div key={entry.id} className="entry-item">
                  <div className="entry-info">
                    <div className="entry-date">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="badge badge-primary">{entry.category}</div>
                    <div className="entry-amount">${entry.amount.toFixed(2)}</div>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)} className="btn btn-danger">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Journal
