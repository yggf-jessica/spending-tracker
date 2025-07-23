// import React, { useState, useEffect } from "react";
// import { LineChartComponent } from "./LineChartComponent";
// import { PieChartComponent } from "./PieChartComponent";
// import { groupByTimePeriod, calculateTotals } from "../utils/LocalStorageHelpers";

// function Dashboard() {
//   const [view, setView] = useState("monthly");
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const entries = JSON.parse(localStorage.getItem("spendingEntries")) || [];
//     setData(entries);
//   }, []);

//   const grouped = groupByTimePeriod(data, view);
//   const totals = calculateTotals(data);

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-2">Analytics Dashboard</h2>

//       <div className="space-x-2 mb-2">
//         <button onClick={() => setView("daily")}>Daily</button>
//         <button onClick={() => setView("weekly")}>Weekly</button>
//         <button onClick={() => setView("monthly")}>Monthly</button>
//       </div>

//       <p>Total Spending (All Time): ${totals.allTime}</p>
//       <p>Total Spending (This {view}): ${totals[view]}</p>

//       <div className="my-4">
//         <LineChartComponent data={grouped} view={view} />
//         <PieChartComponent data={grouped} />
//       </div>
//     </div>
//   );
// }



// export default Dashboard;

import React from "react";

function Dashboard() {
  return <div><h2>Dashboard Page ✅</h2></div>;
}

export default Dashboard;