// ----- Toolbar -----
const toolbar = document.createElement("div");
toolbar.style.position = "fixed";
toolbar.style.top = "0";
toolbar.style.left = "0";
toolbar.style.width = "100%";
toolbar.style.height = "60px";
toolbar.style.backgroundColor = "#222";
toolbar.style.display = "flex";
toolbar.style.alignItems = "center";
toolbar.style.padding = "0 20px";
toolbar.style.boxSizing = "border-box";

// ----- Button -----
const button = document.createElement("button");
button.textContent = "Hold me";
button.style.fontSize = "16px";
button.style.padding = "10px 16px";
button.style.cursor = "pointer";

// Add button to toolbar
toolbar.appendChild(button);

// Add toolbar to page
document.body.appendChild(toolbar);

// Push page content down so toolbar doesn't cover it
document.body.style.marginTop = "60px";

// Smooth background transition
document.body.style.transition = "background-color 0.2s";

// ----- Hold behavior -----
function turnGreen() {
  document.body.style.backgroundColor = "green";
}

function resetColor() {
  document.body.style.backgroundColor = "white";
}

// Desktop
button.addEventListener("mousedown", turnGreen);
button.addEventListener("mouseup", resetColor);
button.addEventListener("mouseleave", resetColor);

// Mobile
button.addEventListener("touchstart", turnGreen);
button.addEventListener("touchend", resetColor);
