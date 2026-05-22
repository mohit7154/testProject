var currentColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
const button = document.getElementById("myButton");
const name = document.getElementById("nameInput");


button.onmouseover = function () {
  button.style.backgroundColor = currentColor;
  name.style.backgroundColor = currentColor;
  name.style.transform = "scale(2)";
};
{
  
}

button.onmouseout = function () {
  button.style.backgroundColor = null;
  name.style.backgroundColor = null;
  name.style.transform = null;
};
const tasks = [];

function addTask() {

  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();

  if (task === "") {
    return;
  }

  tasks.push(task);
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
  for (let i = 0; i < tasks.length; i++) {
    taskList.innerHTML += `<li>${tasks[i]}</li>`;
  }
}
function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    taskList.innerHTML += `<li>${tasks[i]}<button onclick="deleteTask(${i})">Delete</button></li>`;
  }
}
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}
