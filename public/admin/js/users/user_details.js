


// ================= TAB SWITCH =================
function switchTab(tabName) {
    document.querySelectorAll(".tab").forEach(tab =>
        tab.classList.remove("active")
    );

    document.querySelectorAll(".tab-content").forEach(content =>
        content.classList.remove("active")
    );

    const activeTab = document.querySelector(
        `.tab[onclick="switchTab('${tabName}')"]`
    );
    if (activeTab) activeTab.classList.add("active");

    const content = document.getElementById(tabName);
    if (content) content.classList.add("active");
}


// ================= MODAL =================
function openUpdateModal() {
    document.getElementById("updateModal")?.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeUpdateModal() {
    document.getElementById("updateModal")?.classList.remove("show");
    document.body.style.overflow = "auto";
}

function openChartModal() {
    const modal = document.getElementById("chartModal");
    if (!modal) return;

    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    const staffId = document.body.dataset.staffId;
    renderStaffRevenueChart(staffId, "month");
}

function closeChartModal() {
    document.getElementById("chartModal")?.classList.remove("show");
    document.body.style.overflow = "auto";
}

// ================= GO BACK =================
function goBack() {
    window.history.length > 1
        ? window.history.back()
        : alert("Quay lại danh sách khách hàng...");
}

// ================= AVATAR PREVIEW =================
function previewAvatar(input) {
    const preview = document.getElementById("avatarPreview");
    if (!preview) return;

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => (preview.src = e.target.result);
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = "/images/users/avatar-face.jpg";
    }
}

// ================= FETCH CHART DATA =================
async function fetchStaffRevenue(staffId, period = "month") {
    try {
        const res = await fetch(
            `/admin/staff-revenue/api?staffId=${staffId}&period=${period}`
        );
        if (!res.ok) throw new Error("Fetch failed");
        return await res.json();
    } catch (err) {
        console.error("❌ Fetch chart error:", err);
        return { labels: [], revenues: [] };
    }
}

// ================= RENDER CHART =================
async function renderStaffRevenueChart(staffId, period) {
    if (!staffId) return;

    const { labels, revenues } = await fetchStaffRevenue(staffId, period);
    const canvas = document.getElementById("staffRevenueChart");
    if (!canvas) return;

    if (window.staffChart) window.staffChart.destroy();

    window.staffChart = new Chart(canvas, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: `Doanh thu (${period})`,
                data: revenues,
                borderColor: "#714024",
                backgroundColor: "rgba(113,64,36,0.2)",
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ================= ORDERS =================
const ordersEl = document.getElementById("orders-data");
const ordersData = ordersEl
    ? JSON.parse(ordersEl.dataset.orders)
    : [];

const tbody = document.getElementById("ordersTableBody");

function formatMoney(v) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(v);
}

function renderOrders() {
    if (!tbody) return;
    tbody.innerHTML = "";

    ordersData.forEach(order => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${order.order_id}</td>
            <td>${new Date(order.orderDate).toLocaleDateString("vi-VN")}</td>
            <td>${order.order_details.length} sản phẩm</td>
            <td>${formatMoney(order.final_amount)}</td>
            <td>
                <span class="order-status status-${order.status}">
                    ${order.status}
                </span>
            </td>
            <td>
                <button
                    class="btn-view-detail"
                    data-id="${order.order_id}">
                    Xem chi tiết
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

tbody.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-view-detail");
    if (!btn) return;

    const orderId = btn.dataset.id;
    showOrderDetail(orderId);
});

function showOrderDetail(orderId) {
    const order = ordersData.find(o => o.order_id === orderId);
    if (!order) return;

    document.getElementById("orderModalBody").innerHTML = `
        <div class="order-info-box">
            <p><b>Mã đơn:</b> #MD${order.order_id.toString().padStart(3, "0")}</p>
            <p><b>Ngày đặt:</b> ${new Date(order.orderDate).toLocaleDateString("vi-VN")}</p>
            <p><b>Trạng thái:</b> ${order.status}</p>
        </div>

        ${order.order_details.map(d => `
            <div class="product-list-item">
                <div>${d.products.name} x${d.quantity}</div>
                <div>${formatMoney(d.price * d.quantity)}</div>
            </div>
        `).join("")}

        <div class="order-total-section">
            <div class="order-total-label">Tổng cộng</div>
            <div class="order-total-value">${formatMoney(order.final_amount)}</div>
        </div>
    `;

    document.getElementById("orderDetailModal").classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeOrderModal() {
    document.getElementById("orderDetailModal")?.classList.remove("show");
    document.body.style.overflow = "auto";
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    renderOrders();
});
