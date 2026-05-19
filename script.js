function changeText() {
  var message = document.getElementById("message");
  switch(message.innerText){
    case "This is Day 4 of my consistency streak.":
      message.innerText = "Button clicked. I'm still showing up.";
      break;
    default:
      message.innerText = "Button clicked. I'm still showing up.";
  }
  message.style.color = "#" + Math.floor(Math.random()*16777215).toString(16);
}
