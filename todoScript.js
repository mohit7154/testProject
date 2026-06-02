var currentFilter = "all";
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
var isEditing = false;
var editingIndex = null;
var searchText = "";
var currentSort = "newest";
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
  
  var oldestPendingTask = Number.POSITIVE_INFINITY;
  var newestCompletedTask = Number.NEGATIVE_INFINITY;
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  var filteredTasks = tasks;
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks = filteredTasks.filter(task => task.text.toLowerCase().includes(searchText));

  if (filteredTasks.length == 0) {
    taskList.innerHTML = "No tasks found.";
    return;
  }

  if (currentSort === "newest") {
    filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
  }else if(currentSort === "oldest"){
    filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
  }else if(currentSort === "completed"){
    filteredTasks = filteredTasks.filter(task => task.completed);
    filteredTasks.sort((a, b) => a.completedAt - b.completedAt);
  }else{
    filteredTasks = filteredTasks.filter(task => !task.completed);
    filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
  }

  if (filteredTasks.length == 0) {
    taskList.innerHTML = "No tasks found.";
    return;
  }

  for(let i = 0; i < filteredTasks.length; i++)
    if(filteredTasks[i].completed && filteredTasks[i].completedAt > newestCompletedTask)
        newestCompletedTask = filteredTasks[i].completedAt;
    else if(filteredTasks[i].createdAt < oldestPendingTask) 
        oldestPendingTask = filteredTasks[i].createdAt;
  console.log(newestCompletedTask, oldestPendingTask);


  for (let i = 0; i < filteredTasks.length; i++) {
    var originalIndex = tasks.indexOf(filteredTasks[i]);
    taskList.innerHTML +=
      `<li style = "
      text-decoration:
        ${filteredTasks[i].completed ? "line-through" : "none"};
      opacity:
        ${filteredTasks[i].completed ? "0.5" : "1"};
      color:
        ${filteredTasks[i].completedAt == newestCompletedTask ? "green" :
         (filteredTasks[i].createdAt == oldestPendingTask ? "red" : "black")};">
      <span onclick="toggleTask(${originalIndex})" style = "cursor:pointer;">${filteredTasks[i].text}</span>
      <button class="edit-btn" style = "background-color:${originalIndex == editingIndex ? "orange" : "none"};" onclick="editTask(${originalIndex})">Edit</button>
      <button style = "
        background-color: crimson;
        color: white;
        border: none;
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 999px;
        cursor: pointer;"
        onclick="deleteTask(${originalIndex})">x</button>
      </li>`;
  }
}

function setFilter(filter) {
  currentFilter = filter;
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

  if(completionPercentage <= 30) {
    document.getElementById("completionRate").style.color = "red";
  } else if (completionPercentage <= 70) {
    document.getElementById("completionRate").style.color = "orange";
  } else {
    document.getElementById("completionRate").style.color = "green";
  }
}