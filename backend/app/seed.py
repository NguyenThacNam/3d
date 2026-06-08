"""Seed dữ liệu mẫu khớp với frontend.

Chạy:  python -m app.seed          (chỉ seed nếu DB trống)
        python -m app.seed --reset  (xóa sạch rồi seed lại)
"""

import sys

from sqlalchemy import select

import app.models  # noqa: F401
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.classroom import Classroom
from app.models.course import Course
from app.models.enums import Role, StudentStatus
from app.models.experiment import Experiment
from app.models.lesson import Lesson
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.school import School
from app.models.user import User
from app.core.config import settings

PW = "123456"


def seed() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(School).limit(1)):
            print("DB đã có dữ liệu — bỏ qua. Dùng --reset để seed lại.")
            return

        # 1) Admin hệ thống
        db.add(User(
            email=settings.FIRST_ADMIN_EMAIL,
            password_hash=hash_password(settings.FIRST_ADMIN_PASSWORD),
            full_name="Quản trị viên hệ thống",
            role=Role.admin,
            phone="0900000001",
        ))

        # 2) Trường + quản trị trường
        school = School(name="THPT Chu Văn An", address="10 Thụy Khuê, Hà Nội", email="lienhe@cva.edu.vn")
        db.add(school)
        db.flush()
        db.add(User(
            email="admin@cva.edu.vn", password_hash=hash_password(PW),
            full_name="Ban quản trị nhà trường", role=Role.school, school_id=school.id, phone="02438230001",
        ))

        # 3) Giáo viên
        teachers_data = [
            ("Nguyễn Văn An", "an.nv@cva.edu.vn", "Vật lý"),
            ("Trần Thị Bình", "binh.tt@cva.edu.vn", "Hóa học"),
            ("Lê Hoàng Cường", "cuong.lh@cva.edu.vn", "Toán học"),
        ]
        teachers: dict[str, TeacherProfile] = {}
        for name, email, subject in teachers_data:
            u = User(email=email, password_hash=hash_password(PW), full_name=name, role=Role.teacher, school_id=school.id)
            db.add(u)
            tp = TeacherProfile(user=u, name=name, subject=subject, school_id=school.id)
            db.add(tp)
            teachers[name] = tp
        db.flush()

        # 4) Lớp học
        classes_data = [
            ("Lớp 10A1", "10", "Nguyễn Văn An"),
            ("Lớp 10A2", "10", "Trần Thị Bình"),
            ("Lớp 11B1", "11", "Lê Hoàng Cường"),
            ("Lớp 12C1", "12", "Nguyễn Văn An"),
        ]
        classes: dict[str, Classroom] = {}
        for name, grade, teacher_name in classes_data:
            c = Classroom(name=name, grade=grade, school_id=school.id,
                          teacher_profile_id=teachers[teacher_name].id)
            db.add(c)
            classes[name] = c
        db.flush()

        # 5) Học sinh
        students_data = [
            ("Đỗ Minh Khôi", "khoi.dm@hs.cva.edu.vn", "Lớp 10A1", StudentStatus.active),
            ("Vũ Hà My", "my.vh@hs.cva.edu.vn", "Lớp 10A1", StudentStatus.active),
            ("Bùi Quang Huy", "huy.bq@hs.cva.edu.vn", "Lớp 10A2", StudentStatus.active),
            ("Ngô Thảo Linh", "linh.nt@hs.cva.edu.vn", "Lớp 11B1", StudentStatus.inactive),
        ]
        for name, email, class_name, status in students_data:
            u = User(email=email, password_hash=hash_password(PW), full_name=name, role=Role.student, school_id=school.id)
            db.add(u)
            db.add(StudentProfile(user=u, name=name, school_id=school.id,
                                  class_id=classes[class_name].id, status=status))

        # 6) Thí nghiệm 3D
        exps = {
            "solar": Experiment(name="Mô phỏng Hệ Mặt Trời", html_path="experiments/solar-system.htm",
                                description="Mô hình 3D các hành tinh chuyển động theo quỹ đạo."),
            "pendulum": Experiment(name="Thí nghiệm Con lắc đơn", html_path="experiments/pendulum.htm",
                                   description="Con lắc 3D dao động theo thời gian thực."),
            "water": Experiment(name="Mô hình phân tử H₂O", html_path="experiments/water-molecule.htm",
                                description="Mô hình 3D phân tử nước có thể xoay tự do."),
            "geometry": Experiment(name="Khối đa diện 3D", html_path="experiments/geometry.htm",
                                   description="Các khối hình học 3D tương tác."),
        }
        for e in exps.values():
            db.add(e)
        db.flush()

        # 7) Khóa học + bài học
        physics = Course(
            title="Vật lý & Thiên văn 3D", subject="Vật lý", level="Lớp 10",
            gradient="from-indigo-500 to-violet-600", is_published=True,
            description="Khám phá chuyển động, lực và vũ trụ qua các mô hình 3D tương tác trực quan.",
            lessons=[
                Lesson(title="Bài 1: Hệ Mặt Trời", lesson_order=1, duration_min=15, experiment=exps["solar"],
                       description="Quan sát quỹ đạo các hành tinh quay quanh Mặt Trời."),
                Lesson(title="Bài 2: Con lắc đơn", lesson_order=2, duration_min=12, experiment=exps["pendulum"],
                       description="Tìm hiểu dao động điều hòa của con lắc đơn."),
            ],
        )
        chemistry = Course(
            title="Hóa học phân tử 3D", subject="Hóa học", level="Lớp 11",
            gradient="from-emerald-500 to-teal-600", is_published=True,
            description="Dựng và xoay các mô hình phân tử trong không gian 3D.",
            lessons=[
                Lesson(title="Bài 1: Phân tử nước H₂O", lesson_order=1, duration_min=10, experiment=exps["water"],
                       description="Quan sát cấu trúc phân tử nước, góc liên kết và sự sắp xếp nguyên tử."),
            ],
        )
        geometry = Course(
            title="Hình học không gian 3D", subject="Toán học", level="Lớp 12",
            gradient="from-sky-500 to-indigo-600", is_published=True,
            description="Trực quan hóa các khối đa diện, mặt cầu và phép biến hình trong không gian.",
            lessons=[
                Lesson(title="Bài 1: Khối đa diện", lesson_order=1, duration_min=14, experiment=exps["geometry"],
                       description="Khám phá các khối đa diện đều, xoay để quan sát từ mọi góc nhìn."),
            ],
        )
        db.add_all([physics, chemistry, geometry])
        db.flush()

        # 8) Gán khóa học: hệ thống → trường; trường → lớp
        school.courses = [physics, chemistry]            # khóa khả dụng của trường
        classes["Lớp 10A1"].courses = [physics]          # HS lớp 10A1 thấy Vật lý
        classes["Lớp 11B1"].courses = [chemistry]

        db.commit()
        print("[OK] Seed thành công.")
        print("Tài khoản đăng nhập (mật khẩu '123456', admin hệ thống dùng mật khẩu trong .env):")
        print(f"  - Hệ thống : {settings.FIRST_ADMIN_EMAIL} / {settings.FIRST_ADMIN_PASSWORD}")
        print("  - Trường   : admin@cva.edu.vn")
        print("  - Giáo viên: an.nv@cva.edu.vn")
        print("  - Học sinh : khoi.dm@hs.cva.edu.vn")
    finally:
        db.close()


def main() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # in được tiếng Việt trên console Windows
    except Exception:
        pass
    if "--reset" in sys.argv:
        print("[!] Xóa toàn bộ bảng và tạo lại...")
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed()


if __name__ == "__main__":
    main()
