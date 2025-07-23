import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChartComponent = ({ groupedData }) => {
  const categoryTotals = {};

  Object.values(groupedData).forEach(periodData => {
    Object.entries(periodData).forEach(([category, amount]) => {
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
  });

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};