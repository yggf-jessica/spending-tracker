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

const Journal = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Edit states
  const [editingId, setEditingId] = useState(null)
  const [editDate, setEditDate] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editAmount, setEditAmount] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const customCategories = getCustomCategories()
    const defaultCategories = categoriesData.map((c) => c.category)
    const allCategories = [...defaultCategories, ...customCategories]
    setCategories(allCategories)
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

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

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
      setDate(new Date().toISOString().split("T")[0])
      setCategory("")
      setAmount("")
      alert("Entry saved successfully!")
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

  const startEdit = (entry) => {
    setEditingId(entry.id)
    setEditDate(entry.date)
    setEditCategory(entry.category)
    setEditAmount(entry.amount.toString())
  }

  const saveEdit = () => {
    if (!editDate || !editCategory || !editAmount) {
      alert("Please fill in all fields")
      return
    }

    const numAmount = Number.parseFloat(editAmount)
    if (numAmount <= 0) {
      alert("Please enter a valid amount greater than 0")
      return
    }

    const updatedEntries = entries.map((entry) =>
      entry.id === editingId ? { ...entry, date: editDate, category: editCategory, amount: numAmount } : entry,
    )
    if (saveSpendingEntries(updatedEntries)) {
      setEntries(updatedEntries)
      setEditingId(null)
      alert("Entry updated!")
    } else {
      alert("Error updating entry.")
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
      alert("Category added successfully!")
    } else {
      alert("Error adding category. Please try again.")
    }
  }

  const deleteCustomCategory = (cat) => {
    const defaultCategories = categoriesData.map((c) => c.category)

    if (defaultCategories.includes(cat)) {
      alert("Default categories cannot be deleted!")
      return
    }

    if (window.confirm(`Delete custom category "${cat}"?`)) {
      const updatedCustomCategories = getCustomCategories().filter((c) => c !== cat)
      if (saveCustomCategories(updatedCustomCategories)) {
        setCategories(categories.filter((c) => c !== cat))
      } else {
        alert("Error deleting category.")
      }
    }
  }

  const recentEntries = entries
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 10)

  const customCategories = getCustomCategories()
  const defaultCategories = categoriesData.map((c) => c.category)

  return (
    <div
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #faf7f5 0%, #f1ede8 100%)", padding: "20px" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", paddingTop: "20px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#722F37", marginBottom: "10px" }}>
          Spending Journal
        </h1>
        <p style={{ color: "#8B4513", fontSize: "1.1rem" }}>Track your expenses and manage your budget</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {/* Add Entry Form */}
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
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              Add New Entry
            </h3>
            <p style={{ margin: "5px 0 0 0", opacity: "0.9" }}>Record your spending transaction</p>
          </div>
          <div style={{ padding: "30px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#722F37" }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "2px solid #E8D5D1",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#722F37")}
                onBlur={(e) => (e.target.style.borderColor = "#E8D5D1")}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#722F37" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "2px solid #E8D5D1",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                  background: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#722F37")}
                onBlur={(e) => (e.target.style.borderColor = "#E8D5D1")}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#722F37" }}>
                Amount (฿)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "2px solid #E8D5D1",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#722F37")}
                onBlur={(e) => (e.target.style.borderColor = "#E8D5D1")}
              />
            </div>
            <button
              onClick={addEntry}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "15px",
                background: isLoading ? "#9ca3af" : "linear-gradient(135deg, #722F37 0%, #8B4513 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                transform: isLoading ? "none" : "translateY(0)",
                boxShadow: "0 5px 15px rgba(114, 47, 55, 0.4)",
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => !isLoading && (e.target.style.transform = "translateY(0)")}
            >
              {isLoading ? "Adding Entry..." : "Add Entry"}
            </button>
          </div>
        </div>

        {/* Add Custom Category */}
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
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              Manage Categories
            </h3>
            <p style={{ margin: "5px 0 0 0", opacity: "0.9" }}>Add and organize your spending categories</p>
          </div>
          <div style={{ padding: "30px" }}>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#722F37" }}>
                Add New Category
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name"
                  style={{
                    flex: "1",
                    padding: "12px 15px",
                    border: "2px solid #E8D5D1",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#A0522D")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8D5D1")}
                  onKeyDown={(e) => e.key === "Enter" && addCustomCategory()}
                />
                <button
                  onClick={addCustomCategory}
                  style={{
                    padding: "12px 20px",
                    background: "linear-gradient(135deg, #A0522D 0%, #CD853F 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "15px", fontWeight: "600", color: "#722F37" }}>
                Available Categories ({categories.length})
              </label>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "2px solid #F5F5DC",
                  borderRadius: "15px",
                  padding: "20px",
                  backgroundColor: "#FEFCF8",
                }}
              >
                {/* Default Categories */}
                {defaultCategories.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#8B4513",
                        marginBottom: "15px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Default Categories
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {defaultCategories.map((cat) => (
                        <span
                          key={cat}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "10px 15px",
                            background: "linear-gradient(135deg, #F5F5DC 0%, #E8D5D1 100%)",
                            color: "#722F37",
                            borderRadius: "25px",
                            fontSize: "0.95rem",
                            fontWeight: "500",
                            border: "1px solid #E8D5D1",
                            minWidth: "fit-content",
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Categories */}
                {customCategories.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#8B4513",
                        marginBottom: "15px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Custom Categories
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {customCategories.map((cat) => (
                        <span
                          key={cat}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 15px",
                            background: "linear-gradient(135deg, #F0E6D2 0%, #E8D5D1 100%)",
                            color: "#722F37",
                            borderRadius: "25px",
                            fontSize: "0.95rem",
                            fontWeight: "500",
                            border: "1px solid #D2B48C",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            minWidth: "fit-content",
                          }}
                          onClick={() => deleteCustomCategory(cat)}
                          onMouseEnter={(e) => {
                            e.target.style.background = "linear-gradient(135deg, #F5C6CB 0%, #F8D7DA 100%)"
                            e.target.style.color = "#721C24"
                            e.target.style.borderColor = "#F5C6CB"
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "linear-gradient(135deg, #F0E6D2 0%, #E8D5D1 100%)"
                            e.target.style.color = "#722F37"
                            e.target.style.borderColor = "#D2B48C"
                          }}
                        >
                          {cat}
                          <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>×</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {categories.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#8B4513" }}>
                    <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>No categories available</p>
                    <p style={{ fontSize: "0.95rem", opacity: "0.8" }}>Add your first category above to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
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
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              margin: "0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Recent Entries
          </h3>
          <p style={{ margin: "5px 0 0 0", opacity: "0.9" }}>Your latest spending records</p>
        </div>
        <div style={{ padding: "30px" }}>
          {recentEntries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#722F37", marginBottom: "10px" }}>
                No entries yet
              </h3>
              <p style={{ color: "#8B4513", fontSize: "1.1rem" }}>
                Add your first spending entry above to get started tracking your expenses!
              </p>
            </div>
          ) : (
            <div>
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "20px",
                    marginBottom: "15px",
                    border: "2px solid #F5F5DC",
                    borderRadius: "15px",
                    transition: "all 0.3s ease",
                    background: "#FEFCF8",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#E8D5D1"
                    e.target.style.boxShadow = "0 5px 15px rgba(114, 47, 55, 0.1)"
                    e.target.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#F5F5DC"
                    e.target.style.boxShadow = "none"
                    e.target.style.transform = "translateY(0)"
                  }}
                >
                  {editingId === entry.id ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "15px",
                        alignItems: "end",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "5px",
                            fontSize: "0.9rem",
                            color: "#722F37",
                            fontWeight: "500",
                          }}
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "2px solid #E8D5D1",
                            borderRadius: "8px",
                            outline: "none",
                            fontSize: "1rem",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "5px",
                            fontSize: "0.9rem",
                            color: "#722F37",
                            fontWeight: "500",
                          }}
                        >
                          Category
                        </label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "2px solid #E8D5D1",
                            borderRadius: "8px",
                            outline: "none",
                            fontSize: "1rem",
                            background: "white",
                          }}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "5px",
                            fontSize: "0.9rem",
                            color: "#722F37",
                            fontWeight: "500",
                          }}
                        >
                          Amount (฿)
                        </label>
                        <input
                          type="text"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          placeholder="0.00"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "2px solid #E8D5D1",
                            borderRadius: "8px",
                            outline: "none",
                            fontSize: "1rem",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={saveEdit}
                          style={{
                            padding: "10px 15px",
                            background: "#228B22",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "0.9rem",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: "10px 15px",
                            background: "#8B4513",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "0.9rem",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "15px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "#8B4513",
                            fontWeight: "500",
                            minWidth: "100px",
                          }}
                        >
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div
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
                          {entry.category}
                        </div>
                        <div
                          style={{
                            fontSize: "1.3rem",
                            fontWeight: "bold",
                            color: "#722F37",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          ฿{entry.amount.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => startEdit(entry)}
                          style={{
                            padding: "8px 15px",
                            background: "#A0522D",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.target.style.background = "#8B4513")}
                          onMouseLeave={(e) => (e.target.style.background = "#A0522D")}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          style={{
                            padding: "8px 15px",
                            background: "#B22222",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.target.style.background = "#8B0000")}
                          onMouseLeave={(e) => (e.target.style.background = "#B22222")}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
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
