// ----------------------------
// 🧭 STATE + CONFIG
// ----------------------------
const state = {
    category: "",
    sort: "newest",
    minPrice: 0,
    maxPrice: 500000,
    keyword: "",
    currentPage: 1,
    itemsPerPage: 9,
};

// ----------------------------
// 💰 FORMATTER
// ----------------------------
function formatVND(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

// ----------------------------
// 🧩 INIT SLIDER
// ----------------------------
let products = [];
$(document).ready(async function () {
    await getCateforyAPI();
    const slider = new Slider("#priceSlider", {
        min: 0,
        max: 500000,
        step: 5000,
        value: [0, 500000],
        tooltip: "hide",
        range: true,
    });
    dataFlashsale = localStorage.getItem("flashsale-product");
    products = dataFlashsale ? JSON.parse(dataFlashsale) : [];
    const favorite =
        JSON.parse(localStorage.getItem("favoriteList")).length || 0;
    $("#favoriteBadge").text(favorite);
    // Hiển thị giá khi kéo
    slider.on("slide", function (values) {
        const [min, max] = values;
        $("#minPrice").text(Number(min).toLocaleString() + "đ");
        $("#maxPrice").text(Number(max).toLocaleString() + "đ");
    });
    updateCartBadge();
    // Khi dừng kéo => apply filter
    slider.on("slideStop", function () {
        const [min, max] = slider.getValue();
        state.minPrice = min;
        state.maxPrice = max;
        state.currentPage = 1;
        applyFilters();
    });

    // ----------------------------
    // 🎯 EVENT HANDLERS
    // ----------------------------
    $(document).on("change", "input[name='category']", function () {
        state.category = $(this).val();
        state.currentPage = 1;
        applyFilters();
    });

    $("#sortSelect").on("change", function () {
        state.sort = $(this).val();
        state.currentPage = 1;
        applyFilters();
    });
    slider.on("slide", function (values) {
        const [min, max] = values;
        $("#minPrice").text(min.toLocaleString("vi-VN") + "đ");
        $("#maxPrice").text(max.toLocaleString("vi-VN") + "đ");
    });

    $(".search-container button").on("click", function () {
        state.keyword = $("#searchInput").val().trim();
        state.currentPage = 1;
        applyFilters();
    });

    $("#searchInput").on("keypress", function (e) {
        if (e.which === 13) {
            state.keyword = e.target.value.trim();
            state.currentPage = 1;
            applyFilters();
        }
    });

    $(".pagination").on("click", ".page-link", function (e) {
        e.preventDefault();
        const page = parseInt($(this).data("page"));
        if (page && page !== state.currentPage) {
            state.currentPage = page;
            applyFilters();
        }
    });

    $(document).ready(function () {
        $(document).on("click", ".pd-btn-add-to-cart", function (e) {
            e.stopPropagation();
            // Lấy div cha chứa thông tin sản phẩm
            const productDiv = $(this).closest(".pd-product-card");
            // Lấy thông tin từ data-attribute và input
            const product = {
                product_id: $(this).data("productid"),
                product_name: productDiv
                    .find(".pd-product-name")
                    .text()
                    ?.trim(),
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
                    console.error("Lỗi khi thêm sản phẩm:", error);
                    alert("Thêm sản phẩm thất bại!");
                },
            });
        });
    });

    $(document).on("click", ".pd-product-card", function (e) {
        if (
            $(e.target).closest(
                ".pd-btn-add-to-cart, .pd-size-btn, .pd-quantity-btn, .pd-favorite-btn"
            ).length
        ) {
            return;
        }

        const productId = $(this).data("id");
        window.location.href = `/products/${productId}`;
    });

    applyFilters();
});

// ----------------------------
// 🔍 FETCH & RENDER PRODUCTS
// ----------------------------
async function applyFilters() {
    try {
        const grid = $("#productGrid");
        const loader = $("#productLoading");

        // 🔹 Hiện loader – ẩn sản phẩm cũ
        grid.hide();
        loader.show();
        const query = new URLSearchParams({
            category: state.category,
            sort: state.sort,
            minPrice: state.minPrice,
            maxPrice: state.maxPrice,
            keyword: state.keyword,
            page: state.currentPage,
        });

        const res = await fetch(`/api/products?${query.toString()}`);
        console.log(`/api/products?${query.toString()}`);
        const { productsFilter, totalPages, currentPage } = await res.json();
        setTimeout(() => {
            renderProducts(productsFilter);
            renderPagination(totalPages, currentPage);

            loader.hide();
            grid.show();
        }, 200);
    } catch (err) {
        console.error("❌ Lỗi khi lấy sản phẩm:", err);
    }
}

const getCateforyAPI = async () => {
    $.ajax({
        url: "api/categories",
        method: "get",
        success: function (res) {
            const categories = res.categories;
            renderCategories(categories);
        },
        error: function (err) {
            console.error("Lỗi:", err);
        },
    });
};

// ----------------------------
// 🧱 RENDER PRODUCT CARDS
// ----------------------------
function renderCategories(categories) {
    let html = `<label class="filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        value=""
                                        checked
                                    />
                                    <span class="filter-label"
                                        >Tất cả sản phẩm</span
                                    >
                                </label>`;
    categories.map((c) => {
        html += `<label class="filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="${c.name}"
                                    />
                                    <span class="filter-label"
                                        >${c.name}</span
                                    >
                                </label>`;
    });
    $(".filter-options").html(html);
}

