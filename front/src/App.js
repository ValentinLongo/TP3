import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const [temperaturaData, setTemperaturaData] = useState([]);
  const [humedadData, setHumedadData] = useState([]);
  const [selectedPlaca, setSelectedPlaca] = useState(null);
  const [fechaDesde, setFechaDesde] = useState(new Date()); // Establecer con la fecha actual
  const [fechaHasta, setFechaHasta] = useState(new Date()); // Establecer con la fecha actual
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

        let filteredDataTemperatura = temperaturaData.filter(
          (temperatura) => temperatura.IdPlaca === selectedPlaca
        );

        let filteredDataHumedad = humedadData.filter(
          (humedad) => humedad.IdPlaca === selectedPlaca
        );

        // Aplicar filtro de fecha desde y hasta
        if (fechaDesde && fechaHasta) {
          filteredDataTemperatura = filteredDataTemperatura.filter(
            (temperatura) => {
              const timestamp = new Date(temperatura.TimeStamp * 1000);
              return timestamp >= fechaDesde && timestamp <= fechaHasta;
            }
          );

          filteredDataHumedad = filteredDataHumedad.filter((humedad) => {
            const timestamp = new Date(humedad.TimeStamp * 1000);
            return timestamp >= fechaDesde && timestamp <= fechaHasta;
          });
        }

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
  }, [selectedPlaca, temperaturaData, humedadData, fechaDesde, fechaHasta]);

  const handlePlacaSelect = (e) => {
    setSelectedPlaca(parseInt(e.target.value));
  };

  // Función para manejar cambios en la fecha desde
  const handleFechaDesdeChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setFechaDesde(selectedDate);
  };

  // Función para manejar cambios en la fecha hasta
  const handleFechaHastaChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setFechaHasta(selectedDate);
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

  // Estilos CSS en línea
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundImage: `url(${process.env.PUBLIC_URL}/fondo.jpg)`, // Ruta de la imagen de fondo
    backgroundSize: 'cover', // Ajustar la imagen para cubrir todo el contenedor
    backgroundRepeat: 'no-repeat', // No repetir la imagen
    minHeight: '91vh', // Altura del 100% de la ventana gráfica
    width: '100%', // Ancho del 100%
  };

  const selectStyle = {
    fontSize: '16px',
    padding: '5px',
    marginRight: '10px', // Espacio entre el select y el input de fecha
  };

  const inputStyle = {
    fontSize: '16px',
    padding: '5px',
    marginRight: '10px', // Espacio entre el select y el input de fecha
  };

  return (
    <div className="App" style={containerStyle}>
      <div>
        {temperaturaData.length > 0 && (
          <div>
            <div style={{ marginBottom:'10px' }}>
            <label style={{ fontSize: '16px', marginRight: '10px' }}>Seleccione una placa: </label>
              <select onChange={handlePlacaSelect} value={selectedPlaca || ''} style={selectStyle}>
                <option value="">Seleccione una placa</option>
                {uniquePlacas.map((idPlaca) => (
                  <option key={idPlaca} value={idPlaca}>
                    {placaNombres[idPlaca]}
                  </option>
                ))}
              </select>

              <label style={{ fontSize: '16px', marginRight: '10px' }}>Fecha desde: </label>
              <input type="date" onChange={handleFechaDesdeChange} value={fechaDesde.toISOString().split('T')[0]} style={inputStyle} />

              <label style={{ fontSize: '16px', marginRight: '10px' }}>Fecha hasta: </label>
              <input type="date" onChange={handleFechaHastaChange} value={fechaHasta.toISOString().split('T')[0]} style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      <canvas style={{ backgroundColor: 'white', borderRadius: '10px', padding: '5px', maxWidth: 'calc(100% - 35px)' }} ref={chartRef}></canvas>
    </div>
  );
}

export default App;
