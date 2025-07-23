document.getElementById("comment").addEventListener("input", function () {
  document.getElementById("char-count").textContent = this.value.length;
});

document.getElementById("phone").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

let map, placemark;
ymaps.ready(initMap);

function initMap() {
  map = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 10,
  });

  map.events.add("click", function (e) {
    const coords = e.get("coords");

    if (placemark) {
      map.geoObjects.remove(placemark);
    }

    placemark = new ymaps.Placemark(coords, {
      balloonContent: `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(
        6
      )}`,
    });

    map.geoObjects.add(placemark);
    placemark.balloon.open();
    document.getElementById("map-error").textContent = "";
  });
}

document.getElementById("order-form").addEventListener("submit", function (e) {
  e.preventDefault();
  let errors = [];
  let isValid = true;

  if (!document.getElementById("name").value.trim()) {
    document.getElementById("name-error").textContent = "Укажите ФИО";
    errors.push("ФИО");
    isValid = false;
  } else {
    document.getElementById("name-error").textContent = "";
  }

  const phone = document.getElementById("phone").value;
  if (!phone) {
    document.getElementById("phone-error").textContent = "Укажите телефон";
    errors.push("телефон");
    isValid = false;
  } else if (!/^\d+$/.test(phone)) {
    document.getElementById("phone-error").textContent = "Только цифры";
    errors.push("телефон");
    isValid = false;
  } else {
    document.getElementById("phone-error").textContent = "";
  }

  const email = document.getElementById("email").value;
  if (email && !email.includes("@")) {
    document.getElementById("email-error").textContent =
      "Email должен содержать @";
    errors.push("email");
    isValid = false;
  } else {
    document.getElementById("email-error").textContent = "";
  }
  if (!placemark) {
    document.getElementById("map-error").textContent = "Укажите адрес на карте";
    errors.push("адрес");
    isValid = false;
  } else {
    document.getElementById("map-error").textContent = "";
  }

  const resultDiv = document.getElementById("result");
  if (isValid) {
    resultDiv.textContent = "Заказ оформлен!";
    resultDiv.style.color = "green";
  } else {
    resultDiv.textContent = "Ошибки: " + errors.join(", ");
    resultDiv.style.color = "red";
  }
});
