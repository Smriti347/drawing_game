const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const brushSizeInput = document.getElementById("brushSize");
const brushValue = document.getElementById("brushValue");
const colorPicker = document.getElementById("colorPicker");
const colorButtons = document.querySelectorAll(".color-btn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushSize = parseInt(brushSizeInput.value, 10);
let brushColor = colorPicker.value;

// Resize canvas to fit wrapper with proper resolution
function resizeCanvas() {
  const wrapper = document.querySelector(".canvas-wrapper");
  const rect = wrapper.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushSize;
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.clearRect(0, 0, rect.width, rect.height);
}

resizeCanvas();

function startDraw(x, y) {
  isDrawing = true;
  [lastX, lastY] = [x, y];
}

function draw(x, y) {
  if (!isDrawing) return;
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushSize;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
}

function stopDraw() {
  isDrawing = false;
}

// Mouse events
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  startDraw(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  draw(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

// Touch events
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    startDraw(touch.clientX - rect.left, touch.clientY - rect.top);
  },
  { passive: false }
);

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
  },
  { passive: false }
);

canvas.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    stopDraw();
  },
  { passive: false }
);

// Brush size
brushSizeInput.addEventListener("input", (e) => {
  brushSize = parseInt(e.target.value, 10) || 1;
  brushValue.textContent = brushSize;
});

// Colors from buttons
colorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const color = btn.getAttribute("data-color");
    brushColor = color;
    colorPicker.value = color;

    colorButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Color from picker
colorPicker.addEventListener("input", (e) => {
  brushColor = e.target.value;
  colorButtons.forEach((b) => b.classList.remove("active"));
});

// Clear canvas
clearBtn.addEventListener("click", () => {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
});

// Save drawing as image
saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "my-drawing.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// Optional: re-initialize if window is resized a lot
window.addEventListener("resize", () => {
  // If you want to keep drawings on resize, you'd need extra logic.
  // For now we just reset the canvas.
  resizeCanvas();
});
