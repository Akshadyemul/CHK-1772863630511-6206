const DEFAULT_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_API_BASE_URL || 'http://localhost:5000';

function normalizeMedicineArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.medicines)) return payload.medicines;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export async function searchMedicineByName(query, { baseUrl = DEFAULT_API_BASE_URL } = {}) {
  const q = query?.trim();
  if (!q) return [];

  const url = `${baseUrl}/api/medicine/search/${encodeURIComponent(q)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Search failed (${res.status}): ${text || res.statusText}`);
  }
  const json = await res.json();
  return normalizeMedicineArray(json);
}

export async function getMedicineByBarcode(barcode, { baseUrl = DEFAULT_API_BASE_URL } = {}) {
  const value = String(barcode ?? '').trim();
  if (!value) throw new Error('Barcode is empty.');

  const url = `${baseUrl}/api/medicine/barcode/${encodeURIComponent(value)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Lookup failed (${res.status}): ${text || res.statusText}`);
  }
  return await res.json();
}
