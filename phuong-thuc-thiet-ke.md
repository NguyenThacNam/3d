# Chương 1: Tổng quan và cơ sở lý thuyết

## I. Tổng quan

### 1.1. Bối cảnh

Trong kỷ nguyên số, giáo dục STEM và trải nghiệm học tập dựa trên mô hình 3D đang ngày càng trở nên quan trọng. Việc xây dựng một hệ thống học tập trực tuyến cho phép học sinh truy cập các thí nghiệm 3D qua iframe giúp tăng tính trực quan, dễ hiểu và phù hợp với nhu cầu dạy học hiện đại.

Đối với nhà trường, hệ thống cần hỗ trợ quản lý nội dung khóa học, phân quyền người dùng rõ ràng và đảm bảo rằng mỗi học sinh chỉ truy cập được nội dung phù hợp với lớp và khóa học mà mình tham gia.

### 1.2. Mục tiêu hệ thống

- Xây dựng nền tảng học tập cho phép duyệt khóa học, bài học và mở file 3D bằng iframe.
- Thiết kế hệ thống phân quyền với 4 role: admin, school, teacher, student.
- Cung cấp luồng quản trị rõ ràng:
  - admin quản lý trường học, khóa học, gán khóa học cho trường.
  - school quản lý lớp, giáo viên, học sinh, gán khóa học cho lớp.
- Đảm bảo trải nghiệm học tập: học sinh có thể xem nội dung bài học và thí nghiệm 3D một cách trực quan và liên tục.

### 1.3. Phạm vi của chương này

Chương 1 tập trung vào:
- Tổng quan kiến trúc nghiệp vụ của hệ thống.
- Các role và phân quyền chính.
- Luồng dữ liệu giữa admin, school, teacher và student.
- Mô hình nội dung Khóa học → Bài học → Thí nghiệm 3D.

## II. Phân tích nghiệp vụ

### 2.1. Vai trò người dùng

#### 2.1.1. Role admin
- Quản trị toàn hệ thống.
- Quản lý danh sách trường học.
- Quản lý danh sách khóa học.
- Gán khóa học cho trường.
- Quy định: trường không gán khóa học sẽ không có nội dung hiển thị.

#### 2.1.2. Role school
- Quản lý lớp học, giáo viên, học sinh.
- Gán khoá học cho lớp học.
- Chỉ được gán khóa học khi khóa học đã được admin phân bổ cho trường.

#### 2.1.3. Role teacher
- Quản lý các lớp do mình phụ trách.
- Theo dõi danh sách học sinh trong lớp.
- Hỗ trợ học sinh tiếp cận nội dung khóa học và thí nghiệm 3D.

#### 2.1.4. Role student
- Truy cập trang chủ để xem khóa học được phép.
- Xem danh sách bài học thuộc khóa học đã gán.
- Mở thí nghiệm 3D trong iframe và đọc nội dung học tập.

### 2.2. Mô hình dữ liệu nghiệp vụ

#### 2.2.1. Trường học (School)
- ID trường
- Tên trường
- Địa chỉ
- Danh sách lớp
- Danh sách khóa học được gán

#### 2.2.2. Khóa học (Course)
- ID khóa học
- Tiêu đề
- Mô tả
- Danh sách bài học
- Trạng thái công khai

#### 2.2.3. Lớp học (Class)
- ID lớp
- Tên lớp
- Giáo viên chủ nhiệm
- Danh sách học sinh
- Khóa học đã gán

#### 2.2.4. Bài học (Lesson)
- ID bài học
- Tiêu đề bài học
- Mô tả nội dung
- Thứ tự trong khóa học
- File HTML thí nghiệm 3D (experiment file)

#### 2.2.5. File thí nghiệm 3D (Experiment)
- Đường dẫn file HTML
- Tên thí nghiệm
- Mô tả ngắn gọn
- Thông tin liên kết với bài học

#### 2.2.6. Người dùng (User)
- ID người dùng
- Họ tên
- Email
- Role: admin, school, teacher, student
- Liên kết với trường/lớp khi cần thiết

### 2.3. Luồng chức năng chính

#### 2.3.1. Luồng admin
1. Đăng nhập vào hệ thống quản trị.
2. Quản lý danh sách trường học.
3. Tạo và quản lý khóa học.
4. Gán khóa học cho trường.
5. Kiểm tra trạng thái trường và nội dung đã phân bổ.

