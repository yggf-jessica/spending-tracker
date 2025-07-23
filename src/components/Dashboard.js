import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { LineChartComponent } from "./LineChartComponent";
import { PieChartComponent } from "./PieChartComponent";

dayjs.extend(isoWeek);

const Dashboard = () => {
  const [view, setView] = useState("daily");
  const [groupedData, setGroupedData] = useState({});
  const [totalAllTime, setTotalAllTime] = useState(0);
  const [totalSelectedPeriod, setTotalSelectedPeriod] = useState(0);

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem("spendingEntries")) || [];

    const totalAll = rawData.reduce((sum, e) => sum + Number(e.amount), 0);
    setTotalAllTime(totalAll);

    const selectedMonth = dayjs().format("YYYY-MM");
    const totalMonth = rawData.reduce((sum, e) => {
      return e.date.startsWith(selectedMonth) ? sum + Number(e.amount) : sum;
    }, 0);
    setTotalSelectedPeriod(totalMonth);

    const grouped = groupByTimePeriod(rawData, view);
    setGroupedData(grouped);
  }, [view]);

  return (
    <div className="dashboard" style={{ padding: "1rem" }}>
      <h1>Analytics Dashboard</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("daily")}>Daily</button>
        <button onClick={() => setView("weekly")}>Weekly</button>
        <button onClick={() => setView("monthly")}>Monthly</button>
      </div>

      <div>
        <p><strong>Total Spending (All Time):</strong> ${totalAllTime.toFixed(2)}</p>
        <p><strong>Total Spending (This Month):</strong> ${totalSelectedPeriod.toFixed(2)}</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
        <div style={{ flex: 1, minWidth: "300px", maxWidth: "600px", height: "400px" }}>
          <LineChartComponent groupedData={groupedData} view={view} />
        </div>
        <div style={{ flex: 1, minWidth: "300px", maxWidth: "600px", height: "400px" }}>
          <PieChartComponent groupedData={groupedData} />
        </div>
      </div>
    </div>
  );
};

const groupByTimePeriod = (entries, period) => {
  const result = {};
  entries.forEach(e => {
    const key = period === "daily"
      ? dayjs(e.date).format("YYYY-MM-DD")
      : period === "weekly"
      ? `${dayjs(e.date).isoWeek()}-${dayjs(e.date).year()}`
      : dayjs(e.date).format("YYYY-MM");

    if (!result[key]) result[key] = {};
    if (!result[key][e.category]) result[key][e.category] = 0;
    result[key][e.category] += Number(e.amount);
  });
  return result;
};

export default Dashboard;