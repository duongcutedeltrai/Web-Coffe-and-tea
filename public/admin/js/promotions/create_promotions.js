let selectedProducts = [];
const currentProductCategory = "all";
let promotions = [];
let flashsale = [];
let currentEditingId = null;
let currentTab = "Voucher"; // Thêm biến theo dõi tab hiện tại
let currentEditingType = "Voucher"; // hoặc "FlashSale"

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

function switchTab(tabName) {
  currentTab = tabName;
  currentEditingId = null;
  // Cập nhật UI của tab buttons
  document.querySelectorAll(".tab-trigger").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    }
  });

  // Hiển thị/ẩn nội dung tab
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.style.display = "none";
  });

  if (tabName === "Voucher") {
    document.getElementById("voucherTab").style.display = "block";
    // Ẩn các filter cho voucher nếu không cần
  } else if (tabName === "FlashSale") {
    document.getElementById("flashsaleTab").style.display = "block";
    renderFlashSaleTable();
  }
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

let productsCatalog = [];
let categoriesCatalog = [];

async function fetchProductsCatalog() {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch("/api/admin/products/data"),
      fetch("/admin/categories/data"),
    ]);
    productsCatalog = await productsResponse.json();
    categoriesCatalog = await categoriesResponse.json();
    renderProductSelection();
    return { productsCatalog, categoriesCatalog };
  } catch (error) {
    console.error("Error fetching products catalog:", error);
    return { productsCatalog: [], categoriesCatalog: [] };
  }
}

let selectedCategory = "all";

function renderProductSelection() {
  // Render category buttons
  const categoriesContainer = document.querySelector(".product-categories");
  if (categoriesContainer) {
    const allButton = `
      <button 
        class="category-btn ${selectedCategory === "all" ? "active" : ""}" 
        onclick="filterProductsByCategory('all')"
      >
        Tất cả
      </button>
    `;

    const categoryButtons = categoriesCatalog
      .map(
        (cat) => `
        <button 
          class="category-btn ${
            selectedCategory == cat.category_id ? "active" : ""
          }" 
          onclick="filterProductsByCategory(${cat.category_id})"
        >
          ${cat.name}
        </button>
      `
      )
      .join("");

    categoriesContainer.innerHTML = allButton + categoryButtons;
  }

  // Render products grid
  const grid = document.getElementById("productSelectionGrid");
  const searchQuery =
    document.getElementById("productSearchInput")?.value.toLowerCase() || "";

  const filteredProducts = productsCatalog.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!grid) return;

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="product-selection-empty">
        <div class="product-selection-empty-icon">📦</div>
        <div class="product-selection-empty-title">Không tìm thấy sản phẩm</div>
        <div class="product-selection-empty-text">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
      </div>
    `;
    updateSelectedProductsSummary();
    return;
  }

  grid.innerHTML = filteredProducts
    .map((product) => {
      const isSelected = selectedProducts.some(
        (p) => p.productId === product.product_id
      );
      const selectedProductData = selectedProducts.find(
        (p) => p.productId === product.product_id
      );
      const selectedSize =
        selectedProductData?.size || product.price_product[0]?.size || "M";

      // Tìm category name
      const category = categoriesCatalog.find(
        (c) => c.category_id === product.category_id
      );
      const categoryName = category ? category.name : "Khác";

      // Tìm giá theo size đã chọn
      const selectedPriceItem =
        product.price_product.find((p) => p.size === selectedSize) ||
        product.price_product[0];
      const displayPrice = selectedPriceItem ? selectedPriceItem.price : 0;
      //size
      let sizeButtonsHTML = "";
      if (
        Array.isArray(product.price_product) &&
        product.price_product.length > 1
      ) {
        // Có nhiều size
        sizeButtonsHTML = `
        <div class="product-card-sizes">
              ${product.price_product
                .map(
                  (priceItem) => `
                  <button 
                    type="button"
                    class="size-btn ${
                      selectedSize === priceItem.size ? "active" : ""
                    }"
                    data-size="${priceItem.size}"
                    data-price="${priceItem.price}"
                    onclick="event.stopPropagation(); selectProductSize(${
                      product.product_id
                    }, '${priceItem.size}', ${priceItem.price})"
                    ${!isSelected ? "disabled" : ""}
                  >
                    ${priceItem.size}
                  </button>
                `
                )
                .join("")}
             
                 <button 
                    type="button"
                    class="size-btn size-btn-all ${
                      selectedSize === "all" ? "active" : ""
                    }"
                    onclick="event.stopPropagation(); selectProductSize(${
                      product.product_id
                    }, 'all', ${displayPrice})"
                   ${!isSelected ? "disabled" : ""}
                  >
                   Tất cả
                 </button>
            </div>`;
      } else if (
        Array.isArray(product.price_product) &&
        product.price_product.length === 1
      ) {
        // Chỉ có 1 size
        const onlyItem = product.price_product[0];
        sizeButtonsHTML = `
    <div class="product-card-sizes single-size">
      <span class="size-static">${onlyItem.size}</span>
    </div>`;
      }

      return `
        <div class="product-card ${
          isSelected ? "selected" : ""
        }" data-product-id="${product.product_id}">
          <div class="product-card-content">
            <!-- Header với checkbox và tên -->
            <div class="product-card-header">
              <input 
                type="checkbox" 
                id="product-${product.product_id}" 
                ${isSelected ? "checked" : ""}
                onchange="toggleProductCheckbox(${product.product_id}, event)"
              >
              <div class="product-card-info">
                <label 
                  for="product-${product.product_id}" 
                  class="product-card-name"
                >
                  ${product.name}
                </label>
                <div class="product-card-category">${categoryName}</div>
              </div>
            </div>

            <!-- Description (optional) -->
            ${
              product.description
                ? `
              <div class="product-card-description">${product.description}</div>
            `
                : ""
            }

            <!-- Size Selection -->
            ${sizeButtonsHTML}

            <!-- Price -->
            <div class="product-card-price">
              ${formatCurrency(displayPrice)}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  updateSelectedProductsSummary();
}

