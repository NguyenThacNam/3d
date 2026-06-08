# BKAP 3D Learning — Frontend

Giao diện nền tảng học tập với thí nghiệm 3D tương tác, xây dựng bằng **React + TypeScript + Vite + Tailwind CSS**.

## Luồng người dùng
**Trang chủ** (danh sách khóa học) → bấm khóa học → **Trang khóa học** (danh sách bài học) → bấm bài học → **Trang bài học** (nhúng thí nghiệm 3D `.htm` qua `<iframe>`).

## Chạy dự án
```bash
npm install
npm run dev      # phát triển — http://localhost:5173
npm run build    # build production vào /dist
npm run preview  # xem thử bản build
```

## Kết nối backend
Frontend gọi REST API (FastAPI, xem `../backend`). Cấu hình endpoint trong `.env`:
```
VITE_API_URL=http://localhost:8000/api
```
1. Khởi động backend trước (xem `../backend/README.md`) và seed dữ liệu.
2. `npm run dev`, mở http://localhost:5173 → màn hình **đăng nhập**.
3. Đăng nhập bằng tài khoản mẫu — hệ thống tự điều hướng theo vai trò:
   - `admin@3dlearning.vn / admin123` → Quản trị hệ thống
   - `admin@cva.edu.vn / 123456` → Quản trị trường
   - `khoi.dm@hs.cva.edu.vn / 123456` → Học sinh (xem khóa học + thí nghiệm 3D)

Token JWT lưu ở `localStorage`; tự đính kèm header `Authorization`. Trang được bảo vệ
bằng `RequireAuth` / `RequireRole`. Nhập Excel học sinh nay gọi thẳng API
(`POST /students/import`) — parse bằng openpyxl ở backend.

## Cấu trúc
```
public/experiments/        # Thí nghiệm 3D (Three.js) — file .htm độc lập
  solar-system.htm         # Hệ Mặt Trời
  pendulum.htm             # Con lắc đơn
  water-molecule.htm       # Phân tử nước H₂O
  geometry.htm             # Khối đa diện
src/
  data/courses.ts          # Dữ liệu Khóa học → Bài học → Thí nghiệm
  types.ts                 # Mô hình dữ liệu (theo tài liệu thiết kế)
  components/              # Navbar, Footer, CourseCard, Breadcrumb, Icon
  pages/                   # HomePage, CoursePage, LessonPage, ProfilePage, NotFound
  admin/                   # Khu quản trị (dùng layout sidebar riêng)
    AdminLayout.tsx        # Shell: sidebar + topbar + Outlet
    components/            # Sidebar, DataTable, ResourcePage (CRUD), AssignBoard, Modal…
    data/adminData.ts      # Dữ liệu mẫu: trường, lớp, GV, HS, người dùng
    system/                # Quản trị hệ thống: Tổng quan, Trường, Khóa học, Gán cho trường
    school/                # Quản trị trường: Tổng quan, Lớp, GV, HS, Gán cho lớp
  App.tsx                  # Định tuyến (HashRouter)
```

## Các đường dẫn (routes)
| Khu | URL | Mô tả |
|-----|-----|-------|
| Học tập | `#/` · `#/course/:id` · `#/course/:id/lesson/:id` | Trang chủ → khóa học → bài học (iframe 3D) |
| Hồ sơ | `#/profile` | Hồ sơ người dùng |
| Quản trị hệ thống | `#/admin/system` (+ `/schools` `/courses` `/assign` `/profile`) | Quản lý trường, khóa học, gán khóa cho trường |
| Quản trị trường | `#/admin/school` (+ `/classes` `/teachers` `/students` `/assign` `/profile`) | Quản lý lớp, GV, HS, gán khóa cho lớp |

> Truy cập nhanh khu quản trị qua menu tài khoản (góc phải navbar).
> Thao tác Thêm/Sửa/Xóa hiện lưu **state cục bộ** — sẵn chỗ thay bằng API backend (xem chú thích `TODO(backend)`).

## Thiết kế (UI/UX Pro Max)
- **Phong cách**: Micro-interactions, light mode (phù hợp giáo dục), glass nhẹ.
- **Màu**: Indigo `#4F46E5` (chủ đạo) + Green `#22C55E` (CTA/tiến độ).
- **Font**: Poppins (tiêu đề) + Plus Jakarta Sans (nội dung).
- Tôn trọng `prefers-reduced-motion`, focus-visible, touch target ≥ 44px, không dùng emoji làm icon (SVG line).

## Thêm thí nghiệm / bài học mới
1. Thêm file `.htm` vào `public/experiments/`.
2. Khai báo bài học mới trong `src/data/courses.ts`, trỏ `experiment.htmlPath` tới file đó.
