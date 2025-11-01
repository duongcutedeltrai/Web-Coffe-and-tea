/* eslint-disable no-undef */
/* global $, jQuery */
async function loadCartFromDB() {
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
            updateCartBadge();
            console.log("✅ Cart loaded from DB:", simplifiedCart); // render lại giao diện giỏ hàng
        } else {
            console.error("Không thể tải giỏ hàng:", data.message);
        }
    } catch (err) {
        console.error("Lỗi khi tải giỏ hàng:", err);
    }
}

// jQuery is loaded via CDN in index.html
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

// Products Data
const products = [
    {
        id: 1,
        name: "Phê Nấu",
        image: "/images/products/GẤM.jpg",
        currentPrice: 11.0,
        originalPrice: 12.5,
        discount: 12,
        rating: 0,
        endTime:
            new Date().getTime() +
            177 * 24 * 60 * 60 * 1000 +
            5 * 60 * 60 * 1000 +
            2 * 60 * 1000 +
            8 * 1000,
    },
    {
        id: 2,
        name: "Phê Nấu",
        image: "/images/products/GẤM.jpg",
        currentPrice: 11.0,
        originalPrice: 12.5,
        discount: 12,
        rating: 0,
        endTime:
            new Date().getTime() +
            177 * 24 * 60 * 60 * 1000 +
            5 * 60 * 60 * 1000 +
            2 * 60 * 1000 +
            8 * 1000,
    },
    {
        id: 3,
        name: "Phê Nấu",
        image: "/images/products/GẤM.jpg",
        currentPrice: 11.0,
        originalPrice: 12.5,
        discount: 12,
        rating: 0,
        endTime:
            new Date().getTime() +
            177 * 24 * 60 * 60 * 1000 +
            5 * 60 * 60 * 1000 +
            2 * 60 * 1000 +
            8 * 1000,
    },
    {
        id: 4,
        name: "Phê Nấu",
        image: "/images/products/GẤM.jpg",
        currentPrice: 11.0,
        originalPrice: 12.5,
        discount: 12,
        rating: 0,
        endTime:
            new Date().getTime() +
            177 * 24 * 60 * 60 * 1000 +
            5 * 60 * 60 * 1000 +
            2 * 60 * 1000 +
            8 * 1000,
    },
    {
        id: 5,
        name: "Phê Nấu",
        image: "/images/products/GẤM.jpg",
        currentPrice: 11.0,
        originalPrice: 12.5,
        discount: 12,
        rating: 0,
        endTime:
            new Date().getTime() +
            177 * 24 * 60 * 60 * 1000 +
            5 * 60 * 60 * 1000 +
            2 * 60 * 1000 +
            8 * 1000,
    },
];

// Combos Data
const combos = [
    {
        id: 1,
        title: "Chef Burgers London",
        image: "/images/products/GẤM.jpg",
        discount: 40,
    },
    {
        id: 2,
        title: "Chef Burgers London",
        image: "/images/products/GẤM.jpg",
        discount: 40,
    },
    {
        id: 3,
        title: "Chef Burgers London",
        image: "/images/products/GẤM.jpg",
        discount: 40,
    },
];

// Countdown Timer Function
function updateCountdown(endTime, $element) {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
        $element.html(
            '<div class="countdown-item"><span class="countdown-value">00</span><span class="countdown-label">Expired</span></div>'
        );
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    $element.html(`
    <div class="countdown-item">
      <span class="countdown-value">${days}</span>
      <span class="countdown-label">Days</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-value">${String(hours).padStart(2, "0")}</span>
      <span class="countdown-label">Hours</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-value">${String(minutes).padStart(2, "0")}</span>
      <span class="countdown-label">Mins</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-value">${String(seconds).padStart(2, "0")}</span>
      <span class="countdown-label">Secs</span>
    </div>
  `);
}