#### 2.3.2. Luồng school
1. Đăng nhập vào bảng điều khiển trường.
2. Quản lý các lớp học.
3. Quản lý giáo viên và học sinh.
4. Gán khóa học cho lớp học từ danh sách khóa học của trường.
5. Kiểm tra xem học sinh đã được truy cập khóa học.

#### 2.3.3. Luồng teacher
1. Đăng nhập vào trang giáo viên.
2. Xem lớp và học sinh do mình phụ trách.
3. Xem các khóa học đã gán cho lớp.
4. Hỗ trợ học sinh khi cần.

#### 2.3.4. Luồng student
1. Đăng nhập vào trang chủ học sinh.
2. Xem danh sách khóa học được gán cho lớp.
3. Chọn khóa học cần học.
4. Mở bài học và xem thí nghiệm 3D trong iframe.
5. Điều hướng giữa các bài học.

### 2.4. Luồng nội dung trang học

1. Home
   - Hiển thị danh sách khóa học phù hợp với người dùng.
2. Course Detail
   - Hiển thị thông tin khóa học và danh sách bài học.
3. Lesson Detail
   - Hiển thị tiêu đề, mô tả, nội dung bài học.
   - Nhúng iframe để hiển thị file HTML 3D.
4. Experiment
   - File HTML 3D được mở trong iframe.
   - Học sinh tương tác với mô hình 3D mà không rời khỏi trang bài học.

## III. Thiết kế hệ thống

### 3.1. Hệ thống phân quyền

- admin: toàn quyền quản lý trường học, khóa học, gán khóa học cho trường.
- school: quản lý lớp học, giáo viên, học sinh, gán khóa học cho lớp.
- teacher: xem thông tin lớp học, hỗ trợ học sinh.
- student: truy cập nội dung đã gán, xem bài học và thí nghiệm 3D.

### 3.2. Quy tắc gán khóa học

- Admin phân bổ khóa học cho trường.
- School chỉ có thể gán khóa học cho lớp nếu khóa học đã được phân bổ cho trường đó.
- Nếu trường không có khóa học được phân bổ, các lớp trong trường không có nội dung học.
- Học sinh chỉ thấy khóa học khi lớp của mình đã được gán khóa học.

### 3.3. Kiến trúc luồng dữ liệu

1. Admin đăng nhập và phân bổ khóa học cho trường.
2. School quản lý lớp và xem các khóa học đã có của trường.
3. School gán khóa học cho lớp.
4. Teacher/Student truy cập và xem nội dung theo quyền.
5. Học sinh mở khóa học → bài học → thí nghiệm 3D.

### 3.4. Kiến trúc thư mục gợi ý

```
/ (root)
  index.html                  # Trang chủ
  admin-dashboard.html        # Bảng điều khiển admin
  school-dashboard.html       # Bảng điều khiển school
  teacher-dashboard.html      # Bảng điều khiển teacher
  student-home.html           # Trang học sinh
  /courses/
    course-detail.html
    lesson-detail.html
  /experiments/
    exp-1.html
    exp-2.html
  /assets/
    styles.css
    script.js
  /data/
    schools.json
    courses.json
    classes.json
    users.json
```

### 3.5. Giao diện chính

#### 3.5.1. Trang chủ
- Hiển thị các khóa học phù hợp với người dùng.
- Mỗi khóa học gồm tên, mô tả ngắn và nút Xem bài học.

#### 3.5.2. Trang khóa học
- Hiển thị tiêu đề khóa học, mô tả, số lượng bài học.
- Danh sách bài học theo thứ tự.

#### 3.5.3. Trang bài học
- Tiêu đề bài học, mô tả nội dung.
- iframe nhúng file HTML thí nghiệm 3D.
- Điều hướng bài học.

#### 3.5.4. Dashboard admin
- Quản lý trường học, quản lý khóa học, gán khóa học cho trường.

#### 3.5.5. Dashboard school
- Quản lý lớp, giáo viên, học sinh, gán khóa học cho lớp.

## IV. Kết luận

Chương 1 đã xây dựng khung phân tích và thiết kế tổng quan cho hệ thống trang web thí nghiệm 3D, bao gồm:
- Bối cảnh và mục tiêu hệ thống.
- Phân tích các role và nghiệp vụ quản lý.
- Luồng truy cập nội dung khóa học → bài học → thí nghiệm 3D.
- Quy tắc phân quyền và gán khóa học cho trường/lớp.

