import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const UserBreakdownChart = ({ clientCount, proCount }) => {
  const data = {
    labels: ["Clients", "Handymen Pro"],
    datasets: [
      {
        data: [clientCount, proCount],
        backgroundColor: ["#3b82f6", "#ff7f00"], // Blue for Clients, Orange for Pros
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: "'Outfit', 'Inter', sans-serif",
            size: 12,
            weight: "600",
          },
          color: "#475569",
        },
      },
      tooltip: {
        titleFont: {
          family: "'Outfit', 'Inter', sans-serif",
          size: 13,
          weight: "700",
        },
        bodyFont: {
          family: "'Outfit', 'Inter', sans-serif",
          size: 12,
        },
        padding: 10,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        cornerRadius: 8,
      },
    },
    cutout: "70%", // Doughnut style cutout
  };

  return (
    <div style={{ height: "220px", position: "relative" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default UserBreakdownChart;
