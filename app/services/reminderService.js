const DEFAULT_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_API_BASE_URL || 'http://localhost:5000';

export async function createReminder({ medicineName, reminderTime }, { baseUrl = DEFAULT_API_BASE_URL } = {}) {
  const name = String(medicineName ?? '').trim();
  if (!name) throw new Error('Medicine name is required.');
  if (!(reminderTime instanceof Date) || Number.isNaN(reminderTime.getTime())) {
    throw new Error('Reminder time is invalid.');
  }

  const res = await fetch(`${baseUrl}/api/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      medicineName: name,
      reminderTime: reminderTime.toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Save failed (${res.status}): ${text || res.statusText}`);
  }
  return await res.json();
}

