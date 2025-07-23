import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export const LineChartComponent = ({ groupedData, view }) => {
  const labels = Object.keys(groupedData);
  const dataPoints = labels.map(period =>
    Object.values(groupedData[period]).reduce((sum, val) => sum + val, 0)
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: `Spending by ${view}`,
        data: dataPoints,
        borderColor: "#4b9ce2",
        backgroundColor: "rgba(75, 156, 226, 0.4)",
        fill: true,
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false }
    },
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Amount ($)" } }
    }
  };

  return <Line data={chartData} options={options} />;
};