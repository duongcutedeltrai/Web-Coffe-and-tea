let searchQuery = "";
let typeFilter = "all";
let currentTab = "all";
let activeDropdown = null;

// Selected products state and category filter
let selectedProducts = [];
let selectedCategory = "all";
//Định dạng số tiền sang kiểu tiền tệ Việt Nam
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

//Chuyển status tiếng Anh từ database sang tiếng Việt hiển thị.
function mapOrderStatus(status) {
  const statusMap = {
    pending: "Đang xử lý",
    ready: "Sẵn sàng",
    shipped: "Đang giao",
    completed: "Hoàn thành",
    canceled: "Đã hủy",
  };
  return statusMap[status] || status;
}
//Chuyển phương thức/thông tin thanh toán sang tiếng Việt.
function mapPaymentMethod(method) {
  const methodMap = {
    cod: "Tiền mặt",
    banking: "Chuyển khoản",
    momo: "MoMo",
    paypal: "PayPal",
  };
  return methodMap[method] || method;
}

function mapPaymentStatus(status) {
  const statusMap = {
    pending: "Đang chờ",
    success: "Đã thanh toán",
    failed: "Thất bại",
  };
  return statusMap[status] || status;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapOrderType(type) {
  const typeMap = {
    DINE_IN: "Tại quán",
    TAKE_AWAY: "Mang đi",
    DELIVERY: "Giao hàng",
  };
  return typeMap[type] || type;
}

function canonicalStatus(status) {
  if (!status) return "";
  const s = status.toString().trim().toLowerCase();
  if (s === "pending" || s === "đang xử lý") return "pending";
  if (s === "ready" || s === "sẵn sàng") return "ready";
  if (s === "shipped" || s === "đang giao") return "shipped";
  if (s === "completed" || s === "hoàn thành") return "completed";
  if (s === "canceled" || s === "đã hủy") return "canceled";
  return s;
}
//Trả về class CSS tương ứng với trạng thái (để đổi màu nhãn).
function getBadgeClass(status) {
  const statusLower = status.toLowerCase();
  if (statusLower === "pending" || statusLower === "đang xử lý")
    return "badge-processing";
  if (statusLower === "ready" || statusLower === "sẵn sàng")
    return "badge-ready";
  if (statusLower === "shipped" || statusLower === "đang giao")
    return "badge-ready";
  if (statusLower === "completed" || statusLower === "hoàn thành")
    return "badge-completed";
  if (statusLower === "canceled" || statusLower === "đã hủy")
    return "badge-cancelled";
  return "badge-processing";
}

//Tạo ra SVG icon hiển thị trạng thái thanh toán (success, pending, failed).
function getPaymentIcon(paymentStatus) {
  if (paymentStatus === "success" || paymentStatus === "Đã thanh toán") {
    return `<svg class="payment-icon paid" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`;
  } else if (paymentStatus === "pending" || paymentStatus === "Đang chờ") {
    return `<svg class="payment-icon pending" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>`;
  } else {
    return `<svg class="payment-icon cancelled" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>`;
  }
}

//-----------------------------   PHẦN QUẢN LÝ ĐƠN HÀNG  ------------------------------

// Toggle dropdown menu
function toggleDropdown(orderId) {
  const dropdown = document.getElementById(`dropdown-${orderId}`);

  // Close all other dropdowns
  closeAllDropdowns();

  // Toggle current dropdown
  if (dropdown) {
    dropdown.classList.toggle("hidden");
    activeDropdown = dropdown.classList.contains("hidden") ? null : dropdown;
  }
}

// Close all dropdowns
function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach((dropdown) => {
    dropdown.classList.add("hidden");
  });
  activeDropdown = null;
}

