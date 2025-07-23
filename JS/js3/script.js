document.addEventListener("DOMContentLoaded", function () {
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const refreshBtn = document.getElementById("refreshBtn");
  const resetBtn = document.getElementById("resetBtn");
  const productsTable = document
    .getElementById("productsTable")
    .getElementsByTagName("tbody")[0];
  const errorMessage = document.getElementById("errorMessage");
  const noDataMessage = document.getElementById("noDataMessage");
  const tableContainer = document.getElementById("tableContainer");

  let productsData = [];

  loadProducts();

  refreshBtn.addEventListener("click", function () {
    validateAndFilter();
  });

  resetBtn.addEventListener("click", function () {
    minPriceInput.value = 0;
    maxPriceInput.value = 10000;
    validateAndFilter();
  });

  function loadProducts() {
    fetch("https://exercise.develop.maximaster.ru/service/products/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }
        return response.json();
      })
      .then((data) => {
        productsData = data.map((item, index) => ({
          id: index + 1,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          sum: item.quantity * item.price,
        }));
        filterAndDisplayProducts();
      })
      .catch((error) => {
        showError(error.message);
      });
  }

  function validateAndFilter() {
    const minPrice = parseInt(minPriceInput.value);
    const maxPrice = parseInt(maxPriceInput.value);

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      showError("Пожалуйста, введите корректные числовые значения");
      return;
    }

    if (minPrice < 0 || maxPrice < 0) {
      showError("Цена не может быть отрицательной");
      return;
    }

    if (minPrice > maxPrice) {
      showError("Минимальная цена не может быть больше максимальной");
      return;
    }

    hideError();
    filterAndDisplayProducts();
  }

  function filterAndDisplayProducts() {
    const minPrice = parseInt(minPriceInput.value);
    const maxPrice = parseInt(maxPriceInput.value);

    let filteredProducts;

    if (minPrice === 0 && maxPrice === 0) {
      filteredProducts = productsData;
    } else {
      filteredProducts = productsData.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    productsTable.innerHTML = "";

    if (filteredProducts.length === 0) {
      tableContainer.style.display = "none";
      noDataMessage.style.display = "block";
    } else {
      tableContainer.style.display = "block";
      noDataMessage.style.display = "none";

      filteredProducts.forEach((product) => {
        const row = productsTable.insertRow();

        const idCell = row.insertCell(0);
        idCell.textContent = product.id;

        const nameCell = row.insertCell(1);
        nameCell.textContent = product.name;

        const quantityCell = row.insertCell(2);
        quantityCell.textContent = product.quantity;

        const priceCell = row.insertCell(3);
        priceCell.textContent = formatPrice(product.price);

        const sumCell = row.insertCell(4);
        sumCell.textContent = formatPrice(product.sum);
      });
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price);
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  function hideError() {
    errorMessage.style.display = "none";
  }
});
