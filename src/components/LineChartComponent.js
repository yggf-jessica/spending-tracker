import React from "react";
import { Line } from "react-chartjs-2";

export const LineChartComponent = ({ data, view }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: `Spending by ${view}`,
      data: Object.values(data),
      borderColor: "#4b9ce2",
      tension: 0.2
    }]
  };

  return <Line data={chartData} />;
};



