// File: src/components/PieChartComponent.js
import React from "react";
import { Pie } from "react-chartjs-2";

export const PieChartComponent = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: "Category Breakdown",
      data: Object.values(data),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
    }]
  };

  return <Pie data={chartData} />;
};