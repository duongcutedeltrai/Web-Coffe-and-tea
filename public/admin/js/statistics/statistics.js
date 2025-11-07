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
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34,197,94,0.2)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#22c55e",
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,

                    text: "Biểu đồ doanh thu",
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

    orderChartInstance = new Chart(canvas, {

        type: "line",
        data: {
            labels: chartData.labels,
            datasets: [
                {

                    label: "Đơn hàng",
                    data: chartData.orderData,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.2)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#3b82f6",
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
