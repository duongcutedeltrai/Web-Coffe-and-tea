function formatVND(amount) {
    return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}
function decreaseQuantity() {
    const input = document.getElementById("quantity");
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

function increaseQuantity() {
    const input = document.getElementById("quantity");
    const currentValue = parseInt(input.value);
    input.value = currentValue + 1;
}

// Mobile menu toggle (if needed)
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
}
const priceEl = document.querySelector(".price");
window.addEventListener("DOMContentLoaded", () => {
    const sizesContainer = document.querySelector(".size-container");
    if (sizeOptions[0].dataset.size.toUpperCase() === "DEFAULT") {
        sizesContainer.style.display = "none";
    }
    if (priceEl) {
        let raw = priceEl.textContent.trim();
        let number = parseInt(raw, 10);

        if (!isNaN(number)) {
            priceEl.textContent = formatVND(number);
        }
    }
});

// Add smooth scrolling animation
window.addEventListener("scroll", function () {
    const elements = document.querySelectorAll(
        ".product-details, .chart-section, .reviews-section ,.product-image"
    );
    elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }
    });
});
const sizeOptions = document.querySelectorAll(".size-option");

sizeOptions.forEach((option) => {
    option.addEventListener("click", () => {
        // Bỏ active cũ
        sizeOptions.forEach((opt) => opt.classList.remove("active"));
        // Thêm active cho ô vừa click
        option.classList.add("active");
        // update giá
        const newPrice = parseInt(option.dataset.price, 10);
        if (!isNaN(newPrice)) {
            priceEl.textContent = formatVND(newPrice);
        }
    });
});
// Initialize animation styles
document
    .querySelectorAll(
        ".product-details, .chart-section, .reviews-section,.product-image"
    )
    .forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "all 0.6s ease";
    });

// Show elements on load
window.addEventListener("load", function () {
    setTimeout(() => {
        document
            .querySelectorAll(
                ".product-details, .chart-section, .reviews-section,.product-image"
            )
            .forEach((element) => {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            });
    }, 300);
});

////xóa sản phẩm
$(document).on("click", ".delete--btn", function (e) {
    // e.stopPropagation(); // tránh click card nếu nút nằm trong card
    const productId = $(".product-details").data("id");
    console.log(productId);
    if (!productId) return;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        backdrop: `
        rgba(0,0,0,0.5)
        left top
        no-repeat
    `,
        customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            // Gọi API xóa
            $.ajax({
                url: `/api/admin/products/${productId}`, // endpoint xóa
                method: "DELETE",
                success: function () {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your product has been deleted.",
                        icon: "success",
                        confirmButtonColor: "rgba(17, 202, 33, 1)",
                        backdrop: `
        rgba(0,0,0,0.5)
        left top
        no-repeat
    `,
                    }).then(() => {
                        // quay về trang danh sách sản phẩm
                        window.location.href = "/admin/products";
                    });
                },
                error: function (err) {
                    Swal.fire({
                        title: "Error!",
                        text: "Xóa thất bại. Vui lòng thử lại.",
                        icon: "error",
                    });
                },
            });
        }
    });
});

/////////chart///////////
const ctx = document.getElementById("myChart").getContext("2d");

// Dữ liệu mẫu
const chartData = {
    daily: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [300, 200, 1500, 70, 50, 220, 60],
    },
    weekly: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        data: [1200, 1900, 800, 2200],
    },
    monthly: {
        labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [3500, 4200, 3900, 4500, 4800, 5000],
    },
};

// lưu lại index đang hover
let activeIndex = -1;
let myChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [
            {
                label: "Doanh số",
                data: [],
                backgroundColor: "rgba(183,28,28,0.6)",
                hoverBackgroundColor: "rgba(183,28,28,0.9)",
                borderRadius: 8,
                categoryPercentage: 0.5, // độ rộng nhóm bar (giảm xuống thì cách xa hơn)
                barPercentage: 0.7, // độ rộng mỗi bar (giảm thì bar hẹp lại, cách xa hơn)
            },
        ],
    },
    options: {
        scales: {
            x: {
                grid: {
                    display: false, // ẩn lưới dọc
                },
                ticks: {
                    color: "#999", // màu chữ trục X
                    font: {
                        size: 16, // cỡ chữ trục X
                        weight: "100",
                    },
                },
            },
            y: {
                ///ẩn đường trục y
                ticks: {
                    font: {
                        size: 15, // cỡ chữ trục X
                        weight: "500",
                    },
                    callback: (val) => {
                        if (val >= 1000000) return val / 1000000 + "M";
                        if (val >= 1000) return val / 1000 + "k";
                        return val;
                    },
                    maxTicksLimit: 8,
                },
                grid: {
                    color: "rgba(0,0,0,0.1)", // màu lưới ngang rất nhạt
                    // bỏ đường viền trục Y
                    lineWidth: 1, // mỏng nhẹ
                    ///ẩn đường trục y
                    borderDash: [3, 3], // đường nét đứt
                },
                border: {
                    display: false,
                    width: 2,
                    color: "red",
                    dash: [5, 5],
                    dashOffset: 2,
                },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false, // ẩn chú thích
            },
        },
    },
});

function updateChart(type) {
    const { labels, data } = chartData[type];
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.update();

    document
        .querySelectorAll(".tab")
        .forEach((tab) => tab.classList.remove("active"));
    document.querySelector(`.tab[data-type="${type}"]`).classList.add("active");
}

// Xác định tab mặc định theo tháng hiện tại
window.onload = () => {
    updateChart("monthly");
};

// Gắn sự kiện click
document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        const type = tab.getAttribute("data-type");
        updateChart(type);
    });
});
