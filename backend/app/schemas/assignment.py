from pydantic import BaseModel


class AssignUpdate(BaseModel):
    course_ids: list[int]


# Bản đồ { entityId(str) : [courseId, ...] } cho AssignBoard ở frontend
AssignmentsMap = dict[str, list[int]]
