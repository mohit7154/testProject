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

  tasks.push({ text: task, completed: false, createdAt: Date.now(), completedAt: null });
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function renderTasks() {

  updateStats();
  document.getElementById("statsContainer").style.visibility = "visible";

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  var filteredTasks = getFilteredTasks();

  if (filteredTasks.length == 0) {
    taskList.innerHTML = `<div class = "no-tasks">No tasks found.</div>`;
    return;
  }

  renderTaskRows(taskList, filteredTasks);
}

function getFilteredTasks() {
  let filteredTasks = tasks;
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
  return filteredTasks;
}

function renderTaskRows(taskList, filteredTasks) {
  for (const taskRow of filteredTasks) {
    const originalIndex = tasks.indexOf(taskRow);
    const row = document.createElement("div");
    row.className = "task-row";

    // ---------------- Task Name ----------------

    
    const taskName = document.createElement("input");
    taskName.value = taskRow.text;
    taskName.readOnly = true;
    taskName.className = "task-name";
    if (originalIndex === editingIndex) {
      taskName.readOnly = false;
      taskName.className = "task-edit-input";
    }
    row.appendChild(taskName);

    // ---------------- Status ----------------

    const taskStatus = document.createElement("div");
    taskStatus.className = "task-status";

    const statusIndicator = document.createElement("span");
    statusIndicator.className = "status-indicator";

    statusIndicator.style.border = "1px solid rgba(255,255,255,0.76)";

    statusIndicator.style.backgroundColor = taskRow.completed ? "#27633ae5" : "rgba(255,0,0,0.7)";

    statusIndicator.addEventListener("click", () => {
      toggleTask(originalIndex);
    });

    taskStatus.appendChild(statusIndicator);
    row.appendChild(taskStatus);

    // ---------------- Actions ----------------

    const taskActions = document.createElement("div");
    taskActions.className = "task-actions";

    // Edit Button

    const editButton = document.createElement("button");
    editButton.className = "action-button";

    const editText = document.createElement("span");
    editText.className = "action-button-text";
    editText.textContent = "Edit";

    if (originalIndex === editingIndex) {
      editText.style.background = "#2b3a54";
      editText.textContent = "Done";
    }

    editButton.appendChild(editText);

    editButton.addEventListener("click", () => {
      editTask(originalIndex);
    });

    // Delete Button

    const deleteButton = document.createElement("button");
    deleteButton.className = "action-button";

    const deleteText = document.createElement("span");
    deleteText.className = "action-button-text";
    deleteText.textContent = "X";

    deleteButton.appendChild(deleteText);

    deleteButton.addEventListener("click", () => {
      deleteTask(originalIndex);
    });

    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    row.appendChild(taskActions);
    taskList.appendChild(row);
    if (originalIndex === editingIndex) {
      taskName.focus();
    }
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

  editingIndex = null;
  isEditing = false;
  const taskInput = document.getElementById("taskInput");
  taskInput.value = '';
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
  if(isEditing && editingIndex === index) {
    const taskEdit = document.querySelector(".task-edit-input");
    const task = taskEdit.value.trim();
    if (task === "") {
      return;
    }
    tasks[editingIndex].text = task;

    isEditing = false;
    editingIndex = null;
    saveTasks();
    renderTasks();
    return;
  }
  isEditing = true;
  editingIndex = index;
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

  if (completionPercentage == 0 && total != 0) {
    document.getElementById("statsContainer").style.background = `linear-gradient(to right, rgba(255, 0, 0, 0.7) 100%`;
  } else if (completionPercentage <= 30 && total != 0) {
    document.getElementById("statsContainer").style.background = `linear-gradient(to right, rgba(255, 0, 0, 0.7)  ${completionPercentage}%, rgba(255,255,255,0.08) ${completionPercentage + 4}%)`;
  } else if (completionPercentage <= 70 && total != 0) {
    document.getElementById("statsContainer").style.background = `linear-gradient(to right, rgba(253, 59, 0, 0.6)  ${completionPercentage}%, rgba(255,255,255,0.08) ${completionPercentage + 4}%)`;
  } else if(total != 0){
    document.getElementById("statsContainer").style.background = `linear-gradient(to right, #1d4329e5 ${completionPercentage}%, rgba(255,255,255,0.08) ${completionPercentage + 4}%)`;
  }
}