/* global $, jQuery */
let favoriteIds = JSON.parse(localStorage.getItem("favoriteList")) || [];

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
        const total = await fetch("/api/favorite");
        const totalFavorite = await total.json();
        if (totalFavorite.total) {
            $("#favoriteBadge").text(totalFavorite.total);
            favoriteIds = totalFavorite.favorites.map((f) => f.product_id);
            localStorage.setItem("favoriteCount", totalFavorite.total);
            localStorage.setItem("favoriteList", JSON.stringify(favoriteIds));
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
    products.push(product);
    const stars = "★★★★★";
    const favoriteList = JSON.parse(
        localStorage.getItem("favoriteList") || "[]"
    );
    const isFavorite = favoriteList.some((fav) => fav === product.product_id);
    const discount = product.discountValue || 0;
    const matchedSize = product.price_product.find(
        (pp) => pp.size === product.size
    );

    const basePrice = matchedSize?.price || 0;
    const currentPrice = basePrice - discount;
    const originalPrice = basePrice;
    console.log(product.endTime);
    return $(`
    <div class="product-card pd-product-card" data-id="${product.product_id}">
      <div class="product-image-container">
        <img src="/images/products/${product.images}" alt="${
        product.name
    }" class="product-image">
        <div class="sale-badge"><i class="fa-solid fa-bolt" style="color: #e3b81c;"></i> -${formatVND(
            discount
        )}</div>
         <button class="pd-favorite-btn ${
             isFavorite ? "active" : ""
         }" onclick="pdToggleFavorite(this)">
                        <i class="far fa-heart"></i>
                    </button>
        <div class="countdown-timer" data-endtime="${product.endTime}"></div>
      </div>
      <div class="product-info">
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${product.rating})</span>
        </div>
      
        <h3 class="product-name">${product.name}</h3>
          <div class="product-size">
          <button 
                class="pd-size-btn active" 
                data-price="${currentPrice}" 
                data-original="${originalPrice}" 
                data-size="${product.size}"
                onclick="pdSelectSize(this)"
                style="width: 40px; margin-right: 4px;">
                ${product.size}
            </button>
               </b></span>
            </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="current-price">${formatVND(currentPrice)}</span>
            <span class="original-price">${formatVND(originalPrice)}</span>
          </div>
          <button class="add-to-cart-btn" data-product-id="${
              product.product_id
          }">
            <i class="fa-solid fa-plus" style="color: #ffffff; font-size:15px;"></i>
          </button>
        </div>
      </div>
    </div>
  `);
}

