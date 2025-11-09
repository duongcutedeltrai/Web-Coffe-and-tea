let chartData = {
    labels: [],
    orderData: [],
    revenueData: [],
};

let currentPeriod = "month";

let orderChartInstance = null;
let revenueChartInstance = null;

// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", async () => {
    console.log("📊 Statistics page initializing...");

    await fetchStatisticsData(currentPeriod);
    initializeCharts();
    setupToggleButtons();
    setupResponsiveCharts();
    console.log("✅ Statistics page loaded successfully");
});

async function fetchStatisticsData(period = "month") {
    try {
        const response = await fetch(`/admin/statistics/api?period=${period}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        chartData.labels = data.labels || [];
        chartData.revenueData = data.revenues || [];
        chartData.orderData = data.orders || [];
        console.log("📈 Chart data loaded:", chartData);
        return data;
    } catch (error) {
        console.error("❌ Failed to fetch statistics data:", error);
    }
}

// -----------------------------
// Chart Initialization
// -----------------------------
function initializeCharts() {
    initializeRevenueChart();
    initializeOrderChart();
}

function initializeRevenueChart() {
    const canvas = document.getElementById("revenueChart");
    if (!canvas) {
        console.warn("⚠️ Revenue chart canvas not found");
        return;
    }
    if (revenueChartInstance) revenueChartInstance.destroy();

    revenueChartInstance = new Chart(canvas, {
        type: "line",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Doanh thu",
                    data: chartData.revenueData,
                    borderColor: "#16a34a",
                    backgroundColor: "rgba(22,163,74,0.12)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3, pointBackgroundColor: "#16a34a",
                pointRadius: 5,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: "#15803d",
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Biểu đồ doanh thu",
                    color: "#374151", 
                },
                legend: { display: false },
            },
            scales: {
                x: { title: { display: false } },
                y: {
                    beginAtZero: true,
                    title: { display: false },
                    ticks: {
                        callback: function (value) {
                            return formatCurrency(value);
                        },
                    },
                },
            },
        },
    });
}

function initializeOrderChart() {
    const canvas = document.getElementById("orderChart");
    if (!canvas) {
        console.warn("⚠️ Order chart canvas not found");
        return;
    }
    if (orderChartInstance) orderChartInstance.destroy();
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(59, 187, 246, 0.2)");
    gradient.addColorStop(0.7, "rgba(59, 187, 246, 0)");
    orderChartInstance = new Chart(ctx , {
        type: "line",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Đơn hàng",
                    data: chartData.orderData,
                    borderColor: "#0096C7",
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 5,
                    pointBackgroundColor: "#0096C7",
                },
            ],
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500, // thời gian chạy 1.5s
                easing: "easeOutQuart", // kiểu mượt
            },
            plugins: {
                title: {
                    display: true,
                    text: "Biểu đồ đặt hàng",
                },
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    title: {
                        display: false,
                    },
                     ticks: {
                        color: "#555",
                        font: {
                            size: 13,
                            family: "Poppins, sans-serif",
                        },
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: false,
                    },
                    ticks: {
                        callback: function (value) {
                            return value;
                        },
                    },
                     grid: {
                        color: "rgba(0,0,0,0.05)",
                    },
                    ticks: {
                        color: "#777",
                        font: {
                            size: 13,
                            family: "Poppins, sans-serif",
                        },
                    },
                },
            },
        },
    });
}

// -----------------------------
// Utility Functions
// -----------------------------
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + "M";
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + "K";
    }
    return amount.toString();
}

// -----------------------------
// Toggle Buttons Setup
// -----------------------------
function setupToggleButtons() {
    const toggleGroups = document.querySelectorAll(".time-toggles");
    toggleGroups.forEach((group) => {
        const buttons = group.querySelectorAll(".toggle-btn");
        buttons.forEach((button) => {
            button.addEventListener("click", async () => {
                buttons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
                const period = button.getAttribute("data-period");
                currentPeriod = period;
                await updateChartData(period);
                console.log(`📊 Switched to ${period} period`);
            });
        });
    });
}

// -----------------------------
// Chart Data Update
// -----------------------------
async function updateChartData(period) {
    const data = await fetchStatisticsData(period);

    if (orderChartInstance && revenueChartInstance) {
        orderChartInstance.data.labels = chartData.labels;
        orderChartInstance.data.datasets[0].data = chartData.orderData;

        revenueChartInstance.data.labels = chartData.labels;
        revenueChartInstance.data.datasets[0].data = chartData.revenueData;

        orderChartInstance.update();
        revenueChartInstance.update();
    } else {
        initializeCharts();
    }
}

// -----------------------------
// Responsive Charts
// -----------------------------
function setupResponsiveCharts() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("📱 Resizing charts...");
            initializeCharts();
        }, 250);
    });
}

// -----------------------------
// Export for external use
// -----------------------------
window.StatisticsCharts = {
    refresh: initializeCharts,
    updatePeriod: updateChartData,
    getCurrentData: () => chartData,
};
