const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return options.method === 'DELETE' ? undefined : response.json();
}

export async function fetchTasks(filter, orderBy) {
  const params = new URLSearchParams();
  if (filter) params.append('filter', filter);
  if (orderBy) params.append('orderBy', orderBy);

  const endpoint = `/todos${params.toString() ? `?${params.toString()}` : ''}`;
  return apiRequest(endpoint);
}

export async function createTask(description) {
  return apiRequest('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
}

export async function updateTask(id, updates) {
  return apiRequest(`/todo/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(id) {
  return apiRequest(`/todo/${id}`, { method: 'DELETE' });
}

export async function toggleTaskCompletion(id, currentState) {
  return updateTask(id, {
    state: currentState === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE',
  });
}