// Create order card HTML
function createOrderCard(order) {
  // Get order items from order_details
  const itemsHTML = order.order_details
    .map(
      (item) => `
    <div class="order-item">
      <span>${item.quantity} x ${item.products?.name || "Sản phẩm"}</span>
      <span>${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `
    )
    .join("");

  // Get customer name
  const customerName =
    order.receiver_name || order.users?.username || "Khách lẻ";

  // Get payment info (if exists)
  const payment =
    order.payment && order.payment.length > 0 ? order.payment[0] : null;
  const paymentMethod = payment ? mapPaymentMethod(payment.method) : "Chưa có";
  const paymentStatus = payment ? mapPaymentStatus(payment.status) : "Đang chờ";

  // Map type to Vietnamese
  const typeVietnamese = mapOrderType(order.order_type);
  const normalizedStatus = canonicalStatus(order.status);
  // Determine action buttons based on status and tab
  let actionButtons = "";
  if (currentTab === "all") {
    actionButtons = `
      <div class="dropdown-container">
        <button class="btn btn-primary" onclick="toggleDropdown('${order.order_id}')">
          Cập nhật trạng thái
        </button>
        <div id="dropdown-${order.order_id}" class="dropdown-menu hidden">
          <div class="dropdown-label">Thay đổi trạng thái</div>
          <div class="dropdown-separator"></div>
          <button class="dropdown-item" onclick="updateOrderStatus('${order.order_id}', 'pending')">Đang xử lý</button>
          <button class="dropdown-item" onclick="updateOrderStatus('${order.order_id}', 'ready')">Sẵn sàng</button>
          <button class="dropdown-item" onclick="updateOrderStatus('${order.order_id}', 'completed')">Hoàn thành</button>
          <button class="dropdown-item" onclick="updateOrderStatus('${order.order_id}', 'canceled')">Đã hủy</button>
        </div>
      </div>
      <button class="btn btn-outline" onclick="viewOrderDetails('${order.order_id}')">
        Chi tiết
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>`;
  } else if (currentTab === "pending") {
    if (normalizedStatus === "pending") {
      actionButtons = `
        <button class="btn btn-primary" onclick="updateOrderStatus('${order.order_id}', 'ready')" style="flex: 1;">
          Đánh dấu sẵn sàng
        </button>
        <button class="btn btn-outline" onclick="viewOrderDetails('${order.order_id}')">
          Chi tiết
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>`;
    } else if (normalizedStatus === "ready" || normalizedStatus === "shipped") {
      actionButtons = `
        <button class="btn btn-primary" onclick="updateOrderStatus('${order.order_id}', 'completed')" style="flex: 1;">
          Đánh dấu hoàn thành
        </button>
        <button class="btn btn-outline" onclick="viewOrderDetails('${order.order_id}')">
          Chi tiết
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>`;
    }
  } else if (currentTab === "ready") {
    actionButtons = `
      <button class="btn btn-primary" onclick="updateOrderStatus('${order.order_id}', 'completed')" style="flex: 1;">
        Đánh dấu hoàn thành
      </button>
      <button class="btn btn-outline" onclick="viewOrderDetails('${order.order_id}')">
        Chi tiết
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>`;
  } else if (currentTab === "completed" || currentTab === "canceled") {
    actionButtons = `
      <button class="btn btn-outline btn-full" onclick="viewOrderDetails('${order.order_id}')">
        Xem chi tiết
      </button>`;
  }

  return `
    <div class="order-card">
      <div class="order-card-header">
        <div class="order-header-top">
          <h3 class="order-id">#${order.order_id}</h3>
          <span class="badge ${getBadgeClass(order.status)}">${mapOrderStatus(
    order.status
  )}</span>
        </div>
        <div class="order-header-info">
          <div>${customerName} • ${formatDate(order.orderDate)}</div>
          <div>${order.delivery_address}</div>
        </div>
      </div>
      <div class="order-card-body">
        <div class="order-items">
          ${itemsHTML}
        </div>
        <div class="order-separator"></div>
        <div class="order-total">
          <span>Tổng cộng</span>
          <span>${formatCurrency(order.final_amount)}</span>
        </div>
        ${
          currentTab !== "active"
            ? `
        <div class="order-payment">
          <span>Thanh toán</span>
          <span class="payment-status">
            ${getPaymentIcon(paymentStatus)}
            ${paymentStatus} • ${paymentMethod}
          </span>
        </div>
        `
            : ""
        }
        <div class="order-actions">
          ${actionButtons}
        </div>
      </div>
    </div>
  `;
}