Chương tiếp theo có thể chuyển sang chi tiết yêu cầu chức năng và kiến trúc dữ liệu.

# Chương 2: Yêu cầu chức năng và kiến trúc dữ liệu

## I. Mục tiêu chương 2

Chương 2 trình bày yêu cầu chức năng chi tiết cho từng role người dùng, các trường hợp sử dụng chính, yêu cầu dữ liệu và cấu trúc thông tin cần thiết để xây dựng hệ thống.

## II. Yêu cầu chức năng tổng quát

### 2.1. Yêu cầu hệ thống
- Hệ thống phải cho phép đăng nhập với 4 role: admin, school, teacher, student.
- Hệ thống phải xác thực quyền truy cập và chỉ hiển thị chức năng phù hợp với role tương ứng.
- Hệ thống phải lưu trữ và tải dữ liệu khóa học, bài học, experiment 3D theo định dạng tệp JSON hoặc cơ sở dữ liệu.
- Hệ thống phải nhúng experiment 3D bằng iframe trong trang bài học.
- Hệ thống phải cung cấp giao diện quản lý cho admin và school.

### 2.2. Yêu cầu bảo mật
- Người dùng phải đăng nhập với email và mật khẩu hợp lệ.
- Mỗi role chỉ có thể xem và thao tác trên dữ liệu được phép.
- Học sinh chỉ truy cập được bài học thuộc khóa học gán cho lớp của mình.
- Giáo viên chỉ được xem danh sách lớp và học sinh do mình phụ trách.
- School chỉ quản lý dữ liệu trong phạm vi trường của mình.

### 2.3. Yêu cầu về dữ liệu 3D
- Mỗi bài học phải liên kết với một experiment 3D dưới dạng tệp HTML.
- Khi học sinh mở bài học, iframe phải tải experiment 3D tương ứng.
- Thí nghiệm 3D phải hoạt động độc lập trong iframe và không làm gián đoạn luồng học.
- Hệ thống phải hỗ trợ nhiều experiment cho mỗi khóa học nếu cần.

## III. Yêu cầu chức năng theo role

### 3.1. Admin
- Đăng nhập và truy cập bảng điều khiển admin.
- Tạo, sửa, xóa trường học.
- Tạo, sửa, xóa khóa học.
- Gán/bỏ gán khóa học cho trường.
- Xem danh sách trường và khóa học đã phân bổ.
- Kiểm tra trạng thái gán khóa học và báo cáo tổng quan.

### 3.2. School
- Đăng nhập và truy cập bảng điều khiển trường.
- Tạo, sửa, xóa lớp học.
- Tạo, sửa, xóa giáo viên và học sinh.
- Gán/bỏ gán khóa học cho lớp học.
- Xem danh sách giáo viên và học sinh theo từng lớp.
- Xem tình trạng truy cập khóa học của học sinh.

### 3.3. Teacher
- Đăng nhập và xem danh sách lớp do mình phụ trách.
- Xem danh sách học sinh trong lớp.
- Xem các khóa học và bài học đã gán cho lớp.
- Hỗ trợ học sinh truy cập nội dung bài học và experiment 3D.
- Có thể theo dõi tiến độ học của học sinh nếu hệ thống bổ sung chức năng.

### 3.4. Student
- Đăng nhập và xem trang học sinh.
- Xem danh sách khóa học đã được gán cho lớp.
- Chọn khóa học để xem thông tin và bài học.
- Mở bài học và xem experiment 3D trong iframe.
- Điều hướng giữa các bài học trong cùng khóa học.

## IV. Các trường hợp sử dụng chính

### 4.1. Đăng nhập người dùng
- Người dùng nhập email và mật khẩu.
- Hệ thống xác thực và phân quyền.
- Sau khi đăng nhập, chuyển hướng đến trang phù hợp với role.

### 4.2. Quản lý trường học
- Admin thêm trường mới với tên và địa chỉ.
- Admin cập nhật thông tin trường.
- Admin xoá trường khi không còn sử dụng.

### 4.3. Quản lý khóa học
- Admin tạo khóa học mới gồm tiêu đề, mô tả và trạng thái.
- Admin thêm bài học vào khóa học.
- Admin liên kết experiment 3D với mỗi bài học.

