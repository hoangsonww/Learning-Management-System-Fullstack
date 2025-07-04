const { HttpHeaders } = require("@angular/common/http");
const { LessonService } = require("../src/app/services/lesson.service.ts");

describe("LessonService", () => {
  let http;
  let svc;
  const token = "secret-abc";

  beforeEach(() => {
    http = { get: jest.fn(), post: jest.fn(), put: jest.fn() };
    svc = new LessonService(http, { getToken: () => token });
  });

  test("getLesson(id) fetches the right endpoint", () => {
    http.get.mockReturnValue("ℹ️");
    const id = 7;
    const out = svc.getLesson(id);

    expect(http.get).toHaveBeenCalledWith(
      `https://learning-management-system-fullstack.onrender.com/api/lessons/${id}/`,
      {
        headers: new HttpHeaders({
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        }),
      },
    );
    expect(out).toBe("ℹ️");
  });

  test("createLesson() POSTs payload with auth header", () => {
    const body = { title: "RxJS Basics" };
    http.post.mockReturnValue("👍");

    svc.createLesson(body);

    expect(http.post).toHaveBeenCalledWith(
      "https://learning-management-system-fullstack.onrender.com/api/lessons/",
      body,
      expect.objectContaining({ headers: expect.any(HttpHeaders) }),
    );
  });
});
