// Sample promotion data
let promotions = [
  {
    id: 1,
    code: "SUMMER2024",
    description: "Giảm giá mùa hè cho tất cả đồ uống",
    start_date: "2024-06-01T00:00",
    end_date: "2024-08-31T23:59",
    discount_percent: 20,
    min_order_amount: 100000,
    max_usage_count: 500,
    current_usage: 234,
    is_for_new_user: false,
    applicable_membership: ["bronze", "silver", "gold", "platinum"],
    applicable_products: "all", // Added applicable_products field
  },
  {
    id: 2,
    code: "NEWUSER50",
    description: "Ưu đãi đặc biệt cho khách hàng mới",
    start_date: "2024-01-01T00:00",
    end_date: "2024-12-31T23:59",
    discount_percent: 50,
    min_order_amount: 50000,
    max_usage_count: 1000,
    current_usage: 456,
    is_for_new_user: true,
    applicable_membership: ["bronze"],
    applicable_products: "all",
  },
  {
    id: 3,
    code: "VIP30",
    description: "Ưu đãi dành riêng cho thành viên VIP",
    start_date: "2024-01-01T00:00",
    end_date: "2024-12-31T23:59",
    discount_percent: 30,
    min_order_amount: 200000,
    max_usage_count: 200,
    current_usage: 89,
    is_for_new_user: false,
    applicable_membership: ["gold", "platinum"],
    applicable_products: [1, 2, 3, 4, 5, 6], // Specific coffee products
  },
  {
    id: 4,
    code: "FLASH15",
    description: "Flash sale cuối tuần - Giảm ngay 15%",
    start_date: "2024-12-20T00:00",
    end_date: "2024-12-22T23:59",
    discount_percent: 15,
    min_order_amount: 0,
    max_usage_count: 300,
    current_usage: 178,
    is_for_new_user: false,
    applicable_membership: ["bronze", "silver", "gold", "platinum"],
    applicable_products: "all",
  },
];

const productCatalog = [
  { id: 1, name: "Espresso", price: 45000, category: "coffee" },
  { id: 2, name: "Americano", price: 50000, category: "coffee" },
  { id: 3, name: "Cappuccino", price: 55000, category: "coffee" },
  { id: 4, name: "Latte", price: 55000, category: "coffee" },
  { id: 5, name: "Mocha", price: 60000, category: "coffee" },
  { id: 6, name: "Caramel Macchiato", price: 65000, category: "coffee" },
  { id: 7, name: "Trà xanh", price: 40000, category: "tea" },
  { id: 8, name: "Trà đào", price: 45000, category: "tea" },
  { id: 9, name: "Trà sữa", price: 50000, category: "tea" },
  { id: 10, name: "Trà chanh", price: 40000, category: "tea" },
  { id: 11, name: "Bánh croissant", price: 35000, category: "pastry" },
  { id: 12, name: "Bánh muffin", price: 30000, category: "pastry" },
  { id: 13, name: "Bánh tiramisu", price: 45000, category: "pastry" },
  { id: 14, name: "Bánh cheesecake", price: 50000, category: "pastry" },
  { id: 15, name: "Sandwich", price: 55000, category: "food" },
  { id: 16, name: "Salad", price: 60000, category: "food" },
];

let selectedProducts = [];
let currentProductCategory = "all";

let currentEditingId = null;

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get promotion status
function getPromotionStatus(promotion) {
  const now = new Date();
  const start = new Date(promotion.start_date);
  const end = new Date(promotion.end_date);

  if (now < start) return "upcoming";
  if (now > end) return "expired";
  if (
    promotion.max_usage_count &&
    promotion.current_usage >= promotion.max_usage_count
  )
    return "expired";
  return "active";
}

// Get status text in Vietnamese
function getStatusText(status) {
  const statusMap = {
    active: "Đang hoạt động",
    upcoming: "Sắp diễn ra",
    expired: "Đã hết hạn",
  };
  return statusMap[status] || status;
}

