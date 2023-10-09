import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function App() {
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
            aspectRatio: 2.5,
          },
        });
      }
    }
  }, [selectedPlaca, temperaturaData, humedadData]);

  const handlePlacaSelect = (e) => {
    setSelectedPlaca(parseInt(e.target.value));
  };

  // Mapeo de nombres para las placas
  const placaNombres = {
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
    11: 'Placa 11',
    12: 'Placa 12',
    13: 'Placa 13',
    14: 'Placa 14',
    15: 'Placa 15',
    16: 'Placa 16',
    17: 'Placa 17',
    18: 'Placa 18',
    19: 'Placa 19',
    20: 'Placa 20',
    21: 'Placa 21'
  };

  const uniquePlacas = [
    ...new Set(temperaturaData.map((temperatura) => temperatura.IdPlaca)),
  ];

  return (
    <div className="App">
      <div>
        {temperaturaData.length > 0 && (
          <div>
            <h3>Selecciona una placa:</h3>
            <div>
              <select onChange={handlePlacaSelect} value={selectedPlaca || ''}>
                <option value="">Seleccione una placa</option>
                {uniquePlacas.map((idPlaca) => (
                  <option key={idPlaca} value={idPlaca}>
                    {placaNombres[idPlaca]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default App;
