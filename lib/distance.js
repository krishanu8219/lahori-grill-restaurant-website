// Restaurant location - Lahori Grill, Corso Brescia 22/A, Torino
const RESTAURANT_LOCATION = {
  lat: 45.0896,  // Lahori Grill actual coordinates
  lng: 7.6614,
};

// Haversine formula to calculate straight-line distance between two coordinates
// Then applies urban routing factor to approximate road-based distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;

  // Apply 1.3x factor to approximate road-based distance in urban areas
  // This accounts for street layout and is more realistic than straight-line distance
  const roadDistance = straightLineDistance * 1.3;

  return roadDistance; // in kilometers (road-approximated)
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Calculate delivery fee based on distance
export function calculateDeliveryFee(distance) {
  if (distance > 1.5) {
    return 1.00; // €1 for distances over 1.5km
  }
  return 0; // Free delivery for distances <= 1.5km
}

// Geocode address using Nominatim (OpenStreetMap's free geocoding service)
export async function geocodeAddress(address) {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'LahoriGrill/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error('Address not found');
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

// Main function to calculate delivery fee from address
export async function getDeliveryFeeFromAddress(address) {
  try {
    const coords = await geocodeAddress(address);
    const distance = calculateDistance(
      RESTAURANT_LOCATION.lat,
      RESTAURANT_LOCATION.lng,
      coords.lat,
      coords.lng
    );

    const fee = calculateDeliveryFee(distance);

    return {
      distance: distance.toFixed(2),
      fee: fee,
      coordinates: coords,
    };
  } catch (error) {
    // Default to €1 if geocoding fails
    return {
      distance: null,
      fee: 1.00,
      error: error.message,
    };
  }
}

export { RESTAURANT_LOCATION };
