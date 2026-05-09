import { useCallback, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Location from './Location';
import {
  faClockRotateLeft,
  faLocationCrosshairs,
  faMagnifyingGlass,
  faMoon,
  faRotateRight,
  faSun,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IP_LOOKUP_URL = '/api/lookup';

const isValidIpAddress = (value) => {
  const ip = value.trim();
  const ipv4 =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  if (ipv4.test(ip)) {
    return true;
  }

  if (!ip.includes(':')) {
    return false;
  }

  try {
    new URL(`http://[${ip}]`);
    return true;
  } catch {
    return false;
  }
};

const normalizeIpData = (data) => ({
  query: data.ip || data.query,
  country: data.country_name || data.country,
  countryCode: data.country_code || data.countryCode,
  region: data.region_code || data.region,
  regionName: data.regionName || data.region,
  city: data.city,
  zip: data.postal,
  lat: data.latitude ?? data.lat,
  lon: data.longitude ?? data.lon,
  timezone: typeof data.timezone === 'string' ? data.timezone : data.timezone?.id,
  isp: data.org || data.connection?.isp,
  org: data.org || data.connection?.org,
  as: data.asn || data.as || (data.connection?.asn ? `AS${data.connection.asn}` : ''),
  reverse: data.reverse || '',
  mobile: data.connection?.type === 'mobile',
  proxy: Boolean(data.proxy || data.security?.is_proxy || data.security?.is_vpn || data.security?.is_tor),
  hosting: Boolean(data.hosting || data.security?.is_cloud_provider),
});

export default function App() {
  const [IP, setIP] = useState({});
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('ip-finder-theme');
    return storedTheme ? storedTheme === 'dark' : true;
  });
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return (JSON.parse(localStorage.getItem('ip-finder-history')) || []).filter(
        (item) => item?.query
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ip-finder-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('ip-finder-history', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = useCallback((result) => {
    setRecentSearches((items) => {
      const filtered = items.filter((item) => item.query !== result.query);
      return [
        {
          query: result.query,
          city: result.city,
          country: result.country,
          timestamp: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 5);
    });
  }, []);

  const fetchAddress = useCallback(async (ip, options = {}) => {
    const nextAddress = ip.trim();

    if (!nextAddress) {
      setError("Enter an IP address or use the current IP button.");
      return;
    }

    if (!isValidIpAddress(nextAddress)) {
      setError("Enter a valid IPv4 or IPv6 address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(IP_LOOKUP_URL, {
        params: { ip: nextAddress },
      });

      if (response.data.success === false || response.data.status === "fail") {
        setIP({});
        setError(response.data.message || "Address not found.");
        return;
      }

      const result = normalizeIpData(response.data);
      setIP(result);
      addRecentSearch(result);
    } catch {
      setIP({});
      setError("Failed to fetch IP data. Please try again.");
    } finally {
      setLoading(false);
      if (options.clearInput) {
        setAddress("");
      }
    }
  }, [addRecentSearch]);

  const fetchUserIP = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get('https://api64.ipify.org?format=json');
      await fetchAddress(response.data.ip, { clearInput: true });
    } catch {
      setError("Failed to detect your current IP address.");
    } finally {
      setLoading(false);
    }
  }, [fetchAddress]);

  // Fetch user's IP on page load
  useEffect(() => {
    fetchUserIP();
  }, [fetchUserIP]);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <main className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">Network lookup</p>
            <h1>IP Address Finder</h1>
          </div>
          <button
            className="icon-button"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            type="button"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </header>

        <section className="lookup-panel" aria-label="IP lookup form">
          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              fetchAddress(address);
            }}
          >
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="search-box"
              placeholder="Enter IPv4 or IPv6 address"
              aria-label="IP address"
            />
            <button type="submit" className="primary-button" disabled={loading}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Search
            </button>
          </form>

          <div className="quick-actions">
            <button type="button" className="secondary-button" onClick={fetchUserIP} disabled={loading}>
              <FontAwesomeIcon icon={faLocationCrosshairs} />
              My IP
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => IP.query && fetchAddress(IP.query, { clearInput: true })}
              disabled={loading || !IP.query}
            >
              <FontAwesomeIcon icon={faRotateRight} />
              Refresh
            </button>
          </div>
        </section>

        {loading && <div className="spinner" aria-label="Loading"></div>}
        {error && <p className="error-message">{error}</p>}

        <Location ipaddress={IP} />

        {recentSearches.length > 0 && (
          <section className="history-panel" aria-label="Recent searches">
            <div className="section-heading">
              <h2>
                <FontAwesomeIcon icon={faClockRotateLeft} />
                Recent searches
              </h2>
              <button
                type="button"
                className="icon-button subtle"
                onClick={() => setRecentSearches([])}
                title="Clear recent searches"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="history-list">
              {recentSearches.map((item) => (
                <button
                  type="button"
                  className="history-item"
                  key={`${item.query}-${item.timestamp}`}
                  onClick={() => fetchAddress(item.query, { clearInput: true })}
                >
                  <span>{item.query}</span>
                  <small>{[item.city, item.country].filter(Boolean).join(', ') || 'Unknown location'}</small>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
