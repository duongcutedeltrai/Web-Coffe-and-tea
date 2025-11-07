// Tab switching functionality
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document
        .querySelectorAll(".tab")
        .forEach((tab) => tab.classList.remove("active"));
    document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));

    // Add active class to clicked tab and corresponding content
    event.target.classList.add("active");
    document.getElementById(tabName).classList.add("active");
}

// Modal functionality
function openUpdateModal() {
    const modal = document.getElementById("updateModal");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeUpdateModal() {
    const modal = document.getElementById("updateModal");
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
}

function openChartModal() {
    const modal = document.getElementById("chartModal");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    const staffId = document.body.getAttribute("data-staff-id");

    // ✅ Set tab mặc định là "month"

    document
        .querySelectorAll(".tab")
        .forEach((tab) => tab.classList.remove("active"));
    const defaultTab = document.querySelector('.tab[data-period="month"]');
    defaultTab.classList.add("active");

    // ✅ Gọi vẽ biểu đồ khi modal mở
    renderStaffRevenueChart(staffId, "month");
}
function closeChartModal() {
    const modal = document.getElementById("chartModal");
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
}


// Go back functionality
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Simulate going back to user list
        alert("Quay lại danh sách khách hàng...");
    }
}

// Add some interactive effects
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const staffId = document.body.getAttribute("data-staff-id");


    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const period = tab.getAttribute("data-period");
            renderStaffRevenueChart(staffId, period);
        });
    });
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
    // ESC to close modal
    if (e.key === "Escape") {
        closeUpdateModal();
    }

    // Ctrl+E to open edit modal
    if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        openUpdateModal();
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

//preview data
function previewAvatar(input) {
    const preview = document.getElementById("avatarPreview");
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result; // chỉ update src
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        // fallback nếu không chọn file
        preview.src = "/images/users/avatar-face.jpg";
    }
}

// Chart
// ===== Fetch API cho dữ liệu doanh thu =====
async function fetchStaffRevenue(staffId, period = "month") {
    try {

        const res = await fetch(
            `/admin/staff-revenue/api?staffId=${staffId}&period=${period}`
        );
        if (!res.ok) {
            throw new Error("Failed to fetch staff revenue");
        }
        const data = await res.json();
        if (!data.labels || !data.revenues) {
            throw new Error("Invalid data format");
        }
        return data;
    } catch (error) {
        console.error("❌ Error fetching staff revenue:", error);
        return { labels: [], revenues: [] }; // Trả về dữ liệu rỗng nếu lỗi
    }
}

// ===== Vẽ biểu đồ doanh thu nhân viên =====
async function renderStaffRevenueChart(staffId, period = "month") {
    try {
        const data = await fetchStaffRevenue(staffId, period);

        const ctx = document
            .getElementById("staffRevenueChart")
            .getContext("2d");

        if (window.staffChart) {
            window.staffChart.destroy();
        }

        window.staffChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: `Doanh thu (${period})`,
                        data: data.revenues,
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76, 175, 80, 0.2)",
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Doanh thu nhân viên (${period})`,
                    },
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                animation: {
                    duration: 1000,
                    easing: "easeOutQuart",
                },
            },
        });
    } catch (error) {
        console.error(" Error rendering chart:", error);
    }
}

// Chart modal tabs