// Hàm toggle checkbox
function toggleProductCheckbox(productId, event) {
  if (event) {
    event.stopPropagation();
  }

  const product = productsCatalog.find((p) => p.product_id === productId);
  if (!product) return;

  const existingIndex = selectedProducts.findIndex(
    (p) => p.productId === productId
  );

  if (existingIndex === -1) {
    // Thêm sản phẩm với size và giá mặc định (size đầu tiên)
    const defaultPriceItem = product.price_product[0];
    selectedProducts.push({
      productId: productId,
      size: defaultPriceItem.size,
      price: defaultPriceItem.price,
    });
  } else {
    // Xóa sản phẩm
    selectedProducts.splice(existingIndex, 1);
  }
  updateSelectedProductsSummary();
  renderProductSelection();
}

function selectProductSize(productId, size, price) {
  const productIndex = selectedProducts.findIndex(
    (p) => p.productId === productId
  );

  const hasMultipleSizes =
    Array.isArray(productsCatalog[productId].price_product) &&
    productsCatalog[productId].price_product.length > 1;
  if (productIndex === -1) {
    // Nếu chưa chọn mà click size => tự động thêm
    selectedProducts.push({ productId, size, price });
  } else {
    if (!hasMultipleSizes) return;
    if (size === "all") {
      // Nếu chọn "Tất cả" => gán size = "all"
      selectedProducts[productIndex].size = "all";
      selectedProducts[productIndex].price = price;
    } else {
      // Cập nhật size cụ thể
      selectedProducts[productIndex].size = size;
      selectedProducts[productIndex].price = price;
    }
  }

  updateSelectedProductsSummary();
  renderProductSelection();
}

// Cập nhật summary
function updateSelectedProductsSummary() {
  const summary = document.getElementById("selectedProductsSummary");
  if (summary) {
    const totalProducts = selectedProducts.length;
    summary.innerHTML = `
      <span>Đã chọn: <strong>${totalProducts}</strong> sản phẩm</span>
    `;
  }
}

// Hàm lọc theo category
function filterProductsByCategory(category) {
  selectedCategory = category;
  renderProductSelection();
}

