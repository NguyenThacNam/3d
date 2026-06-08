class AppError(Exception):
    """Lỗi nghiệp vụ cơ sở, có mã HTTP tương ứng."""

    status_code = 400
    message = "Yêu cầu không hợp lệ."

    def __init__(self, message: str | None = None):
        super().__init__(message or self.message)
        self.message = message or self.message


class NotFoundError(AppError):
    status_code = 404
    message = "Không tìm thấy tài nguyên."


class ConflictError(AppError):
    status_code = 409
    message = "Dữ liệu bị trùng lặp."


class AuthError(AppError):
    status_code = 401
    message = "Email hoặc mật khẩu không đúng."


class ForbiddenError(AppError):
    status_code = 403
    message = "Bạn không có quyền thực hiện thao tác này."
