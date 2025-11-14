// /admin/js/products.js -- Replace entire file with this
(() => {
  let currentCategoryId = null;
  let currentKeyword = "";
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
    fetchProducts(1);
  });

  // Unified fetch function
  function fetchProducts(page = 1, categoryId = null, keyword = "") {
    currentPage = page;
    currentKeyword = keyword;
    currentCategoryId = categoryId;
    $(".loading-wrapper").html(loadingHTML);
    let url = "";
    if (keyword && keyword.trim() !== "" && categoryId) {
      url = `/api/admin/categories/${categoryId}/products/search?q=${encodeURIComponent(
        keyword
      )}&page=${page}`;
    } else if (keyword && keyword.trim() !== "") {
      // ✅ Chỉ tìm kiếm theo tên
      url = `/api/admin/products/search?q=${encodeURIComponent(
        keyword
      )}&page=${page}`;
    } else if (categoryId) {
      // ✅ Chỉ lọc theo category
      url = `/api/admin/categories/${categoryId}/products?page=${page}`;
    } else {
      // ✅ Mặc định: tất cả sản phẩm
      url = `/api/admin/products?page=${page}`;
    }

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

  ////api xem chi tiết sản phẩm
  $(document).on("click", ".menu-card", function (e) {
    const productId = $(this).data("id");
    if (!productId) {
      return;
    }
    if ($(e.target).closest(".product__edit").length > 0) {
      // mở popup chỉnh sửa
      sessionStorage.setItem("openPopup", "true"); // hoặc tùy code popup của bạn
    }
    window.location.href = `products/${productId}`;
  });

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
        const id = c.category_id ?? c.categoryId ?? "";
        const item = document.createElement("div");
        item.className = "category-item";
        item.dataset.category = id;
        item.innerHTML = `
          <div class="category-image">
            <img src="/images/categories/${c.images}" alt="${c.name}">
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
              <span class="product_price">${formatVND(pp.price)}</span>
            </button>
          `;
        });
      }
      const imgName = product.images ?? product.image ?? "";
      const card = $(`
        <div class="menu-card" data-id=${product.product_id}>
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
    initSizeOptionsForCards();
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
  function initSizeOptionsForCards() {
    const products = document.querySelectorAll(".menu-card");

    products.forEach((product) => {
      const sizeBtns = product.querySelectorAll(".size-btn");
      const priceSize = product.querySelector(".product_size");

      if (
        sizeBtns.length === 1 &&
        sizeBtns[0].dataset.size.toUpperCase() === "DEFAULT"
      ) {
        // Nếu chỉ có 1 size và là DEFAULT → ẩn price-size
        sizeBtns[0].classList.add("default");
        priceSize.style.display = "none";
      }
    });
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
      fetchProducts(page, currentCategoryId, currentKeyword);
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
      fetchProducts(1, categoryId, currentKeyword);
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
  function formatVND(amount) {
    return Number(amount).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  // expose for debug/inline calls if needed
  window.fetchProducts = fetchProducts;
  let typingTimer;
  const typingDelay = 300;
  /////tìm kiếm theo tên sản phẩm
  $("#search").on("keyup", function () {
    const keyword = $(this).val().trim();
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      // gọi fetchProducts, giữ page = 1 và currentCategoryId nếu có
      fetchProducts(1, currentCategoryId, keyword);
    }, typingDelay);
  });

  ///reset về ban đầu
  // Reset filter về mặc định
  $(document).on("click", ".reset-filter", function () {
    currentCategoryId = null;
    currentKeyword = "";
    currentPage = 1;

    // reset UI
    $(".menu-title h2").text("Tất cả sản phẩm");
    $(".category-image img").removeClass("active");
    $("#search").val("");

    // gọi lại fetchProducts về mặc định
    fetchProducts(1);
  });
})();