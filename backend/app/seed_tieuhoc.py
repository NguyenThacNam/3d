"""Seed bộ khóa học Tiểu học (39 thí nghiệm 3D) → 6 khóa theo chủ đề.

Điều kiện: 39 file .html đã được copy vào thư mục uploads/experiments/ của backend.

Chạy:  python -m app.seed_tieuhoc            (bỏ qua khóa đã tồn tại)
        python -m app.seed_tieuhoc --reset   (xóa 6 khóa này rồi tạo lại)
"""

import sys
from pathlib import Path

from sqlalchemy import select

import app.models  # noqa: F401  (đăng ký bảng)
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.models.course import Course
from app.models.experiment import Experiment
from app.models.lesson import Lesson

SUBJECT = "Khoa học"
LEVEL = "Tiểu học"

# Mỗi khóa: tiêu đề, mô tả, gradient hiển thị, và danh sách (tên file .html, tiêu đề bài)
COURSES = [
    {
        "title": "Nước, Không khí & Chất",
        "description": "Khám phá ba thể của nước, tính chất không khí và cách tách các chất qua thí nghiệm 3D.",
        "gradient": "from-sky-500 to-cyan-600",
        "items": [
            ("ba-the-cua-nuoc-3d.html", "Ba thể của nước"),
            ("bay-hoi-ngung-tu-3d.html", "Bay hơi và ngưng tụ"),
            ("vong-tuan-hoan-nuoc-3d.html", "Vòng tuần hoàn của nước"),
            ("nuoc-mang-hinh-vat-chua-3d.html", "Nước mang hình vật chứa"),
            ("khong-khi-bi-nen-3d.html", "Không khí bị nén"),
            ("khong-khi-chiem-cho-3d.html", "Không khí chiếm chỗ"),
            ("khong-khi-nuoi-su-chay-3d.html", "Không khí nuôi sự cháy"),
            ("hoa-tan-dung-dich-hon-hop-3d.html", "Hòa tan, dung dịch và hỗn hợp"),
            ("tach-chat-co-can-loc-3d.html", "Tách chất: cô cạn và lọc"),
        ],
    },
    {
        "title": "Âm thanh & Ánh sáng",
        "description": "Tìm hiểu âm thanh từ vật rung và đường đi của ánh sáng qua các mô hình 3D tương tác.",
        "gradient": "from-amber-500 to-orange-600",
        "items": [
            ("am-thanh-vat-rung-3d.html", "Âm thanh và vật rung"),
            ("am-to-nho-cao-thap-3d.html", "Âm to – nhỏ, cao – thấp"),
            ("am-truyen-moi-truong-3d.html", "Âm thanh truyền qua môi trường"),
            ("anh-sang-truyen-thang-3d_1.html", "Ánh sáng truyền thẳng"),
            ("bong-cua-vat-3d.html", "Bóng của vật"),
            ("guong-doi-huong-anh-sang-3d.html", "Gương đổi hướng ánh sáng"),
            ("vat-cho-can-anh-sang-3d.html", "Vật cho và cản ánh sáng"),
        ],
    },
    {
        "title": "Nóng – Lạnh & Nhiệt",
        "description": "Quan sát sự truyền nhiệt, chuyển thể và đo nhiệt độ qua thí nghiệm 3D.",
        "gradient": "from-rose-500 to-red-600",
        "items": [
            ("chuyen-the-do-nhiet-do-3d.html", "Chuyển thể do nhiệt độ"),
            ("truyen-nhiet-nong-lanh-3d.html", "Truyền nhiệt nóng – lạnh"),
            ("vat-dan-nhiet-cach-nhiet-3d.html", "Vật dẫn nhiệt và cách nhiệt"),
            ("nong-lanh-nhiet-ke-3d_2.html", "Nóng, lạnh và nhiệt kế"),
        ],
    },
    {
        "title": "Điện & Năng lượng",
        "description": "Lắp mạch điện, tìm hiểu vật dẫn điện và các nguồn năng lượng sạch.",
        "gradient": "from-yellow-500 to-amber-600",
        "items": [
            ("lap-mach-dien-thap-sang-3d.html", "Lắp mạch điện thắp sáng"),
            ("vat-dan-dien-cach-dien-3d.html", "Vật dẫn điện và cách điện"),
            ("pin-mat-troi-chay-quat-3d.html", "Pin mặt trời chạy quạt"),
            ("banh-xe-nuoc-thuy-nang-3d.html", "Bánh xe nước – thủy năng"),
            ("turbine-gio-thap-den-led-3d.html", "Tua-bin gió thắp đèn LED"),
            ("nang-luong-chat-dot-3d.html", "Năng lượng chất đốt"),
        ],
    },
    {
        "title": "Thực vật & Chuỗi thức ăn",
        "description": "Khám phá cấu tạo cây, điều kiện sống và mối quan hệ trong chuỗi thức ăn.",
        "gradient": "from-emerald-500 to-green-600",
        "items": [
            ("cau-tao-la-hoa-re-3d.html", "Cấu tạo lá, hoa, rễ"),
            ("cay-can-gi-de-song-3d.html", "Cây cần gì để sống"),
            ("hat-nay-mam-cay-con-3d.html", "Hạt nảy mầm thành cây con"),
            ("sinh-san-vong-doi-3d.html", "Sinh sản và vòng đời"),
            ("mo-phong-chuoi-thuc-an-3d.html", "Mô phỏng chuỗi thức ăn"),
        ],
    },
    {
        "title": "Vi sinh vật & Sức khỏe",
        "description": "Quan sát vi khuẩn, nấm men, sức khỏe cơ thể và môi trường sống quanh ta.",
        "gradient": "from-violet-500 to-purple-600",
        "items": [
            ("vi-khuan-quanh-ta-3d.html", "Vi khuẩn quanh ta"),
            ("nuoi-quan-sat-nam-moc-3d.html", "Nuôi và quan sát nấm mốc"),
            ("nam-men-lam-no-bot-banh-3d.html", "Nấm men làm nở bột bánh"),
            ("lam-sua-chua-3d_1.html", "Làm sữa chua"),
            ("nhip-tim-van-dong-3d.html", "Nhịp tim khi vận động"),
            ("dinh-duong-day-thi-an-toan-3d.html", "Dinh dưỡng và dậy thì an toàn"),
            ("khao-sat-moi-truong-3d.html", "Khảo sát môi trường"),
            ("so-sanh-nuoc-sach-o-nhiem-3d.html", "So sánh nước sạch và ô nhiễm"),
        ],
    },
]

