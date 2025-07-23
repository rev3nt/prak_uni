document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "spreadsheetData";
  const MIN_COLS = 1;
  const MIN_ROWS = 1;

  const columnHeaders = document.getElementById("column-headers");
  const spreadsheetBody = document.getElementById("spreadsheet-body");

  let spreadsheetData = [];
  let cols = 5;
  let rows = 5;

  function initSpreadsheet() {
    loadFromLocalStorage();
    renderSpreadsheet();
  }

  function loadFromLocalStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      spreadsheetData = parsedData.data || [];
      cols = parsedData.cols || 5;
      rows = parsedData.rows || 5;
    } else {
      spreadsheetData = Array(rows)
        .fill()
        .map(() => Array(cols).fill(""));
    }
  }

  function saveToLocalStorage() {
    const dataToSave = {
      data: spreadsheetData,
      cols: cols,
      rows: rows,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }

  function renderSpreadsheet() {
    columnHeaders.innerHTML = "";
    spreadsheetBody.innerHTML = "";

    for (let i = 0; i < cols; i++) {
      const colHeader = document.createElement("div");
      colHeader.className = "column-header";
      colHeader.textContent = String.fromCharCode(65 + i);
      columnHeaders.appendChild(colHeader);
    }

    for (let row = 0; row < rows; row++) {
      const rowElement = document.createElement("div");
      rowElement.className = "spreadsheet-row";

      const rowHeader = document.createElement("div");
      rowHeader.className = "row-header";
      rowHeader.textContent = row + 1;
      rowElement.appendChild(rowHeader);

      for (let col = 0; col < cols; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = spreadsheetData[row]?.[col] || "";
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener("dblclick", function () {
          startEditingCell(cell, row, col);
        });

        rowElement.appendChild(cell);
      }

      spreadsheetBody.appendChild(rowElement);
    }
  }

  function startEditingCell(cell, row, col) {
    cell.classList.add("editing");
    cell.innerHTML = `<input type="text" class="cell-input" value="${
      spreadsheetData[row][col] || ""
    }">`;

    const input = cell.querySelector(".cell-input");
    input.focus();

    input.addEventListener("blur", function () {
      finishEditingCell(cell, row, col, input.value);
    });

    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        finishEditingCell(cell, row, col, input.value);
      }
    });
  }

  function finishEditingCell(cell, row, col, value) {
    if (!spreadsheetData[row]) {
      spreadsheetData[row] = [];
    }
    spreadsheetData[row][col] = value;

    cell.classList.remove("editing");
    cell.textContent = value;

    saveToLocalStorage();
  }

  function addColumn() {
    cols++;
    for (let row = 0; row < rows; row++) {
      if (!spreadsheetData[row]) {
        spreadsheetData[row] = [];
      }
      spreadsheetData[row].push("");
    }
    saveToLocalStorage();
    renderSpreadsheet();
  }

  function removeColumn() {
    if (cols <= MIN_COLS) return;

    let hasData = false;
    for (let row = 0; row < rows; row++) {
      if (spreadsheetData[row]?.[cols - 1]) {
        hasData = true;
        break;
      }
    }

    if (hasData && !confirm("В удаляемом столбце есть данные. Удалить?")) {
      return;
    }

    cols--;
    for (let row = 0; row < rows; row++) {
      if (spreadsheetData[row]) {
        spreadsheetData[row].pop();
      }
    }
    saveToLocalStorage();
    renderSpreadsheet();
  }

  function addRow() {
    rows++;
    spreadsheetData.push(Array(cols).fill(""));
    saveToLocalStorage();
    renderSpreadsheet();
  }

  function removeRow() {
    if (rows <= MIN_ROWS) return;

    const lastRow = spreadsheetData[rows - 1];
    const hasData = lastRow && lastRow.some((cell) => cell);

    if (hasData && !confirm("В удаляемой строке есть данные. Удалить?")) {
      return;
    }

    rows--;
    spreadsheetData.pop();
    saveToLocalStorage();
    renderSpreadsheet();
  }

  document
    .querySelector(".add-column-btn")
    .addEventListener("click", addColumn);
  document
    .querySelector(".remove-column-btn")
    .addEventListener("click", removeColumn);
  document.querySelector(".add-row-btn").addEventListener("click", addRow);
  document
    .querySelector(".remove-row-btn")
    .addEventListener("click", removeRow);

  initSpreadsheet();
});
