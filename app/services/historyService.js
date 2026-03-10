const DEFAULT_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_API_BASE_URL || 'http://localhost:5000';

export async function fetchHistory({ limit = 50 } = {}, { baseUrl = DEFAULT_API_BASE_URL } = {}) {
  const res = await fetch(`${baseUrl}/api/history?limit=${encodeURIComponent(String(limit))}`, {
    method: 'GET',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`History failed (${res.status}): ${text || res.statusText}`);
  }
  return await res.json();
}

export async function addHistoryItem(
  { medicineName, medicineData, source },
  { baseUrl = DEFAULT_API_BASE_URL } = {}
) {
  const name = String(medicineName ?? '').trim();
  if (!name) return null;
  if (source !== 'search' && source !== 'scan') return null;

  const res = await fetch(`${baseUrl}/api/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      medicineName: name,
      medicineData: medicineData ?? null,
      source,
    }),
  });
  if (!res.ok) return null;
  return await res.json();
}

