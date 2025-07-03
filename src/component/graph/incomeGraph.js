import '../css/incomeGraph.css';
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const IncomeGraph = () => {
  const [incomeData, setIncomeData] = useState([]);

  const jours = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const labels = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("incomeList")) || [];
    setIncomeData(storedData);
  }, []);

  // Initialiser un total par jour
  const totals = {
    Lundi: 0,
    Mardi: 0,
    Mercredi: 0,
    Jeudi: 0,
    Vendredi: 0,
    Samedi: 0,
    Dimanche: 0,
  };

  incomeData.forEach((item) => {
    const date = new Date(item.date);
    const dayIndex = date.getDay(); // 0 (Dimanche) → 6 (Samedi)
    const dayName = jours[dayIndex];
    const amount = parseFloat(item.amount) || 0;
    totals[dayName] += amount;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Versements par jour de la semaine",
        data: labels.map((day) => totals[day]), // Lundi → Dimanche
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Totaux de versements par jour de la semaine",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Montant (Ar)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Jour",
        },
      },
    },
  };

  return (
    <div className='income-graph'>
      <Line data={data} options={options} />
    </div>
  );
};

export default IncomeGraph;
