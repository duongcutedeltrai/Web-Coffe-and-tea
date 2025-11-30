const API_KEY = "pk.03b18bda78b036dde5d41f92905d72e1";
const map = L.map("map").setView([10.762622, 106.660172], 15);
map.invalidateSize();
// Load tile từ OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
}).addTo(map);
document.getElementById("addressBtn").onclick = function () {
    document.getElementById("addressModal").style.display = "block";
    setTimeout(function () {
        map.invalidateSize();
    }, 100);
};
// Fix lỗi map bị co hoặc không hiển thị đầy đủ

let marker;

// Sự kiện: click nút hoặc nhấn Enter
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchAddress();
    }
});
async function renderAddressText(latlng) {
    const { lat, lng } = latlng;

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }

    const API_KEY = "pk.03b18bda78b036dde5d41f92905d72e1"; // 🔹 thay bằng key của bạn
    const url = `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${lat}&lon=${lng}&format=json`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    // console.log("Địa chỉ:", data.display_name);
    //
    const address = data.display_name || "Không tìm thấy địa chỉ";
    marker.bindPopup(`<b>Địa chỉ:</b><br>${address}`).openPopup();
    const addr = data.address || {};
    const addressFinal = cleanAddress(address);
    console.log(addressFinal);
    $("#specificAddress").val(addressFinal);
}
// Sự kiện click trên map
map.on("click", async (e) => {
    renderAddressText(e.latlng);
});
// Lấy vị trí hiện tại
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Trình duyệt không hỗ trợ định vị.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const latlng = { lat, lng };
            // Cập nhật bản đồ (nếu có)
            if (typeof map !== "undefined") {
                map.setView([lat, lng], 16);
                if (typeof marker !== "undefined") {
                    map.removeLayer(marker);
                }
                marker = L.marker([lat, lng]).addTo(map);
            }

            // Lấy địa chỉ từ toạ độ
            renderAddressText(latlng);
        },
        (err) => {
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    alert("Bạn đã từ chối quyền truy cập vị trí.");
                    break;
                case err.POSITION_UNAVAILABLE:
                    alert("Không thể xác định vị trí.");
                    break;
                case err.TIMEOUT:
                    alert("Quá thời gian lấy vị trí.");
                    break;
                default:
                    alert("Lỗi không xác định khi lấy vị trí.");
            }
        }
    );
}

const NEARBY_LOCATIONS = [
    {
        id: 1,
        name: "Công Ty TNHH Tư Vấn Và Dịch Vụ Xây Dựng Clc...",
        address:
            "155 Trần Quý Khoách, phường Hoà Minh, Quận Liên Chiểu, Đà Nẵng",
        lat: 16.0544,
        lng: 108.2022,
    },
    {
        id: 2,
        name: "Công Ty TNHH Xây Dựng Và Dịch Vụ Thương...",
        address: "74 Hòa Minh 15, P. Hòa Minh, Quận Liên Chiểu, Đà Nẵng",
        lat: 16.0534,
        lng: 108.2012,
    },
    {
        id: 3,
        name: "Công Ty Thnh Một Thành Viên Bình An Hòa",
        address: "4 Hòa Minh 16, Hoà Minh, Quận Liên Chiểu, Đà Nẵng",
        lat: 16.0524,
        lng: 108.2002,
    },
];
getCurrentLocation();
// Bootstrap modal instance
const bootstrap = window.bootstrap;

// Initialize on page load
let products = [];
let promotionSelected;
let subtotal;
let discount;
document.addEventListener("DOMContentLoaded", () => {
    dataFlashsale = localStorage.getItem("flashsale-product");
    products = dataFlashsale ? JSON.parse(dataFlashsale) : [];
    dataPromotion = localStorage.getItem("selectedVoucher");
    promotionSelected = dataPromotion ? JSON.parse(dataPromotion) : [];
    document
        .getElementById("checkoutForm")
        .addEventListener("submit", handlePayment);
    getCartAPI();
    initializeEventListeners();
});
async function applyPromotion() {
    try {
        if (promotionSelected.length == 0) {
            // Nếu chưa chọn voucher, reset discount và thoát luôn
            discount = 0;
            localStorage.removeItem("selectedVoucher");
            return null;
        }
        const promotionId = promotionSelected?.promotion_id;
        const totalPrice = subtotal;
        const response = await fetch("/admin/data/promotions/apply-promotion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                promotion_id: promotionId,
                totalPrice: totalPrice,
            }),
        });

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Mã khuyến mãi không hợp lệ.");
            localStorage.removeItem("selectedVoucher");
            discount = 0;
            return null;
        }

        // ✅ Gán discountPrice vào biến discount
        discount = data.discountPrice || 0;
        // console.log(discount);
    } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra khi áp dụng khuyến mãi.");
        return null;
    }
}
// Initialize products display
function initializeProducts(carts) {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = carts
        .map((cart) => {
            const flashSaleItem = products.find(
                (f) =>
                    f.product_id === cart.product_id &&
                    (f.size == cart.product_size || f.size === "all")
            );
            let displayPrice = cart.price;
            let oldPrice = null;

            if (flashSaleItem) {
                const discountValue = flashSaleItem.discountValue ?? 0;
                oldPrice = cart.price;
                displayPrice = cart.price - discountValue;
            }
            return `
        <div class="product-item">
            <img src="/images/products/${cart.products.images}" alt="${
                cart.products.name
            }" class="product-image">
            <div class="flex-grow-1">
                <p class="product-name">${cart.products.name} </p>
                <p style="color:#7b4423;">x${cart.quantity} : ${
                cart.product_size
            }</p>
            </div>
             
           
             <p class="pd-old-price">${
                 displayPrice == cart.price
                     ? ""
                     : formatVND(oldPrice * cart.quantity)
             }</p>
              <p class="product-price">${formatVND(
                  displayPrice * cart.quantity
              )}</p>
        </div>
    `;
        })
        .join("");
    updateCartTotals(carts);
    // Initialize locations list
    const locationsList = document.getElementById("locationsList");
    renderLocations(NEARBY_LOCATIONS);
}