// Get membership text in Vietnamese
function getMembershipText(membership) {
  const membershipMap = {
    bronze: "Đồng",
    silver: "Bạc",
    gold: "Vàng",
    platinum: "Bạch kim",
  };
  return membershipMap[membership] || membership;
}

function toggleProductSelection() {
  const specificRadio = document.querySelector(
    'input[name="productScope"][value="specific"]'
  );
  const container = document.getElementById("productSelectionContainer");

  if (specificRadio.checked) {
    container.style.display = "block";
    renderProductSelection();
  } else {
    container.style.display = "none";
    selectedProducts = [];
  }
}

function renderProductSelection() {
  // Render category buttons (orders-style)
  const categoriesContainer = document.querySelector(".product-categories");
  if (categoriesContainer) {
    // derive unique categories from productCatalog
    const cats = Array.from(
      new Set(productCatalog.map((p) => p.category || "other"))
    );
    const allButton = `
      <button class="category-btn ${
        currentProductCategory === "all" ? "active" : ""
      }" data-category="all" onclick="filterProductsByCategory('all')">Tất cả</button>
    `;
    const catButtons = cats
      .map(
        (c) => `
          <button class="category-btn ${
            currentProductCategory === c ? "active" : ""
          }" data-category="${c}" onclick="filterProductsByCategory('${c}')">${getCategoryText(
          c
        )}</button>
        `
      )
      .join("");
    categoriesContainer.innerHTML = allButton + catButtons;
  }

  // Render products grid similar to orders
  const grid = document.getElementById("productSelectionGrid");
  const searchTerm =
    document.getElementById("productSearchInput")?.value.toLowerCase() || "";

  const filtered = productCatalog.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      currentProductCategory === "all" ||
      product.category === currentProductCategory;
    return matchesSearch && matchesCategory;
  });

  if (!grid) return;
  if (filtered.length === 0) {
    grid.innerHTML =
      '<p style="text-align: center; color: #6c757d; padding: 2rem;">Không tìm thấy sản phẩm</p>';
    updateSelectedProductsSummary();
    return;
  }

  grid.innerHTML = filtered
    .map((product) => {
      const checked = selectedProducts.includes(product.id) ? "checked" : "";
      return `
        <div class="product-card" data-product-id="${
          product.id
        }" onclick="toggleProductSelection_item(${product.id})">
          <div class="product-card-overlay"></div>
          <div class="product-card-content">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <input type="checkbox" id="product-${
                product.id
              }" ${checked} onclick="event.stopPropagation(); toggleProductSelection_item(${
        product.id
      });">
              <div class="product-card-name">${product.name}</div>
            </div>
            <div class="product-card-category">${getCategoryText(
              product.category
            )}</div>
            <div class="product-card-price">${formatCurrency(
              product.price
            )}</div>
          </div>
        </div>
      `;
    })
    .join("");

  updateSelectedProductsSummary();
}

function toggleProductSelection_item(productId) {
  const checkbox = document.getElementById(`product-${productId}`);
  checkbox.checked = !checkbox.checked;

  if (checkbox.checked) {
    if (!selectedProducts.includes(productId)) {
      selectedProducts.push(productId);
    }
  } else {
    selectedProducts = selectedProducts.filter((id) => id !== productId);
  }

  renderProductSelection();
}

function updateSelectedProductsSummary() {
  const summary = document.getElementById("selectedProductsSummary");
  summary.innerHTML = `<span>Đã chọn: <strong>${selectedProducts.length}</strong> sản phẩm</span>`;
}

function filterProductsByCategory(category) {
  currentProductCategory = category;

  document
    .querySelectorAll(".product-categories .category-btn")
    .forEach((btn) => {
      btn.classList.remove("active");
    });
  const selector = document.querySelector(
    `.product-categories .category-btn[data-category="${category}"]`
  );
  if (selector) selector.classList.add("active");

  renderProductSelection();
}

function getCategoryText(category) {
  const categoryMap = {
    coffee: "Cà phê",
    tea: "Trà",
    pastry: "Bánh ngọt",
    food: "Đồ ăn",
  };
  return categoryMap[category] || category;
}

