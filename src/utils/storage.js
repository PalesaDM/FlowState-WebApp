const STORAGE_KEYS = {
  locations: "flowstate_locations",
  routes: "flowstate_routes",
};

export function getLocations() {
  const saved = localStorage.getItem(STORAGE_KEYS.locations);
  return saved ? JSON.parse(saved) : [];
}

export function saveLocations(locations) {
  localStorage.setItem(STORAGE_KEYS.locations, JSON.stringify(locations));
}

export function getRoutes() {
  const saved = localStorage.getItem(STORAGE_KEYS.routes);
  return saved ? JSON.parse(saved) : [];
}

export function saveRoutes(routes) {
  localStorage.setItem(STORAGE_KEYS.routes, JSON.stringify(routes));
}

export function getEvents() {
  const saved = localStorage.getItem(STORAGE_KEYS.events);
  return saved ? JSON.parse(saved) : [];
}

export function saveEvents(events) {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}