//Hàm hiển thị đơn hàng theo từng tab, tìm kiếm, lọc loại đơn hàng
async function renderOrders(tabName = "all", orderType = "") {
  const params = new URLSearchParams();
  if (tabName && tabName !== "all") {
    params.append("status", tabName);
  }
  if (orderType) params.append("type", orderType);

  if (searchQuery && searchQuery.trim() !== "") {
    params.append("search", searchQuery.trim());
  }
  const res = await fetch(`/admin/data/orders?${params.toString()}`);
  const result = await res.json();
  const ordersToShow = result.success ? result.data : [];

  const gridId =
    tabName === "all"
      ? "ordersGridAll"
      : tabName === "pending"
      ? "ordersGridPending"
      : tabName === "ready"
      ? "ordersGridReady"
      : tabName === "completed"
      ? "ordersGridCompleted"
      : "ordersGridCanceled";

  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (ordersToShow.length === 0) {
    grid.innerHTML =
      '<p style="text-align: center; color: #6c757d; padding: 2rem;">Không có đơn hàng nào</p>';
  } else {
    grid.innerHTML = ordersToShow
      .map((order) => createOrderCard(order))
      .join("");
  }
}

//Cập nhật trạng thái đơn hàng
async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }
    await renderOrders(currentTab, typeFilter);
    closeAllDropdowns();
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Không thể cập nhật trạng thái đơn hàng");
  }
}

