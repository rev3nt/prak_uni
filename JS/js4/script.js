document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("cpuChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Загруженность процессора (%)",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          fill: false,
          pointBackgroundColor: function (context) {
            const value = context.dataset.data[context.dataIndex];
            return value === null
              ? "rgba(255, 99, 132, 0.8)"
              : "rgba(75, 192, 192, 0.8)";
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Загруженность (%)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Время",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y === null) {
                label += "ошибка (использовано предыдущее значение)";
              } else {
                label += context.parsed.y + "%";
              }
              return label;
            },
          },
        },
      },
    },
  });

  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");
  const totalRequestsEl = document.getElementById("totalRequests");
  const errorRequestsEl = document.getElementById("errorRequests");
  const errorPercentageEl = document.getElementById("errorPercentage");
  const lastUpdateEl = document.getElementById("lastUpdate");

  let stats = {
    totalRequests: 0,
    errorRequests: 0,
    lastValue: 50,
  };

  let updateInterval;
  const UPDATE_INTERVAL_MS = 5000;

  function updateData() {
    fetch("https://exercise.develop.maximaster.ru/service/cpu/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка сети");
        }
        return response.text();
      })
      .then((data) => {
        stats.totalRequests++;
        const cpuUsage = parseInt(data);
        const now = new Date();
        const timeLabel = now.toLocaleTimeString();

        if (cpuUsage === 0) {
          stats.errorRequests++;
          addDataPoint(timeLabel, null);
        } else {
          stats.lastValue = cpuUsage;
          addDataPoint(timeLabel, cpuUsage);
        }

        updateStats();
        updateLastUpdateTime(now);
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        stats.totalRequests++;
        stats.errorRequests++;
        updateStats();
      });
  }

  function addDataPoint(label, value) {
    const actualValue = value === null ? stats.lastValue : value;

    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(actualValue);

    const maxPoints = 20;
    if (chart.data.labels.length > maxPoints) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    chart.update();
  }

  function updateStats() {
    totalRequestsEl.textContent = stats.totalRequests;
    errorRequestsEl.textContent = stats.errorRequests;

    const errorPercent =
      stats.totalRequests > 0
        ? Math.round((stats.errorRequests / stats.totalRequests) * 100)
        : 0;
    errorPercentageEl.textContent = `(${errorPercent}%)`;
  }

  function updateLastUpdateTime(time) {
    lastUpdateEl.textContent = time.toLocaleTimeString();
  }

  startBtn.addEventListener("click", function () {
    if (!updateInterval) {
      updateData();
      updateInterval = setInterval(updateData, UPDATE_INTERVAL_MS);
      startBtn.disabled = true;
      stopBtn.disabled = false;
    }
  });

  stopBtn.addEventListener("click", function () {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  });

  resetBtn.addEventListener("click", function () {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();

    stats = {
      totalRequests: 0,
      errorRequests: 0,
      lastValue: 50,
    };
    updateStats();
    lastUpdateEl.textContent = "-";

    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  });

  stopBtn.disabled = true;
});
