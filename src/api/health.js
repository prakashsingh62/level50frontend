export async function health() {
  const r = await fetch(import.meta.env.VITE_API_BASE_URL + "/health");
  return r.json();
}
