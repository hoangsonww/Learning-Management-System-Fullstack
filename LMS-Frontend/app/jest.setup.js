/* Minimal stand-ins so we can unit-test without Angular’s runtime */
const noopDecorator = () => (cls) => cls;

jest.mock("@angular/core", () => ({
  Injectable: noopDecorator,
}));

jest.mock("@angular/common/http", () => {
  class HttpHeaders {
    constructor(init = {}) {
      this._h = init;
    }
    get(k) {
      return this._h[k];
    }
    toJSON() {
      return { ...this._h };
    }
  }

  class HttpRequest {
    constructor(method, url, opts = {}) {
      this.method = method;
      this.url = url;
      this.headers = opts.headers || {};
    }
    clone({ setHeaders = {} }) {
      return new HttpRequest(this.method, this.url, {
        headers: { ...this.headers, ...setHeaders },
      });
    }
  }

  class HttpHandler {} // gets `handle` spy-patched inside tests
  class HttpClient {} // ditto

  return {
    HttpHeaders,
    HttpRequest,
    HttpHandler,
    HttpClient,
    HttpInterceptor: class {},
    HttpEvent: class {},
  };
});
