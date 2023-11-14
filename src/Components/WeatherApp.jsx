import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = '74dc6e86a69850d6af26cc0237faba17';

const style = {
  container: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  header: {
    color: '#007bff',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: 'rgb(212 143 17 / 89%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '18px',
  },
  daysContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px',
    backgroundColor: '#fff',
    flex: '1',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
  },
  th: {
    backgroundColor: 'rgba(212, 143, 17, 0.89)',
    color: 'white',
    paddingTop: '12px',
    textAlign: 'center',
  },
  td: {
    border: '1px solid #ccc',
    padding: '12px',
    textAlign: 'center',
  },
};

function WeatherApp() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState([]);

  const handleSearch = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
      )
      .then((response) => {
        setForecast(response.data.list);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const renderWeatherData = () => {
    if (forecast.length === 0) {
      return null;
    }

    const groupedData = {};
    forecast.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!groupedData[date]) {
        groupedData[date] = {
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          pressure: item.main.pressure,
          humidity: item.main.humidity,
        };
      } else {
        // Update values if a newer entry is found for the same date
        groupedData[date].minTemp = Math.min(groupedData[date].minTemp, item.main.temp_min);
        groupedData[date].maxTemp = Math.max(groupedData[date].maxTemp, item.main.temp_max);
      }
    });

    // Get the latest 5 dates
    const latestDates = Object.keys(groupedData).slice(-5);

    const dateTables = latestDates.map((date) => (
      <div key={date} style={style.dayContainer}>
        <table style={style.table}>
          <thead>
          <tr>
              <th colSpan={2} style={style.th}>Date: {new Date(date).toLocaleDateString()}</th>
            </tr>
            <tr>
              <th colSpan={2} style={style.th}>Temperature</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={style.td}>Min</td>
              <td style={style.td}>Max</td>
            </tr>
            <tr>
              <td style={style.td}>
                {(groupedData[date].minTemp - 273.15).toFixed(2)}
              </td>
              <td style={style.td}>
                {(groupedData[date].maxTemp - 273.15).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <table style={{width:"50%", display: 'flex'}}>
          <thead style={{paddingTop: "3px", backgroundColor: 'rgba(212, 143, 17, 0.89)', borderBottom: '2px solid white'}}>
            <tr>
              <th style={style.th}>Pressure</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={style.td}>{groupedData[date].pressure}</td>
            </tr>
          </tbody>
        </table>
        <table style={{width:"50%", display: 'flex'}}>
          <thead  style={{paddingTop: "3px", backgroundColor: 'rgba(212, 143, 17, 0.89)'}}>
            <tr>
              <th style={style.th}>Humidity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={style.td}>{groupedData[date].humidity}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ));

    return (
      <div style={style.daysContainer}>
        {dateTables}
      </div>
    );
  };

  return (
    <div style={style.container}>
      <h1 style={style.header}> Weather In Your City</h1>
      <input
        type="text"
        placeholder="Enter a city"
        style={style.input}
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button style={style.button} onClick={handleSearch}>
        Search
      </button>
      {renderWeatherData()}
    </div>
  );
}

export default WeatherApp;
