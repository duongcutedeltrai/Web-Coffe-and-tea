function formatVND(amount) {
    return Number(amount).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}

// Dữ liệu voucher
const availableVouchers = [
    {
        id: "1",
        code: "WELCOME10",
        description: "Giảm 10% cho khách hàng mới",
        discount: 10,
        minOrder: 50,
        expiryDate: "31/12/2025",
    },
    {
        id: "2",
        code: "SAVE20",
        description: "Giảm 20% cho đơn hàng trên $100",
        discount: 20,
        minOrder: 100,
        expiryDate: "31/12/2025",
    },
    {
        id: "3",
        code: "FREESHIP",
        description: "Miễn phí vận chuyển cho tất cả đơn hàng",
        discount: 5,
        minOrder: 30,
        expiryDate: "31/12/2025",
    },
    {
        id: "4",
        code: "COFFEE15",
        description: "Giảm 15% cho các món cà phê",
        discount: 15,
        minOrder: 40,
        expiryDate: "31/12/2025",
    },
];

let selectedVoucherId = null;
const $ = window.jQuery; // Declare the $ variable

$(document).ready(async () => {
    await getCartAPI();
    renderVouchers();
    updateCartTotals();
});
function renderCartItems() {
    const cart = getCartFromStorage();
    const $container = $("#cartItemsContainer");

    // Nếu giỏ hàng trống
    if (!cart.cart_details || cart.cart_details.length === 0) {
        $container.html(`
            <div class="p-4 text-center text-muted">
                Giỏ hàng trống
            </div>
        `);
        return;
    }

    const itemsHtml = cart.cart_details
        .map(
            (item) => `
        <div class="cart-item" data-cartDetailId="${item.cart_detail_id}">
            <div class="row g-3 align-items-center">

                <!-- Sản phẩm -->
                <div class="col-12 col-md-4">
                    <div class="d-flex align-items-center gap-3">
                        <button class="btn-remove" 
                                data-item-id="${item.product_id}" 
                                data-size="${item.product_size}">
                            <i class="fa-solid fa-circle-xmark" style="color:#8f8f8f;"></i>
                        </button>
                        <img src="/images/products/${item.product_image}" 
                             alt="${item.product_name}" 
                             class="product-image" style="margin-left:4px;">
                        <span class="fw-medium">${item.product_name}</span>
                    </div>
                </div>

                <!-- Size -->
                <div class="col-md-2">
                    <select class="shopping-item-size form-select w-auto m-auto"
                            data-product-id="${item.product_id}">
                        ${item.price_product_id
                            .map(
                                (opt) =>
                                    `<option value="${opt.size}" ${
                                        opt.size === item.product_size
                                            ? "selected"
                                            : ""
                                    }>
                                        ${opt.size}
                                    </option>`
                            )
                            .join("")}
                    </select>
                </div>

                <!-- Giá -->
                <div class="col-4 col-md-2 text-center">
                    <div class="price-current">${formatVND(item.price)}</div>
                </div>

                <!-- Số lượng -->
                <div class="col-4 col-md-2">
                    <div class="cart-quantity-controls">
                        <button class="cart-quantity-btn" onclick="cartChangeQuantity(this, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                               class="cart-quantity-input-i" 
                               value="${item.sub_quantity}" 
                               min="1" max="99" readonly 
                               data-productid="${item.product_id}" 
                               data-priceproduct="${item.price}" 
                               data-size="${item.product_size}" 
                               data-cartdetailid="${item.cart_detail_id}">
                        <button class="cart-quantity-btn" onclick="cartChangeQuantity(this, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                <!-- Tổng phụ -->
                <div class="col-4 col-md-2 text-center">
                    <span class="fw-semibold">
                        ${formatVND(item.price * item.sub_quantity)}
                    </span>
                </div>
            </div>
        </div>
    `
        )
        .join("");

    $container.html(itemsHtml);

    $(".btn-remove").on("click", function () {
        Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn bỏ sản phẩm này khỏi giỏ hàng?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55a81dff",
            cancelButtonColor: "rgba(190, 28, 28, 1)",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Không",
        }).then((result) => {
            if (result.isConfirmed) {
                const productId = $(this).data("item-id");
                const size = $(this).data("size");
                const cartDetailId = $(this)
                    .closest(".cart-item")
                    .data("cartdetailid");
                console.log(cartDetailId, productId, size);
                removeCart(cartDetailId, productId, size);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                });
            }
        });
    });
}
async function cartChangeQuantity(button, delta) {
    const input = button.parentElement.querySelector(".cart-quantity-input-i");
    let value = parseInt(input.value) || 1;

    // Giới hạn giá trị hợp lệ từ 0 → 99
    value = Math.max(0, Math.min(99, value + delta));
    input.value = value;

    const productId = Number(input.dataset.productid);
    const price = Number(input.dataset.priceproduct);
    const size = input.dataset.size;
    const cartDetailId = input.dataset.cartdetailid;
    let cart = getCartFromStorage();
    // Nếu người dùng giảm về 0 → xóa khỏi giỏ hàng
    if (value === 0) {
        await removeCart(cartDetailId, productId, size);
        updateCart();
        return;
    }
    cart = changeQuantity(cart, productId, size, delta);
    saveCartToStorage(cart);
    updateCart();
    // Cập nhật lại số lượng và tổng tiền
    await update(cartDetailId, productId, value, size);

    // Cập nhật lại giao diện sau khi update
    updateCart();
}

