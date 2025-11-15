function formatVND(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

function renderProducts(products) {
      const favoriteList = JSON.parse(localStorage.getItem("favoriteList") || "[]");
    const container = $("#productGrid");
    if (!container.length) return;
    console.log(products.length);
    if (products.length == 0) {
        container.html(`<p class="no_product">
                            Không có sản phẩm đủ điều kiện lọc
                        </p>`);
        return;
    }
    const html = products
        .map((p) => {
               const isFavorite = favoriteList.some(fav => fav === p.product_id);
            const sizes = p.price_product
                .map(
                    (pp, i) => `
                <button class="pd-size-btn ${i === 0 ? "active" : ""}" 
                        data-price="${pp.price}" 
                        onclick="pdSelectSize(this);event.stopPropagation();">
                    ${pp.size}
                </button>`
                )
                .join("");

            return `
                <div class="col-12 col-sm-6 col-md-4  mt-4" style="width:20%;">
                    <div class="pd-product-card pd-product-card-compact" data-id="${
                        p.product_id
                    }">
                        <div class="pd-product-image-wrapper">
                            <img src="/images/products/${p.images}" alt="${
                p.name
            }" class="pd-product-image">
                            <button class="pd-favorite-btn ${isFavorite ? "active" : ""}" onclick="pdToggleFavorite(this)">
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
                                <div class="pd-product-price">${formatVND(
                                    p.price_product[0].price
                                )}</div>
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
}
async function pdToggleFavorite(button) {
    console.log("Toggling favorite for button:", button);
    button.classList.toggle("active");
    const productId = parseInt(button.closest(".pd-product-card").getAttribute("data-id"));
    const isActive = button.classList.contains("active");
     try{
    if (isActive) {
        // Gọi API thêm 
            const res= await fetch("/api/favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: productId,
            }),
        });
        if (!res.ok) throw new Error("Thêm yêu thích thất bại");
        const data= await res.json();
        if (!favoriteIds.includes(productId)) {
                favoriteIds.push(productId);
                localStorage.setItem("favoriteList", JSON.stringify(favoriteIds));
                 $("#favoriteBadge").text(favoriteIds.length);
        }

    } else {
        //xóa ui card
        
 const card = button.closest(".col-12, .col-sm-6, .col-md-4, .col-lg-3");

    // Hiệu ứng ẩn dần & co nhỏ
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease, margin 0.3s ease, height 0.3s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(0.8)";
    card.style.margin = "0";
    card.style.height = "0";
    card.style.overflow = "hidden";

    // Sau 300ms mới xóa khỏi DOM
    setTimeout(() => {
        card.remove();
    }, 300);
          const res = await fetch(`/api/favorite`, {
                method: "DELETE", 
                 headers: {
                "Content-Type": "application/json",
            },
                body: JSON.stringify({
                productId: productId,
            })
            });
            if (!res.ok) throw new Error("Xóa yêu thích thất bại");
            favoriteIds = favoriteIds.filter(id => id !== productId);
            console.log("Updated favoriteIds:", favoriteIds);
            localStorage.setItem("favoriteList", JSON.stringify(favoriteIds));
            $("#favoriteBadge").text(favoriteIds.length);
    }}catch(err){
         console.error("Lỗi khi cập nhật yêu thích:", err);
         button.classList.toggle("active");
    }
    
    // Add animation
    button.style.transform = "scale(1.2)";
    setTimeout(() => {
        button.style.transform = "";
    }, 200);
}
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

    const card = button.closest(".pd-product-card");
    const priceEl = card.querySelector(".pd-product-price");
    priceEl.textContent = formatVND(Number(button.dataset.price));
}

function pdChangeQuantity(button, delta) {
    const input = button.parentElement.querySelector(".pd-quantity-input");
    let value = parseInt(input.value) || 1;
    value = Math.max(1, Math.min(99, value + delta));
    input.value = value;
}


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

$(document).ready(function () {
    // Initial fetch
    let currentPage = 1;
    const pageSize = 8;
    function fetchFavorites(page) {
        $.ajax({
            url: `/api/favorite`,
            method: "GET",
            data: {
                page: page,
                pageSize: pageSize,
            },
            success: function (response) {
                console.log("Favorites fetched:", response);
                renderProducts(response.favorites);
                renderPagination(response.totalPages, page);
            },
            error: function (err) {
                console.error("Error fetching favorites:", err);
            }

        });
    }
    fetchFavorites(currentPage);
     $(".pagination").on("click", ".page-link", function (e) {
        e.preventDefault();
        const page = parseInt($(this).data("page"));
        if (page && page !== state.currentPage) {
            state.currentPage = page;
            fetchFavorites(state.currentPage);
        }
    });
})