// Create Product Card
function createProductCard(product) {
    const stars = "★★★★★";

    return $(`
    <div class="product-card" data-aos="flip-right">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="sale-badge"><i class="fa-solid fa-bolt" style="color: #e3b81c;"></i> -${
            product.discount
        }%</div>
        <button class="favorite-btn"><i class="fa-solid fa-heart" style="color: #be1313; font-size:15px;"></i></button>
        <div class="countdown-timer" data-endtime="${product.endTime}"></div>
      </div>
      <div class="product-info">
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${product.rating})</span>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-footer">
          <div class="product-price">
            <span class="current-price">$${product.currentPrice.toFixed(
                2
            )}</span>
            <span class="original-price">$${product.originalPrice.toFixed(
                2
            )}</span>
          </div>
          <button class="add-to-cart-btn" data-product-id="${
              product.id
          }"><i class="fa-solid fa-plus" style="color: #ffffff;  font-size:15px;"></i></button>
        </div>
      </div>
    </div>
  `);
}

// Create Combo Card
function createComboCard(combo) {
    return $(`
    <div class="combo-card" data-aos="zoom-in-up">
      <div class="combo-image-container">
        <img src="${combo.image}" alt="${combo.title}" class="combo-image">
        <div class="overlay"></div>
        <div class="combo-discount">-${combo.discount}%</div>
        <div class="combo-info">
            <div class="title">
                <p class="sub-title">Combo</p>
                <h3 class="combo-title">${combo.title}</h3>
            </div>
            <button class="combo-btn" data-combo-id="${combo.id}"><i class="fa-solid fa-plus" ></i></button>
        </div>
      </div>
    </div>
  `);
}

// Products Carousel
let productsCurrentIndex = 0;
const productsPerView = 5;

function renderProducts() {
    const $carousel = $("#productsCarousel");
    $carousel.empty();

    $.each(products, (index, product) => {
        const $card = createProductCard(product);
        $carousel.append($card);
    });

    // Initialize countdown timers
    $(".countdown-timer").each(function () {
        const $element = $(this);
        const endTime = Number.parseInt($element.attr("data-endtime"));
        updateCountdown(endTime, $element);
        setInterval(() => updateCountdown(endTime, $element), 1000);
    });

    updateProductsCarousel();
    renderProductsDots();
}

function updateProductsCarousel() {
    const $carousel = $("#productsCarousel");
    const cardWidth = $carousel.find(".product-card").first().outerWidth();
    const gap = 24;
    const offset = -(
        productsCurrentIndex *
        (cardWidth + gap) *
        productsPerView
    );
    $carousel.css("transform", `translateX(${offset}px)`);
}

function renderProductsDots() {
    const $dotsContainer = $("#productsDots");
    $dotsContainer.empty();

    const totalPages = Math.ceil(products.length / productsPerView);

    for (let i = 0; i < totalPages; i++) {
        const $dot = $(
            `<div class="dot ${
                i === productsCurrentIndex ? "active" : ""
            }"></div>`
        );
        $dot.on("click", () => {
            goToProductsPage(i);
        });
        $dotsContainer.append($dot);
    }
}

function goToProductsPage(index) {
    const totalPages = Math.ceil(products.length / productsPerView);
    productsCurrentIndex = Math.max(0, Math.min(index, totalPages - 1));
    updateProductsCarousel();
    renderProductsDots();
}

// Combos Carousel
let combosCurrentIndex = 0;
const combosPerView = 3;

function renderCombos() {
    const $carousel = $("#combosCarousel");
    $carousel.empty();

    $.each(combos, (index, combo) => {
        const $card = createComboCard(combo);
        $carousel.append($card);
    });

    updateCombosCarousel();
    renderCombosDots();
}

function updateCombosCarousel() {
    const $carousel = $("#combosCarousel");
    const cardWidth = $carousel.find(".combo-card").first().outerWidth();
    const gap = 24;
    const offset = -(combosCurrentIndex * (cardWidth + gap) * combosPerView);
    $carousel.css("transform", `translateX(${offset}px)`);
}

function renderCombosDots() {
    const $dotsContainer = $("#combosDots");
    $dotsContainer.empty();

    const totalPages = Math.ceil(combos.length / combosPerView);

    for (let i = 0; i < totalPages; i++) {
        const $dot = $(
            `<div class="dot ${
                i === combosCurrentIndex ? "active" : ""
            }"></div>`
        );
        $dot.on("click", () => {
            goToCombosPage(i);
        });
        $dotsContainer.append($dot);
    }
}

function goToCombosPage(index) {
    const totalPages = Math.ceil(combos.length / combosPerView);
    combosCurrentIndex = Math.max(0, Math.min(index, totalPages - 1));
    updateCombosCarousel();
    renderCombosDots();
}