function renderVouchers() {
    const $container = $("#voucherList");

    const vouchersHtml = availableVouchers
        .map(
            (voucher) => `
        <div class="voucher-card ${
            selectedVoucherId === voucher.id ? "selected" : ""
        }" 
             data-voucher-id="${voucher.id}">
            <div class="d-flex align-items-start gap-3">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="voucherRadio" 
                           id="voucher${voucher.id}" ${
                selectedVoucherId === voucher.id ? "checked" : ""
            }>
                </div>
                <div class="flex-grow-1">
                    <div class="voucher-code">${voucher.code}</div>
                    <div class="voucher-description">${
                        voucher.description
                    }</div>
                    <div class="voucher-details">
                        Đơn tối thiểu: $${voucher.minOrder} • Hết hạn: ${
                voucher.expiryDate
            }
                    </div>
                </div>
                <div class="voucher-discount">${voucher.discount}% OFF</div>
            </div>
        </div>
    `
        )
        .join("");

    $container.html(vouchersHtml);

    $(".voucher-card").on("click", function () {
        const voucherId = $(this).data("voucher-id");
        selectVoucher(voucherId);
    });
}

// Chọn voucher
function selectVoucher(voucherId) {
    selectedVoucherId = voucherId;
    renderVouchers();
}

function applySelectedVoucher() {
    if (selectedVoucherId) {
        const voucher = availableVouchers.find(
            (v) => v.id === selectedVoucherId
        );
        if (voucher) {
            $("#couponInput").val(voucher.code);

            // Đóng modal bằng jQuery
            $("#voucherModal").modal("hide");

            // Hiển thị thông báo
            alert(
                `Đã áp dụng voucher: ${voucher.code} - Giảm ${voucher.discount}%`
            );
        }
    }
}

