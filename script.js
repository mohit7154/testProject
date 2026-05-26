const currentColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
const currentFilter = "all";
const button = document.getElementById("myButton");
const name = document.getElementById("nameInput");
const tasks = [];


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

  tasks.push({text: task, completed: false});
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
  alert(currentFilter);
  
  var filteredTasks = tasks;
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }else if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  alert(filteredTasks);

  for (let i = 0; i < filteredTasks.length; i++) {
    var originalIndex = tasks.indexOf(filteredTasks[i]);
    taskList.innerHTML += 
    `<li style = "
      text-decoration:
        ${filteredTasks[i].completed ? "line-through" : "none"};
      opacity:
        ${filteredTasks[i].completed ? "0.5" : "1"};">
      <span onclick="toggleTask(${originalIndex})" style = "cursor:pointer;">${filteredTasks[i].text}</span>
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
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}