// jQuery Document Ready
$(document).ready(() => {
    // Initialize carousels
    renderProducts();
    renderCombos();

    // Event Handlers using jQuery event delegation
    $(document).on("click", ".favorite-btn", function () {
        const $btn = $(this);
        $btn.toggleClass("active");
        $btn.html(
            $btn.hasClass("active")
                ? '<i class="fa-solid fa-heart" style="color: #be1313; font-size:15px;"></i>'
                : '<i class="fa-regular fa-heart" style="color: #808080; font-size:15px;"></i>'
        );
    });

    $(document).on("click", ".add-to-cart-btn", function () {
        const productId = $(this).data("product-id");
        alert("Đã thêm vào giỏ hàng!");
    });

    $(document).on("click", ".combo-btn", function () {
        const comboId = $(this).data("combo-id");
        alert("Xem chi tiết combo!");
    });

    // Products carousel navigation
    $("#productsPrev").on("click", () => {
        if (productsCurrentIndex > 0) {
            goToProductsPage(productsCurrentIndex - 1);
        }
    });

    $("#productsNext").on("click", () => {
        const totalPages = Math.ceil(products.length / productsPerView);
        if (productsCurrentIndex < totalPages - 1) {
            goToProductsPage(productsCurrentIndex + 1);
        }
    });

    // Combos carousel navigation
    $("#combosPrev").on("click", () => {
        if (combosCurrentIndex > 0) {
            goToCombosPage(combosCurrentIndex - 1);
        }
    });

    $("#combosNext").on("click", () => {
        const totalPages = Math.ceil(combos.length / combosPerView);
        if (combosCurrentIndex < totalPages - 1) {
            goToCombosPage(combosCurrentIndex + 1);
        }
    });

    // Auto-play products carousel
    setInterval(() => {
        const totalPages = Math.ceil(products.length / productsPerView);
        if (productsCurrentIndex < totalPages - 1) {
            goToProductsPage(productsCurrentIndex + 1);
        } else {
            goToProductsPage(0);
        }
    }, 5000);

    // Auto-play combos carousel
    setInterval(() => {
        const totalPages = Math.ceil(combos.length / combosPerView);
        if (combosCurrentIndex < totalPages - 1) {
            goToCombosPage(combosCurrentIndex + 1);
        } else {
            goToCombosPage(0);
        }
    }, 6000);

    // Handle window resize
    $(window).on("resize", () => {
        updateProductsCarousel();
        updateCombosCarousel();
    });
});

const voucherData = {
    vouchers: [
        {
            id: 1,
            label: "ƯU ĐÃI",
            offer: "MUA 1 TẶNG 1",
            description: "Áp dụng cho tất cả đồ uống",
            code: "CAFE2024",
            image: "/public/vietnamese-coffee-products-on-dark-background.jpg",
        },
        {
            id: 2,
            label: "ƯU ĐÃI",
            offer: "MUA 1 TẶNG 1",
            description: "Đặc biệt cho cà phê phin",
            code: "PHIN2024",
            image: "/public/vietnamese-coffee-products-on-dark-background.jpg",
        },
        {
            id: 3,
            label: "ƯU ĐÃI",
            offer: "MUA 1 TẶNG 1",
            description: "Combo cà phê sữa đá",
            code: "COMBO2024",
            image: "/public/vietnamese-coffee-products-on-dark-background.jpg",
        },
        {
            id: 4,
            label: "ƯU ĐÃI",
            offer: "GIẢM 30%",
            description: "Cho đơn hàng từ 200k",
            code: "GIAM30",
            image: "/public/vietnamese-coffee-products-on-dark-background.jpg",
        },
        {
            id: 5,
            label: "ƯU ĐÃI",
            offer: "GIẢM 50%",
            description: "Khách hàng mới",
            code: "NEW50",
            image: "/public/vietnamese-coffee-products-on-dark-background.jpg",
        },
        {
            id: 6,
            label: "ƯU ĐÃI",
            offer: "FREESHIP",
            description: "Miễn phí giao hàng",
            code: "SHIP0D",
            image: "/public/vietnamese-coffee-products-on-dark-background.jpg",
        },
    ],
};

