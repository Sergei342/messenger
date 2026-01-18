enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface Options {
  method?: Method;
  data?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  timeout?: number;
}

type HTTPMethod = <R = unknown>(url: string, options?: Options) => Promise<R>;

export function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    const value = data[key];
    const encodedValue = encodeURIComponent(String(value));
    return `${result}${key}=${encodedValue}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
}

class HTTPTransport {
  private _baseUrl: string;

  constructor(baseUrl: string = '') {
    this._baseUrl = baseUrl;
  }

  get: HTTPMethod = (url, options = {}) => {
    const { data } = options;
    const queryString = data ? queryStringify(data as Record<string, unknown>) : '';
    return this.request(`${url}${queryString}`, { ...options, method: Method.GET });
  };

  post: HTTPMethod = (url, options = {}) => this.request(url, { ...options, method: Method.POST });

  put: HTTPMethod = (url, options = {}) => this.request(url, { ...options, method: Method.PUT });

  delete: HTTPMethod = (url, options = {}) => this.request(url, { ...options, method: Method.DELETE });

  request<R>(url: string, options: Options = {}): Promise<R> {
    const {
      method = Method.GET,
      data,
      headers = {},
      timeout = 5000,
    } = options;

    const fullUrl = `${this._baseUrl}${url}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, fullUrl);

      xhr.withCredentials = true;
      xhr.timeout = timeout;

      // Set headers
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = xhr.response ? JSON.parse(xhr.response) : {};
            resolve(response);
          } catch {
            resolve(xhr.response);
          }
        } else {
          try {
            const error = JSON.parse(xhr.response);
            reject(error);
          } catch {
            reject(new Error(`HTTP Error: ${xhr.status}`));
          }
        }
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      if (method === Method.GET || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}

export { HTTPTransport, Method };