//-----------------------------   XEM CHI TIẾT ĐƠN HÀNG  ------------------------------
async function viewOrderDetails(orderId) {
  // Đổi URL khi mở popup (SPA style)
  if (window.location.pathname !== `/admin/orders/${orderId}`) {
    history.pushState({ orderId }, "", `/admin/orders/${orderId}`);
  }

  const response = await fetch(`/admin/data/orders/${orderId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }

  const order = await response.json();
  console.log("Data chi tiết đơn hàng từ server:", order);

  const itemsHTML = order.data.order_details.map(
    (item) => `
    <div class="modal-items-row">
      <span>${item.products?.name || "Sản phẩm"}</span>
      <span>${item.quantity}</span>
      <span>${formatCurrency(item.price)}</span>
      <span>${formatCurrency(item.price * item.quantity)}</span>
    </div>`
  );

  document.getElementById("orderModal").classList.remove("hidden");
  document.getElementsByClassName("modal-body").item(0).innerHTML = `
          <div class="modal-section">
            <h3 class="modal-section-title">Thông tin khách hàng</h3>
            <div class="modal-info-grid">
              <div class="modal-info-item">
                <span class="modal-info-label">Tên khách hàng:</span>
                <span class="modal-info-value" id="modalCustomerName">${
                  order.data.receiver_name
                }</span>
              </div>
              <div class="modal-info-item">
                <span class="modal-info-label">Số điện thoại:</span>
                <span class="modal-info-value" id="modalPhone">${
                  order.data.receiver_phone
                }</span>
              </div>
              <div class="modal-info-item full-width">
                <span class="modal-info-label">Địa chỉ giao hàng:</span>
                <span class="modal-info-value" id="modalAddress">${
                  order.data.delivery_address
                }</span>
              </div>
            </div>
          </div>

          <div class="modal-section">
            <h3 class="modal-section-title">Thông tin đơn hàng</h3>
            <div class="modal-info-grid">
              <div class="modal-info-item">
                <span class="modal-info-label">Mã đơn hàng:</span>
                <span class="modal-info-value" id="modalOrderId">${
                  order.data.order_id
                }</span>
              </div>
              <div class="modal-info-item">
                <span class="modal-info-label">Thời gian:</span>
                <span class="modal-info-value" id="modalTime">${formatDate(
                  order.data.orderDate
                )}</span>
              </div>
              <div class="modal-info-item">
                <span class="modal-info-label">Loại đơn:</span>
                <span class="modal-info-value" id="modalType">${
                  order.data.order_type
                }</span>
              </div>
              <div class="modal-info-item">
                <span class="modal-info-label">Trạng thái:</span>
                <span class="modal-info-value" id="modalStatus">${mapOrderStatus(
                  order.data.status
                )}</span>
              </div>
            </div>
          </div>

           <div class="modal-section">
            <h3 class="modal-section-title">Sản phẩm</h3>
            <div class="modal-items-table">
              <div class="modal-items-header">
                <span>Sản phẩm</span>
                <span>SL</span>
                <span>Đơn giá</span>
                <span>Thành tiền</span>
              </div>
              <div id="modalItemsList">${itemsHTML.join("")}</div>
            </div>
          </div> 

         
           <div class="modal-section">
            <div class="modal-summary">
              <div class="modal-summary-row">
                <span>Tổng cộng:</span>
                <span class="modal-summary-total" id="modalTotal"></span>
              </div>
              <div class="modal-summary-row">
                <span>Thanh toán:</span>
                <span id="modalPaymentMethod">
                  ${order.data.payment[0].method}
                </span>
              </div>
              <div class="modal-summary-row">
                <span>Trạng thái thanh toán:</span>
                <span id="modalPaymentStatus">
                  ${order.data.payment[0].status}
                </span>
              </div>
            </div>
          </div> 
    `;
}
function closeOrderModal() {
  document.getElementById("orderModal").classList.add("hidden");
  document.body.style.overflow = "auto";
  if (window.location.pathname !== "/admin/orders") {
    history.pushState({}, "", "/admin/orders");
  }
}

// Print order (placeholder)
function printOrder() {
  alert("Chức năng in đơn hàng đang được phát triển");
}

// Initialize event listeners
function initEventListeners() {
  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchQuery = e.target.value;

    searchTimeout = setTimeout(() => {
      renderOrders(currentTab, typeFilter);

      //  Cập nhật URL trên trình duyệt
      const params = new URLSearchParams(window.location.search);
      if (currentTab && currentTab !== "all") params.set("status", currentTab);
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
      if (searchQuery && searchQuery.trim() !== "")
        params.set("search", searchQuery.trim());
      else params.delete("search");

      history.replaceState({}, "", `/admin/orders?${params.toString()}`);
    }, 400);
  });
  // Type filter
  const typeFilterSelect = document.getElementById("typeFilter");
  if (typeFilterSelect) {
    typeFilterSelect.addEventListener("change", (e) => {
      typeFilter = e.target.value;

      renderOrders(currentTab, typeFilter);

      const params = new URLSearchParams(window.location.search);
      if (currentTab && currentTab !== "all") params.set("status", currentTab);
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
      else params.delete("type");

      history.pushState({}, "", `/admin/orders?${params.toString()}`);
    });
  }

  // Tab triggers
  const tabTriggers = document.querySelectorAll(".tab-trigger");
  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const tabName = trigger.getAttribute("data-tab");

      // Update active tab trigger
      tabTriggers.forEach((t) => t.classList.remove("active"));
      trigger.classList.add("active");

      // Update active tab content
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });
      document.getElementById(`tab-${tabName}`).classList.add("active");

      currentTab = tabName;
      renderOrders(tabName, typeFilter);

      // Cập nhật query trên URL
      const params = new URLSearchParams(window.location.search);
      params.set("status", tabName);
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
      else params.delete("type");

      history.pushState({}, "", `/admin/orders?${params.toString()}`);
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown-container") && activeDropdown) {
      closeAllDropdowns();
    }
  });
}

//---------------------------------   FETCH PRODUCTS CATALOG   ---------------------------------------
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
    renderProductsGrid();
    renderCategoryButtons();
    return { productsCatalog, categoriesCatalog };
  } catch (error) {
    console.error("Error fetching products catalog:", error);
    return { productsCatalog: [], categoriesCatalog: [] };
  }
}

// Render category buttons
function renderCategoryButtons() {
  const container = document.querySelector(".product-categories");
  if (!container) return;

  // Button "Tất cả"
  const allButton = `
    <button 
      class="category-btn ${selectedCategory === "all" ? "active" : ""}" 
      onclick="selectCategory('all')"
    >
      Tất cả
    </button>
  `;

  // Các danh mục từ API
  const categoryButtons = categoriesCatalog
    .map(
      (cat) => `
        <button 
          class="category-btn ${
            selectedCategory == cat.category_id ? "active" : ""
          }" 
          onclick="selectCategory(${cat.category_id})"
        >
          ${cat.name}
        </button>
      `
    )
    .join("");

  container.innerHTML = allButton + categoryButtons;
}

// Render products grid
function renderProductsGrid() {
  const searchQuery = document
    .getElementById("productSearchInput")
    .value.toLowerCase();
  const grid = document.getElementById("productsGrid");

  const filteredProducts = productsCatalog.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (filteredProducts.length === 0) {
    grid.innerHTML =
      '<p style="text-align: center; color: #6c757d; padding: 2rem;">Không tìm thấy sản phẩm</p>';
  } else {
    grid.innerHTML = filteredProducts
      .map(
        (product) => `
      <div 
        class="product-card"
        data-product-id="${product.product_id}"
        onclick="addProductToOrder(${product.product_id})"
      >
        <div class="product-card-overlay"></div>

        <div class="product-card-content">
          <div class="product-card-name">${product.name}</div>
          <div class="product-card-category">${product.category_id}</div>

          <div class="product-card-sizes">
  ${product.price_product
    .map(
      (priceItem) => `
        <button 
          class="size-btn${
            (
              product.selectedSize
                ? product.selectedSize === priceItem.size
                : priceItem.size === "M"
            )
              ? " active"
              : ""
          }"
          data-size="${priceItem.size}"
          data-price="${priceItem.price}"
          data-product-id="${product.product_id}"
          onclick="event.stopPropagation(); selectProductSize(${
            product.product_id
          }, '${priceItem.size}', ${priceItem.price})"
        >
          ${priceItem.size}
        </button>`
    )
    .join("")}
</div>
        </div>
      </div>
    `
      )
      .join("");
  }
}

//----------------------------------- CREATE ORDER --------------------------------------------------
function initDrawerListeners() {
  // Close drawer when clicking overlay (outside drawer-container)
  document
    .getElementById("createOrderDrawer")
    .addEventListener("click", (e) => {
      if (e.target.id === "createOrderDrawer") {
        closeCreateOrderDrawer();
      }
    });

  // Show/hide table number based on order type
  const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');
  orderTypeRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const tableNumberGroup = document.getElementById("tableNumberGroup");
      if (tableNumberGroup) {
        if (e.target.value === "DINE_IN") {
          tableNumberGroup.style.display = "block";
        } else {
          tableNumberGroup.style.display = "none";
          document.getElementById("tableNumber").value = "";
        }
      }
    });
  });

  // Close drawer on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const drawer = document.getElementById("createOrderDrawer");
      if (!drawer.classList.contains("hidden")) {
        closeCreateOrderDrawer();
      }
    }
  });
}
let isProductSelectorOpen = false;
function openCreateOrderDrawer() {
  document.getElementById("createOrderDrawer").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  resetCreateOrderForm();
  updateOrderTotal();

  document.getElementById("voucherCode").value = "";

  if (window.location.pathname !== "/admin/orders/create") {
    history.pushState({ action: "create" }, "", "/admin/orders/create");
  }
  // Không render products grid khi drawer mở - chỉ render khi click nút chọn sản phẩm
  isProductSelectorOpen = false;
  hideProductSelector();
}

function showProductSelector() {
  const panel = document.querySelector(".product-selector-panel");
  if (panel) {
    panel.style.display = "flex";
    isProductSelectorOpen = true;
    renderProductsGrid();
  }
}

function hideProductSelector() {
  const panel = document.querySelector(".product-selector-panel");
  if (panel) {
    panel.style.display = "none";
    isProductSelectorOpen = false;
  }
}

// Close create order drawer
function closeCreateOrderDrawer() {
  document.getElementById("createOrderDrawer").classList.add("hidden");
  document.body.style.overflow = "auto";
  if (window.location.pathname !== "/admin/orders") {
    history.pushState({}, "", "/admin/orders");
  }
}

// Reset create order form
function resetCreateOrderForm() {
  document.getElementById("createOrderForm").reset();
  selectedProducts = [];
  renderSelectedProducts();
  updateOrderTotal();
  document.getElementById("voucherCode").value = "";
}

// Update category buttons
function updateCategoryButtons() {
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    if (btn.getAttribute("data-category") === selectedCategory) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Select category
function selectCategory(category) {
  selectedCategory = category;
  updateCategoryButtons();
  renderProductsGrid();
  renderCategoryButtons();
}

// Open product selector
function openProductSelector() {
  document.getElementById("productSelectorModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  renderProductsGrid();
}

// Close product selector
function closeProductSelector() {
  document.getElementById("productSelectorModal").classList.add("hidden");
  document.body.style.overflow = "auto";
  document.getElementById("productSearchInput").value = "";
  selectedCategory = "all";
  updateCategoryButtons();
}

// Filter products based on search and category
function filterProducts() {
  renderProductsGrid();
}

function selectProductSize(productId, size) {
  const product = productsCatalog.find((p) => p.product_id === productId);
  if (!product) return;

  // Xóa class active khỏi tất cả nút size của sản phẩm này
  document
    .querySelectorAll(`.product-card[data-product-id="${productId}"] .size-btn`)
    .forEach((btn) => btn.classList.remove("active"));

  // Thêm class active cho nút size vừa chọn
  const activeBtn = document.querySelector(
    `.product-card[data-product-id="${productId}"] .size-btn[data-size="${size}"]`
  );
  if (activeBtn) activeBtn.classList.add("active");

  // Cập nhật giá hiển thị theo size
  const priceObj = product.price_product.find((p) => p.size === size);
  const priceElement = document.getElementById(`price-${productId}`);
  if (priceElement && priceObj) {
    priceElement.textContent = formatCurrency(priceObj.price);
  }

  // Lưu size được chọn vào product để add vào order đúng size
  product.selectedSize = size;
}

// Add product to order
function addProductToOrder(productId) {
  const product = productsCatalog.find((p) => p.product_id === productId);
  if (!product) return;

  const size = product.selectedSize || "M"; // mặc định M
  const priceObj = product.price_product.find((p) => p.size === size);
  const price = priceObj ? priceObj.price : product.price_product[0].price;

  const existingProduct = selectedProducts.find(
    (p) => p.product_id === productId && p.size === size
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    selectedProducts.push({
      product_id: product.product_id,
      name: product.name,
      size,
      price,
      quantity: 1,
    });
  }

  renderSelectedProducts();
  updateOrderTotal();
}

// Render selected products
function renderSelectedProducts() {
  const container = document.getElementById("selectedProductsList");

  if (selectedProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-products-message">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Chưa có sản phẩm nào được chọn</p>
        <small>Nhấn nút bên dưới để chọn sản phẩm</small>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="selected-products-table">
      <div class="selected-products-header">
        <span>Tên sản phẩm</span>
        <span>Đơn giá</span>
        <span>Số lượng</span>
        <span></span>
      </div>
      ${selectedProducts
        .map(
          (product) => `
        <div class="selected-product-row">
          <div class="selected-product-name">${product.name}</div>
          <div class="selected-product-price">${formatCurrency(
            product.price
          )}</div>
          <div class="selected-product-quantity">
            <button type="button" class="quantity-btn" onclick="decreaseQuantity(${
              product.product_id
            }, '${product.size}') " ${product.quantity <= 1 ? "disabled" : ""}>
              −
            </button>
            <span class="quantity-value">${product.quantity}</span>
            <button type="button" class="quantity-btn" onclick="increaseQuantity(${
              product.product_id
            }, '${product.size}')">
              +
            </button>
          </div>
          <div class="selected-product-actions">
            <button type="button" class="btn-remove-selected" onclick="removeSelectedProduct(${
              product.product_id
            }, '${product.size}')" title="Xóa sản phẩm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// Increase product quantity