function getProductNames(productIds) {
  if (productIds === "all") return "Tất cả sản phẩm";
  if (!Array.isArray(productIds) || productIds.length === 0)
    return "Tất cả sản phẩm";

  const names = productIds.map((id) => {
    const product = productCatalog.find((p) => p.id === id);
    return product ? product.name : "";
  });

  if (names.length > 3) {
    return `${names.slice(0, 3).join(", ")} và ${
      names.length - 3
    } sản phẩm khác`;
  }

  return names.join(", ");
}

// Render promotions
function renderPromotions() {
  const container = document.getElementById("promotionsContainer");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;
  const membershipFilter = document.getElementById("membershipFilter").value;

  const filtered = promotions.filter((promotion) => {
    const matchesSearch =
      promotion.code.toLowerCase().includes(searchTerm) ||
      promotion.description.toLowerCase().includes(searchTerm);

    const status = getPromotionStatus(promotion);
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    const matchesMembership =
      membershipFilter === "all" ||
      promotion.applicable_membership.includes(membershipFilter);

    return matchesSearch && matchesStatus && matchesMembership;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 16px;">🎁</div>
                <div style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">Không tìm thấy khuyến mãi</div>
                <div style="font-size: 14px;">Thử thay đổi bộ lọc hoặc tạo khuyến mãi mới</div>
            </div>
        `;
    return;
  }

  container.innerHTML = filtered
    .map((promotion) => {
      const status = getPromotionStatus(promotion);
      const membershipBadges = promotion.applicable_membership
        .map((m) => `<span class="badge">${getMembershipText(m)}</span>`)
        .join("");

      const applicableProductsHtml =
        promotion.applicable_products !== "all"
          ? `
                <div class="promotion-applicable-products">
                    <div class="label">Sản phẩm áp dụng:</div>
                    <div class="products-list">${getProductNames(
                      promotion.applicable_products
                    )}</div>
                </div>
            `
          : "";

      return `
            <div class="promotion-card" onclick="viewPromotionDetails(${
              promotion.id
            })">
                <div class="promotion-header">
                    <div class="promotion-code">${promotion.code}</div>
                    <span class="promotion-status status-${status}">${getStatusText(
        status
      )}</span>
                </div>
                <div class="promotion-description">${
                  promotion.description
                }</div>
                <div class="promotion-details">
                    <div class="detail-item">
                        <span class="detail-label">Giảm giá</span>
                        <span class="detail-value">${
                          promotion.discount_percent
                        }%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Đơn tối thiểu</span>
                        <span class="detail-value">${
                          promotion.min_order_amount
                            ? formatCurrency(promotion.min_order_amount)
                            : "Không"
                        }</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Đã sử dụng</span>
                        <span class="detail-value">${promotion.current_usage}/${
        promotion.max_usage_count || "∞"
      }</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Kết thúc</span>
                        <span class="detail-value">${formatDate(
                          promotion.end_date
                        )}</span>
                    </div>
                </div>
                <div class="promotion-badges">
                    ${
                      promotion.is_for_new_user
                        ? '<span class="badge badge-new-user">Khách hàng mới</span>'
                        : ""
                    }
                    ${membershipBadges}
                </div>
                ${applicableProductsHtml}
                <div class="promotion-actions" onclick="event.stopPropagation()">
                    <button class="btn-edit" onclick="editPromotion(${
                      promotion.id
                    })">✏️ Sửa</button>
                    <button class="btn-delete" onclick="deletePromotion(${
                      promotion.id
                    })">🗑️ Xóa</button>
                </div>
            </div>
        `;
    })
    .join("");
}

// Open create promotion drawer
function openCreatePromotionDrawer() {
  currentEditingId = null;
  selectedProducts = []; // Reset selected products
  document.getElementById("drawerTitle").textContent = "Tạo khuyến mãi mới";
  document.getElementById("promotionForm").reset();
  document.getElementById("promotionId").value = "";
  document.getElementById("currentUsage").value = "0";
  document.getElementById("productSelectionContainer").style.display = "none"; // Hide product selection by default

  document.getElementById("promotionDrawerOverlay").classList.add("active");
  document.getElementById("promotionDrawer").classList.add("active");
}

// Close promotion drawer
function closePromotionDrawer() {
  document.getElementById("promotionDrawerOverlay").classList.remove("active");
  document.getElementById("promotionDrawer").classList.remove("active");
}

// Edit promotion
function editPromotion(id) {
  const promotion = promotions.find((p) => p.id === id);
  if (!promotion) return;

  currentEditingId = id;
  document.getElementById("drawerTitle").textContent = "Chỉnh sửa khuyến mãi";
  document.getElementById("promotionId").value = promotion.id;
  document.getElementById("promotionCode").value = promotion.code;
  document.getElementById("promotionDescription").value = promotion.description;
  document.getElementById("startDate").value = promotion.start_date;
  document.getElementById("endDate").value = promotion.end_date;
  document.getElementById("discountPercent").value = promotion.discount_percent;
  document.getElementById("minOrderAmount").value =
    promotion.min_order_amount || "";
  document.getElementById("maxUsageCount").value =
    promotion.max_usage_count || "";
  document.getElementById("currentUsage").value = promotion.current_usage;
  document.getElementById("isForNewUser").checked = promotion.is_for_new_user;

  // Set selected memberships
  const membershipSelect = document.getElementById("applicableMembership");
  Array.from(membershipSelect.options).forEach((option) => {
    option.selected = promotion.applicable_membership.includes(option.value);
  });

  if (promotion.applicable_products === "all") {
    document.querySelector(
      'input[name="productScope"][value="all"]'
    ).checked = true;
    selectedProducts = [];
    document.getElementById("productSelectionContainer").style.display = "none";
  } else {
    document.querySelector(
      'input[name="productScope"][value="specific"]'
    ).checked = true;
    selectedProducts = Array.isArray(promotion.applicable_products)
      ? [...promotion.applicable_products]
      : [];
    document.getElementById("productSelectionContainer").style.display =
      "block";
    renderProductSelection();
  }

  document.getElementById("promotionDrawerOverlay").classList.add("active");
  document.getElementById("promotionDrawer").classList.add("active");
}

// Delete promotion
function deletePromotion(id) {
  if (confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
    promotions = promotions.filter((p) => p.id !== id);
    renderPromotions();
  }
}

// View promotion details
function viewPromotionDetails(id) {
  const promotion = promotions.find((p) => p.id === id);
  if (!promotion) return;

  const status = getPromotionStatus(promotion);
  const membershipText = promotion.applicable_membership
    .map((m) => getMembershipText(m))
    .join(", ");

  const content = `
        <div class="detail-section">
            <h3>Thông tin cơ bản</h3>
            <div class="detail-grid">
                <div class="detail-row">
                    <label>Mã khuyến mãi</label>
                    <span style="color: #b22830; font-family: 'Courier New', monospace; font-size: 18px;">${
                      promotion.code
                    }</span>
                </div>
                <div class="detail-row">
                    <label>Trạng thái</label>
                    <span class="promotion-status status-${status}">${getStatusText(
    status
  )}</span>
                </div>
            </div>
            <div class="detail-row" style="margin-top: 12px;">
                <label>Mô tả</label>
                <span>${promotion.description}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>Thời gian áp dụng</h3>
            <div class="detail-grid">
                <div class="detail-row">
                    <label>Ngày bắt đầu</label>
                    <span>${formatDate(promotion.start_date)}</span>
                </div>
                <div class="detail-row">
                    <label>Ngày kết thúc</label>
                    <span>${formatDate(promotion.end_date)}</span>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3>Điều kiện áp dụng</h3>
            <div class="detail-grid">
                <div class="detail-row">
                    <label>Phần trăm giảm giá</label>
                    <span style="color: #b22830; font-size: 20px; font-weight: 600;">${
                      promotion.discount_percent
                    }%</span>
                </div>
                <div class="detail-row">
                    <label>Giá trị đơn hàng tối thiểu</label>
                    <span>${
                      promotion.min_order_amount
                        ? formatCurrency(promotion.min_order_amount)
                        : "Không yêu cầu"
                    }</span>
                </div>
                <div class="detail-row">
                    <label>Số lần sử dụng tối đa</label>
                    <span>${
                      promotion.max_usage_count || "Không giới hạn"
                    }</span>
                </div>
                <div class="detail-row">
                    <label>Đã sử dụng</label>
                    <span>${promotion.current_usage} lần</span>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3>Đối tượng áp dụng</h3>
            <div class="detail-grid">
                <div class="detail-row">
                    <label>Khách hàng mới</label>
                    <span>${
                      promotion.is_for_new_user ? "✅ Có" : "❌ Không"
                    }</span>
                </div>
                <div class="detail-row">
                    <label>Hạng thành viên</label>
                    <span>${membershipText}</span>
                </div>
            </div>
            <div class="detail-row" style="margin-top: 12px;">
                <label>Sản phẩm áp dụng</label>
                <span>${getProductNames(promotion.applicable_products)}</span>
            </div>
        </div>
    `;

  document.getElementById("promotionDetailsContent").innerHTML = content;
  document.getElementById("promotionDetailsOverlay").classList.add("active");
}

// Close promotion details
function closePromotionDetails() {
  document.getElementById("promotionDetailsOverlay").classList.remove("active");
}

// Handle form submission
document.getElementById("promotionForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const selectedMemberships = Array.from(
    document.getElementById("applicableMembership").selectedOptions
  ).map((option) => option.value);

  const productScope = document.querySelector(
    'input[name="productScope"]:checked'
  ).value;
  const applicableProducts =
    productScope === "all"
      ? "all"
      : selectedProducts.length > 0
      ? selectedProducts
      : "all";

  const promotionData = {
    code: document.getElementById("promotionCode").value,
    description: document.getElementById("promotionDescription").value,
    start_date: document.getElementById("startDate").value,
    end_date: document.getElementById("endDate").value,
    discount_percent: Number.parseInt(
      document.getElementById("discountPercent").value
    ),
    min_order_amount:
      Number.parseInt(document.getElementById("minOrderAmount").value) || 0,
    max_usage_count:
      Number.parseInt(document.getElementById("maxUsageCount").value) || null,
    current_usage:
      Number.parseInt(document.getElementById("currentUsage").value) || 0,
    is_for_new_user: document.getElementById("isForNewUser").checked,
    applicable_membership:
      selectedMemberships.length > 0
        ? selectedMemberships
        : ["bronze", "silver", "gold", "platinum"],
    applicable_products: applicableProducts, // Added applicable products
  };

  if (currentEditingId) {
    // Update existing promotion
    const index = promotions.findIndex((p) => p.id === currentEditingId);
    if (index !== -1) {
      promotions[index] = { ...promotions[index], ...promotionData };
    }
  } else {
    // Create new promotion
    const newPromotion = {
      id: Date.now(),
      ...promotionData,
    };
    promotions.unshift(newPromotion);
  }

  closePromotionDrawer();
  renderPromotions();
});

document.addEventListener("DOMContentLoaded", () => {
  const productSearchInput = document.getElementById("productSearchInput");
  if (productSearchInput) {
    productSearchInput.addEventListener("input", renderProductSelection);
  }
});

// Event listeners
document
  .getElementById("searchInput")
  .addEventListener("input", renderPromotions);
document
  .getElementById("statusFilter")
  .addEventListener("change", renderPromotions);
document
  .getElementById("membershipFilter")
  .addEventListener("change", renderPromotions);

// Close drawer on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePromotionDrawer();
    closePromotionDetails();
  }
});

// Sidebar menu active state
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    document
      .querySelectorAll(".menu-item")
      .forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
  });
});

// Initialize
renderPromotions();
