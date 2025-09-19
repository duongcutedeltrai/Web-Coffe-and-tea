
// /admin/js/products.js -- Replace entire file with this
(() => {
    let currentCategoryId = null;
    let currentPage = 1;
    let pageSize = 9;
    let tuiPager = null;

    const loadingHTML = `
    <div class="loading-wrapper">
      <dotlottie-wc
        src="https://lottie.host/8951b1f7-5c2a-45b7-b472-9e33dc0aee10/1kSyttEVJO.lottie"
        style="width: 100px; height: 100px; display: block; margin: auto;"
        speed="1" autoplay loop></dotlottie-wc>
      <p style="text-align:center; font-weight:400;">Đang tải dữ liệu...</p>
    </div>
  `;

    $(document).ready(() => {
        setupEventListeners();
        initScrollNavigation();
        fetchProducts(1, null);
    });

    // Unified fetch function
    function fetchProducts(page = 1, categoryId = null) {
        currentPage = page;
        currentCategoryId = categoryId;
        $(".loading-wrapper").html(loadingHTML);

        const url = categoryId
            ? `/api/admin/categories/${categoryId}/products?page=${page}`
            : `/api/admin/products?page=${page}`;

        $.ajax({
            url,
            method: "GET",
            dataType: "json",
            success(data) {
                $(".loading-wrapper").html("");
                pageSize = Number(data.pageSize) || pageSize;

                renderArea(data);
                initTuiPagination(
                    Number(data.totalItems || 0),
                    pageSize,
                    Number(data.currentPage || page)
                );
            },
            error(err) {
                console.error("Fetch error:", err);
                $(".loading-wrapper").html("");
                $(".menu-grid").html(
                    `<p class="empty">Không thể tải dữ liệu.</p>`
                );
            },
        });
    }

    // Render main area: categories (only when not in category view) + products
    function renderArea(data = {}) {
        $(".menu-grid").html(`
      <button class="menu-card add-new-card show popup_update--btn">
        <span class="add-icon"><i class="fas fa-plus"></i></span>
        <p>Add new dish</p>
      </button>
    `);

        if (!currentCategoryId && Array.isArray(data.categories)) {
            $(".explore__menu--list").empty();
            data.categories.forEach((c) => {
                const id = c.id ?? c.category_id ?? c.categoryId ?? "";
                const item = document.createElement("div");
                item.className = "category-item";
                item.dataset.category = id;
                item.innerHTML = `
          <div class="category-image">
            <img src="/images/categories/${c.name}.jpg" alt="${c.name}">
          </div>
          <span class="menu__item--name">${c.name}</span>
        `;
                $(".explore__menu--list").append(item);
            });
            checkScrollButtons();
            const $select = $(".form-select"); // select trong form
            if ($select.length) {
                $select.empty(); // clear cũ
                $select.append(`<option value="">-- Chọn danh mục --</option>`);
                data.categories.forEach((c) => {
                    const id = c.category_id ?? c.categoryId ?? "";
                    $select.append(`<option value="${id}">${c.name}</option>`);
                });
            }
        }

        if (!Array.isArray(data.products) || data.products.length === 0) {
            $(".menu-grid").append(`<p class="empty">Không có sản phẩm.</p>`);
        } else {
            renderProducts(data.products);
        }
    }

    function renderProducts(products) {
        $(".menu-grid").find(".menu-card:not(.add-new-card)").remove(); // keep add-new-card
        products.forEach((product) => {
            let sizeOptions = "";
            if (Array.isArray(product.price_product)) {
                product.price_product.forEach((pp) => {
                    sizeOptions += `
            <button class="size-btn" data-size="${pp.size}">
              <span class="product_size">${pp.size}</span>
              <span class="product_price">${pp.price}</span>
            </button>
          `;
                });
            }
            const imgName = product.images ?? product.image ?? "";
            const card = $(`
        <div class="menu-card">
          <div class="menu-image"><img src="/images/products/${imgName}" alt="${product.name}" /></div>
          <div class="menu-info">
            <div class="menu__info-header">
              <div class="rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
              <div class="type">Trà sữa</div>
            </div>
            <h3>${product.name}</h3>
            <div class="size-options">${sizeOptions}</div>
          </div>
          <div class="product__edit"><p>Chỉnh sửa sản phẩm</p></div>
        </div>
      `);
            $(".menu-grid").append(card);
        });

        // IntersectionObserver for reveal animation
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document
            .querySelectorAll(".menu-card")
            .forEach((el) => observer.observe(el));
    }

    // tui-pagination init/update
    function initTuiPagination(totalItems, itemsPerPage, current) {
        const container = document.getElementById("pagination-container");
        if (!container) return;

        // destroy old
        if (tuiPager) {
            try {
                tuiPager.destroy();
            } catch (e) {
                /* ignore */
            }
            tuiPager = null;
        }

        tuiPager = new tui.Pagination(container, {
            totalItems,
            itemsPerPage,
            visiblePages: 5,
            page: current,
        });

        tuiPager.on("afterMove", (evt) => {
            const page = evt.page;
            fetchProducts(page, currentCategoryId);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Event listeners (delegation)
    function setupEventListeners() {
        $(document).on("click", ".category-image img", function () {
            $(".category-image img").removeClass("active");
            $(this).addClass("active");

            const categoryName = $(this).attr("alt");
            const categoryId = $(this)
                .closest(".category-item")
                .data("category");
            $(".menu-title h2").text(`${categoryName}`);
            fetchProducts(1, categoryId);
        });

        $(document).on("click", ".menu-card .size-btn", function (e) {
            e.stopPropagation();
            const $card = $(this).closest(".menu-info");
            $card.find(".size-btn").removeClass("active");
            $(this).addClass("active");
        });

        $(document).on("mouseenter", ".menu-card", function () {
            $(this).find(".product__edit").addClass("editShow");
        });
        $(document).on("mouseleave", ".menu-card", function () {
            $(this).find(".product__edit").removeClass("editShow");
        });
    }

    // Scroll nav helpers (kept same as your original)
    const $categoryNav = $(".explore__menu--list");
    const $scrollLeft = $("#scrollLeft");
    const $scrollRight = $("#scrollRight");
    const $categoryNavContainer = $(".category-nav-container");

    function initScrollNavigation() {
        checkScrollButtons();
        $scrollLeft.on("click", () =>
            $categoryNav.animate(
                { scrollLeft: $categoryNav.scrollLeft() - 250 },
                400
            )
        );
        $scrollRight.on("click", () =>
            $categoryNav.animate(
                { scrollLeft: $categoryNav.scrollLeft() + 250 },
                400
            )
        );
        $categoryNav.on("scroll", checkScrollButtons);
        $(window).on("resize", checkScrollButtons);
    }

    function checkScrollButtons() {
        const container = $categoryNav.get(0);
        if (!container) return;
        const isScrollable = container.scrollWidth > container.clientWidth;
        const isAtStart = container.scrollLeft <= 0;
        const isAtEnd =
            container.scrollLeft >=
            container.scrollWidth - container.clientWidth - 1;
        if (isScrollable) {
            $scrollLeft.toggleClass("show", !isAtStart);
            $scrollRight.toggleClass("show", !isAtEnd);
            $categoryNavContainer.addClass("show-fade");
        } else {
            $scrollLeft.removeClass("show");
            $scrollRight.removeClass("show");
            $categoryNavContainer.removeClass("show-fade");
        }
    }

    // expose for debug/inline calls if needed
    window.fetchProducts = fetchProducts;
})();