function renderProducts(productsFilter) {
    const favoriteList = JSON.parse(
        localStorage.getItem("favoriteList") || "[]"
    );
    const container = $("#productGrid");
    if (!container.length) return;
    console.log(productsFilter.length);
    if (productsFilter.length == 0) {
        container.html(`<p class="no_product">
                            Không có sản phẩm đủ điều kiện lọc
                        </p>`);
        return;
    }
    const html = productsFilter
        .map((p) => {
            const isFavorite = favoriteList.some((fav) => fav === p.product_id);
            const sizes = p.price_product
                .map((pp, i) => {
                    const flashSaleItem = products.find(
                        (f) =>
                            f.product_id === p.product_id &&
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
                <button class="pd-size-btn ${i === 0 ? "active" : ""}" 
                        data-price="${displayPrice}" 
                        data-oldprice="${oldPrice || ""}"
                        onclick="pdSelectSize(this);event.stopPropagation();">
                    ${pp.size}
                </button>`;
                })
                .join("");

            return `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mt-4">
                    <div class="pd-product-card pd-product-card-compact" data-id="${
                        p.product_id
                    }">
                        <div class="pd-product-image-wrapper">
                            <img src="/images/products/${p.images}" alt="${
                p.name
            }" class="pd-product-image">
                            <button class="pd-favorite-btn ${
                                isFavorite ? "active" : ""
                            }" onclick="pdToggleFavorite(this)">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>

                        <div class="pd-product-content">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div class="pd-product-category">${
                                    p.categories.name
                                }</div>
                                <div class="pd-product-rating">
                                    ${pdGenerateStars(p.rating)}
                                    <span class="pd-rating-count">(${
                                        p.reviews
                                    })</span>
                                </div>
                            </div>

                            <h3 class="pd-product-name">${p.name}</h3>

                            <div class="pd-size-selector mb-3">
                                <div class="d-flex align-items-center gap-2 justify-content-between">
                                    <label class="pd-size-label mb-0">Chọn kích cỡ:</label>
                                    <div class="pd-size-options">${sizes}</div>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="pd-quantity-selector">
                                    <label class="pd-quantity-label">Số lượng:</label>
                                    <div class="pd-quantity-controls">
                                        <button class="pd-quantity-btn" onclick="pdChangeQuantity(this, -1);event.stopPropagation();">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="number" class="pd-quantity-input" value="1" min="1" max="99" readonly>
                                        <button class="pd-quantity-btn" onclick="pdChangeQuantity(this, 1);event.stopPropagation();">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="pd-product-price"></div>
                            </div>

                            <button class="pd-btn-add-to-cart" data-productid="${
                                p.product_id
                            }" >
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>`;
        })
        .join("");

    container.html(html);
    requestAnimationFrame(() => {
        document
            .querySelectorAll(".pd-product-card")
            .forEach(pdInitPriceDisplay);
    });
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
        ? `<p class="pd-old-price" id="price-old" style="margin-bottom:0px;">${formatVND(
              oldPrice
          )}</p>
           <p class="pd-sale-price text-danger " style="margin-bottom:2px;">${formatVND(
               price
           )}</p>`
        : `<span id="price-old">${formatVND(price)}</span>`;
    if (oldPrice) {
        card.querySelector(".pd-product-image-wrapper").insertAdjacentHTML(
            "beforeend",
            `<div class="flashsale-badge"><span>Flash<br/> Sale</span></div>`
        );
    }
}
let favoriteIds = JSON.parse(localStorage.getItem("favoriteList")) || [];

async function pdToggleFavorite(button) {
    console.log("Toggling favorite for button:", button);
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

// ----------------------------
// ⭐ UI HELPERS
// ----------------------------
function pdGenerateStars(rating) {
    return Array(5)
        .fill(0)
        .map(() => `<i class="fas fa-star"></i>`)
        .join("");
}

function pdSelectSize(button) {
    const sizeBtns = button
        .closest(".pd-size-options")
        .querySelectorAll(".pd-size-btn");
    sizeBtns.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const parent = button.closest(".pd-product-card");
    pdInitPriceDisplay(parent);
}

function pdChangeQuantity(button, delta) {
    const input = button.parentElement.querySelector(".pd-quantity-input");
    let value = parseInt(input.value) || 1;
    value = Math.max(1, Math.min(99, value + delta));
    input.value = value;
}

// ----------------------------
// 📄 PAGINATION
// ----------------------------
function renderPagination(totalPages, currentPage) {
    const container = $(".pagination");
    if (!container.length) return;

    if (totalPages <= 1) return container.empty();

    let html = `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" data-page="${currentPage - 1}">&laquo;</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" data-page="${i}">${i}</a>
            </li>`;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" data-page="${currentPage + 1}">&raquo;</a>
        </li>
    `;

    container.html(html);
}

window.addEventListener("scroll", function () {
    const header = document.querySelector(".header-filter");
    if (window.scrollY > 180) {
        // cuộn xuống 50px thì đổi nền
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
