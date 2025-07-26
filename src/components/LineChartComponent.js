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

const LineChartComponent = ({ data = {}, view }) => {
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
        borderColor: "#722F37",
        backgroundColor: "rgba(114, 47, 55, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#722F37",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#8B4513",
        pointHoverBorderColor: "#ffffff",
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
          color: "#722F37",
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(114, 47, 55, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#722F37",
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.dataset.label}: ฿${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time Period",
          font: { size: 12, weight: "bold" },
          color: "#722F37",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#8B4513",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (฿)",
          font: { size: 12, weight: "bold" },
          color: "#722F37",
        },
        beginAtZero: true,
        grid: {
          color: "rgba(114, 47, 55, 0.1)",
        },
        ticks: {
          callback: (value) => "฿" + value.toFixed(0),
          color: "#8B4513",
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#8B4513",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#722F37" }}>No data available</p>
          <p style={{ fontSize: "1rem", color: "#8B4513" }}>Add some spending entries to see your chart</p>
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

export default LineChartComponent