$(document).ready(() => {
    loadVouchers();

    // Smooth scroll for "View All" link
    $(".view-all-link").on("click", (e) => {
        e.preventDefault();
        showAllVouchers();
    });

    // Lazy loading for images
    const images = document.querySelectorAll("img");
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add("loaded");
                observer.unobserve(img);
            }
        });
    });

    images.forEach((img) => imageObserver.observe(img));

    // Add fade-in animation on scroll
    const fadeElements = $(".hero-content, .voucher-card");

    $(window).on("scroll", () => {
        fadeElements.each(function () {
            const elementTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();

            if (windowBottom > elementTop + 100) {
                $(this).addClass("fade-in");
            }
        });
    });
});

function loadVouchers(limit = 3) {
    displayVouchers(voucherData.vouchers.slice(0, limit));
}

function displayVouchers(vouchers) {
    const container = $("#voucherContainer");
    container.empty();

    vouchers.forEach((voucher) => {
        const voucherCard = `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="voucher-card" data-voucher-id="${voucher.id}" data-code="${voucher.code}">
            <div class="voucher-left">
                <div class="voucher-description">${voucher.description}</div>
                <h3 class="voucher-offer">${voucher.offer}</h3>
            </div>  
            <div class="voucher-right">
                <div class="voucher-code">${voucher.code}</div>
                <button class="voucher-btn">LƯU MÃ</button>
            </div>
        </div>
      </div>
    `;
        container.append(voucherCard);
    });

    $(".voucher-card").on("click", function () {
        const voucherId = $(this).data("voucher-id");
        const voucherCode = $(this).data("code");

        // Copy voucher code to clipboard
        copyToClipboard(voucherCode);

        // Show notification
        showNotification(`Đã sao chép mã: ${voucherCode}`);
    });
}

function showAllVouchers() {
    displayVouchers(voucherData.vouchers);

    // Scroll to voucher section
    $("html, body").animate(
        {
            scrollTop: $(".voucher-section").offset().top - 20,
        },
        500
    );
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log("Copied to clipboard:", text);
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
            });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("Failed to copy (fallback):", err);
        }
        document.body.removeChild(textarea);
    }
}

function showNotification(message) {
    // Remove existing notification if any
    $(".notification").remove();

    const notification = $(`
    <div class="notification">
      <span>${message}</span>
    </div>
  `);

    $("body").append(notification);

    // Show notification
    setTimeout(() => {
        notification.addClass("show");
    }, 100);

    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.removeClass("show");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

////category--------------------------------------------------------------------------------------------------------------------------------------------------------
// Mảng dữ liệu danh mục
let categories;

$.ajax({
    url: "/api/categories",
    method: "GET",
    success: function (res) {
        categories = res.categories; // gán vào biến
        console.log("categories:", categories);
        // Render danh mục
        const categoryList = document.getElementById("category-list");
        categories.forEach((cat) => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            slide.innerHTML = `
      <img src="/images/categories/${cat.images}" alt="${cat.name}">
      <p>${cat.name}</p>
    `;
            categoryList.appendChild(slide);
        });
    },
    error: function (err) {
        console.error("Lỗi:", err);
    },
});

// Khởi tạo Swiper
const swiper = new Swiper(".swiper", {
    slidesPerView: 6, // số item hiển thị 1 lúc (auto responsive)
    spaceBetween: 15, // khoảng cách
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    slidesPerGroup: 1, // mỗi lần bấm trượt 1 item
    breakpoints: {
        320: { slidesPerView: 2, spaceBetween: 10 },
        768: { slidesPerView: 3, spaceBetween: 15 },
        1024: { slidesPerView: 6, spaceBetween: 15 },
    },
});

////product---------------------------------------------------------------------------------------------------------------------------------------------------------

let pdProducts = [];

function initProductSeller() {
    $.ajax({
        url: "/api/product/sellers",
        method: "GET",
        success: function (res) {
            pdProducts = res.products; // gán vào biến
            console.log("Products:", pdProducts);
            pdInitializeProductGrid();
        },
        error: function (err) {
            console.error("Lỗi:", err);
        },
    });
}

// Generate star rating HTML
function pdGenerateStars(rating) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    return stars;
}

