import { useState } from 'react';
import './App.css';
import axios from 'axios';
import Location from './Location';
import { faMagnifyingGlass, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function App() {
  const [IP, setIP] = useState({});
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const fetchAddress = async (e) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://ip-api.com/json/${address}`);
      setIP(response.data);
      if (response.data.status === "fail") {
        setError("Address not found!");
      }
    } catch {
      setError("Failed to fetch data!");
    } finally {
      setLoading(false);
      setAddress("");
    }
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="toggle-container">
        <button className="toggle-button" onClick={() => setDarkMode(!darkMode)}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} /> {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <h1>IP Address Finder</h1>
      <div className='searchBar'>
        <form onSubmit={fetchAddress}>
          <input
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='searchBox'
            placeholder='Enter IP Address...'
          />
          <button type='submit' className='searchButton'>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      </div>

      {loading && <div className="spinner"></div>}
      {error && <p className="error-message">{error}</p>}

      <Location ipaddress={IP} />
    </div>
  );
}
