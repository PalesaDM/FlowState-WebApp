const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MODE_TO_PROFILE = {
  Walking: "walking",
  Car: "driving",
  Taxi: "driving",
};

export async function getLiveTravelTime(origin, destination, mode) {
  const profile = MODE_TO_PROFILE[mode];

  if (!profile || !origin || !destination) {
    return null;
  }

  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}?access_token=${MAPBOX_TOKEN}&overview=false`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Directions request failed:", response.status);
      return null;
    }

    const data = await response.json();
    const route = data.routes?.[0];

    if (!route) return null;

    return Math.round(route.duration / 60);
  } catch (error) {
    console.error("Directions error:", error);
    return null;
  }
}