function increaseQuantity(productId, size) {
  console.log(selectedProducts);
  const product = selectedProducts.find(
    (p) => p.product_id === productId && p.size === size
  );
  if (product) {
    product.quantity += 1;
    renderSelectedProducts();
    updateOrderTotal();
  }
}

// Decrease product quantity
function decreaseQuantity(productId, size) {
  const product = selectedProducts.find(
    (p) => p.product_id === productId && p.size === size
  );
  if (product && product.quantity > 1) {
    product.quantity -= 1;
    renderSelectedProducts();
    updateOrderTotal();
  }
}

// Remove selected product
function removeSelectedProduct(productId, size) {
  selectedProducts = selectedProducts.filter(
    (p) => !(p.product_id === productId && p.size === size)
  );
  renderSelectedProducts();
  updateOrderTotal();
}

// Update order total
function updateOrderTotal() {
  const total = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  document.getElementById("orderTotal").textContent = formatCurrency(total);
  return total;
}

//TAO ID
function generateOrderId(orderType) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());

  let prefix = "OR"; // fallback
  switch (orderType) {
    case "DINE_IN":
      prefix = "DI";
      break;
    case "TAKE_AWAY":
      prefix = "TA";
      break;
    case "DELIVERY":
      prefix = "DL";
      break;
  }

  return `${prefix}_${hh}${mm}${ss}`;
}

