export const getSpendingEntries = () => {
  try {
    return JSON.parse(localStorage.getItem("spendingEntries") || "[]")
  } catch (error) {
    console.error("Error loading spending entries:", error)
    return []
  }
}

export const saveSpendingEntries = (entries) => {
  try {
    localStorage.setItem("spendingEntries", JSON.stringify(entries))
    return true
  } catch (error) {
    console.error("Error saving spending entries:", error)
    return false
  }
}

export const getCustomCategories = () => {
  try {
    return JSON.parse(localStorage.getItem("customCategories") || "[]")
  } catch (error) {
    console.error("Error loading custom categories:", error)
    return []
  }
}

export const saveCustomCategories = (categories) => {
  try {
    localStorage.setItem("customCategories", JSON.stringify(categories))
    return true
  } catch (error) {
    console.error("Error saving custom categories:", error)
    return false
  }
}

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}
