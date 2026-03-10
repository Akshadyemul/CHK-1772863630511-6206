import axios from 'axios';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export async function registerUser(payload) {
  try {
    const res = await apiClient.post('/api/auth/register', payload);
    return res.data;
  } catch (err) {
    handleApiError(err, 'registerUser');
  }
}

export async function loginUser(payload) {
  try {
    const res = await apiClient.post('/api/auth/login', payload);
    return res.data;
  } catch (err) {
    handleApiError(err, 'loginUser');
  }
}

export async function fetchProfile() {
  try {
    const res = await apiClient.get('/api/auth/profile');
    return res.data;
  } catch (err) {
    handleApiError(err, 'fetchProfile');
  }
}

export async function searchMedicine(name) {
  const q = String(name ?? '').trim();
  if (!q) throw new Error('Medicine name is required.');

  console.log('[API] searchMedicine query =', q, 'baseURL =', API_BASE_URL);

  try {
    const res = await apiClient.get(`/api/medicine/search/${encodeURIComponent(q)}`);
    console.log('[API] searchMedicine response data =', res.data);
    return res.data;
  } catch (err) {
    handleApiError(err, 'searchMedicine');
  }
}

export async function scanBarcode(code) {
  const value = String(code ?? '').trim();
  if (!value) throw new Error('Barcode is required.');
  console.log('[API] scanBarcode value =', value);
  try {
    const res = await apiClient.get(`/api/medicine/barcode/${encodeURIComponent(value)}`);
    console.log('[API] scanBarcode response data =', res.data);
    return res.data;
  } catch (err) {
    handleApiError(err, 'scanBarcode');
  }
}

export async function getReminders() {
  try {
    const res = await apiClient.get('/api/reminders');
    return res.data;
  } catch (err) {
    handleApiError(err, 'getReminders');
  }
}

export async function createReminder(data) {
  try {
    const res = await apiClient.post('/api/reminders', data);
    return res.data;
  } catch (err) {
    handleApiError(err, 'createReminder');
  }
}

export async function getHistory() {
  try {
    const res = await apiClient.get('/api/history');
    return res.data;
  } catch (err) {
    handleApiError(err, 'getHistory');
  }
}

function handleApiError(err, context) {
  console.log(
    `[API] ${context} error =`,
    err.message,
    'status =',
    err.response?.status,
    'data =',
    err.response?.data
  );

  if (err.message === 'Network Error' || err.code === 'ECONNABORTED' || !err.response) {
    throw new Error(`Cannot connect to the backend server. Please check your network and ensure the backend is running at ${API_BASE_URL}`);
  }

  throw new Error(err.response?.data?.message || err.message || 'An error occurred while connecting to the server.');
}

