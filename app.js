const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];
const STORAGE_KEY = "tasks";

function renderTasks() {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    taskCounter.style.display = "none";
  } else {
    emptyMessage.style.display = "none";
    taskCounter.style.display = "block";
  }
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const deleteButton = document.createElement("button");
    const toggleButton = document.createElement("button");
    const editButton = document.createElement("button");

    editButton.className = "edit-btn";
    editButton.setAttribute("aria-label", "Редактировать задачу");
    toggleButton.className = "toggle-btn";
    span.className = "task-text";
    span.textContent = task.text;
    deleteButton.className = "delete-btn";

    editButton.addEventListener("click", () => {
      startEdit(index);
    });
    deleteButton.addEventListener("click", () => {
      removeTask(index);
    });

    toggleButton.textContent = task.running ? "⏸" : "⏵";

    const timeSpan = document.createElement("span");
    timeSpan.className = "time";
    timeSpan.textContent = formatTime(task.seconds);

    toggleButton.addEventListener("click", () => {
      toggleTimer(index);
    });

    li.appendChild(editButton);
    li.appendChild(span);
    li.appendChild(timeSpan);
    li.appendChild(toggleButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });

  taskCounter.textContent = `Всего: ${tasks.length}`;
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) return;

  const parsed = JSON.parse(saved);

  tasks = parsed.map((item) => {
    if (typeof item === "string") {
      return { text: item, seconds: 0, running: false };
    }
    return { ...item, running: false };
  });
  saveTasks();
  renderTasks();
}

function startEdit(index) {
  const li = taskList.children[index];
  const span = li.querySelector(".task-text");

  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].text;
  input.className = "task-input";

  li.replaceChild(input, span);
  input.focus();
  input.select();

  let saved = false;

  function save() {
    if (saved) return;
    saved = true;

    const newText = input.value.trim();
    if (newText) {
      tasks[index].text = newText;
      saveTasks();
      span.textContent = newText;
    }
    li.replaceChild(span, input);
  }

  function cancel() {
    if (saved) return;
    saved = true;
    li.replaceChild(span, input);
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") save();
    if (event.key === "Escape") cancel();
  });
  input.addEventListener("blur", save);
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, seconds: 0, running: false });
  taskInput.value = "";
  renderTasks();
  saveTasks();
}

function removeTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function toggleTimer(index) {
  if (tasks[index].running) {
    tasks[index].running = false;
  } else {
    tasks.forEach((task) => {
      task.running = false;
    });
    tasks[index].running = true;
  }
  saveTasks();
  updateToggleButtons();
}
function updateToggleButtons() {
  tasks.forEach((task, index) => {
    const li = taskList.children[index];
    if (!li) return;
    const toggleButton = li.querySelector(".toggle-btn");
    if (toggleButton) {
      toggleButton.textContent = task.running ? "⏸" : "⏵";
    }
  });
}
addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

setInterval(() => {
  tasks.forEach((task, index) => {
    if (task.running) {
      task.seconds++;

      const li = taskList.children[index];
      if (li) {
        const timeSpan = li.querySelector(".time");
        if (timeSpan) {
          timeSpan.textContent = formatTime(task.seconds);
        }
      }
    }
  });
}, 1000);
window.addEventListener("beforeunload", () => {
  saveTasks();
});
loadTasks();