async function updateCartTotals(carts) {
    subtotal = carts.reduce((sum, item) => {
        // Tìm sản phẩm flash sale tương ứng
        const flashSaleItem = products.find(
            (f) =>
                f.product_id === item.product_id &&
                (f.size == item.product_size || f.size === "all")
        );

        // Nếu có flash sale → giảm giá
        let finalPrice = item.price;
        if (flashSaleItem) {
            const discountValue = flashSaleItem.discountValue ?? 0;
            finalPrice = item.price - discountValue;
        }

        return sum + finalPrice * item.quantity;
    }, 0);
    await applyPromotion();
    const delivery = 0;
    const total = subtotal - discount + delivery;
    // console.log(discount);
    $("#subtotal").text(`${formatVND(subtotal)}`);
    $("#discount").text(`-${formatVND(discount)}`);
    $("#total").text(`${formatVND(total)}`);
}

async function getCartAPI() {
    // Lấy dữ liệu cart từ server
    return $.ajax({
        url: "/api/cart",
        type: "GET",
        success: function (response) {
            console.log(response);
            initializeProducts(response.cart.cart_details);
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        },
    });
}
// Render locations list
function renderLocations(locations) {
    const locationsList = document.getElementById("locationsList");
    locationsList.innerHTML =
        locations.length > 0
            ? locations
                  .map(
                      (location) => `
            <div class="location-item ${
                selectedLocation?.id === location.id ? "selected" : ""
            }" data-location-id="${location.id}">
                <div class="d-flex gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-geo-alt location-icon" viewBox="0 0 16 16">
                        <path d="M12.854 6.5c0 3.314-5.854 7.5-5.854 7.5S1 9.814 1 6.5a5.854 5.854 0 1 1 11.708 0z"/>
                    </svg>
                    <div class="flex-grow-1">
                        <p class="location-name">${location.name}</p>
                        <p class="location-address">${location.address}</p>
                    </div>
                </div>
            </div>
        `
                  )
                  .join("")
            : '<p class="text-muted text-center py-4">Không tìm thấy địa điểm</p>';

    // Add click handlers to location items
    document.querySelectorAll(".location-item").forEach((item) => {
        item.addEventListener("click", function () {
            const locationId = Number.parseInt(this.dataset.locationId);
            const location = NEARBY_LOCATIONS.find((l) => l.id === locationId);
            selectLocation(location);
        });
    });
}

// Select location
function selectLocation(location) {
    selectedLocation = location;
    document.getElementById("specificAddress").value = location.address;
    document.getElementById("mapText").textContent = location.name;
    renderLocations(NEARBY_LOCATIONS);
}

// Initialize event listeners
function initializeEventListeners() {
    // Form inputs
    document.getElementById("firstName").addEventListener("change", (e) => {
        formData.firstName = e.target.value;
    });
    document.getElementById("phone").addEventListener("change", (e) => {
        formData.phone = e.target.value;
    });
    document.getElementById("email").addEventListener("change", (e) => {
        formData.email = e.target.value;
    });
    document.getElementById("notes").addEventListener("change", (e) => {
        formData.notes = e.target.value;
    });

    // Payment method
    document
        .querySelectorAll('input[name="paymentMethod"]')
        .forEach((radio) => {
            radio.addEventListener("change", (e) => {
                formData.paymentMethod = e.target.value;
            });
        });

    // Search input
    document
        .getElementById("searchInput")
        .addEventListener("input", function () {
            const query = this.value.toLowerCase();
            const filtered = NEARBY_LOCATIONS.filter(
                (location) =>
                    location.name.toLowerCase().includes(query) ||
                    location.address.toLowerCase().includes(query)
            );
            renderLocations(filtered);
        });

    // Confirm address button

    // Form submit
    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Order submitted:", formData);
        alert("Order submitted! Check console for details.");
    });
}

