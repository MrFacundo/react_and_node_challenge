const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiRequest(endpoint, token, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = { message: response.statusText };
    }
    const error = new Error('API error');
    error.body = errorBody;
    throw error;
  }
  return options.method === 'DELETE' ? undefined : response.json();
}

// Task-related API functions

export async function fetchTasks(filter, orderBy, token) {
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (orderBy) params.append('orderBy', orderBy);
  const endpoint = `/todos${params.toString() ? `?${params.toString()}` : ''}`;
  return apiRequest(endpoint, token);
}

export async function createTask(description, token) {
  return apiRequest('/todos', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
}

export async function updateTask(id, updates, token) {
  return apiRequest(`/todo/${id}`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(id, token) {
  return apiRequest(`/todo/${id}`, token, {
    method: 'DELETE',
  });
}

export async function toggleTaskCompletion(id, currentState, token) {
  return updateTask(id, {
    state: currentState === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE',
  }, token);
}

// User-related API functions

export async function loginUser(email, password) {
  return apiRequest('/login', undefined, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email, password, name) {
  return apiRequest('/users', undefined, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
}

export async function getProfile(token) {
  return apiRequest('/me', token);
}

export async function updateProfile(token, updates) {
  return apiRequest('/me', token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}