// Create product card HTML
function pdCreateProductCard(product) {
    const sizeButtonsHTML = product.price_product
        .map(
            (pp, idx) => `
            <button class="pd-size-btn ${idx === 0 ? "active" : ""}" 
                data-price="${pp.price}" 
                onclick="pdSelectSize(this)">
                ${pp.size}
            </button>
        `
        )
        .join("");
    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 ">
            <div class="pd-product-card pd-product-card-compact" data-aos="zoom-out-up" data-id="${
                product.id
            }">
                <div class="pd-product-image-wrapper">
                    <img src="/images/products/${product.images}" alt="${
        product.name
    }" class="pd-product-image">
                    <button class="pd-favorite-btn" onclick="pdToggleFavorite(this)">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                
                <div  class="pd-product-content" >
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="pd-product-category">${
                            product.categories.name
                        }</div>
                        <div class="pd-product-rating">
                            ${pdGenerateStars(product.rating)}
                            <span class="pd-rating-count">(${
                                product.reviews
                            })</span>
                        </div>
                    </div>
                    
                    <h3 class="pd-product-name">${product.name}</h3>
                    
                    <div class="pd-size-selector mb-3">
                        <div class="d-flex align-items-center gap-2 justify-content-between">
                            <label class="pd-size-label mb-0">Chọn kích cỡ:</label>
                            <div class="pd-size-options">
                                  ${sizeButtonsHTML}
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="pd-quantity-selector">
                            <label class="pd-quantity-label">Số lượng:</label>
                            <div class="pd-quantity-controls">
                                <button class="pd-quantity-btn" onclick="pdChangeQuantity(this, -1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="pd-quantity-input" value="1" min="1" max="99" readonly>
                                <button class="pd-quantity-btn" onclick="pdChangeQuantity(this, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="pd-product-price">${formatVND(
                            product.price_product[0].price
                        )}</div>
                    </div>
                    
                    <button class="pd-btn-add-to-cart" data-productId=${
                        product.product_id
                    } >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Initialize product grid
function pdInitializeProductGrid() {
    const productGrid = document.getElementById("pdProductGrid");
    if (productGrid) {
        productGrid.innerHTML = pdProducts
            .map((product) => pdCreateProductCard(product))
            .join("");
    }
}

// Toggle favorite
function pdToggleFavorite(button) {
    button.classList.toggle("active");

    // Add animation
    button.style.transform = "scale(1.2)";
    setTimeout(() => {
        button.style.transform = "";
    }, 200);
}

// Select size
function pdSelectSize(button) {
    const sizeButtons = button.parentElement.querySelectorAll(".pd-size-btn");
    sizeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const card = button.closest(".pd-product-card");
    const priceEl = card.querySelector(".pd-product-price");
    const newPrice = button.getAttribute("data-price");
    priceEl.textContent = formatVND(Number(newPrice));
}

// Change quantity (for grid cards)
function pdChangeQuantity(button, delta) {
    const input = button.parentElement.querySelector(".pd-quantity-input");
    let value = Number.parseInt(input.value) || 1;
    value = Math.max(1, Math.min(99, value + delta));
    input.value = value;
}

// Add to cart----------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
    $(document).on("click", ".pd-btn-add-to-cart", function () {
        // Lấy div cha chứa thông tin sản phẩm
        const productDiv = $(this).closest(".pd-product-card");
        // Lấy thông tin từ data-attribute và input
        const product = {
            product_id: $(this).data("productid"),
            product_name: productDiv.find(".pd-product-name").text()?.trim(),
            product_image: productDiv
                .find(".pd-product-image")
                .attr("src")
                .replace(/^\/images\/products\//, ""),
            price: parseVND(productDiv.find(".pd-product-price").text()),
            product_size: productDiv
                .find(".pd-size-options .active")
                .text()
                ?.trim(),
            sub_quantity:
                parseInt(productDiv.find(".pd-quantity-input").val()) || 1,
            price_product_id: productDiv
                .find(".pd-size-btn")
                .map(function () {
                    const size = $(this).text().trim();
                    const priceText = productDiv
                        .find(`.pd-price[data-size='${size}']`)
                        .text();
                    return {
                        size,
                        price: parseVND(priceText),
                    };
                })
                .get(),
        };
        let cart = getCartFromStorage();
        cart = addToCart(cart, product);
        updateCartSummary(cart);
        saveCartToStorage(cart);
        updateCartBadge();
        updateCart();
        openCart();
        // Gọi Ajax
        $.ajax({
            url: "/api/cart",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                productId: product.product_id,
                quantity: product.sub_quantity,
                size: product.product_size,
            }),
            success: function (response) {
                getCartAPI();
                renderCartItems();
            },
            error: function (xhr, status, error) {
                if (xhr.status === 401) {
                    // Unauthorized - Redirect to login
                    window.location.href = "/auth/login";
                    return;
                }
                console.error("Lỗi khi thêm sản phẩm:", error);
                alert("Thêm sản phẩm thất bại!");
            },
        });
    });
});