async function applyVoucher() {
  const totalAmount = updateOrderTotal();
  if (totalAmount === 0) {
    alert("Vui lòng chọn sản phẩm trước khi áp dụng voucher");
    return;
  }
  const voucherCode = document.querySelector("#voucherCode").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const customerName = document.getElementById("customerName").value.trim();

  const userId = null;

  const products = selectedProducts.map((p) => ({
    product_id: p.product_id,
    size: p.size,
    quantity: p.quantity,
  }));

  const response = await fetch(`/admin/data/promotions/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: voucherCode,
      orderAmount: totalAmount,
      userId,
      phone: customerPhone,
      products,
    }),
  });
  console.log("Request body:", {
    code: voucherCode,
    orderAmount: totalAmount,
    userId,
    phone: customerPhone,
    products,
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    alert(result.message || "Mã voucher không hợp lệ");
    delete selectedProducts.promotion;
    updateOrderTotal(); // Reset lại tổng tiền
    return;
  }
  console.log("Voucher applied successfully:", result.data);

  const { discountAmount, finalAmount } = result.data.data;
  alert(`Áp dụng voucher thành công! Giảm ${formatCurrency(discountAmount)}.`);

  // Cập nhật hiển thị tổng tiền
  document.getElementById("orderTotal").textContent =
    formatCurrency(finalAmount);

  selectedProducts.promotion = result.data.data;

  return result.data;
}

// Submit create order
async function submitCreateOrder() {
  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const deliveryAddress = document
    .getElementById("deliveryAddress")
    .value.trim();
  const orderType = document.querySelector(
    'input[name="orderType"]:checked'
  ).value;
  const paymentMethodRaw = document.getElementById("paymentMethod").value;
  let paymentMethod;
  if (paymentMethodRaw === "Chuyển khoản") paymentMethod = "banking";
  else if (paymentMethodRaw === "Tiền mặt") paymentMethod = "cod";
  else if (paymentMethodRaw === "Ví điện tử") paymentMethod = "momo";
  else paymentMethod = "paypal";
  const paymentStatus = document.getElementById("paymentStatus").value;
  const orderId = generateOrderId(orderType);

  if (!customerName || !customerPhone) {
    alert("Vui lòng nhập tên khách hàng và số điện thoại");
    return;
  }

  if (selectedProducts.length === 0) {
    alert("Vui lòng chọn ít nhất một sản phẩm");
    return;
  }

  const totalAmount = selectedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const orderData = {
    order_id: orderId,
    receiver_name: customerName,
    receiver_phone: customerPhone,
    delivery_address: deliveryAddress || "Không có",
    order_type: orderType,
    payment_method: paymentMethod,
    payment_status: paymentStatus === "Đã thanh toán" ? "success" : "pending",
    total_amount: totalAmount,
    products: selectedProducts.map((p) => ({
      product_id: p.product_id,
      size: p.size,
      quantity: p.quantity,
      price: p.price,
    })),
  };
  if (selectedProducts.promotion) {
    orderData.promotion_code = selectedProducts.promotion.code;
    orderData.promotion_id = selectedProducts.promotion.promotionId;
    orderData.discount_amount = selectedProducts.promotion.discountAmount;
    orderData.final_amount = selectedProducts.promotion.finalAmount;
  }
  console.log("Submitting order data:", orderData);
  try {
    const response = await fetch("/admin/data/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Tạo đơn hàng thất bại");
    }

    alert("Đơn hàng đã được tạo thành công!");
    delete selectedProducts.promotion;
    closeCreateOrderDrawer();
    renderOrders(currentTab, typeFilter);
  } catch (err) {
    console.error("Error creating order:", err);
    alert("Không thể tạo đơn hàng");
  }
}

// Scroll to product selector (for mobile)
function scrollToProductSelector() {
  if (!isProductSelectorOpen) {
    showProductSelector();
  }

  const productPanel = document.querySelector(".product-selector-panel");
  if (productPanel) {
    productPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Initialize the application

function init() {
  initEventListeners();
  //fetchOrders();
  initDrawerListeners();
  fetchProductsCatalog();
  renderCategoryButtons();
  renderOrders("all", typeFilter);
  renderOrders("pending", typeFilter);
  renderOrders("ready", typeFilter);
  renderOrders("completed", typeFilter);
  renderOrders("canceled", typeFilter);

  // Kiểm tra URL hiện tại khi load trang
  const path = window.location.pathname;
  const orderDetailMatch = path.match(/\/admin\/orders\/(\w+)$/);
  if (path.endsWith("/create")) {
    // Nếu URL là /create → mở popup tạo đơn
    openCreateOrderDrawer();
  } else if (orderDetailMatch) {
    // Nếu URL là /orders/:id → mở chi tiết
    const orderId = orderDetailMatch[1];
    viewOrderDetails(orderId);
  }
}

// Đọc query trên URL khi load trang
const queryParams = new URLSearchParams(window.location.search);
const statusParam = queryParams.get("status") || "all";
const typeParam = queryParams.get("type") || "all";

// Cập nhật select "Loại đơn hàng"
const typeSelect = document.getElementById("typeFilter");
if (typeSelect) {
  typeSelect.value = typeParam || "all";
  typeFilter = typeSelect.value;
}

// Cập nhật tab tương ứng
const validTabs = ["all", "pending", "ready", "completed", "canceled"];
if (validTabs.includes(statusParam)) {
  currentTab = statusParam;

  // Kích hoạt nút tab tương ứng
  document.querySelectorAll(".tab-trigger").forEach((t) => {
    t.classList.remove("active");
    if (t.getAttribute("data-tab") === statusParam) t.classList.add("active");
  });

  // Hiển thị phần nội dung tab tương ứng
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`tab-${statusParam}`).classList.add("active");
}

// Gọi renderOrders theo URL query
renderOrders(currentTab, typeFilter);

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.addEventListener("popstate", (event) => {
  const path = window.location.pathname;
  if (path.endsWith("/create")) {
    openCreateOrderDrawer();
  } else {
    const orderDetailMatch = path.match(/\/admin\/orders\/(\w+)$/);
    if (orderDetailMatch) {
      viewOrderDetails(orderDetailMatch[1]);
    } else {
      closeCreateOrderDrawer();
      closeOrderModal();
    }
  }
});
