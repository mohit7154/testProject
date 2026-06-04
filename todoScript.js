var currentFilter = "all";
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
var isEditing = false;
var editingIndex = null;
var searchText = "";
var currentSort = "newest";
const filterButtons = document.querySelectorAll(".main-filter-button");
filterButtons.forEach(button => {
  if (button.id != 'allFilter') {
    button.onmouseover = function () {
      button.style.transform = "translateY(5px)";
    }
    button.onmouseout = function () {
      button.style.transform = "translateY(0px)";
    }
  } else {
    button.onmouseout = null;
    button.onmouseover = null;
    button.style.transform = "translateY(15px)";
  }
});
renderTasks();

function addTask() {

  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();

  if (task === "") {
    return;
  }

  if (isEditing) {
    tasks[editingIndex].text = task;
    isEditing = false;
    editingIndex = null;
  } else {
    tasks.push({ text: task, completed: false, createdAt: Date.now(), completedAt: null });
  }
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function renderTasks() {

  updateStats();
  document.getElementById("statsContainer").style.visibility = "visible";

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  var filteredTasks = tasks;

  if (currentFilter === "completedFilter") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === "pendingFilter") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks = filteredTasks.filter(task => task.text.toLowerCase().includes(searchText));

  if (currentSort === "newest") {
    filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
  } else {
    filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
  }

  if (filteredTasks.length == 0) {
    taskList.innerHTML = `<div class = "no-tasks">No tasks found.</div>`;
    return;
  }


  for (let i = 0; i < filteredTasks.length; i++) {
    let originalIndex = tasks.indexOf(filteredTasks[i]);
    taskList.innerHTML +=
      `<div class="task-row">
        <div class="task-name">
          ${filteredTasks[i].text}
        </div>
        <div class="task-status">
          <span class="status-indicator" onclick="toggleTask(${originalIndex})" 
          style = "border: 1px solid rgba(255, 255, 255, 0.76); background-color: ${filteredTasks[i].completed ? "#27633ae5" : "rgba(255, 0, 0, 0.7)"};"></span>
        </div>
        <div class="task-actions">
          <button class = "stat"
            onclick="editTask(${originalIndex})">
            Edit
          </button>
          <button class="stat"
            onclick="deleteTask(${originalIndex})">
            X
          </button>
        </div>
      </div>`;
  }
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(button => {
    if (button.id != filter) {

      button.onmouseover = function () {
        button.style.transform = "translateY(5px)";
      }

      button.onmouseout = function () {
        button.style.transform = "translateY(0px)";
      }

      button.style.transform = "translateY(0px)";
    } else {
      button.onmouseout = null;
      button.onmouseover = null;
      button.style.transform = "translateY(15px)";
    }
  });

  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  tasks[index].completedAt = tasks[index].completed ? Date.now() : null;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const taskInput = document.getElementById("taskInput");
  taskInput.value = tasks[index].text;
  isEditing = true;
  editingIndex = index;
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateSearch() {
  searchText = document.getElementById("searchInput").value.trim().toLowerCase();
  renderTasks();
}

function updateSort() {
  currentSort = document.getElementById("sortSelect").value;
  renderTasks();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  document.getElementById("totalTasks").innerText = `Total Tasks: ${total}`;
  document.getElementById("completedTasks").innerText = `Completed: ${completed}`;
  document.getElementById("pendingTasks").innerText = `Pending: ${pending}`;
  document.getElementById("completionRate").innerText = `Completion Rate: ${completionPercentage}%`;

  if (completionPercentage == 0) {
    document.getElementById("statsContainer").style.background = `linear-gradient(to right, rgba(255, 0, 0, 0.7) 100%`;
  } else if (completionPercentage <= 30) {
    document.getElementById("statsContainer").style.background = `linear-gradient(to right, rgba(255, 0, 0, 0.7)  ${completionPercentage}%, rgba(255,255,255,0.08) ${completionPercentage + 4}%)`;
  } else if (completionPercentage <= 70) {
    document.getElementById("statsContainer").style.background = `linear-gradient(to right, rgba(253, 59, 0, 0.6)  ${completionPercentage}%, rgba(255,255,255,0.08) ${completionPercentage + 4}%)`;
  } else {
    document.getElementById("statsContainer").style.background = `linear-gradient(to right, #1d4329e5 ${completionPercentage}%, rgba(255,255,255,0.08) ${completionPercentage + 4}%)`;
  }
}