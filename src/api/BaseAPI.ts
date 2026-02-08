import { HTTPTransport } from '@core/HTTPTransport';

export const BASE_URL = 'https://ya-praktikum.tech/api/v2';

class BaseAPI {
  protected http: HTTPTransport;

  constructor(endpoint: string) {
    this.http = new HTTPTransport(`${BASE_URL}${endpoint}`);
  }
}

export { BaseAPI };
