const { HttpHeaders } = require("@angular/common/http");
const { CourseService } = require("../src/app/services/course.service.ts");

describe("CourseService", () => {
  let http;
  let svc;
  const token = "xyz";

  beforeEach(() => {
    http = { get: jest.fn(), post: jest.fn() };
    svc = new CourseService(http, { getToken: () => token });
  });

  test("getCourses() calls correct endpoint + headers", () => {
    http.get.mockReturnValue("observable");

    const out = svc.getCourses();

    expect(http.get).toHaveBeenCalledWith(
      "https://learning-management-system-fullstack.onrender.com/api/courses/",
      {
        headers: new HttpHeaders({
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        }),
      },
    );
    expect(out).toBe("observable");
  });

  test("createCourse() posts body & auth header", () => {
    const body = { title: "Jest 101" };
    http.post.mockReturnValue("👍");

    svc.createCourse(body);

    expect(http.post).toHaveBeenCalledWith(
      "https://learning-management-system-fullstack.onrender.com/api/courses/",
      body,
      expect.objectContaining({ headers: expect.any(HttpHeaders) }),
    );
  });
});
