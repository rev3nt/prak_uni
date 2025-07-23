const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const colorBox = document.getElementById("color-box");
const randomColorBtn = document.getElementById("random-color");

function updateSize() {
  colorBox.style.width = widthInput.value + "px";
  colorBox.style.height = heightInput.value + "px";
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

widthInput.addEventListener("input", updateSize);
heightInput.addEventListener("input", updateSize);

randomColorBtn.addEventListener("click", function () {
  colorBox.style.backgroundColor = getRandomColor();
});

// Инициализация при загрузке
updateSize();
