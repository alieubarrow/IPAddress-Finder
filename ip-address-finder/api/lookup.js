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

const IP_API_FIELDS = [
  'status',
  'message',
  'query',
  'country',
  'countryCode',
  'region',
  'regionName',
  'city',
  'zip',
  'lat',
  'lon',
  'timezone',
  'isp',
  'org',
  'as',
  'reverse',
  'mobile',
  'proxy',
  'hosting',
].join(',');

export default async function handler(request, response) {
  const ip = String(request.query.ip || '').trim();

  if (!ip || !isValidIpAddress(ip)) {
    return response.status(400).json({
      success: false,
      message: 'Enter a valid IPv4 or IPv6 address.',
    });
  }

  try {
    const lookupResponse = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${IP_API_FIELDS}`
    );
    const data = await lookupResponse.json();

    if (data.status === 'fail') {
      return response.status(400).json({
        success: false,
        message: data.message || 'Address not found.',
      });
    }

    data.success = true;
    return response.status(lookupResponse.ok ? 200 : lookupResponse.status).json(data);
  } catch {
    return response.status(502).json({
      success: false,
      message: 'Failed to fetch IP data. Please try again.',
    });
  }
}
