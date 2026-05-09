import { useEffect, useState } from 'react';
import "./App.css";
import { faCopy, faExternalLinkAlt, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const detailGroups = [
  ['Country', 'country'],
  ['Country code', 'countryCode'],
  ['Region', 'regionName'],
  ['City', 'city'],
  ['Zip', 'zip'],
  ['Timezone', 'timezone'],
  ['ISP', 'isp'],
  ['Organization', 'org'],
  ['ASN', 'as'],
  ['Reverse DNS', 'reverse'],
];

const getNetworkFlags = (ipaddress) =>
  [
    ipaddress.mobile ? 'Mobile network' : null,
    ipaddress.proxy ? 'Proxy/VPN' : null,
    ipaddress.hosting ? 'Hosting provider' : null,
  ].filter(Boolean);

export default function Location({ ipaddress }) {
  const [mapUrl, setMapUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ipaddress?.lat && ipaddress?.lon) {
      setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${ipaddress.lon - 0.1},${ipaddress.lat - 0.1},${ipaddress.lon + 0.1},${ipaddress.lat + 0.1}&layer=mapnik&marker=${ipaddress.lat},${ipaddress.lon}`);
    } else {
      setMapUrl("");
    }
  }, [ipaddress]);

  if (!ipaddress?.query) return null;

  const mapLink =
    ipaddress.lat && ipaddress.lon
      ? `https://www.openstreetmap.org/?mlat=${ipaddress.lat}&mlon=${ipaddress.lon}#map=12/${ipaddress.lat}/${ipaddress.lon}`
      : "";
  const flags = getNetworkFlags(ipaddress);

  const copySummary = async () => {
    const summary = [
      `IP: ${ipaddress.query}`,
      `Location: ${[ipaddress.city, ipaddress.regionName, ipaddress.country].filter(Boolean).join(', ') || 'N/A'}`,
      `Coordinates: ${ipaddress.lat || 'N/A'}, ${ipaddress.lon || 'N/A'}`,
      `ISP: ${ipaddress.isp || 'N/A'}`,
    ].join('\n');

    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="data">
      <div className="result-header">
        <div>
          <p className="eyebrow">Lookup result</p>
          <h2>{ipaddress.query}</h2>
          <p className="location-line">
            {[ipaddress.city, ipaddress.regionName, ipaddress.country].filter(Boolean).join(', ') || 'Location unavailable'}
          </p>
        </div>
        <button type="button" className="icon-button" onClick={copySummary} title="Copy lookup summary">
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>

      {copied && <p className="success-message">Summary copied.</p>}

      <div className="coordinate-strip">
        <div>
          <span>Latitude</span>
          <strong>{ipaddress.lat ?? "N/A"}</strong>
        </div>
        <div>
          <span>Longitude</span>
          <strong>{ipaddress.lon ?? "N/A"}</strong>
        </div>
      </div>

      <dl className="detail-grid">
        {detailGroups.map(([label, key]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{ipaddress[key] || "N/A"}</dd>
          </div>
        ))}
      </dl>

      {flags.length > 0 && (
        <div className="flag-list">
          {flags.map((flag) => (
            <span key={flag}>
              <FontAwesomeIcon icon={faShieldHalved} />
              {flag}
            </span>
          ))}
        </div>
      )}

      {mapUrl && (
        <div className="map-container">
          <iframe title="map" src={mapUrl} width="100%" height="300px"></iframe>
          {mapLink && (
            <a className="map-link" href={mapLink} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              Open map
            </a>
          )}
        </div>
      )}
    </section>
  );
}