// Create Combo Card
function createComboCard(combo) {
    return $(`
    <div class="combo-card" >
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
let products = [];
async function renderProducts() {
    try {
        const res = await fetch("/admin/data/promotions/flashsale/client");
        const data = await res.json();
        
        if (!data.success) throw new Error("Không thể tải flash sale");

        const flashSales = data.data;
        const $carousel = $("#productsCarousel");
        $carousel.empty();
        products = [];
        const now = new Date();

        flashSales.forEach((promotion) => {
            const startDate = new Date(promotion.start_date);
            const endDate = new Date(promotion.end_date);

            // 🕒 Chỉ hiển thị khi đang trong khoảng thời gian
            if (now < startDate || now > endDate) return;

            const product = promotion.products;
            // const basePrice = product.price_product[0]?.price || 0;
            const discountValue = promotion.discount_price || 0;

            if (promotion.size === "all") {
                product.price_product.forEach((pp) => {
                    const $card = createProductCard({
                        ...product,
                        size: pp.size,
                        discountValue: discountValue,
                        endTime: promotion.end_date,
                    });
                    $carousel.append($card);
                });
            }
            // ⚙️ Nếu size cụ thể → chỉ render 1 card
            else {
                const $card = createProductCard({
                    ...product,
                    size: promotion.size,
                    discountValue: discountValue,
                    endTime: promotion.end_date,
                });
                $carousel.append($card);
            }

            // $carousel.append($card);
        });

        localStorage.setItem("flashsale-product", JSON.stringify(products));
        if ($carousel.children().length === 0) {
            $carousel.append(
                `<p class="text-center text-gray-500 mt-4">Hiện chưa có Flash Sale nào đang diễn ra.</p>`
            );
            return;
        }

        // 🧭 Countdown
        $(".countdown-timer").each(function () {
            const $element = $(this);
            const raw = $element.attr("data-endtime");
            const localStr = raw.replace("Z", "");
            const endTime = new Date(localStr);
            console.log(endTime);
            updateCountdown(endTime, $element);
            setInterval(() => updateCountdown(endTime, $element), 1000);
        });
        console.log(products);
        updateProductsCarousel();
        renderProductsDots();
    } catch (err) {
        console.error("Lỗi khi tải flash sale:", err);
    }
}
function updateProductsCarousel() {
    const $carousel = $("#productsCarousel");
    const cardWidth = $carousel.find(".product-card").first().outerWidth(true);
    const gap = 24;
    const offset = -(productsCurrentIndex * (cardWidth + gap));
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

function goToNextProduct() {
    const maxIndex = products.length - productsPerView; // 8 - 5 = 3
    if (productsCurrentIndex < maxIndex) {
        productsCurrentIndex++;
    } else {
        productsCurrentIndex = 0; // quay lại đầu
    }
    updateProductsCarousel();
}

function goToPrevProduct() {
    const maxIndex = products.length - productsPerView; // 8 - 5 = 3
    if (productsCurrentIndex > 0) {
        productsCurrentIndex--;
    } else {
        productsCurrentIndex = maxIndex;
    }
    updateProductsCarousel();
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
    loadPdNewsArticles();
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
    setInterval(goToNextProduct, 4000);
    $(document).on("click", ".add-to-cart-btn", function () {
        const productId = $(this).data("product-id");
        alert("Đã thêm vào giỏ hàng!");
    });

    $(document).on("click", ".combo-btn", function () {
        const comboId = $(this).data("combo-id");
        alert("Xem chi tiết combo!");
    });

    // Products carousel navigation
    $("#productsNext").on("click", goToNextProduct);
    $("#productsPrev").on("click", goToPrevProduct);

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
    // setInterval(() => {
    //     const totalPages = Math.ceil(products.length / productsPerView);
    //     if (productsCurrentIndex < totalPages - 1) {
    //         goToProductsPage(productsCurrentIndex + 1);
    //     } else {
    //         goToProductsPage(0);
    //     }
    // }, 5000);

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

$(document).ready(async () => {
    await loadVouchersAPI();
    loadVouchers();

    // Smooth scroll for "View All" link

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

async function loadVouchersAPI() {
    try {
        const res = await fetch(
            "http://localhost:3000/admin/data/promotions/voucher"
        );
        const result = await res.json();

        if (!result.success) return;

        // Lấy 3 voucher đầu tiên
        const firstThree = result.data.slice(0, 3);

        // Map về format hiện tại
        voucherData.vouchers = firstThree.map((item, index) => ({
            id: index + 1,
            label: "ƯU ĐÃI", // Hoặc tự động lấy từ API nếu có
            offer: `${item.discount_percent}%`, // Bạn có thể tuỳ chỉnh
            description: `${new Date(item.start_date).toLocaleDateString(
                "vi-VN"
            )} - ${new Date(item.end_date).toLocaleDateString("vi-VN")}`,
            code: item.code,
            image: "/public/vietnamese-coffee-products-on-dark-background.jpg", // Hoặc URL thực tế từ API
        }));

        console.log("voucherData:", voucherData);
    } catch (error) {
        console.error("Lỗi khi load vouchers:", error);
    }
}
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
                <h3 class="voucher-offer">GIẢM ${voucher.offer}</h3>
            </div>  
            <div class="voucher-right">
                <div class="voucher-code">${voucher.code}</div>
                <button class="voucher-btn">SAO CHÉP</button>
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
        url: "http://localhost:3000/api/products?sort=bestseller",
        method: "GET",
        success: function (res) {
            pdProducts = res.productsFilter; // gán vào biến
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
    const favoriteList = JSON.parse(
        localStorage.getItem("favoriteList") || "[]"
    );

    const isFavorite = favoriteList.some((fav) => fav === product.product_id);
    const sizeButtonsHTML = product.price_product
        .map((pp, idx) => {
            const flashSaleItem = products.find(
                (f) =>
                    f.product_id === product.product_id &&
                    (f.size == pp.size || f.size === "all")
            );

            let displayPrice = pp.price;
            let oldPrice = null;

            if (flashSaleItem) {
                const discountValue = flashSaleItem.discountValue ?? 0;
                oldPrice = pp.price;
                displayPrice = pp.price - discountValue;
            }

            return `
            <button 
                class="pd-size-btn ${idx === 0 ? "active" : ""}" 
                data-price="${displayPrice}" 
                data-oldprice="${oldPrice || ""}"
                onclick="pdSelectSize(this)">
                ${pp.size}
            </button>
        `;
        })
        .join("");
    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 ">
            <div class="pd-product-card pd-product-card-compact"  data-id="${
                product.product_id
            }">
                <div class="pd-product-image-wrapper">
                    <img src="/images/products/${product.images}" alt="${
        product.name
    }" class="pd-product-image">
                    <button class="pd-favorite-btn ${
                        isFavorite ? "active" : ""
                    }" onclick="pdToggleFavorite(this)">
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
                        
                        <div class="pd-product-price"></div>
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
function pdInitPriceDisplay(card) {
    const activeBtn = card.querySelector(".pd-size-btn.active");
    const priceDiv = card.querySelector(".pd-product-price");
    if (!activeBtn || !priceDiv) return;
    const price = Number(activeBtn.dataset.price);
    const oldPrice = activeBtn.dataset.oldprice
        ? Number(activeBtn.dataset.oldprice)
        : null;

    priceDiv.innerHTML = oldPrice
        ? `<span class="pd-old-price" id="price-old">${formatVND(
              oldPrice
          )}</span>
           <span class="pd-sale-price text-danger ms-2">${formatVND(
               price
           )}</span>`
        : `<span id="price-old">${formatVND(price)}</span>`;
    if (oldPrice) {
        card.querySelector(".pd-product-image-wrapper").insertAdjacentHTML(
            "beforeend",
            `<div class="flashsale-badge"><span>Flash<br/> Sale</span></div>`
        );
    }
}

// Gọi hàm này sau khi render tất cả card

// Initialize product grid
function pdInitializeProductGrid() {
    const productGrid = document.getElementById("pdProductGrid");
    if (productGrid) {
        productGrid.innerHTML = pdProducts
            .map((product) => pdCreateProductCard(product))
            .join("");
    }
    requestAnimationFrame(() => {
        document
            .querySelectorAll(".pd-product-card")
            .forEach(pdInitPriceDisplay);
    });
}
// Toggle favorite
async function pdToggleFavorite(button) {
    button.classList.toggle("active");
    const productId = parseInt(
        button.closest(".pd-product-card").getAttribute("data-id")
    );
    const isActive = button.classList.contains("active");
    try {
        if (isActive) {
            // Gọi API thêm
            const res = await fetch("/api/favorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: productId,
                }),
            });
            if (!res.ok) throw new Error("Thêm yêu thích thất bại");
            const data = await res.json();
            if (!favoriteIds.includes(productId)) {
                favoriteIds.push(productId);
                localStorage.setItem(
                    "favoriteList",
                    JSON.stringify(favoriteIds)
                );
                $("#favoriteBadge").text(favoriteIds.length);
            }
        } else {
            const res = await fetch(`/api/favorite`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: productId,
                }),
            });
            if (!res.ok) throw new Error("Xóa yêu thích thất bại");
            favoriteIds = favoriteIds.filter((id) => id !== productId);
            console.log("Updated favoriteIds:", favoriteIds);
            localStorage.setItem("favoriteList", JSON.stringify(favoriteIds));
            $("#favoriteBadge").text(favoriteIds.length);
        }
    } catch (err) {
        console.error("Lỗi khi cập nhật yêu thích:", err);
        button.classList.toggle("active");
    }

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
    const parent = button.closest(".pd-product-card");
    pdInitPriceDisplay(parent);
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
            price: parseVND(productDiv.find("#price-old").text()),
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
        console.log("hi");
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
let pdNewsArticles = [
    // {
    //     id: 1,
    //     title: "Sữa Chua Bông Buổi – Sữa Chua Ổ Long Đã Xay 🧋",
    //     excerpt:
    //         "Lễ khai giảng năm học chill 2025 – 2026 bắt đầu! Đang tìm vào là đâu để mừng là Khởi Động Chill độ 'ban học' Sữa Chua Bông Buổi dẫn đầu...",
    //     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-twt6kdwHURLx78xehPO5oxg2ZQPb9u.png",
    //     date: "04-09-2025",
    // },
    // {
    //     id: 2,
    //     title: "Sữa Chua Bông Buổi – Sữa Chua Ổ Long Đã Xay 🧋",
    //     excerpt:
    //         "Lễ khai giảng năm học chill 2025 – 2026 bắt đầu! Đang tìm vào là đâu để mừng là Khởi Động Chill độ 'ban học' Sữa Chua Bông Buổi dẫn đầu...",
    //     image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
    //     date: "04-09-2025",
    // },
    // {
    //     id: 3,
    //     title: "Sữa Chua Bông Buổi – Sữa Chua Ổ Long Đã Xay 🧋",
    //     excerpt:
    //         "Lễ khai giảng năm học chill 2025 – 2026 bắt đầu! Đang tìm vào là đâu để mừng là Khởi Động Chill độ 'ban học' Sữa Chua Bông Buổi dẫn đầu...",
    //     image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop",
    //     date: "05-09-2025",
    // },
];

async function loadPdNewsArticles() {
    try {
        const res = await fetch("http://localhost:3000/admin/data/blogs");
        const data = await res.json();
        console.log(data);
        pdNewsArticles = data.slice(0, 3).map((item, index) => ({
            id: index + 1,
            title: item.title,
            excerpt: item.description || "",
            image: item.thumbnail,
            date: new Date(item.created_at).toLocaleDateString("vi-VN"),
        }));
    } catch (error) {
        console.error("Lỗi khi load blogs:", error);
        return [];
    }
}

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
// function pdToggleFavorite(button) {
//     button.classList.toggle("active");

//     // Add animation
//     button.style.transform = "scale(1.2)";
//     setTimeout(() => {
//         button.style.transform = "";
//     }, 200);
// }
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
