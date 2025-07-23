
// import React from "react";

// function Journal() {
//   return <div><h2>Journal Page ✅</h2></div>;
// }

// export default Journal;

import React, { useState, useEffect } from "react";
import categoriesData from "../data/spending_data.json";

function Journal() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const custom = JSON.parse(localStorage.getItem("customCategories")) || [];
    const all = [...categoriesData.map(c => c.category), ...custom];
    setCategories(all);
  }, []);

  const addEntry = () => {
    if (!date || !category || !amount) return;
    const entry = { date, category, amount: parseFloat(amount) };
    const prev = JSON.parse(localStorage.getItem("spendingEntries")) || [];
    localStorage.setItem("spendingEntries", JSON.stringify([...prev, entry]));
    setDate("");
    setCategory("");
    setAmount("");
    alert("Entry saved ✅");
  };

  const addCustomCategory = () => {
    if (!customCategory) return;
    const custom = JSON.parse(localStorage.getItem("customCategories")) || [];
    if (!custom.includes(customCategory)) {
      const updated = [...custom, customCategory];
      localStorage.setItem("customCategories", JSON.stringify(updated));
      setCategories([...categories, customCategory]);
    }
    setCustomCategory("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Journal Entry</h2>

      <div className="space-y-2">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border px-2 py-1 block w-full" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border px-2 py-1 block w-full">
          <option value="">Select category</option>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border px-2 py-1 block w-full" />
        <button onClick={addEntry} className="bg-blue-500 text-white px-4 py-2">Add Entry</button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Add New Category</h3>
        <div className="flex gap-2 mt-2">
          <input value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="border px-2 py-1 flex-1" placeholder="New category" />
          <button onClick={addCustomCategory} className="bg-green-500 text-white px-4">Save</button>
        </div>
      </div>
    </div>
  );
}

export default Journal;
