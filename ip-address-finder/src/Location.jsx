import { useEffect, useState } from 'react';
import "./App.css";

export default function Location({ ipaddress }) {
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (ipaddress?.lat && ipaddress?.lon) {
      setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${ipaddress.lon - 0.1},${ipaddress.lat - 0.1},${ipaddress.lon + 0.1},${ipaddress.lat + 0.1}&layer=mapnik&marker=${ipaddress.lat},${ipaddress.lon}`);
    }
  }, [ipaddress]);

  if (!ipaddress?.query) return null;

  return (
    <div className="data">
      <p><strong>Country:</strong> {ipaddress.country || "N/A"}</p>
      <p><strong>City:</strong> {ipaddress.city || "N/A"}</p>
      <p><strong>Country Code:</strong> {ipaddress.countryCode || "N/A"}</p>
      <p><strong>Region:</strong> {ipaddress.region || "N/A"}</p>
      <p><strong>Region Name:</strong> {ipaddress.regionName || "N/A"}</p>
      <p><strong>Longitude & Latitude:</strong> {ipaddress.lat || "N/A"}, {ipaddress.lon || "N/A"}</p>
      <p><strong>Zip:</strong> {ipaddress.zip || "N/A"}</p>

      {mapUrl && (
        <div className="map-container">
          <iframe title="map" src={mapUrl} width="100%" height="300px"></iframe>
        </div>
      )}
    </div>
  );
}
