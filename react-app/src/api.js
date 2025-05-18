const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiRequest(endpoint, options = {}, token) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return options.method === 'DELETE' ? undefined : response.json();
}

export async function fetchTasks(filter, orderBy, token) {
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (orderBy) params.append('orderBy', orderBy);
  const endpoint = `/todos${params.toString() ? `?${params.toString()}` : ''}`;
  return apiRequest(endpoint, {}, token);
}

export async function createTask(description, token) {
  return apiRequest('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  }, token);
}

export async function updateTask(id, updates, token) {
  return apiRequest(`/todo/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }, token);
}

export async function deleteTask(id, token) {
  return apiRequest(`/todo/${id}`, {
    method: 'DELETE',
  }, token);
}

export async function toggleTaskCompletion(id, currentState, token) {
  return updateTask(id, {
    state: currentState === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE',
  }, token);
}

// --- AUTH & USER PROFILE API ---

export async function loginUser(email, password) {
  return apiRequest('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email, password, name) {
  return apiRequest('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
}

export async function getProfile(token) {
  return apiRequest('/me', {}, token);
}

export async function updateProfile(token, updates) {
  return apiRequest('/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }, token);
}
