// create button
const button = document.createElement("button");
button.textContent = "Hold me";

// style it a bit
button.style.fontSize = "20px";
button.style.padding = "20px";

// add to page
document.body.appendChild(button);

// smooth transition
document.body.style.transition = "background-color 0.2s";

// mouse events (desktop)
button.addEventListener("mousedown", () => {
  document.body.style.backgroundColor = "green";
});

button.addEventListener("mouseup", () => {
  document.body.style.backgroundColor = "white";
});

// touch events (mobile)
button.addEventListener("touchstart", () => {
  document.body.style.backgroundColor = "green";
});

button.addEventListener("touchend", () => {
  document.body.style.backgroundColor = "white";
});
