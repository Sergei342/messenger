enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

type Options = {
    method: METHODS;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
    timeout?: number;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

function queryStringify(data: Record<string, unknown>): string {
    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        const value = data[key];
        const pair = `${key}=${value}`;
        return `${result}${index > 0 ? '&' : ''}${pair}`;
    }, '?');
}

export class HTTPTransport {
    get = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => {
        const { data } = options;
        const urlWithParams = data ? url + queryStringify(data) : url;
        return this.request(urlWithParams, { ...options, method: METHODS.GET }, options.timeout);
    };

    post = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => this.request(
        url,
        { ...options, method: METHODS.POST },
        options.timeout,
    );

    put = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => this.request(
        url,
        { ...options, method: METHODS.PUT },
        options.timeout,
    );

    delete = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => this.request(
        url,
        { ...options, method: METHODS.DELETE },
        options.timeout,
    );

    request = (url: string, options: Options, timeout = 5000): Promise<XMLHttpRequest> => {
        const { method, data, headers = {} } = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = () => {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.timeout = timeout;
            xhr.ontimeout = reject;

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            }
        });
    };
}