function updateCartUI(cart) {
    $(".cart-badge").text(cart.quantity);
    let itemsHtml = "";
    cart.items.forEach((item) => {
        itemsHtml += `
            <div class="shopping-cart-item">
                <img src="${item.image}" alt="${item.name}" class="shopping-item-image">
                <div class="shopping-item-details">
                    <h3 class="shopping-item-name">${item.name}</h3>
                    <p class="shopping-item-info mb-0">${item.quantity} x $${item.price}</p>
                </div>
                <button class="shopping-remove-btn" data-product-id="${item.id}">
                    <i class="bi bi-x fs-4"></i>
                </button>
            </div>
        `;
    });
    $("#cartItems").html(itemsHtml);
}

////blog

// Sample news data
const pdNewsArticles = [
    {
        id: 1,
        title: "Sữa Chua Bông Buổi – Sữa Chua Ổ Long Đã Xay 🧋",
        excerpt:
            "Lễ khai giảng năm học chill 2025 – 2026 bắt đầu! Đang tìm vào là đâu để mừng là Khởi Động Chill độ 'ban học' Sữa Chua Bông Buổi dẫn đầu...",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-twt6kdwHURLx78xehPO5oxg2ZQPb9u.png",
        date: "04-09-2025",
    },
    {
        id: 2,
        title: "Sữa Chua Bông Buổi – Sữa Chua Ổ Long Đã Xay 🧋",
        excerpt:
            "Lễ khai giảng năm học chill 2025 – 2026 bắt đầu! Đang tìm vào là đâu để mừng là Khởi Động Chill độ 'ban học' Sữa Chua Bông Buổi dẫn đầu...",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
        date: "04-09-2025",
    },
    {
        id: 3,
        title: "Sữa Chua Bông Buổi – Sữa Chua Ổ Long Đã Xay 🧋",
        excerpt:
            "Lễ khai giảng năm học chill 2025 – 2026 bắt đầu! Đang tìm vào là đâu để mừng là Khởi Động Chill độ 'ban học' Sữa Chua Bông Buổi dẫn đầu...",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop",
        date: "05-09-2025",
    },
];

