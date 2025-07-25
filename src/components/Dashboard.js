
// import React, { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import isoWeek from "dayjs/plugin/isoWeek";
// import { LineChartComponent } from "./LineChartComponent";
// import { PieChartComponent } from "./PieChartComponent";

// dayjs.extend(isoWeek);

// const Dashboard = () => {
//   const [view, setView] = useState("weekly");
//   const [data, setData] = useState([]);
//   const [groupedData, setGroupedData] = useState({});
//   const [categoryTotals, setCategoryTotals] = useState({});
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     const entries = JSON.parse(localStorage.getItem("spendingEntries")) || [];
//     setData(entries);
//     const grouped = groupByPeriod(entries, view);
//     setGroupedData(grouped);

//     const catTotals = {};
//     let totalAmount = 0;
//     entries.forEach(e => {
//       catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
//       totalAmount += Number(e.amount);
//     });
//     setCategoryTotals(catTotals);
//     setTotal(totalAmount);
//   }, [view]);

//   const groupByPeriod = (entries, period) => {
//     const result = {};
//     entries.forEach(e => {
//       const key =
//         period === "daily"
//           ? dayjs(e.date).format("YYYY-MM-DD")
//           : period === "weekly"
//           ? `${dayjs(e.date).isoWeek()}-${dayjs(e.date).year()}`
//           : dayjs(e.date).format("YYYY-MM");

//       if (!result[key]) result[key] = 0;
//       result[key] += Number(e.amount);
//     });
//     return result;
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">Expenses</h2>
//         <div className="space-x-2">
//           <button onClick={() => setView("daily")} className="border px-3 py-1 rounded">Daily</button>
//           <button onClick={() => setView("weekly")} className="border px-3 py-1 rounded">Weekly</button>
//           <button onClick={() => setView("monthly")} className="border px-3 py-1 rounded">Monthly</button>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-6 items-center">
//         <div className="w-full md:w-1/2 h-[320px]">
//           <PieChartComponent data={categoryTotals} total={total} />
//         </div>
//         <div className="w-full md:w-1/2">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left">
//                 <th>Category</th>
//                 <th>Total</th>
//                 <th>%</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(categoryTotals).map(([cat, amt]) => (
//                 <tr key={cat} className="border-t">
//                   <td>{cat}</td>
//                   <td>${amt.toFixed(2)}</td>
//                   <td>{((amt / total) * 100).toFixed(0)}%</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="mt-8 w-full h-[350px]">
//         <LineChartComponent data={groupedData} view={view} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { LineChartComponent } from "./LineChartComponent";
import { PieChartComponent } from "./PieChartComponent";

dayjs.extend(isoWeek);

const Dashboard = () => {
  const [view, setView] = useState("weekly");
  const [groupedData, setGroupedData] = useState({});
  const [categoryTotals, setCategoryTotals] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("spendingEntries")) || [];

    const grouped = groupByPeriod(entries, view);
    setGroupedData(grouped);

    const catTotals = {};
    let totalAmount = 0;
    entries.forEach(e => {
      if (!e || !e.amount || !e.category) return;
      catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
      totalAmount += Number(e.amount);
    });
    setCategoryTotals(catTotals);
    setTotal(totalAmount);
  }, [view]);

  const groupByPeriod = (entries, period) => {
    const result = {};
    entries.forEach(e => {
      if (!e || !e.date || !e.amount) return;
      const key =
        period === "daily"
          ? dayjs(e.date).format("YYYY-MM-DD")
          : period === "weekly"
          ? `${dayjs(e.date).isoWeek()}-${dayjs(e.date).year()}`
          : dayjs(e.date).format("YYYY-MM");

      if (!result[key]) result[key] = 0;
      result[key] += Number(e.amount);
    });
    return result;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <div className="space-x-2">
          <button onClick={() => setView("daily")} className="border px-3 py-1 rounded">Daily</button>
          <button onClick={() => setView("weekly")} className="border px-3 py-1 rounded">Weekly</button>
          <button onClick={() => setView("monthly")} className="border px-3 py-1 rounded">Monthly</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {Object.keys(categoryTotals || {}).length > 0 && (
          <div className="w-full md:w-1/2 h-[320px]">
            <PieChartComponent data={categoryTotals} total={total} />
          </div>
        )}
        <div className="w-full md:w-1/2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th>Category</th>
                <th>Total</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryTotals).map(([cat, amt]) => (
                <tr key={cat} className="border-t">
                  <td>{cat}</td>
                  <td>${amt.toFixed(2)}</td>
                  <td>{((amt / total) * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 w-full h-[350px]">
        <LineChartComponent data={groupedData} view={view} />
      </div>
    </div>
  );
};

export default Dashboard;
