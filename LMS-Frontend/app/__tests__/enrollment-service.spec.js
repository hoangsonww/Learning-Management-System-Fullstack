const { HttpHeaders } = require("@angular/common/http");
const {
  EnrollmentService,
} = require("../src/app/services/enrollment.service.ts");

describe("EnrollmentService", () => {
  let http;
  let svc;
  const token = "demo-token";

  beforeEach(() => {
    http = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    svc = new EnrollmentService(http, { getToken: () => token });
  });

  test("getEnrollments() hits base URL with auth header", () => {
    http.get.mockReturnValue("✔");
    const out = svc.getEnrollments();

    expect(http.get).toHaveBeenCalledWith(
      "https://learning-management-system-fullstack.onrender.com/api/enrollments/",
      {
        headers: new HttpHeaders({
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        }),
      },
    );
    expect(out).toBe("✔");
  });

  test("deleteEnrollment() calls DELETE with correct id", () => {
    http.delete.mockReturnValue("🗑");
    const id = 42;

    svc.deleteEnrollment(id);

    expect(http.delete).toHaveBeenCalledWith(
      `https://learning-management-system-fullstack.onrender.com/api/enrollments/${id}/`,
      expect.objectContaining({ headers: expect.any(HttpHeaders) }),
    );
  });
});