### 4.4. Gán khóa học cho trường/lớp
- Admin gán khóa học cho trường.
- School gán khóa học cho lớp từ khóa học đã được phân bổ cho trường.
- Học sinh chỉ nhìn thấy khóa học khi lớp của mình đã được gán.

### 4.5. Học và xem experiment 3D
- Student chọn khóa học.
- Student xem danh sách bài học và mở bài học.
- Trang bài học nhúng iframe chứa experiment 3D.
- Student tương tác với mô hình 3D trong iframe.

## V. Kiến trúc dữ liệu chi tiết

### 5.1. Sơ đồ dữ liệu (Data Model)
- User
  - id
  - email
  - passwordHash
  - role
  - createdAt
  - updatedAt

- StudentProfile
  - id
  - userId
  - name
  - schoolId
  - classId
  - additionalInfo
  - createdAt
  - updatedAt

- TeacherProfile
  - id
  - userId
  - name
  - schoolId
  - createdAt
  - updatedAt

- School
  - id
  - name
  - address
  - email
  - courseIds
  - classIds

- Class
  - id
  - name
  - schoolId
  - teacherProfileId
  - studentIds
  - courseIds

- Course
  - id
  - title
  - description
  - isPublished
  - lessonIds

- Lesson
  - id
  - courseId
  - title
  - description
  - order
  - experimentId

- Experiment
  - id
  - name
  - htmlPath
  - description
  - lessonId

### 5.2. Quan hệ giữa các thực thể
- School → Class: một trường có nhiều lớp.
- School → Course: một trường có nhiều khóa học được phân bổ.
- Class → Course: một lớp có nhiều khóa học được gán.
- Course → Lesson: một khóa học gồm nhiều bài học.
- Lesson → Experiment: mỗi bài học có một experiment 3D.
- StudentProfile → Class: học sinh thuộc một lớp.
- TeacherProfile → Class: giáo viên phụ trách một hoặc nhiều lớp.
- User → StudentProfile / TeacherProfile: một user có thể có một profile tương ứng.

### 5.3. Định dạng lưu trữ dữ liệu
- Dữ liệu có thể lưu trong các tệp JSON tĩnh trong giai đoạn prototyping.
- Với hệ thống thực tế, nên sử dụng một cơ sở dữ liệu quan hệ hoặc NoSQL để quản lý quan hệ giữa trường, lớp, khóa học, bài học và experiment.
- Ví dụ tệp JSON cấu trúc: `schools.json`, `courses.json`, `classes.json`, `lessons.json`, `experiments.json`, `users.json`, `student_profiles.json`, `teacher_profiles.json`.

## VI. Yêu cầu phi chức năng

### 6.1. Hiệu năng
- Trang học sinh và trang bài học phải tải nhanh, đặc biệt khi nhúng iframe experiment 3D.
- Dữ liệu danh sách khóa học nên được tải trước hoặc lazy-load để giảm thời gian chờ.

### 6.2. Khả năng mở rộng
- Thiết kế dữ liệu đảm bảo dễ mở rộng khi thêm trường, lớp, khóa học mới.
- Hệ thống phải dễ dàng thêm experiment 3D mới mà không ảnh hưởng cấu trúc cốt lõi.

### 6.3. Tính dễ sử dụng
- Giao diện cần trực quan cho cả giáo viên và học sinh.
- Điều hướng giữa khóa học, bài học và experiment phải rõ ràng.
- Các thông báo lỗi phải dễ hiểu khi không có quyền truy cập hoặc khi dữ liệu chưa được gán.

### 6.4. Tính bảo trì
- Mã nguồn cần cấu trúc rõ ràng theo mô-đun.
- Dữ liệu và cấu hình nên tách thành các tệp riêng để dễ bảo trì.
- Các quy tắc phân quyền cần được kiểm tra ở cả front-end và back-end nếu có.

## VII. Kết luận chương 2

Chương 2 đã làm rõ yêu cầu chức năng và kiến trúc dữ liệu cho hệ thống học trực tuyến thí nghiệm 3D. Từ phân quyền người dùng, các luồng sử dụng chính đến mô hình dữ liệu và yêu cầu phi chức năng, nội dung này cung cấp nền tảng để triển khai chi tiết trong Chương 3.

# Chương 3: Thiết kế cơ sở dữ liệu

## I. Mục tiêu chương 3

