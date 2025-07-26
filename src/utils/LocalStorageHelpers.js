export const getSpendingEntries = () => {
  if (typeof window === "undefined") return []
  try {
    const entries = localStorage.getItem("spendingEntries")
    return entries ? JSON.parse(entries) : []
  } catch (error) {
    console.error("Error loading spending entries:", error)
    return []
  }
}

export const saveSpendingEntries = (entries: any[]) => {
  if (typeof window === "undefined") return false
  try {
    localStorage.setItem("spendingEntries", JSON.stringify(entries))
    return true
  } catch (error) {
    console.error("Error saving spending entries:", error)
    return false
  }
}

export const getCustomCategories = () => {
  if (typeof window === "undefined") return []
  try {
    const categories = localStorage.getItem("customCategories")
    return categories ? JSON.parse(categories) : []
  } catch (error) {
    console.error("Error loading custom categories:", error)
    return []
  }
}

export const saveCustomCategories = (categories: string[]) => {
  if (typeof window === "undefined") return false
  try {
    localStorage.setItem("customCategories", JSON.stringify(categories))
    return true
  } catch (error) {
    console.error("Error saving custom categories:", error)
    return false
  }
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
