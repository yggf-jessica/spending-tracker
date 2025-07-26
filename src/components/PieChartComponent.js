import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export const PieChartComponent = ({ data = {}, total = 0 }) => {
  const labels = Object.keys(data)
  const values = Object.values(data)

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
    "#14b8a6",
    "#f43f5e",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
  ]

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          generateLabels: (chart) => {
            const data = chart.data
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i]
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                return {
                  text: `${label}: $${value.toFixed(2)} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i,
                }
              })
            }
            return []
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#3b82f6",
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const value = context.parsed
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`
          },
        },
      },
    },
  }

  if (labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No data available</p>
          <p className="text-sm">Add some spending entries to see your breakdown</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}