Chương 3 thiết kế chi tiết cơ sở dữ liệu cho hệ thống học trực tuyến 3D, bao gồm mô hình quan hệ, bảng dữ liệu, khóa ngoại và các ràng buộc. Mục tiêu là đảm bảo dữ liệu được lưu trữ nhất quán, dễ truy vấn và dễ mở rộng.

## II. Lựa chọn mô hình cơ sở dữ liệu

### 2.1. Loại cơ sở dữ liệu
- Sử dụng cơ sở dữ liệu quan hệ (SQL) vì hệ thống có nhiều quan hệ rõ ràng giữa: trường, lớp, khóa học, bài học và người dùng.
- SQL phù hợp với yêu cầu phân quyền, truy vấn lọc theo role và quan hệ nhiều-nhiều.

### 2.2. Công nghệ đề xuất
- SQLite cho giai đoạn prototype và phát triển nhẹ.
- MySQL / MariaDB hoặc PostgreSQL cho triển khai thực tế.
- Nếu mở rộng lớn hơn, có thể cân nhắc thêm các dịch vụ như SQL Server hoặc cơ sở dữ liệu đám mây.

## III. Các bảng chính và mối quan hệ

### 3.1. Bảng 

#### 3.1.1. `users`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `email` TEXT NOT NULL UNIQUE
- `password_hash` TEXT NOT NULL
- `role` TEXT NOT NULL CHECK(role IN ('admin', 'school', 'teacher', 'student'))
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Giải thích cột:
- `id`: khoá chính duy nhất cho mỗi tài khoản.
- `email`: dùng làm tên đăng nhập và liên hệ chung.
- `password_hash`: mật khẩu đã băm bảo mật.
- `role`: phân loại quyền truy cập.
- `created_at`, `updated_at`: thời điểm tạo và cập nhật tài khoản.

#### 3.1.2. `student_profiles`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `user_id` Long NOT NULL
- `name` TEXT NOT NULL
- `school_id` Long NOT NULL
- `class_id` Long NOT NULL
- `additional_info` TEXT
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Giải thích cột:
- `id`: khoá chính hồ sơ học sinh.
- `user_id`: tham chiếu đến tài khoản `users`.
- `name`: tên học sinh hiển thị trong hệ thống.
- `school_id`: trường học mà học sinh đang theo học.
- `class_id`: lớp hiện tại của học sinh.
- `additional_info`: thông tin bổ sung như số liên hệ, ghi chú sức khỏe, v.v.
- `created_at`, `updated_at`: ghi nhận thời điểm tạo và thay đổi hồ sơ.

#### 3.1.3. `teacher_profiles`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `user_id` Long NOT NULL
- `name` TEXT NOT NULL
- `school_id` Long NOT NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Giải thích cột:
- `id`: khoá chính hồ sơ giáo viên.
- `user_id`: tham chiếu đến tài khoản `users`.
- `name`: tên giáo viên hiển thị.
- `school_id`: trường giáo viên đang thuộc.
- `created_at`, `updated_at`: thời điểm tạo và cập nhật hồ sơ.

#### 3.1.4. `schools`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `address` TEXT
- `email` TEXT
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Giải thích cột:
- `id`: khoá chính trường học.
- `name`: tên trường.
- `address`: địa chỉ trường.
- `email`: địa chỉ liên hệ chính thức của trường.
- `created_at`, `updated_at`: thời điểm tạo và cập nhật bản ghi.

#### 3.1.5. `classes`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `grade` TEXT
- `school_id` Long NOT NULL
- `teacher_profile_id` Long NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Giải thích cột:
- `id`: khoá chính lớp học.
- `name`: tên lớp, ví dụ '10A1'.
- `grade`: khối/lớp, ví dụ '10', '11', '12'.
- `school_id`: trường sở hữu lớp.
- `teacher_profile_id`: giáo viên chủ nhiệm của lớp.
- `created_at`, `updated_at`: thời điểm tạo và cập nhật lớp.

#### 3.1.6. `courses`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `title` TEXT NOT NULL
- `description` TEXT
- `is_published` BOOLEAN DEFAULT 0
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Giải thích cột:
- `id`: khoá chính khóa học.
- `title`: tên khóa học.
- `description`: mô tả nội dung khóa học.
- `is_published`: trạng thái công khai / đang hoạt động.
- `created_at`, `updated_at`: thời điểm tạo và cập nhật khóa học.