function getProductNames(applicableProducts) {
  console.log("applicableProducts:", applicableProducts);
  if (!applicableProducts || applicableProducts === "all")
    return "Tất cả sản phẩm";

  if (!Array.isArray(applicableProducts) || applicableProducts.length === 0)
    return "Tất cả sản phẩm";

  const names = applicableProducts.map((item) => {
    const productId =
      typeof item === "object" ? item.productId || item.product_id : item;

    const product = productsCatalog.find((p) => p.product_id === productId);
    return product ? product.name : `#${productId}`;
  });

  if (names.length > 3) {
    return `${names.slice(0, 3).join(", ")} và ${
      names.length - 3
    } sản phẩm khác`;
  }

  return names.join(", ");
}

// Render promotions
async function fetchPromotions() {
  try {
    const response = await fetch("/admin/data/promotions/voucher");
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.error("Error fetching promotions:", error);
  }
  return [];
}
//--------------------------------- Flash Sale Table Rendering ---------------------------------
async function renderFlashSaleTable() {
  const tableBody = document.getElementById("flashsaleTableBody");
  const emptyState = document.getElementById("flashsaleEmptyState");

  try {
    const response = await fetch("/admin/data/promotions/flashsale");
    const result = await response.json();
    flashsale = result.success && Array.isArray(result.data) ? result.data : [];
    console.log("Fetched flash sales:", flashsale);
    flashsale.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  } catch (error) {
    console.error("Error fetching flash sales:", error);
    flashsale = [];
  }

  if (flashsale.length === 0) {
    tableBody.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  tableBody.innerHTML = flashsale
    .map((item, index) => {
      // Mỗi promotion có thể áp dụng cho nhiều sản phẩm
      return item.promotion_products
        .map((p) => {
          console.log(item);
          const product = p.products || {};
          const productName = product.name || `Sản phẩm #${p.product_id}`;
          const startDate = formatDate(item.start_date);
          const endDate = formatDate(item.end_date);

          // Nếu có price_product, lấy size và giá
          let priceInfo = "";
          if (product.price_product && product.price_product.length > 0) {
            const priceObj = product.price_product.find(
              (pr) => pr.size === p.size
            );
            if (priceObj) {
              priceInfo = {
                original_price: priceObj.price,
                size: priceObj.size,
              };
            }
          }

          const originalPrice = priceInfo?.original_price || 0;
          const discountPrice = item.discount_price || 0;
          const discountAmount = originalPrice - discountPrice;

          return `
            <tr class="flashsale-row" >
              <td class="cell-product-name">${productName}</td>
              <td>${priceInfo?.size || p.size || "N/A"}</td>
              <td class="cell-original-price">${formatCurrency(
                originalPrice
              )}</td>
              <td class="cell-discount-price">${formatCurrency(
                discountAmount
              )}</td>
              <td class="cell-start-date">${startDate}</td>
              <td class="cell-end-date">${endDate}</td>
              <td class="cell-quantity">${item.current_usage}/${
            item.max_usage_count || 0
          }</td>
              <td class="cell-discount-amount">${formatCurrency(
                discountPrice
              )}</td>
              <td class="cell-actions" onclick="event.stopPropagation()">
                <button class="btn-action btn-edit" onclick="editFlashsale('${
                  item.promotion_id || index
                }')">Sửa</button>
                <button class="btn-action btn-delete" onclick="deleteFlashsale('${
                  item.promotion_id || index
                }')">Xóa</button>
              </td>
            </tr>
          `;
        })
        .join(""); // nối các sản phẩm trong cùng một promotion
    })
    .join(""); // nối tất cả promotions
}

// async function viewFlashsaleDetails(id) {
//   let item = flashsale.find(
//     (f, index) => f.id === id || index.toString() === id.toString()
//   );

//   if (!item) {
//     try {
//       const res = await fetch(`/admin/data/promotions/${id}`);
//       const data = await res.json();
//       if (data.success) {
//         item = data.data;
//         console.log("Fetched flash sale item:", item);
//       } else {
//         alert("Không tìm thấy flash sale!");
//         return;
//       }
//     } catch (error) {
//       console.error("Error loading flash sale details:", error);
//       alert("Lỗi khi tải chi tiết flash sale");
//       return;
//     }
//   }

//   const product = productsCatalog.find((p) => p.product_id === item.product_id);
//   const productName = product ? product.name : `Sản phẩm #${item.product_id}`;
//   const discountAmount = item.original_price - item.discount_price;
//   const totalDiscount = Math.round(discountAmount * (item.quantity || 1));

//   const content = `
//     <div class="detail-section">
//       <h3>Thông tin sản phẩm</h3>
//       <div class="detail-grid">
//         <div class="detail-row">
//           <label>Tên sản phẩm</label>
//           <span>${productName}</span>
//         </div>
//         <div class="detail-row">
//           <label>Size</label>
//           <span>${item.size || "N/A"}</span>
//         </div>
//       </div>
//     </div>

//     <div class="detail-section">
//       <h3>Giá cả</h3>
//       <div class="detail-grid">
//         <div class="detail-row">
//           <label>Giá gốc</label>
//           <span>${formatCurrency(item.original_price)}</span>
//         </div>
//         <div class="detail-row">
//           <label>Giá giảm</label>
//           <span style="color: #b22830; font-weight: 600; font-size: 18px;">${formatCurrency(
//             item.discount_price
//           )}</span>
//         </div>
//         <div class="detail-row">
//           <label>Tiền giảm trên 1 sản phẩm</label>
//           <span>${formatCurrency(discountAmount)}</span>
//         </div>
//         <div class="detail-row">
//           <label>Tổng tiền giảm</label>
//           <span style="color: #b22830; font-weight: 600;">${formatCurrency(
//             totalDiscount
//           )}</span>
//         </div>
//       </div>
//     </div>

//     <div class="detail-section">
//       <h3>Thông tin flash sale</h3>
//       <div class="detail-grid">
//         <div class="detail-row">
//           <label>Số lượng</label>
//           <span>${item.quantity || 0}</span>
//         </div>
//         <div class="detail-row">
//           <label>Bắt đầu</label>
//           <span>${formatDate(item.start_date)}</span>
//         </div>
//         <div class="detail-row">
//           <label>Kết thúc</label>
//           <span>${formatDate(item.end_date)}</span>
//         </div>
//         <div class="detail-row">
//           <label>Mô tả</label>
//           <span>${item.description || "N/A"}</span>
//         </div>
//       </div>
//     </div>
//   `;

//   document.getElementById("flashsaleDetailsContent").innerHTML = content;
//   document.getElementById("flashsaleDetailsOverlay").classList.add("active");
// }

function closeFlashsaleDetails() {
  document.getElementById("flashsaleDetailsOverlay").classList.remove("active");
}

async function deleteFlashsale(id) {
  if (confirm("Bạn có chắc chắn muốn xóa flash sale này?")) {
    try {
      const response = await fetch(`/admin/data/flashsales/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete flash sale");
      }
      alert("Xóa flash sale thành công!");
      renderFlashSaleTable();
    } catch (error) {
      console.error("Error deleting flash sale:", error);
      alert("Có lỗi xảy ra khi xóa flash sale: " + error.message);
    }
  }
}

async function editFlashsale(id) {
  currentEditingId = id;
  currentEditingType = "FlashSale";
  window.history.pushState(
    { flashsaleId: id },
    "",
    `/admin/promotions/update/${id}`
  );
  document.getElementById("drawerTitle").textContent = "Chỉnh sửa Flash Sale";

  // 🔹 Set loại khuyến mãi sang flashsale trước khi fill data
  const typeSelect = document.getElementById("promotionType");
  if (typeSelect) {
    typeSelect.value = "flashsale";
    togglePromotionType(); // 👈 cập nhật lại giao diện form cho Flash Sale
  }

  // 🔹 Tìm flashsale từ danh sách đã load
  let flash = flashsale.find((f) => f.promotion_id === id || f.id === id);

  // Nếu chưa có đầy đủ dữ liệu thì fetch chi tiết
  if (!flash) {
    try {
      const res = await fetch(`/admin/data/promotions/${id}`);
      const json = await res.json();
      if (json.success) flash = json.data;
    } catch (err) {
      console.error("Error fetching flash sale details:", err);
      alert("Không thể tải thông tin flash sale");
      return;
    }
  }

  if (!flash) {
    alert("Không tìm thấy flash sale!");
    return;
  }

  // 🔹 Fill dữ liệu vào form
  document.getElementById("promotionDescription").value =
    flash.description || "Flash Sale - Giảm giá sốc trong thời gian ngắn!";
  document.getElementById("startDate").value = formatDateForInput(
    flash.start_date
  );
  document.getElementById("endDate").value = formatDateForInput(flash.end_date);
  document.getElementById("discountPrice").value = flash.discount_price || 0;
  document.getElementById("maxUsageCount").value = flash.max_usage_count || 0;
  document.getElementById("currentUsage").value = flash.current_usage || 0;

  // 🔹 Sản phẩm áp dụng
  if (flash.promotion_products && flash.promotion_products.length > 0) {
    selectedProducts = flash.promotion_products.map((p) => ({
      productId: p.product_id,
      size: p.size,
      price:
        p.products?.price_product?.find((pp) => pp.size === p.size)?.price || 0,
    }));
  } else {
    selectedProducts = [];
  }

  renderProductSelection();

  // 🔹 Disable vùng chọn sản phẩm all/specific cho Flash Sale
  const radios = document.querySelectorAll('input[name="productScope"]');
  radios.forEach((r) => {
    r.disabled = true;
    if (r.value === "specific") r.checked = true;
  });

  // 🔹 Mở drawer
  document.getElementById("promotionDrawerOverlay").classList.add("active");
  document.getElementById("promotionDrawer").classList.add("active");
}

async function renderPromotionsVoucher() {
  const container = document.getElementById("promotionsContainer");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;
  const membershipFilter = document.getElementById("membershipFilter").value;
  promotions = await fetchPromotions();
  console.log(promotions);

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
                <div style="font-size: 48px; margin-bottom: 16px;"></div>
                <div style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">Không có khuyến mãi nào đã được tạo</div>
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
        promotion.promotion_products !== "all"
          ? `
                <div class="promotion-applicable-products">
                    <div class="label">Sản phẩm áp dụng:</div>
                    <div class="products-list">${getProductNames(
                      promotion.promotion_products
                    )}</div>
                </div>
            `
          : "";

      return `
            <div class="promotion-card" onclick="viewPromotionDetails('${
              promotion.promotion_id
            }')">
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
                   <button class="btn-edit" onclick="editPromotion('${
                     promotion.promotion_id
                   }')">Sửa</button>
                    <button class="btn-delete" onclick="deletePromotion('${
                      promotion.promotion_id
                    }')"> Xóa</button>
                </div>
            </div>
        `;
    })
    .join("");
}

// Open create promotion drawer
function openCreatePromotionDrawer() {
  window.history.pushState({}, "", `/admin/promotions/create`);
  currentEditingId = null;
  selectedProducts = []; // Reset selected products
  currentEditingType = "Voucher";
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
  window.history.pushState({}, "", "/admin/promotions");

  currentEditingId = null;
  currentEditingType = "Voucher";
}

function formatDateForInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);

  // Lấy thời gian local, không có Z
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  // Cắt đến phút (yyyy-MM-ddThh:mm)
  return localDate.toISOString().slice(0, 16);
}

// Edit promotion
function editPromotion(id) {
  const promotion = promotions.find(
    (p) => p.id === id || p.promotion_id === id
  );
  if (!promotion) return;
  window.history.pushState(
    { promotionId: id },
    "",
    `/admin/promotions/update/${promotion.promotion_id}`
  );
  currentEditingId = promotion.promotion_id;
  currentEditingType = "Voucher";
  document.getElementById("drawerTitle").textContent = "Chỉnh sửa khuyến mãi";
  const typeSelect = document.getElementById("promotionType");
  if (typeSelect) {
    typeSelect.value = "voucher"; // Đảm bảo set về voucher
    togglePromotionType(); // Trigger để update UI
  }
  document.getElementById("promotionId").value = promotion.id;
  document.getElementById("promotionCode").value = promotion.code;
  document.getElementById("promotionDescription").value = promotion.description;
  document.getElementById("startDate").value = formatDateForInput(
    promotion.start_date
  );
  document.getElementById("endDate").value = formatDateForInput(
    promotion.end_date
  );
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
    renderPromotionsVoucher();
  }
}

// View promotion details
async function viewPromotionDetails(id) {
  let promotion = promotions.find((p) => p.id === id || p.promotion_id === id);
  console.log("Viewing promotion:", promotion);
  if (!promotion) {
    const res = await fetch(`/admin/data/promotions/${id}`);
    const data = await res.json();
    if (data.success) {
      promotion = data.data;
      console.log("Fetched promotion:", promotion);
    } else {
      alert("Không tìm thấy khuyến mãi!");
      return;
    }
  }
  const newUrl = `/admin/promotions/${promotion.promotion_id}`;
  window.history.pushState({ promotionId: id }, "", newUrl);

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
        <div style=" display: flex;
    justify-content: space-between;
    align-items: center;"> <h3>Điều kiện áp dụng</h3> </div>
           
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
                    <span>${promotion.is_for_new_user ? "Có" : "Không"}</span>
                </div>
                <div class="detail-row">
                    <label>Hạng thành viên</label>
                    <span>${membershipText}</span>
                </div>
            </div>
            <div class="detail-row" style="margin-top: 12px;">
                <label>Sản phẩm áp dụng</label>
                <span>${getProductNames(promotion.promotion_products)}</span>
            </div>
        </div>
    `;

  document.getElementById("promotionDetailsContent").innerHTML = content;
  document.getElementById("promotionDetailsOverlay").classList.add("active");
}
function togglePromotionType() {
  const promotionType = document.getElementById("promotionType").value;
  const codeGroup = document
    .getElementById("promotionCode")
    .closest(".form-group");
  const descriptionGroup = document
    .getElementById("promotionDescription")
    .closest(".form-group");
  const minOrderGroup = document
    .getElementById("minOrderAmount")
    .closest(".form-group");
  const discountPrice = document
    .getElementById("discountPrice")
    .closest(".form-group");
  const discountPercent = document
    .getElementById("discountPercent")
    .closest(".form-group");
  const targetSection = document.querySelector(".form-section:nth-child(5)"); // Đối tượng áp dụng section
  const productScopeRadios = document.querySelectorAll(
    'input[name="productScope"]'
  );

  if (promotionType === "flashsale") {
    // Hide elements for flashsale
    codeGroup.style.display = "none";
    codeGroup.querySelector("input").value = `FLASH_${Date.now()}`; // Set default code
    descriptionGroup.style.display = "none";
    descriptionGroup.querySelector("textarea").value =
      "Flash Sale - Giảm giá sốc trong thời gian ngắn!";
    discountPrice.style.display = "block";
    discountPercent.style.display = "none";
    discountPercent.querySelector("input").value = 0; // Set percent to 0
    minOrderGroup.style.display = "none";
    minOrderGroup.querySelector("input").value = 0; // Set min order to 0
    targetSection.style.display = "none";

    // Auto select specific products for flashsale
    const specificProductRadio = document.querySelector(
      'input[name="productScope"][value="specific"]'
    );
    if (specificProductRadio) {
      specificProductRadio.checked = true;
      toggleProductSelection(); // Trigger product selection display
    }

    // Disable radio buttons
    productScopeRadios.forEach((radio) => {
      radio.disabled = true;
    });
  } else {
    // Show elements for voucher
    codeGroup.style.display = "block";
    descriptionGroup.style.display = "block";
    minOrderGroup.style.display = "block";
    targetSection.style.display = "block";
    discountPrice.querySelector("input").value = 0; // Reset discount price
    discountPrice.style.display = "none";
    discountPercent.style.display = "block";

    // Enable radio buttons
    productScopeRadios.forEach((radio) => {
      radio.disabled = false;
    });
  }
}

// Call this function on page load to set initial state
document.addEventListener("DOMContentLoaded", () => {
  togglePromotionType();
});
// Close promotion details
function closePromotionDetails() {
  document.getElementById("promotionDetailsOverlay").classList.remove("active");
  window.history.pushState({}, "", "/admin/promotions");
}

async function refreshPromotions() {
  try {
    const res = await fetch("/admin/data/promotions");
    const data = await res.json();
    promotions = data; // Cập nhật lại mảng global
    renderPromotionsVoucher();
    renderFlashSaleTable();
  } catch (error) {
    console.error("❌ Lỗi khi tải lại danh sách khuyến mãi:", error);
  }
}

// Handle form submission
async function submitPromotions() {
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
    discount_percent:
      Number.parseInt(document.getElementById("discountPercent").value) || 0,
    discount_price:
      Number.parseInt(document.getElementById("discountPrice").value) || 0,
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
    applicable_products: applicableProducts,
    type: document.getElementById("promotionType").value || "voucher",
  };

  if (currentEditingId) {
    try {
      const response = await fetch(
        `/admin/data/promotions/update/${currentEditingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promotionData),
        }
      );
      if (currentEditingType === "FlashSale") {
        await renderFlashSaleTable();
        switchTab("FlashSale");
      } else {
        await renderPromotionsVoucher();
        switchTab("Voucher");
      }
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update promotion");
      }
      alert("Cập nhật khuyến mãi thành công!");
      closePromotionDrawer();
    } catch (error) {
      console.error("❌ Error updating promotion:", error);
      alert("Có lỗi xảy ra khi cập nhật khuyến mãi: " + error.message);
    }
  } else {
    // Create new promotion
    const newPromotion = {
      promotion_id: crypto.randomUUID(),
      ...promotionData,
    };
    promotions.unshift(newPromotion);
    try {
      const response = await fetch("/admin/data/promotions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPromotion),
      });
      if (promotionData.type === "flashsale") {
        await renderFlashSaleTable(); // Fetch lại tất cả flash sales (bao gồm cái mới)
        switchTab("FlashSale");
      } else {
        promotions.unshift(newPromotion); // Thêm vào mảng local
        await renderPromotionsVoucher(); // Render lại UI
        switchTab("Voucher");
      }
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create promotion");
      }

      alert("Tạo khuyến mãi thành công!");
      closePromotionDrawer();
    } catch (error) {
      console.error("Error creating promotion in js:", error.message);
      alert(error.message);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const productSearchInput = document.getElementById("productSearchInput");
  if (productSearchInput) {
    productSearchInput.addEventListener("input", renderProductSelection);
  }
});

// Event listeners
document
  .getElementById("searchInput")
  .addEventListener("input", renderPromotionsVoucher);
document
  .getElementById("statusFilter")
  .addEventListener("change", renderPromotionsVoucher);
document
  .getElementById("membershipFilter")
  .addEventListener("change", renderPromotionsVoucher);

// Close drawer on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePromotionDrawer();
    closePromotionDetails();
    closeFlashsaleDetails();
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
document.addEventListener("DOMContentLoaded", async () => {
  await fetchProductsCatalog();
  await renderPromotionsVoucher();
  // Phân tích đường dẫn
  const pathParts = window.location.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1];
  const secondLast = pathParts[pathParts.length - 2];
  if (lastPart === "create") {
    openCreatePromotionDrawer();
    return;
  }

  if (secondLast === "update") {
    const promotionId = lastPart;

    try {
      const res = await fetch(`/admin/data/promotions/${promotionId}`);
      const data = await res.json();
      if (data.success && data.data) {
        // Thêm vào danh sách promotions tạm thời
        promotions = [data.data];

        editPromotion(data.data.promotion_id || data.data.id);

        window.history.replaceState(
          {},
          "",
          `/admin/promotions/update/${promotionId}`
        );
      } else {
        alert("❌ Không tìm thấy khuyến mãi cần chỉnh sửa");
      }
    } catch (err) {
      console.error("Error loading promotion for update:", err);
      alert("Lỗi khi tải dữ liệu khuyến mãi để chỉnh sửa");
    }
    return;
  }

  if (lastPart && lastPart !== "promotions") {
    const promotionId = lastPart;

    try {
      const res = await fetch(`/admin/data/promotions/${promotionId}`);
      const data = await res.json();
      if (data.success && data.data) {
        promotions = [data.data];
        viewPromotionDetails(data.data.id || data.data.promotion_id);
      } else {
        alert("Không tìm thấy thông tin khuyến mãi");
      }
    } catch (err) {
      console.error("Error loading promotion details:", err);
    }
  }
});
