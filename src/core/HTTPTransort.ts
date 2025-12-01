export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  timeout?: number;
}

export function queryStringify(data: Record<string, any>): string {
  if (!data || Object.keys(data).length === 0) {
    return '';
  }

  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  return `?${params.toString()}`;
}

export class HTTPTransport {
  get(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
    const queryString = options.data ? queryStringify(options.data) : '';
    return this.request(url + queryString, { ...options, method: 'GET' });
  }

  post(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: 'POST' });
  }

  put(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: 'PUT' });
  }

  delete(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  request(url: string, options: RequestOptions = {}, timeout = 5000): Promise<XMLHttpRequest> {
    const { method = 'GET', headers = {}, data } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        resolve(xhr);
      };

      xhr.onabort = () => {
        reject(new Error('Request aborted'));
      };

      xhr.onerror = () => {
        reject(new Error('Network error'));
      };

      xhr.timeout = timeout;
      xhr.ontimeout = () => {
        reject(new Error('Request timeout'));
      };

      if (method === 'GET' || !data) {
        xhr.send();
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