#### 3.1.7. `lessons`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `course_id` Long NOT NULL
- `title` TEXT NOT NULL
- `description` TEXT
- `lesson_order` INTEGER NOT NULL
- `experiment_id` INTEGER NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Giải thích cột:
- `id`: khoá chính bài học.
- `course_id`: tham chiếu đến khóa học cha.
- `title`: tên bài học.
- `description`: mô tả nội dung bài học.
- `lesson_order`: thứ tự bài học trong khóa học.
- `experiment_id`: liên kết đến thí nghiệm 3D tương ứng.
- `created_at`, `updated_at`: thời điểm tạo và cập nhật bài học.

#### 3.1.8. `experiments`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `html_path` TEXT NOT NULL
- `description` TEXT
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Giải thích cột:
- `id`: khoá chính thí nghiệm.
- `name`: tên thí nghiệm.
- `html_path`: đường dẫn tệp HTML chứa nội dung 3D.
- `description`: mô tả ngắn về thí nghiệm.
- `created_at`, `updated_at`: thời điểm tạo và cập nhật thí nghiệm.

### 3.2. Bảng liên kết nhiều-nhiều

#### 3.2.1. `school_courses`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `school_id` Long NOT NULL
- `course_id` Long NOT NULL
- `assigned_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- UNIQUE(`school_id`, `course_id`)

#### 3.2.2. `class_courses`
- `id` Long PRIMARY KEY AUTOINCREMENT
- `class_id` Long NOT NULL
- `course_id` Long NOT NULL
- `assigned_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- UNIQUE(`class_id`, `course_id`)

### 3.3. Ràng buộc và khóa ngoại

- `student_profiles.user_id` REFERENCES `users.id`
- `student_profiles.school_id` REFERENCES `schools.id`
- `student_profiles.class_id` REFERENCES `classes.id`
- `teacher_profiles.user_id` REFERENCES `users.id`
- `teacher_profiles.school_id` REFERENCES `schools.id`
- `classes.school_id` REFERENCES `schools.id`
- `classes.teacher_profile_id` REFERENCES `teacher_profiles.id`
- `users.school_id` REFERENCES `schools.id`
- `lessons.course_id` REFERENCES `courses.id`
- `lessons.experiment_id` REFERENCES `experiments.id`
- `school_courses.school_id` REFERENCES `schools.id`
- `school_courses.course_id` REFERENCES `courses.id`
- `class_courses.class_id` REFERENCES `classes.id`
- `class_courses.course_id` REFERENCES `courses.id`

### 3.4. Mối quan hệ dữ liệu

- `schools` 1 - N `classes`
- `schools` N - N `courses` qua `school_courses`
- `classes` N - N `courses` qua `class_courses`
- `courses` 1 - N `lessons`
- `lessons` 1 - 1 `experiments`
- `classes` 1 - N `student_profiles`
- `teacher_profiles` 1 - N `classes`
- `users` 1 - 1 `student_profiles` hoặc 1 - 1 `teacher_profiles`

> Lưu ý: quan hệ lớp chủ nhiệm được lưu trong `classes.teacher_profile_id`, nên bảng `teacher_profiles` không cần cột `class_id` nếu mỗi lớp chỉ có một giáo viên chủ nhiệm. Nếu cần một giáo viên phụ trách nhiều lớp thì vẫn dùng mối quan hệ này.

## IV. Thiết kế chi tiết bảng và ví dụ SQL

### 4.1. DDL mẫu cho SQLite

```sql
CREATE TABLE schools (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'school', 'teacher', 'student')),
  school_id BIGINT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE student_profiles (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  user_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  school_id BIGINT NOT NULL,
  class_id BIGINT NOT NULL,
  additional_info TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE teacher_profiles (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  user_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  school_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (school_id) REFERENCES schools(id)
);

CREATE TABLE classes (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  grade TEXT,
  school_id BIGINT NOT NULL,
  teacher_profile_id BIGINT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (teacher_profile_id) REFERENCES teacher_profiles(id)
);

CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE experiments (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  html_path TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  course_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  lesson_order INTEGER NOT NULL,
  experiment_id BIGINT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (experiment_id) REFERENCES experiments(id)
);

CREATE TABLE school_courses (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  school_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (school_id, course_id),
  FOREIGN KEY (school_id) REFERENCES schools(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE class_courses (
  id BIGINT PRIMARY KEY AUTOINCREMENT,
  class_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (class_id, course_id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### 4.2. Ví dụ dữ liệu mẫu

```sql
INSERT INTO schools (name, address, email) VALUES ('Trường THPT A', '123 Đường ABC', 'lienhe@thpta.edu.vn');

