from models import SessionLocal, Task

db = SessionLocal()

new_task = Task(text="Новая задача", seconds=0, running=False)
db.add(new_task)
db.commit()
db.refresh(new_task)

print(f"Создана задача: {new_task}")

tasks = db.query(Task).all()
print("Все задачи:")
for task in tasks:
    print(f" {task.id}: {task.text} ({task.seconds} сек)")

db.close()