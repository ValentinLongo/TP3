import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [temperaturaData, setTemperaturaData] = useState({});
  const [selectedPlaca, setSelectedPlaca] = useState(1);
  const [placaNombres, setPlacaNombres] = useState({
    1: 'Placa 1',
    2: 'Placa 2',
    3: 'Placa 3',
    4: 'Placa 4',
    5: 'Placa 5',
    6: 'Placa 6',
    7: 'Placa 7',
    8: 'Placa 8',
    9: 'Placa 9',
    10: 'Placa 10',
  });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    setIsConnected(true); // Simulamos que estamos conectados

    // Escuchar los datos enviados por el socket después de un POST
    socket.on('temperatura_data', (data) => {
      console.log('Datos recibidos del socket:', data); // Muestra los datos en la consola
      setTemperaturaData((prevData) => ({
        ...prevData,
        [data.IdPlaca]: [
          ...(prevData[data.IdPlaca] || []),
          {
            Temperatura: parseFloat(data.Temperatura),
            Humedad: parseFloat(data.Humedad),
            TimeStamp: data.TimeStamp,
          },
        ],
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

      const labels = dataForSelectedPlaca.map((data) => {
        const timestamp = new Date(data.TimeStamp * 1000);
        return timestamp.toLocaleTimeString();
      });

      const temperaturaDataArray = dataForSelectedPlaca.map((data) =>
        parseFloat(data.Temperatura)
      );

      const humedadDataArray = dataForSelectedPlaca.map((data) =>
        parseFloat(data.Humedad)
      );

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: `Temperatura ${placaNombres[selectedPlaca]}`,
              data: temperaturaDataArray,
              borderColor: 'blue',
              fill: false,
            },
            {
              label: `Humedad ${placaNombres[selectedPlaca]}`,
              data: humedadDataArray,
              borderColor: 'green',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2.5,
        },
      });
    }
  }, [selectedPlaca, temperaturaData, placaNombres]);

  const handlePlacaSelect = (e) => {
    setSelectedPlaca(parseInt(e.target.value));
  };

  const placas = Array.from({ length: 10 }, (_, i) => i + 1); // Generar un arreglo [1, 2, ..., 10]

  return (
    <div className="App">
      <h2>{isConnected ? 'CONECTADO' : 'NO CONECTADO'}</h2>
      <div>
        <div>
          <h3>Selecciona una placa:</h3>
          <div>
            <select onChange={handlePlacaSelect} value={selectedPlaca}>
              {placas.map((idPlaca) => (
                <option key={idPlaca} value={idPlaca}>
                  {placaNombres[idPlaca]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <canvas ref={chartRef}></canvas>
      
    </div>
  );
}

export default App;
