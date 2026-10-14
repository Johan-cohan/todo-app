from pydantic import BaseModel

class TaskBase(BaseModel):
    text: str
    seconds: int = 0
    running: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    text: str | None = None
    seconds: int | None = None
    running: bool | None = None

class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True