const { of } = require("rxjs");
const { HttpRequest, HttpHandler } = require("@angular/common/http");
const { AuthInterceptor } = require("../src/app/services/auth.interceptor.ts"); // keep .ts

describe("AuthInterceptor", () => {
  test("attaches header when token present", (done) => {
    const token = "demo-123";
    const svc = { getToken: () => token };
    const icpt = new AuthInterceptor(svc);

    const req = new HttpRequest("GET", "/api/ping");
    const next = new HttpHandler();
    next.handle = jest.fn().mockReturnValue(of("ok"));

    icpt.intercept(req, next).subscribe(() => {
      const forwarded = next.handle.mock.calls[0][0];
      expect(forwarded.headers.Authorization).toBe(`Token ${token}`);
      done();
    });
  });

  test("leaves request untouched when no token", (done) => {
    const icpt = new AuthInterceptor({ getToken: () => null });

    const req = new HttpRequest("POST", "/api/echo");
    const next = new HttpHandler();
    next.handle = jest.fn().mockReturnValue(of("ok"));

    icpt.intercept(req, next).subscribe(() => {
      expect(next.handle).toHaveBeenCalledWith(req);
      done();
    });
  });
});