INSERT INTO users (email, password_hash, role, school_id) VALUES ('admin@example.com', 'hash123', 'admin', NULL);
INSERT INTO users (email, password_hash, role, school_id) VALUES ('school@example.com', 'hash123', 'school', 1);
INSERT INTO users (email, password_hash, role, school_id) VALUES ('teacher@example.com', 'hash123', 'teacher', 1);
INSERT INTO users (email, password_hash, role, school_id) VALUES ('student@example.com', 'hash123', 'student', 1);

INSERT INTO teacher_profiles (user_id, name, school_id) VALUES (3, 'GV Nguyễn Văn A', 1);
INSERT INTO classes (name, grade, school_id, teacher_profile_id) VALUES ('Lớp 10A1', '10', 1, 1);
INSERT INTO student_profiles (user_id, name, school_id, class_id) VALUES (4, 'HS Trần Văn B', 1, 1);

INSERT INTO courses (title, description, is_published) VALUES ('Toán 3D Cơ bản', 'Khóa học toán ứng dụng 3D.', 1);
INSERT INTO experiments (name, html_path, description) VALUES ('Mô hình 3D hình học', '/experiments/exp-1.html', 'Thí nghiệm 3D hình học.');
INSERT INTO lessons (course_id, title, description, lesson_order, experiment_id) VALUES (1, 'Bài 1: Hình học không gian', 'Giới thiệu thí nghiệm 3D.', 1, 1);
INSERT INTO school_courses (school_id, course_id) VALUES (1, 1);
INSERT INTO class_courses (class_id, course_id) VALUES (1, 1);
```

## V. Các view và truy vấn truy cập dữ liệu

### 5.1. Danh sách khóa học của trường

```sql
SELECT c.*
FROM courses c
JOIN school_courses sc ON c.id = sc.course_id
WHERE sc.school_id = ?;
```

### 5.2. Danh sách khóa học của lớp

```sql
SELECT c.*
FROM courses c
JOIN class_courses cc ON c.id = cc.course_id
WHERE cc.class_id = ?;
```

### 5.3. Danh sách bài học trong khóa học

```sql
SELECT l.*
FROM lessons l
WHERE l.course_id = ?
ORDER BY l.lesson_order;
```

### 5.4. Truy vấn experiment cho bài học

```sql
SELECT e.*
FROM experiments e
JOIN lessons l ON l.experiment_id = e.id
WHERE l.id = ?;
```

### 5.5. Kiểm tra quyền truy cập học sinh

```sql
SELECT 1
FROM users u
JOIN student_profiles sp ON sp.user_id = u.id
JOIN class_courses cc ON sp.class_id = cc.class_id
WHERE u.id = ?
  AND cc.course_id = ?
  AND u.role = 'student';
```

## VI. Yêu cầu mở rộng và bảo trì dữ liệu

### 6.1. Mở rộng chức năng
- Thêm bảng `progress` nếu cần theo dõi tiến độ học sinh.
- Thêm bảng `assignments` và `submissions` khi mở rộng chức năng bài tập.
- Thêm bảng `notifications` cho thông báo lớp học.

### 6.2. Bảo trì dữ liệu
- Sử dụng `created_at` và `updated_at` để kiểm tra lịch sử thay đổi.
- Đặt chỉ mục (`INDEX`) cho các trường khoá ngoại như `school_id`, `class_id`, `course_id`.
- Kiểm tra dữ liệu gán khóa học trước khi xóa để tránh bỏ rơi dữ liệu.

### 6.3. Nguyên tắc thiết kế
- Các bảng liên quan nên có ràng buộc khoá ngoại rõ ràng.
- Các quan hệ nhiều-nhiều phải dùng bảng trung gian.
- Dữ liệu nên được chuẩn hóa ở mức tối thiểu để tránh trùng lặp.
- Trường `password_hash` lưu mật khẩu đã mã hoá chứ không lưu rõ.

## VII. Kết luận chương 3

Chương 3 đã xây dựng thiết kế cơ sở dữ liệu chi tiết cho hệ thống học trực tuyến thí nghiệm 3D. Với các bảng, mối quan hệ, DDL mẫu và truy vấn chính, hệ thống đã có nền tảng để phát triển phần backend và lưu trữ dữ liệu hiệu quả.
