// Restaurant location - Lahori Grill, Corso Brescia 22/A, 10152 Torino
// Exact coordinates from Google Maps
const RESTAURANT_LOCATION = {
  lat: 45.08210814150902,
  lng: 7.6896057214228355,
};

// Calculate actual road distance using OSRM (Open Source Routing Machine)
// This provides real driving distance, not approximation
async function calculateRoadDistance(lat1, lng1, lat2, lng2) {
  try {
    // OSRM API expects coordinates in lng,lat format
    const coords = `${lng1},${lat1};${lng2},${lat2}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LahoriGrill/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('OSRM routing failed');
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    // Distance is returned in meters, convert to kilometers
    const distanceKm = data.routes[0].distance / 1000;

    return distanceKm;
  } catch (error) {
    console.error('OSRM routing error, falling back to Haversine:', error);
    // Fallback to Haversine if OSRM fails
    return calculateHaversineDistance(lat1, lng1, lat2, lng2);
  }
}

// Haversine formula as fallback (with urban factor)
function calculateHaversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;

  // Apply 1.3x factor to approximate road-based distance
  return straightLineDistance * 1.3;
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

    // Use OSRM for actual road distance
    const distance = await calculateRoadDistance(
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
    // Default to €1 if geocoding or routing fails
    return {
      distance: null,
      fee: 1.00,
      error: error.message,
    };
  }
}

// Reverse geocode coordinates to address using Nominatim
export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LahoriGrill/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();

    if (!data.address) {
      throw new Error('Address not found for coordinates');
    }

    // Format address nicely
    const addr = data.address;
    const street = addr.road || '';
    const houseNumber = addr.house_number || '';
    const postcode = addr.postcode || '';
    const city = addr.city || addr.town || addr.village || '';

    // Build formatted address
    let formattedAddress = '';
    if (street) {
      formattedAddress = street;
      if (houseNumber) formattedAddress = `${street}, ${houseNumber}`;
    }
    if (postcode) formattedAddress += `, ${postcode}`;
    if (city) formattedAddress += ` ${city}`;

    return formattedAddress.trim();
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}

export { RESTAURANT_LOCATION };
