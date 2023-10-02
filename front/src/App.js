import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [temperaturaData, setTemperaturaData] = useState([]);
  const [selectedPlaca, setSelectedPlaca] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Realizar una solicitud GET para obtener los datos de temperatura
    fetch('http://localhost:3000/temperatura')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.message === 'Temperatura recuperada exitosamente' && data.data) {
          setTemperaturaData(data.data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener datos de temperatura:', error);
      });

    setIsConnected(true); // Simulamos que estamos conectados
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
            maintainAspectRatio: true,
            aspectRatio: 2,
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
