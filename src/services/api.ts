const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'
).replace(/\/+$/, '');

class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Falha desconhecida de conexão.';
    throw new ApiError(`Não foi possível conectar à API: ${message}`, 0);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new ApiError(
      detail || `A API respondeu com o status ${response.status}.`,
      response.status
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path, 'GET');
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, 'POST', body);
}

export function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, 'PUT', body);
}

export function del<T>(path: string): Promise<T> {
  return request<T>(path, 'DELETE');
}
