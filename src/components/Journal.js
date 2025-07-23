// import React, { useState, useEffect } from "react";
// import categoriesData from "../data/spending_data.json";

// function Journal() {
//   const [date, setDate] = useState("");
//   const [category, setCategory] = useState("");
//   const [amount, setAmount] = useState("");
//   const [customCategory, setCustomCategory] = useState("");
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const custom = JSON.parse(localStorage.getItem("customCategories")) || [];
//     const all = [...categoriesData.map(c => c.category), ...custom];
//     setCategories(all);
//   }, []);

//   const addEntry = () => {
//     const entry = { date, category, amount: parseFloat(amount) };
//     const prev = JSON.parse(localStorage.getItem("spendingEntries")) || [];
//     localStorage.setItem("spendingEntries", JSON.stringify([...prev, entry]));
//     setDate(""); setCategory(""); setAmount("");
//   };

//   const addCustomCategory = () => {
//     const custom = JSON.parse(localStorage.getItem("customCategories")) || [];
//     if (!custom.includes(customCategory)) {
//       const updated = [...custom, customCategory];
//       localStorage.setItem("customCategories", JSON.stringify(updated));
//       setCategories([...categories, customCategory]);
//     }
//     setCustomCategory("");
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-2">Journal Entry</h2>
//       <div className="space-y-2">
//         <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border" />
//         <select value={category} onChange={e => setCategory(e.target.value)} className="border">
//           <option value="">Select category</option>
//           {categories.map(cat => <option key={cat}>{cat}</option>)}
//         </select>
//         <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border" />
//         <button onClick={addEntry}>Add Entry</button>
//       </div>

//       <div className="mt-4">
//         <h3>Add New Category</h3>
//         <input value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="border" />
//         <button onClick={addCustomCategory}>Save Category</button>
//       </div>
//     </div>
//   );
// }


// export default Journal;


import React from "react";

function Journal() {
  return <div><h2>Journal Page ✅</h2></div>;
}

export default Journal;