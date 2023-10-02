import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Chart from 'chart.js/auto';

const socket = io('http://localhost:3000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [temperaturaData, setTemperaturaData] = useState([]);
  const [selectedPlaca, setSelectedPlaca] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));

    socket.on('temperatura_data', (data) => {
      if (Array.isArray(data) && data.length >= 1) {
        setTemperaturaData(data[0]);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('temperatura_data');
    };
  }, []);

  useEffect(() => {
    if (selectedPlaca !== null) {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');

        // Limpia el gráfico anterior si existe
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const filteredData = temperaturaData.filter(
          (temperatura) => temperatura.IdPlaca === selectedPlaca
        );

        const labels = filteredData.map((temperatura) => {
          const timestamp = new Date(temperatura.TimeStamp * 1000);
          return timestamp.toLocaleTimeString();
        });

        const data = filteredData.map((temperatura) => parseFloat(temperatura.Temperatura));

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: `Temperatura Placa ${selectedPlaca}`,
                data,
                borderColor: 'blue',
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true, // Establece esto en true para que el gráfico se ajuste al contenedor
            aspectRatio: 2, // Cambia el aspectRatio según tus preferencias
          },
        });
      }
    }
  }, [selectedPlaca, temperaturaData]);

  const handlePlacaSelect = (idPlaca) => {
    setSelectedPlaca(idPlaca);
  };

  const uniquePlacas = [
    ...new Set(temperaturaData.map((temperatura) => temperatura.IdPlaca)),
  ];

  return (
    <div className="App">
      <h2>{isConnected ? 'CONECTADO' : 'NO CONECTADO'}</h2>
      <canvas ref={chartRef}></canvas>
      <div>
        {temperaturaData.length > 0 && (
          <div>
            <h3>Selecciona una placa:</h3>
            <div>
              {uniquePlacas.map((idPlaca) => (
                <button
                  key={idPlaca}
                  onClick={() => handlePlacaSelect(idPlaca)}
                >
                  Placa {idPlaca}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
