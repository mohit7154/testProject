var currentColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
const button = document.getElementById("myButton");

button.onmouseover = function() {
  button.style.backgroundColor = currentColor;
};

button.onmouseout = function() {
  button.style.backgroundColor = "white";
};

function changeText() {
  const message = document.getElementById("message");
  message.innerText = "Button clicked. I'm still showing up.";
  message.style.color = currentColor;
  currentColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
}
