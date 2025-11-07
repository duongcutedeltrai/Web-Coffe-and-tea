// ============================================================
// 🛠️ HÀM TIỆN ÍCH

// ============================================================
function parseVND(vndString) {
    return parseInt(vndString.replace(/\./g, "").replace(/\s*đ/g, ""), 10);
}
console.log(getCartFromStorage());

function formatVND(amount) {
    return amount.toLocaleString("vi-VN") + " đ";
}

function debounce(fn, delay = 500) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// ============================================================
// 🛒 DỮ LIỆU & KHỞI TẠO
// ============================================================
const shoppingCart = {
    isOpen: false,
};

const $ = window.jQuery;

$(document).ready(() => {
    setupEventListeners();
    getCartAPI();
});

// ============================================================
// 🎯 SETUP SỰ KIỆN
// ============================================================
function setupEventListeners() {
    $(document).on("click", ".shopping-add-btn", function () {
        addToCart($(this).data("product-id"));
    });

    $("#cartButton").on("click", openCart);
    $("#closeCartBtn, #cartOverlay").on("click", closeCart);

    $(document).on("click", ".shopping-remove-btn", function () {
        const productId = $(this).data("product-id");
        const size = $(this).data("size");
        const cartDetailId = $(this)
            .closest(".shopping-cart-item")
            .find(".cart-quantity-input-i")
            .data("cartdetailid");
        removeCart(cartDetailId, productId, size);
    });

    $(document).on("change", ".shopping-item-size", async function () {
        const $item = $(this).closest(".shopping-cart-item");
        const newSize = $(this).val();
        const productId = $(this).data("product-id");
        const input = $item.find(".cart-quantity-input-i");
        const oldSize = input.data("size");
        const quantity = parseInt(input.val(), 10);
        const cartDetailId = input.data("cartdetailid");
        let cart = getCartFromStorage();
        cart = updateProductSize(cart, productId, oldSize, newSize);
        saveCartToStorage(cart);
        updateCart();
        await updateCartItem(cartDetailId, productId, quantity, newSize);
    });
    $(document).on("click", ".cart-quantity-btn", function () {
        const delta = $(this).hasClass("btn-plus") ? 1 : -1;
        cartChangeQuantity(this, delta);
    });
}

// ============================================================
// 🧩 CÁC HÀM CHÍNH
// ============================================================
// function addToCart(productId) {
//     const product = productCart.find((p) => p.id === productId);
//     if (!product) return;

//     const existing = shoppingCart.items.find((i) => i.id === productId);
//     existing
//         ? existing.quantity++
//         : shoppingCart.items.push({ ...product, quantity: 1 });

//     updateCart();
//     openCart();
// }

async function removeCart(cartDetailId, productId, size) {
    console.log(cartDetailId, productId, size);
    let cart = getCartFromStorage();
    cart = removeFromCart(cart, productId, size);
    saveCartToStorage(cart);
    updateCart();
    console.log(cartDetailId);
    await deleteCartItem(cartDetailId);
}

async function cartChangeQuantity(button, delta) {
    const input = $(button).siblings(".cart-quantity-input-i");
    let quantity = Math.max(0, Math.min(99, parseInt(input.val()) + delta));
    const price = parseInt(input.data("priceproduct"));
    const product_size = input.data("size");
    input.val(quantity);

    const { productid, priceproduct, size, cartdetailid } = input.data();
    console.log(productid, size, cartdetailid);
    let cart = getCartFromStorage();
    if (quantity === 0) {
        removeCart(cartdetailid, productid, size);
        return;
    }
    cart = changeQuantity(cart, productid, product_size, delta);
    saveCartToStorage(cart);
    updateCart();
    await updateCartItem(cartdetailid, productid, quantity, size);
}

// ============================================================
// 🧾 CẬP NHẬT GIAO DIỆN
// ============================================================
function updateCart() {
    renderCartItems();
    updateCartBadge();
    updateCartFooter();
}

function updateCartBadge() {
    const cart = getCartFromStorage();
    const totalItems = cart.quantity || 0;
    const badge = $("#cartBadge");
    if (totalItems > 0) {
        badge.text(totalItems).removeClass("d-none");
    } else {
        badge.addClass("d-none");
    }
}

