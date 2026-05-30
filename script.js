var currentColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
var currentFilter = "all";
const button = document.getElementById("myButton");
const name = document.getElementById("nameInput");
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
var isEditing = false;
var editingIndex = null;
var searchText = "";
renderTasks();

button.onmouseover = function () {
  button.style.backgroundColor = currentColor;
  name.style.backgroundColor = currentColor;
  name.style.transform = "scale(2)";
};

button.onmouseout = function () {
  button.style.backgroundColor = null;
  name.style.backgroundColor = null;
  name.style.transform = null;
};

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
    tasks.push({ text: task, completed: false });
  }
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function changeText() {
  const message = document.getElementById("message");
  if ((name.value + '').trim() == "")
    name.value = "BlahBlah";
  message.innerText = "Button clicked. " + name.value + ", you're still showing up.";
  message.style.color = currentColor;
  currentColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  button.style.backgroundColor = currentColor;
  name.style.backgroundColor = currentColor;
  name.value = "";
}

function renderTasks() {

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  var filteredTasks = tasks;
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks = filteredTasks.filter(task => task.text.toLowerCase().includes(searchText));

  if(filteredTasks.length == 0) {
    taskList.innerHTML = "No tasks found.";
    return;
  }

  for (let i = 0; i < filteredTasks.length; i++) {
    var originalIndex = tasks.indexOf(filteredTasks[i]);
    taskList.innerHTML +=
      `<li style = "
      text-decoration:
        ${filteredTasks[i].completed ? "line-through" : "none"};
      opacity:
        ${filteredTasks[i].completed ? "0.5" : "1"};">
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