$(document).ready(function () {
    function handleAddressCheck(e) {
        const value = $.trim($("#specificAddress").val());

        if (!value) {
            e.preventDefault();
            $("#specificAddress").addClass("is-invalid");
        } else {
            $("#addressDisplay").text($("#specificAddress").val());
            $("#specificAddress").removeClass("is-invalid");

            // Đóng modal thủ công
            $(".infoAddress").css("display", "none");
        }
    }

    // Sự kiện click cho 2 nút
    $("#confirmAddressBtn").on("click", handleAddressCheck);

    // Khi người dùng nhập thì ẩn cảnh báo
    $("#specificAddress").on("input", function () {
        $(this).removeClass("is-invalid");
    });
});

////hàm tiện ích
///check xem có nhập input trong modal chưa

////Lấy chuổi địa chỉ
function cleanAddress(address) {
    if (!address) return "";

    // Tách chuỗi theo dấu phẩy và loại bỏ khoảng trắng
    let parts = address
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

    // Bỏ phần "Vietnam" nếu có
    if (/vietnam/i.test(parts[parts.length - 1])) {
        parts.pop();
    }

    // Bỏ phần chỉ toàn số (mã bưu điện)
    if (/^\d+$/.test(parts[parts.length - 1])) {
        parts.pop();
    }

    // Thay "Ward" bằng rỗng
    parts = parts.map((p) => p.replace(/\bWard\b/gi, "").trim());

    return parts.join(", ");
}
function formatVND(amount) {
    return Number(amount).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}

/////////////Sự kiện thanh toán//////////

async function handlePayment(event) {
    event.preventDefault(); // Chặn reload form
    const promotionId = promotionSelected?.promotion_id;
    const totalPrice = subtotal;
    // --- Lấy từng value từ form ---
    const fullName = document.getElementById("firstName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("specificAddress").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const paymentMethod =
        document.querySelector('input[name="paymentMethod"]:checked')?.value ||
        "";

    // --- Gắn từng field vào FormData ---
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("totalPrice", totalPrice);
    formData.append("promotion_id", promotionId);
    formData.append("notes", notes);
    formData.append("paymentMethod", paymentMethod);

    // Nếu bạn muốn xem thử
    for (const [key, val] of formData.entries()) {
        console.log(key, ":", val);
    }
    if (paymentMethod === "cash") {
        return;
    }
    // --- Chuyển sang object để gửi JSON ---
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(
            "http://localhost:3000/api/payment/vnpay/create_payment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        // ⚠️ Nếu Zod validation lỗi
        if (
            response.status === 200 &&
            result.success === false &&
            result.errors
        ) {
            let errorMsg = "Vui lòng kiểm tra lại thông tin:\n\n";
            result.errors.forEach((err) => {
                errorMsg += `- ${err.field}: ${err.message}\n`;
            });
            alert(errorMsg);
            return;
        }

        // ✅ Nếu thành công: chuyển sang VNPay
        if (response.status === 201 && result.url) {
            window.location.href = result.url;
            return;
        }

        // ❌ Lỗi khác
        alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!");
        console.error("Payment error:", result);
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Không thể kết nối đến máy chủ thanh toán.");
    }
}

// Gắn sự kiện cho nút thanh toán
// document.getElementById("checkoutBtn").addEventListener("click", handlePayment);
// async function checkout() {
//     try {
//         const orderData = {
//             receiver_name: document.getElementById("receiver_name").value,
//             receiver_phone: document.getElementById("receiver_phone").value,
//             address: document.getElementById("address").value,
//             payment_method: document.querySelector(
//                 'input[name="payment_method"]:checked'
//             ).value, // "vnpay" hoặc "cod"
//             products: [
//                 // 🧺 ví dụ từ giỏ hàng
//                 { id: 1, quantity: 2 },
//                 { id: 3, quantity: 1 },
//             ],
//         };

//         // 🧩 2️⃣ Gửi dữ liệu đơn hàng đến BE
//         const response = await fetch(
//             "http://localhost:5000/api/orders/create",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(orderData),
//             }
//         );

//         const result = await response.json();

//         // 🧭 3️⃣ Kiểm tra kết quả từ BE
//         if (!result.success) {
//             alert(result.message || "Tạo đơn hàng thất bại");
//             return;
//         }

//         // 💳 4️⃣ Nếu chọn VNPAY → redirect sang trang thanh toán
//         if (orderData.payment_method === "vnpay") {
//             const paymentUrl = result.paymentUrl;
//             if (paymentUrl) {
//                 window.location.href = paymentUrl;
//             } else {
//                 alert("Không lấy được URL thanh toán VNPAY");
//             }
//         } else {
//             // 🏠 Nếu là COD → hiển thị thông báo thành công
//             alert("Đơn hàng đã được tạo. Vui lòng thanh toán khi nhận hàng!");
//         }
//     } catch (error) {
//         console.error("Lỗi thanh toán:", error);
//         alert("Đã xảy ra lỗi khi xử lý thanh toán.");
//     }
// }