EXP_DIR = Path(settings.UPLOAD_DIR) / "experiments"


def seed(reset: bool = False) -> None:
    db = SessionLocal()
    try:
        titles = [c["title"] for c in COURSES]

        if reset:
            for c in db.scalars(select(Course).where(Course.title.in_(titles))).all():
                db.delete(c)
            db.flush()

        existing = set(db.scalars(select(Course.title).where(Course.title.in_(titles))).all())

        missing_files: list[str] = []
        created_courses = 0
        created_lessons = 0

        for c in COURSES:
            if c["title"] in existing:
                print(f"  [bỏ qua] Khóa đã tồn tại: {c['title']}")
                continue

            course = Course(
                title=c["title"],
                description=c["description"],
                subject=SUBJECT,
                level=LEVEL,
                gradient=c["gradient"],
                is_published=True,
            )
            db.add(course)
            db.flush()
            created_courses += 1

            for order, (filename, title) in enumerate(c["items"], start=1):
                if not (EXP_DIR / filename).exists():
                    missing_files.append(filename)
                exp = Experiment(
                    name=title,
                    html_path=f"experiments/{filename}",
                    description=title,
                )
                db.add(exp)
                db.flush()
                db.add(Lesson(
                    title=title,
                    description=title,
                    course_id=course.id,
                    lesson_order=order,
                    duration_min=10,
                    experiment=exp,
                ))
                created_lessons += 1

        db.commit()
        print(f"[OK] Đã tạo {created_courses} khóa, {created_lessons} bài học.")
        if missing_files:
            print(f"[!] CẢNH BÁO: {len(missing_files)} file chưa có trong {EXP_DIR}/ "
                  f"(thí nghiệm sẽ lỗi tới khi copy vào):")
            for f in missing_files:
                print(f"      - {f}")
    finally:
        db.close()


def main() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    Base.metadata.create_all(bind=engine)
    seed(reset="--reset" in sys.argv)


if __name__ == "__main__":
    main()
