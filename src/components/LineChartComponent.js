import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler)

export const LineChartComponent = ({ data = {}, view }) => {
  const labels = Object.keys(data || {}).sort()
  const values = labels.map((label) => data[label] || 0)

  // Format labels based on view type
  const formatLabel = (label, viewType) => {
    switch (viewType) {
      case "daily":
        return new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "weekly":
        const [year, week] = label.split("-W")
        return `W${week} ${year}`
      case "monthly":
        return new Date(label + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" })
      default:
        return label
    }
  }

  const formattedLabels = labels.map((label) => formatLabel(label, view))

  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        label: `Spending (${view})`,
        data: values,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#3b82f6",
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time Period",
          font: { size: 12, weight: "bold" },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
          font: { size: 12, weight: "bold" },
        },
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value) => "$" + value.toFixed(0),
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  }

  if (labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No data available</p>
          <p className="text-sm">Add some spending entries to see your chart</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