function applyCoupon() {
    const couponCode = $("#couponInput").val().trim();

    if (!couponCode) {
        alert("Vui lòng nhập mã khuyến mãi");
        return;
    }

    const voucher = availableVouchers.find(
        (v) => v.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (voucher) {
        alert(`Đã áp dụng mã: ${voucher.code} - Giảm ${voucher.discount}%`);
    } else {
        alert("Mã khuyến mãi không hợp lệ");
    }
}

// Remove from Cart
async function removeCart(cartDetailId, productId, size) {
    console.log("Removing:", { cartDetailId, productId, size });
    let cart = getCartFromStorage();
    cart = removeFromCart(cart, productId, size);
    saveCartToStorage(cart);

    updateCart();

    try {
        await deleted(cartDetailId);
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm trên server:", err);
    }
}

$(document).on("change", ".shopping-item-size", async function () {
    const newSize = $(this).val();
    const product_id = $(this).data("product-id");
    const oldSize = $(this)
        .closest(".cart-item")
        .find(".cart-quantity-input-i")
        .data("size");
    const cartDetailId = $(this).closest(".cart-item").data("cartdetailid");
    const quantity = $(this)
        .closest(".cart-item")
        .find(".cart-quantity-input-i")
        .val();
    let cart = getCartFromStorage();
    cart = updateProductSize(cart, product_id, oldSize, newSize);
    saveCartToStorage(cart);
    updateCart();
    try {
        await update(cartDetailId, product_id, quantity, newSize);
        // getCartAPI(); // ✅ bây giờ chắc chắn chạy
    } catch (err) {
        console.error("Update failed:", err);
    }
});
function updateCartTotals() {
    const cart = getCartFromStorage();
    const subtotal = cart.total;
    const discount = 26400;

    const delivery = 0;
    const total = subtotal - discount + delivery;

    $("#subtotalAmount").text(`${formatVND(subtotal)}`);
    $("#discountAmount").text(`-${formatVND(discount)}`);
    $("#totalAmount").text(`${formatVND(total)}`);
}

function updateCartBadge() {
    const cart = getCartFromStorage();
    const totalItems = cart.quantity || 0;
    const $badge = $(".cart-badge");
    $(".cart-badge").text(totalItems);
    if (totalItems > 0) {
        $badge.text(totalItems).removeClass("d-none").addClass("badge-update");
    } else {
        $badge.addClass("d-none");
    }
    setTimeout(() => $badge.removeClass("badge-update"), 150);
}
function updateCart() {
    renderCartItems();
    updateCartTotals();
    updateCartBadge();
}
////////////////----------------------Xử lí data----------------------------------
async function getCartAPI() {
    // Lấy dữ liệu cart từ server
    return $.ajax({
        url: "/api/cart",
        type: "GET",
        success: function (data) {
            if (data.success && data.cart) {
                const cart = data.cart;
                const simplifiedCart = {
                    total: cart.total,
                    quantity: cart.quantity,
                    cart_details: cart.cart_details.map((detail) => ({
                        cart_detail_id: detail.cart_detail_id,
                        product_id: detail.product_id,
                        product_image: detail.products?.images || "",
                        price: detail.price,
                        product_name: detail.products?.name || "",
                        product_size: detail.product_size,
                        sub_quantity: detail.quantity,
                        price_product_id: detail.products?.price_product.map(
                            (item) => ({
                                size: item.size,
                                price: item.price,
                            })
                        ),
                    })),
                };
                localStorage.setItem("cart", JSON.stringify(simplifiedCart));
                console.log("✅ Cart loaded from DB:", simplifiedCart); // render lại giao diện giỏ hàng
            } else {
                console.error("Không thể tải giỏ hàng:", data.message);
            }
            updateCart();
        },
        error: function (xhr, status, error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        },
    });
}

/////chỉnh sửa sản phâm trong cart
async function update(cartDeatil_id, productId, quantity, size) {
    console.log(cartDeatil_id, productId, quantity, size);
    return $.ajax({
        method: "PUT",
        url: "/api/cart/" + cartDeatil_id,
        contentType: "application/json",
        data: JSON.stringify({
            id_product: productId,
            quantity: quantity,
            size: size,
        }),
        success: function (res) {},
    });
}
/////delete sản phẩm trong cart
async function deleted(cartDetailId) {
    return $.ajax({
        method: "DELETE",
        url: "/api/cart/" + cartDetailId,
        contentType: "application/json",
        data: {},
        success: function (res) {},
    });
}

////////////////////////////////////////////////////
// 🔹 Cập nhật lại tổng tiền và tổng số lượng
function updateCartSummary(cart) {
    cart.quantity = cart.cart_details.reduce(
        (sum, d) => sum + d.sub_quantity,
        0
    );
    cart.total = cart.cart_details.reduce(
        (sum, d) => sum + d.sub_quantity * d.price,
        0
    );
}

// 🔹 Thêm sản phẩm vào giỏ hàng
function addToCart(cart, product) {
    const existing = cart.cart_details.find(
        (d) =>
            d.product_id === product.product_id &&
            d.product_size === product.product_size
    );

    if (existing) {
        existing.sub_quantity += product.sub_quantity;
    } else {
        cart.cart_details.push({
            cart_detail_id: Date.now(), // ID tạm
            product_id: product.product_id,
            product_name: product.product_name,
            product_image: product.product_image || "", // 🆕 thêm ảnh sản phẩm
            product_size: product.product_size,
            sub_quantity: product.sub_quantity,
            price: product.price,
            price_product_id: product.price_product_id || [],
        });
    }

    updateCartSummary(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    return cart;
}

// 🔹 Thay đổi số lượng (tăng / giảm)
function changeQuantity(cart, product_id, product_size, delta) {
    const item = cart.cart_details.find(
        (d) => d.product_id === product_id && d.product_size === product_size
    );

    if (!item) return cart;

    item.sub_quantity += delta;

    if (item.sub_quantity <= 0) {
        cart.cart_details = cart.cart_details.filter(
            (d) =>
                !(
                    d.product_id === product_id &&
                    d.product_size === product_size
                )
        );
    }

    updateCartSummary(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

// 🔹 Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(cart, product_id, product_size) {
    cart.cart_details = cart.cart_details.filter(
        (d) => !(d.product_id === product_id && d.product_size === product_size)
    );

    updateCartSummary(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

// 🔹 Cập nhật size sản phẩm (vd: đổi từ M → L)
function updateProductSize(cart, product_id, oldSize, newSize) {
    const item = cart.cart_details.find(
        (d) => d.product_id === product_id && d.product_size === oldSize
    );

    if (!item) return cart;

    const newPriceInfo = item.price_product_id.find((p) => p.size === newSize);
    if (!newPriceInfo) {
        console.error("❌ Không tìm thấy giá cho size mới:", newSize);
        return cart;
    }

    const existing = cart.cart_details.find(
        (d) => d.product_id === product_id && d.product_size === newSize
    );

    if (existing) {
        existing.sub_quantity += item.sub_quantity;
        cart.cart_details = cart.cart_details.filter(
            (d) => !(d.product_id === product_id && d.product_size === oldSize)
        );
    } else {
        item.product_size = newSize;
        item.price = newPriceInfo.price;
    }

    updateCartSummary(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

// 🔹 Lấy giỏ hàng từ localStorage (nếu có)
function getCartFromStorage() {
    const stored = localStorage.getItem("cart");
    if (!stored) return { total: 0, quantity: 0, cart_details: [] };
    return JSON.parse(stored);
}

// 🔹 Lưu giỏ hàng lại (nếu cần)
function saveCartToStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
