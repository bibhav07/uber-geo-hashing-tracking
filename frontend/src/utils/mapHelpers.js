
export const MUMBAI_BOUNDS = {
  minLat: 18.9000, // South (Colaba)
  maxLat: 19.2500, // North (Borivali)
  minLon: 72.7500, // West (Arabian Sea)
  maxLon: 73.0000  // East
};

export const PREDEFINED_LOCATIONS = [
  { name: 'Borivali', lat: 19.23, lon: 72.85 },
  { name: 'Kandivali', lat: 19.20, lon: 72.84 },
  { name: 'Andheri', lat: 19.11, lon: 72.83 },
  { name: 'Bandra', lat: 19.05, lon: 72.82 },
  { name: 'Dadar', lat: 19.01, lon: 72.84 },
  { name: 'Mumbai Central', lat: 18.96, lon: 72.81 },
  { name: 'Colaba', lat: 18.92, lon: 72.83 },
];

// Converts Lat/Lon to CSS % (Top/Left)
export const getPosition = (lat, lon) => {
  const latRange = MUMBAI_BOUNDS.maxLat - MUMBAI_BOUNDS.minLat;
  const lonRange = MUMBAI_BOUNDS.maxLon - MUMBAI_BOUNDS.minLon;

  // Lat is inverted for CSS (Higher Lat = Lower Top value)
  const y = 100 - ((lat - MUMBAI_BOUNDS.minLat) / latRange) * 100;
  
  // Lon is normal (Higher Lon = Higher Left value)
  const x = ((lon - MUMBAI_BOUNDS.minLon) / lonRange) * 100;

  return { x, y };
};