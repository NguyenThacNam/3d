from fastapi import APIRouter

from app.api.routes import (
    auth,
    classes,
    courses,
    learning,
    lessons,
    profile,
    schools,
    students,
    teachers,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(learning.router)
api_router.include_router(schools.router)
api_router.include_router(courses.router)
api_router.include_router(lessons.router)
api_router.include_router(classes.router)
api_router.include_router(teachers.router)
api_router.include_router(students.router)
