import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [temperaturaData, setTemperaturaData] = useState([]);
  const [humedadData, setHumedadData] = useState([]);
  const [selectedPlaca, setSelectedPlaca] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Realizar una solicitud GET para obtener los datos de temperatura y humedad
    fetch('http://localhost:3000/temperatura')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.message === 'Temperatura recuperada exitosamente' && data.data) {
          setTemperaturaData(data.data);
          // Filtrar los datos de humedad y guardarlos en humedadData
          setHumedadData(
            data.data.map((item) => ({
              ...item,
              Humedad: parseFloat(item.Humedad),
            }))
          );
        }
      })
      .catch((error) => {
        console.error('Error al obtener datos de temperatura y humedad:', error);
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

        const filteredDataTemperatura = temperaturaData.filter(
          (temperatura) => temperatura.IdPlaca === selectedPlaca
        );

        const filteredDataHumedad = humedadData.filter(
          (humedad) => humedad.IdPlaca === selectedPlaca
        );

        const labels = filteredDataTemperatura.map((temperatura) => {
          const timestamp = new Date(temperatura.TimeStamp * 1000);
          return timestamp.toLocaleTimeString();
        });

        const dataTemperatura = filteredDataTemperatura.map((temperatura) =>
          parseFloat(temperatura.Temperatura)
        );

        const dataHumedad = filteredDataHumedad.map((humedad) =>
          parseFloat(humedad.Humedad)
        );

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: `Temperatura Placa ${selectedPlaca}`,
                data: dataTemperatura,
                borderColor: 'blue',
                fill: false,
              },
              {
                label: `Humedad Placa ${selectedPlaca}`,
                data: dataHumedad,
                borderColor: 'green',
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
  }, [selectedPlaca, temperaturaData, humedadData]);

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
