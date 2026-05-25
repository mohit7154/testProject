var currentColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
const button = document.getElementById("myButton");
const name = document.getElementById("nameInput");


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

  const taskList =
    document.getElementById("taskList");

  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {

    taskList.innerHTML +=
      `<  li style = "text - decoration:${tasks[i].completed ? "line-through" : "none"};
          opacity: ${tasks[i].completed ? "0.5" : "1"};">
      <span onclick="toggleTask(${i})" style="cursor:pointer;">${tasks[i].text}</span>
      <button style = " background-color: crimson; color: white; border: none; padding: 6px 12px; border-radius: 999px; cursor: pointer;" onclick="deleteTask(${i})">x</button>
    </li >;`
  }
}
