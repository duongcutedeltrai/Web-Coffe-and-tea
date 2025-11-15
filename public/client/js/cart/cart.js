function formatVND(amount) {
    return Number(amount).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}
function parseVND(vndString) {
    if (!vndString) return 0;
    // Xóa tất cả ký tự không phải số (kể cả dấu chấm, đ, khoảng trắng)
    const num = vndString.replace(/[^\d]/g, "");
    return parseInt(num, 10) || 0;
}
let discount = 0;
async function getVouchers() {
    selectedVoucherId = null;
    // const voucherList = document.getElementById("voucherList");
    const totalCart = parseVND($("#totalAmount").text());
    try {
        const response = await fetch(`/admin/valid-vouchers/${totalCart}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            // Nếu HTTP status không 200–299
            throw new Error(`Lỗi server (${response.status})`);
        }

        const result = await response.json();

        // Kiểm tra cấu trúc JSON
        if (!result.success) {
            throw new Error(
                result.message || "Không thể lấy danh sách voucher"
            );
        }
        const vouchers = result.vouchers || [];

        if (vouchers.length === 0) {
            voucherList.innerHTML =
                '<p class="text-muted text-center mt-3">Chưa có voucher nào.</p>';
            return;
        }
        voucherscart = vouchers;
        renderVouchers(vouchers);
    } catch (error) {
        console.error("Không thể tải voucher:", error);
        voucherList.innerHTML =
            '<p class="text-danger text-center mt-3">Không thể tải voucher! Vui lòng thử lại.</p>';
    }
}

let selectedVoucherId = null;
const $ = window.jQuery; // Declare the $ variable
let product = [];
let voucherscart;
$(document).ready(async () => {
    dataFlashsale = localStorage.getItem("flashsale-product");
    products = dataFlashsale ? JSON.parse(dataFlashsale) : [];
    await getCartAPI();
    await getVouchers();
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
        .map((item) => {
            const flashSaleItem = products.find(
                (f) =>
                    f.product_id === item.product_id &&
                    (f.size == item.product_size || f.size === "all")
            );
            let displayPrice = item.price;
            let oldPrice = null;

            if (flashSaleItem) {
                const discountValue = flashSaleItem.discountValue ?? 0;
                oldPrice = item.price;
                displayPrice = item.price - discountValue;
            }
            return `
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
                        <span class="fw-medium">${
                            flashSaleItem
                                ? `<div class="fw-semibold text-danger" >Flash Sale</div>`
                                : ""
                        }${item.product_name}</span>
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
                    <div class="price-current"><p class="pd-old-price" style="margin-bottom:1px;">${
                        displayPrice == item.price ? "" : formatVND(item.price)
                    }</p>${formatVND(displayPrice)}</div>
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
                        ${formatVND(displayPrice * item.sub_quantity)}
                    </span>
                </div>
            </div>
        </div>
    `;
        })
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
function renderVouchers(availableVouchers) {
    const $container = $("#voucherList");

    const vouchersHtml = availableVouchers
        .map((voucher) => {
            const isSelected = selectedVoucherId === voucher.promotion_id;
            const isValid = voucher.is_valid;
            const formattedMinOrder = Number(
                voucher.min_order_amount
            ).toLocaleString("vi-VN");
            const expiryDate = new Date(voucher.end_date).toLocaleDateString(
                "vi-VN"
            );

            return `
            <div class="voucher-card 
                        ${isSelected ? "selected" : ""} 
                        ${isValid ? "valid" : "invalid"}" 
                 data-voucher-id="${voucher.promotion_id}"
                 ${!isValid ? "data-disabled='true'" : ""}>
                <div class="d-flex align-items-start gap-3">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="voucherRadio" 
                            id="voucher${voucher.promotion_id}" 
                            ${isSelected ? "checked" : ""} 
                            ${!isValid ? "disabled" : ""}>
                    </div>
                    <div class="flex-grow-1">
                        <div class="voucher-code">${voucher.code}</div>
                        <div class="voucher-description">${
                            voucher.description
                        }</div>
                        <div class="voucher-details">
                            Đơn tối thiểu: ${formattedMinOrder}đ • Hết hạn: ${expiryDate}
                        </div>
                    </div>
                    <div class="voucher-discount">${
                        voucher.discount_percent
                    }% OFF</div>
                </div>
            </div>`;
        })
        .join("");

    $container.html(vouchersHtml);

    // Chỉ cho phép click chọn khi hợp lệ
    $(".voucher-card.valid").on("click", function () {
        const voucherId = $(this).data("voucher-id");
        selectVoucher(voucherId);
    });
}
function applySelectedVoucher() {
    // Lấy ID voucher đang chọn
    const selectedRadio = $('input[name="voucherRadio"]:checked');
    if (!selectedRadio.length) {
        return;
    }

    const voucherId = selectedRadio.closest(".voucher-card").data("voucher-id");
    const voucher = voucherscart.find((v) => v.promotion_id === voucherId);

    if (!voucher || !voucher.is_valid) {
        alert("Voucher này không hợp lệ hoặc đã hết hạn.");
        return;
    }

    const totalElement = $("#subtotalAmount");
    const totalPrice = parseVND(totalElement.text());

    // Tính giảm giá
    const discountPercent = Number(voucher.discount_percent);
    const minOrder = Number(voucher.min_order_amount);

    if (totalPrice < minOrder) {
        alert(
            `Voucher chỉ áp dụng cho đơn hàng từ ${minOrder.toLocaleString(
                "vi-VN"
            )}đ.`
        );
        return;
    }

    // Tính toán
    const discountAmount = Math.round(totalPrice * (discountPercent / 100));
    discount = discountAmount;
    updateCartTotals();

    // Có thể lưu voucher đã chọn vào localStorage nếu cần
    localStorage.setItem("selectedVoucher", JSON.stringify(voucher));

    // Thông báo nhỏ
    // const modalEl = document.getElementById("voucherModal");
    // const modal =
    //     bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    // modal.hide();
}

function selectVoucher(voucherId) {
    selectedVoucherId = voucherId;
    renderVouchers(voucherscart);
}

// function applySelectedVoucher() {
//     if (selectedVoucherId) {
//         const voucher = availableVouchers.find(
//             (v) => v.id === selectedVoucherId
//         );
//         if (voucher) {
//             $("#couponInput").val(voucher.code);

//             // Đóng modal bằng jQuery
//             $("#voucherModal").modal("hide");

//             // Hiển thị thông báo
//             alert(
//                 `Đã áp dụng voucher: ${voucher.code} - Giảm ${voucher.discount}%`
//             );
//         }
//     }
// }

// function applyCoupon() {
//     const couponCode = $("#couponInput").val().trim();

//     if (!couponCode) {
//         alert("Vui lòng nhập mã khuyến mãi");
//         return;
//     }

//     const voucher = availableVouchers.find(
//         (v) => v.code.toLowerCase() === couponCode.toLowerCase()
//     );

//     if (voucher) {
//         alert(`Đã áp dụng mã: ${voucher.code} - Giảm ${voucher.discount}%`);
//     } else {
//         alert("Mã khuyến mãi không hợp lệ");
//     }
// }

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
    const dataFlashsale = localStorage.getItem("flashsale-product");
    const products = dataFlashsale ? JSON.parse(dataFlashsale) : [];
    let subtotal = 0;

    cart.cart_details.forEach((item) => {
        let price = item.price;

        const flashSaleItem = products.find(
            (f) =>
                f.product_id === item.product_id &&
                (f.size == item.product_size || f.size === "all")
        );

        if (flashSaleItem) {
            const discountValue = flashSaleItem.discountValue ?? 0;
            price = price - discountValue; // giảm trực tiếp giá
        }

        subtotal += price * item.sub_quantity;
    });
    const delivery = 0;
    const total = subtotal - discount + delivery;

    $("#subtotalAmount").text(`${formatVND(subtotal)}`);
    $("#discountAmount").text(`-${formatVND(discount)}`);
    $("#totalAmount").text(`${formatVND(total)}`);
}

function updateCartBadge() {
    const cart = getCartFromStorage();
    const totalItems = cart.quantity || 0;
    const $badge = $("#cartBadge");
    $("#cartBadge").text(totalItems);
    if (totalItems > 0) {
        $badge.text(totalItems).removeClass("d-none").addClass("badge-update");
    } else {
        $badge.addClass("d-none");
    }
    setTimeout(() => $badge.removeClass("badge-update"), 150);
}
async function updateCart() {
    discount = 0;
    renderCartItems();
    updateCartTotals();
    updateCartBadge();
    await getVouchers();
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
