/* global jest */
const noopDecorator = () => (cls) => cls;

jest.mock("@angular/core", () => ({
  Injectable: noopDecorator,
}));

jest.mock("@angular/common/http", () => {
  class HttpHeaders {
    constructor(init = {}) {
      this._init = init;
    }
    get(k) {
      return this._init[k];
    }
    toJSON() {
      return { ...this._init };
    }
  }

  /* Bare-bones stand-ins – only what the code touches */
  class HttpClient {
    /* methods will be monkey-patched per-test */
  }

  class HttpRequest {
    constructor(method, url, options = {}) {
      this.method = method;
      this.url = url;
      this.headers = options.headers || {};
    }
    clone(opts = {}) {
      return new HttpRequest(this.method, this.url, {
        ...opts,
        headers: { ...this.headers, ...(opts.setHeaders || {}) },
      });
    }
  }

  class HttpHandler {
    /* each test supplies its own handle() */
  }

  return {
    HttpHeaders,
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpInterceptor: class {},
    HttpEvent: class {},
  };
});
