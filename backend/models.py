from sqlalchemy import Column, Integer, String, Boolean, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine("sqlite:///tasks.db", echo=True)

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    seconds = Column(Integer, default=0)
    running = Column(Boolean, default=False)

    def __repr__(self):
        return f"<Task(id={self.id}, text='{self.text}', seconds={self.seconds})>"

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(bind=engine)