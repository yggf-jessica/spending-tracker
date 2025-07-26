import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChartComponent = ({ data = {}, total = 0 }) => {
  const labels = Object.keys(data)
  const values = Object.values(data)

  const colors = [
    "#722F37", // Deep burgundy
    "#8B4513", // Saddle brown
    "#A0522D", // Sienna
    "#CD853F", // Peru
    "#D2B48C", // Tan
    "#DEB887", // Burlywood
    "#F4A460", // Sandy brown
    "#DAA520", // Goldenrod
    "#B8860B", // Dark goldenrod
    "#9ACD32", // Yellow green
    "#8FBC8F", // Dark sea green
    "#20B2AA", // Light sea green
    "#4682B4", // Steel blue
    "#6495ED", // Cornflower blue
    "#9370DB", // Medium purple
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
          color: "#722F37",
          font: {
            size: 11,
            weight: "500",
          },
          generateLabels: (chart) => {
            const data = chart.data
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i]
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                return {
                  text: `${label}: ฿${value.toFixed(2)} (${percentage}%)`,
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
        backgroundColor: "rgba(114, 47, 55, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#722F37",
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const value = context.parsed
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
            return `${context.label}: ฿${value.toFixed(2)} (${percentage}%)`
          },
        },
      },
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
          <p style={{ fontSize: "1rem", color: "#8B4513" }}>Add some spending entries to see your breakdown</p>
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

export default PieChartComponent
