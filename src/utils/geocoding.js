const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export async function geocodeAddress(address) {
  if (!address) return null;

  const encoded = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Geocoding request failed:", response.status);
      return null;
    }

    const data = await response.json();
    const firstResult = data.features?.[0];

    if (!firstResult) {
      return null;
    }

    const [lng, lat] = firstResult.center;

    return { lat, lng };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}