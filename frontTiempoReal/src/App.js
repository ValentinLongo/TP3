import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [temperaturaData, setTemperaturaData] = useState({});
  const [selectedPlaca, setSelectedPlaca] = useState(1);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    setIsConnected(true); // Simulamos que estamos conectados

    // Escuchar los datos enviados por el socket después de un POST
    socket.on('temperatura_data', (data) => {
      console.log('Datos recibidos del socket:', data); // Muestra los datos en la consola
      setTemperaturaData((prevData) => ({
        ...prevData,
        [data.IdPlaca]: [...(prevData[data.IdPlaca] || []), data],
      }));
    });

    return () => {
      socket.off('temperatura_data');
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Limpia el gráfico anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const dataForSelectedPlaca = temperaturaData[selectedPlaca] || [];

      const labels = dataForSelectedPlaca.map((temperatura) => {
        const timestamp = new Date(temperatura.TimeStamp * 1000);
        return timestamp.toLocaleTimeString();
      });

      const data = dataForSelectedPlaca.map((temperatura) =>
        parseFloat(temperatura.Temperatura)
      );

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
  }, [selectedPlaca, temperaturaData]);

  const handlePlacaSelect = (idPlaca) => {
    setSelectedPlaca(idPlaca);
  };

  const placas = Array.from({ length: 10 }, (_, i) => i + 1); // Generar un arreglo [1, 2, ..., 10]

  return (
    <div className="App">
      <h2>{isConnected ? 'CONECTADO' : 'NO CONECTADO'}</h2>
      <canvas ref={chartRef}></canvas>
      <div>
        <div>
          <h3>Selecciona una placa:</h3>
          <div>
            {placas.map((idPlaca) => (
              <button
                key={idPlaca}
                onClick={() => handlePlacaSelect(idPlaca)}
              >
                Placa {idPlaca}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
