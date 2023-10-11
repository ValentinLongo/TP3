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

  const placas = Array.from({ length: 21 }, (_, i) => i + 1); // Generar un arreglo [1, 2, ..., 10]

    // Estilos CSS en línea para el segundo componente
    const containerStyle = {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundImage: `url(${process.env.PUBLIC_URL}/fondo.jpg)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      minHeight: '91vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column', // Mostrar elementos en columna
      justifyContent: 'center', // Centrar verticalmente los elementos
    };
  
    const labelSelectStyle = {
      display: 'flex', // Mostrar elementos en línea
      alignItems: 'center', // Centrar verticalmente los elementos
      marginBottom: '10px'
    };
  
    const selectStyle = {
      fontSize: '16px',
      padding: '5px',
      marginRight: '10px',
    };
  
    return (
      <div className="App" style={containerStyle}>
        <div style={labelSelectStyle}>
          <label style={{ fontSize: '16px', marginRight: '10px' }}>Selecciona una placa:</label>
          <select onChange={handlePlacaSelect} value={selectedPlaca} style={selectStyle}>
            {placas.map((idPlaca) => (
              <option key={idPlaca} value={idPlaca}>
                {placaNombres[idPlaca]}
              </option>
            ))}
          </select>
        </div>
        <canvas style={{ backgroundColor: 'white', borderRadius: '10px', padding: '5px', maxWidth: 'calc(100% - 35px)' }} ref={chartRef}></canvas>
      </div>
    );
}

export default App;
