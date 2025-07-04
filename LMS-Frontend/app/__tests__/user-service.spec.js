const { HttpHeaders } = require("@angular/common/http");
const { UserService } = require("../src/app/services/user.service.ts");

describe("UserService", () => {
  let http;
  let svc;
  const token = "tok-123";

  beforeEach(() => {
    http = { get: jest.fn(), put: jest.fn() };
    svc = new UserService(http, { getToken: () => token });
  });

  test("getUser(id) issues GET with header", () => {
    http.get.mockReturnValue("🙋");
    const id = 99;
    const out = svc.getUser(id);

    expect(http.get).toHaveBeenCalledWith(
      `https://learning-management-system-fullstack.onrender.com/api/users/${id}/`,
      {
        headers: new HttpHeaders({
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        }),
      },
    );
    expect(out).toBe("🙋");
  });

  test("updateUser() PUTs body & retains auth header", () => {
    const id = 99;
    const body = { email: "new@mail.com" };
    http.put.mockReturnValue("✅");

    svc.updateUser(id, body);

    expect(http.put).toHaveBeenCalledWith(
      `https://learning-management-system-fullstack.onrender.com/api/users/${id}/`,
      body,
      expect.objectContaining({ headers: expect.any(HttpHeaders) }),
    );
  });
});