function renderCartItems() {
    const cart = getCartFromStorage();
    const $container = $("#cartItems");
    if (!cart.cart_details || cart.cart_details.length === 0) {
        $container.html(`
            <div class="shopping-empty text-center py-5">
                <p class="text-muted">Your cart is empty</p>
            </div>
        `);
        updateCartBadge();
        return;
    }
    const html = cart.cart_details
        .map(
            (item) => `
        <div class="shopping-cart-item" data-product-id="${
            item.product_id
        }" data-size="${item.product_size}">
            <img src="/images/products/${item.product_image}" alt="${
                item.product_name
            }" class="shopping-item-image">

            <div class="shopping-item-details">
                <h3 class="shopping-item-name">${item.product_name}</h3>

                <select class="shopping-item-size form-select w-auto" data-product-id="${
                    item.product_id
                }">
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

            <div class="cart-item-right">
                <div class="cart-quantity-controls">
                    <button class="cart-quantity-btn btn-minus" data-product-id="${
                        item.product_id
                    }" data-size="${item.product_size}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="cart-quantity-input-i"
                        value="${
                            item.sub_quantity
                        }" min="1" max="99" readonly data-cartdetailid="${
                item.cart_detail_id
            }" data-productid="${item.product_id}" data-priceproduct="${
                item.price
            }" data-size="${item.product_size}">
                    <button class="cart-quantity-btn btn-plus" data-product-id="${
                        item.product_id
                    }" data-size="${item.product_size}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <p class="shopping-item-info mb-0">${formatVND(item.price)}</p>
            </div>

            <button class="shopping-remove-btn" data-product-id="${
                item.product_id
            }" data-size="${item.product_size}">
                <i class="bi bi-x fs-4"></i>
            </button>
        </div>
        `
        )
        .join("");

    $container.html(html);
}

function updateCartFooter() {
    const footer = $("#cartFooter");
    const cart = getCartFromStorage();

    // Nếu giỏ hàng trống → ẩn footer
    if (!cart.cart_details || cart.cart_details.length === 0) {
        footer.hide();
        return;
    }
    // Tính tổng số lượng sản phẩm
    const totalItems = cart.quantity;
    // Tính tổng tiền
    const totalPrice = cart.total;
    // Hiển thị footer và cập nhật nội dung
    footer.show();
    $("#cartCount").text(cart.cart_details.length);
    $("#productCount").text(`${totalItems} sản phẩm`);
    $("#totalPrice").text(formatVND(totalPrice));
}

// ============================================================
// 🧠 XỬ LÝ CART & API
// ============================================================
function openCart() {
    updateCart();
    shoppingCart.isOpen = true;
    $("#cartPopup, #cartOverlay").addClass("active");
    $("body").css("overflow", "hidden");
}

function closeCart() {
    shoppingCart.isOpen = false;
    $("#cartPopup, #cartOverlay").removeClass("active");
    $("body").css("overflow", "");
}

async function getCartAPI() {
    try {
        const res = await fetch("/api/cart");
        const data = await res.json();

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
            updateCart();
            console.log("✅ Cart loaded from DB:", simplifiedCart); // render lại giao diện giỏ hàng
        } else {
            console.error("Không thể tải giỏ hàng:", data.message);
        }
    } catch (err) {
        console.error("Lỗi khi tải giỏ hàng:", err);
    }
}

async function updateCartItem(cartDetailId, productId, quantity, size) {
    return $.ajax({
        method: "PUT",
        url: `/api/cart/${cartDetailId}`,
        contentType: "application/json",
        data: JSON.stringify({ id_product: productId, quantity, size }),
        success: {},
        error: (err) => console.error("❌ Lỗi cập nhật giỏ hàng:", err),
    });
}

async function deleteCartItem(cartDetailId) {
    return $.ajax({
        method: "DELETE",
        url: `/api/cart/${cartDetailId}`,
        contentType: "application/json",
        success: {},
        error: (err) => console.error("❌ Lỗi xóa sản phẩm:", err),
    });
}

// Debounced phiên bản update (nếu cần tối ưu nhiều request liên tiếp)
const debounceUpdate = debounce(updateCartItem, 500);

///////hàm xử lý ở fe localstorge// =========================
// 🛒 CART UTILITIES
// =========================

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
