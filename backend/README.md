# 3D Learning — Backend (FastAPI + PostgreSQL)

API cho nền tảng học tập 3D. Kiến trúc phân lớp rõ ràng:

```
entity (models)  →  repository  →  service  →  api (routers)
```

## Cấu trúc
```
app/
  core/            # config, database, security (JWT/bcrypt), exceptions
  models/          # SQLAlchemy entities + bảng M2M (school_courses, class_courses)
  repositories/    # truy cập dữ liệu (BaseRepository + repo từng entity)
  services/        # nghiệp vụ: auth, profile, school, course, class, people; serializers; excel
  schemas/         # Pydantic DTO (khớp field frontend)
  api/
    deps.py        # get_current_user, require_roles, scope school
    routes/        # auth, profile, learning, schools, courses, classes, teachers, students
    router.py      # gộp router
  main.py          # FastAPI app, CORS, exception handler, tạo bảng khi khởi động
  seed.py          # dữ liệu mẫu khớp frontend
```

## Chạy local (PostgreSQL qua pgAdmin)

1. Trong **pgAdmin**, tạo database trống tên `learning3d`.
2. Tạo môi trường ảo & cài đặt:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate            # Windows
   pip install -r requirements.txt
   ```
3. Sao chép `.env.example` → `.env`, sửa `DATABASE_URL` đúng user/mật khẩu Postgres của bạn:
   ```
   DATABASE_URL=postgresql+psycopg://postgres:<mat_khau>@localhost:5432/learning3d
   ```
4. Seed dữ liệu mẫu (tạo bảng + dữ liệu khớp frontend):
   ```bash
   python -m app.seed          # seed nếu DB trống
   python -m app.seed --reset  # xóa sạch và seed lại
   ```
5. Chạy server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API: http://localhost:8000/api
   - Swagger UI: http://localhost:8000/docs

## Tài khoản mẫu (sau khi seed)
| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Quản trị hệ thống | admin@3dlearning.vn | admin123 (theo `.env`) |
| Quản trị trường | admin@cva.edu.vn | 123456 |
| Giáo viên | an.nv@cva.edu.vn | 123456 |
| Học sinh | khoi.dm@hs.cva.edu.vn | 123456 |

## Tổng quan endpoint (`/api`)
| Nhóm | Method & Path | Quyền |
|------|---------------|-------|
| Auth | `POST /auth/login`, `GET /auth/me` | công khai / đã đăng nhập |
| Hồ sơ | `GET/PUT /profile` | đã đăng nhập |
| Học tập | `GET /learning/courses`, `GET /learning/courses/{id}` | theo phân quyền |
| Trường | `GET/POST /schools`, `PUT/DELETE /schools/{id}`, `GET /schools/assignments`, `PUT /schools/{id}/courses` | admin |
| Khóa học | `GET/POST /courses`, `PUT/DELETE /courses/{id}` | admin |
| Lớp | `GET/POST /classes`, `PUT/DELETE /classes/{id}`, `GET /classes/available-courses`, `GET /classes/assignments`, `PUT /classes/{id}/courses` | school |
| Giáo viên | `GET/POST /teachers`, `PUT/DELETE /teachers/{id}` | school |
| Học sinh | `GET/POST /students`, `PUT/DELETE /students/{id}`, `GET /students/template`, `POST /students/import` | school |

## Quy tắc phân quyền (theo tài liệu thiết kế)
- Admin gán khóa học cho **trường**; trường chỉ gán cho **lớp** những khóa đã được phân bổ.
- Học sinh chỉ thấy khóa học gán cho **lớp** của mình; giáo viên thấy khóa của các lớp phụ trách.

## Hiệu năng & chịu tải
Đã tối ưu (gói A):
- **Connection pool** điều chỉnh được qua `.env` (`DB_POOL_SIZE`, `DB_MAX_OVERFLOW`…).
- **Index** trên các khóa ngoại (`school_id`, `class_id`, `course_id`, `lesson.course_id`…).
- **Hết N+1** ở các API danh sách: dùng `selectinload`/`joinedload` + đếm học sinh bằng 1 truy vấn group-by.

Chạy nhiều worker để dùng nhiều core (vượt giới hạn GIL của 1 tiến trình):
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
> Quy tắc pool: `số_worker × DB_POOL_SIZE ≤ Postgres max_connections` (mặc định 100).
> Ví dụ 4 worker × 20 = 80 (an toàn). Nhiều worker hơn → cân nhắc **PgBouncer**.
> Đặt sau **nginx** reverse proxy khi lên production.

## Production (VPS, Docker)
```bash
cp .env.example .env        # chỉnh SECRET_KEY, CORS_ORIGINS...
docker compose up -d --build
docker compose exec api python -m app.seed
```
> Production nên dùng **Alembic** migration thay cho `create_all`. Hiện prototype tự tạo bảng khi khởi động.
