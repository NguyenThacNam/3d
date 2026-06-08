// HTTP client gọn cho REST API, tự đính kèm JWT và xử lý lỗi.

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const TOKEN_KEY = '3dl_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

async function request<T>(path: string, opts: Options = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = opts;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || `Lỗi ${res.status}`;
    throw new ApiError(res.status, typeof msg === 'string' ? msg : 'Đã có lỗi xảy ra');
  }
  return data as T;
}

export const api = {
  get: <T>(p: string) => request<T>(p),
  post: <T>(p: string, body?: unknown) => request<T>(p, { method: 'POST', body }),
  put: <T>(p: string, body?: unknown) => request<T>(p, { method: 'PUT', body }),
  del: (p: string) => request<void>(p, { method: 'DELETE' }),

  /** Upload file (multipart) — dùng cho nhập Excel */
  async upload<T>(p: string, file: File): Promise<T> {
    const form = new FormData();
    form.append('file', file);
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${p}`, { method: 'POST', headers, body: form });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = (data && data.detail) || `Lỗi ${res.status}`;
      throw new ApiError(res.status, typeof msg === 'string' ? msg : 'Upload thất bại');
    }
    return data as T;
  },

  /** Tải file nhị phân (vd: file Excel mẫu) */
  async download(p: string, filename: string): Promise<void> {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${p}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new ApiError(res.status, 'Tải file thất bại');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};

export const API_BASE_URL = BASE_URL;

/** Origin của backend (bỏ hậu tố /api) — để nạp file tĩnh đã upload. */
export const ASSET_ORIGIN = BASE_URL.replace(/\/api\/?$/, '');

/** Chuẩn hóa đường dẫn file thí nghiệm thành URL đầy đủ. */
export function assetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${ASSET_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
