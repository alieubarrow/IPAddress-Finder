import "./App.css";

export default function Location({ ipaddress }) {
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
    </div>
  );
}

