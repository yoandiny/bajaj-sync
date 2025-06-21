import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const IncomeGraph = () => {
  const [incomeData, setIncomeData] = useState(JSON.parse(localStorage.getItem('incomeData')) || []);

  // Définir les labels (jours de la semaine)
  const labels = ['Lundi', 'Mercredi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Mettre à jour les données si localStorage change (optionnel)
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('incomeData')) || [];
    setIncomeData(storedData);
  }, []);

  // Préparer les données pour le graphique
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenus Quotidiens (Ar)',
        data: incomeData.length > 0 ? incomeData : Array(labels.length).fill(0), // Données ou zéros par défaut
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Options de configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenus Hebdomadaires (21 Juin 2025)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Montant (Ar)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Jours',
        },
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
      <h2>Graphique des Revenus</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default IncomeGraph;