// Create news card HTML
function pdCreateNewsCard(article) {
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="pd-news-card">
                <div class="pd-news-image-wrapper">
                    <img src="${article.image}" alt="${article.title}" class="pd-news-image">
                </div>
                
                <div class="pd-news-content">
                    <h3 class="pd-news-title-text">${article.title}</h3>
                    <p class="pd-news-excerpt">${article.excerpt}</p>
                    
                    <div class="pd-news-footer">
                        <span class="pd-news-date">${article.date}</span>
                        <button class="pd-btn-read-more" onclick="pdReadMore(${article.id})">
                            ĐỌC TIẾP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function pdInitializeNewsGrid() {
    const newsGrid = document.getElementById("pdNewsGrid");
    if (newsGrid) {
        newsGrid.innerHTML = pdNewsArticles
            .map((article) => pdCreateNewsCard(article))
            .join("");
    }
}

// Read more function
function pdReadMore(articleId) {
    console.log("[v0] Reading article:", articleId);
    alert(`Đang mở bài viết #${articleId}`);
    // Here you would typically navigate to the article detail page
}

///feedback

const pdWhyReasons = [
    {
        id: 1,
        title: "Phê nâu",
        rating: 5,
        content:
            "Cà phê đậm vị, hương thơm từ nhiên, các món khác cũng pha chế hài hòa, dễ uống và có sự sáng tạo riêng, trình bày đẹp mắt, kết hợp hợp lý với đi uống, tạo trải nghiệm trọn vẹn hơn cho khách.",
    },
    {
        id: 2,
        title: "Anh Đức",
        rating: 5,
        content:
            "Cà phê đậm vị, hương thơm từ nhiên, các món khác cũng pha chế hài hòa, dễ uống và có sự sáng tạo riêng, trình bày đẹp mắt, kết hợp hợp lý với đi uống, tạo trải nghiệm trọn vẹn hơn cho khách.",
    },
    {
        id: 3,
        title: "Chị Mai",
        rating: 5,
        content:
            "Không gian thoải mái, nhân viên nhiệt tình, đồ uống ngon và giá cả hợp lý. Đặc biệt là các món signature rất độc đáo và đáng thử.",
    },
    {
        id: 4,
        title: "Anh Tuấn",
        rating: 5,
        content:
            "Quán có view đẹp, âm nhạc dễ nghe, thích hợp để làm việc hoặc gặp gỡ bạn bè. Cà phê pha chế chuẩn vị, không quá đắng hay quá ngọt.",
    },
];

function pdInitializeWhyCarousel() {
    const carousel = document.getElementById("pdWhyCarousel");
    if (!carousel) return;

    // Create all cards
    pdWhyReasons.forEach((reason, index) => {
        const card = document.createElement("div");
        card.className = "pd-why-card";
        card.innerHTML = `
      <div class="pd-why-card-header">
        <h3 class="pd-why-card-title">${reason.title}</h3>
        <div class="pd-why-card-rating">
          ${pdGenerateStars(reason.rating)}
        </div>
      </div>
      <div class="pd-why-card-content">
        ${reason.content}
      </div>
    `;
        carousel.appendChild(card);
    });

    // Start carousel animation
    pdStartWhyCarousel();
}

let pdCurrentWhyIndex = 0;
let pdWhyCarouselInterval;

function pdStartWhyCarousel() {
    const cards = document.querySelectorAll(".pd-why-card");
    if (cards.length === 0) return;

    function updateCarousel() {
        cards.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove(
                "pd-active",
                "pd-prev",
                "pd-next",
                "pd-hidden"
            );

            // Calculate position relative to current index
            const diff = index - pdCurrentWhyIndex;
            const total = cards.length;

            if (diff === 0) {
                // Current card - center and active
                card.classList.add("pd-active");
            } else if (diff === -1 || diff === total - 1) {
                // Previous card
                card.classList.add("pd-prev");
            } else if (diff === 1 || diff === -(total - 1)) {
                // Next card
                card.classList.add("pd-next");
            } else {
                // Hidden cards
                card.classList.add("pd-hidden");
            }
        });
    }

    // Initial update
    updateCarousel();

    // Auto-rotate every 3 seconds
    pdWhyCarouselInterval = setInterval(() => {
        pdCurrentWhyIndex = (pdCurrentWhyIndex + 1) % cards.length;
        updateCarousel();
    }, 3000);
}

window.addEventListener("beforeunload", () => {
    if (pdWhyCarouselInterval) {
        clearInterval(pdWhyCarouselInterval);
    }
});
// Handle newsletter subscription
function pdHandleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector(".pd-newsletter-input");
    const email = emailInput.value.trim();

    if (email) {
        console.log("[v0] Newsletter subscription:", email);
        alert(
            "Cảm ơn bạn đã đăng ký nhận tin! Chúng tôi sẽ gửi ưu đãi đặc biệt đến email của bạn."
        );
        emailInput.value = "";
    }
}

// Toggle favorite
function pdToggleFavorite(button) {
    button.classList.toggle("active");

    // Add animation
    button.style.transform = "scale(1.2)";
    setTimeout(() => {
        button.style.transform = "";
    }, 200);
}
// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize product grid if on index page
    await loadCartFromDB();
    initProductSeller();
    pdInitializeNewsGrid();
    pdInitializeWhyCarousel();
    // Add custom CSS for 5-column grid on larger screens
    const style = document.createElement("style");
    style.textContent = `
        @media (min-width: 1200px) {
            .col-xl-2-4 {
                flex: 0 0 20%;
                max-width: 20%;
            }
        }
    `;
    document.head.appendChild(style);
    const newsletterForm = document.querySelector(".pd-newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", pdHandleNewsletterSubmit);
    }
});
