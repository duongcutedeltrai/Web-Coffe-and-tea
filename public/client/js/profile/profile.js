const menuItems = document.querySelectorAll(".menu-item");
const contentSections = document.querySelectorAll(".content-section");
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
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

menuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("[v0] Menu clicked:", item.getAttribute("data-section"));

    // Remove active class from all items
    menuItems.forEach((mi) => mi.classList.remove("active"));
    // Add active class to clicked item
    item.classList.add("active");

    // Hide all sections
    contentSections.forEach((section) => {
      section.classList.remove("active");
    });

    // Show selected section
    const sectionId = item.getAttribute("data-section");
    const section = document.getElementById(sectionId);
    if (section) {
      console.log("[v0] Showing section:", sectionId);
      section.classList.add("active");
    }
  });
});

// Edit Profile Toggle
const toggleEditBtn = document.getElementById("toggleEditBtn");
const editForm = document.getElementById("editForm");
const cancelEditBtn = document.getElementById("cancelEditBtn");

if (toggleEditBtn && editForm && cancelEditBtn) {
  toggleEditBtn.addEventListener("click", () => {
    editForm.classList.toggle("hidden");
    if (!editForm.classList.contains("hidden")) {
      toggleEditBtn.textContent = "Đóng";
      toggleEditBtn.style.backgroundColor = "#d32f2f";
    } else {
      toggleEditBtn.textContent = "Chỉnh Sửa";
      toggleEditBtn.style.backgroundColor = "#24A148";
    }
  });

  cancelEditBtn.addEventListener("click", () => {
    editForm.classList.add("hidden");
    toggleEditBtn.textContent = "Chỉnh Sửa";
    toggleEditBtn.style.backgroundColor = "#24A148";
    // Reset form
    document.getElementById("editForm").reset();
  });

  //fetch order
  async function fetchOrdersHistory() {
    try {
      const response = await fetch("/admin/data/orders-user");
      const result = await response.json();
      console.log("Order history data:", result.data);

      console.log("Orders Data:", result.data);
      renderOrderHistory(result.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  }

  fetchOrdersHistory();

  function renderOrderHistory(orders) {
    const container = document.querySelector("#purchase-history .history-list");
    if (!container) return;
    console.log("Rendering orders:", orders);
    container.innerHTML = ""; // Xóa nội dung cũ

    if (!orders || orders.length === 0) {
      container.innerHTML = `<p>Không có đơn hàng nào.</p>`;
      return;
    }
    const filteredOrders = orders.filter(
      (order) => order.status === "completed" || order.status === "canceled"
    );
    const html = filteredOrders
      .map((order) => {
        console.log(order.order_details);
        const productList = order.order_details
          .map(
            (item) =>
              `${item.products.name} (${item.size}) x${
                item.quantity
              } - ${Number(item.price).toLocaleString()} VND`
          )
          .join("<br>");

        const paymentMethod =
          order.payment && order.payment.length > 0
            ? order.payment[0].method.toUpperCase()
            : "Không xác định";

        return `
        <div class="history-card purchase-card">

          <div class="card-header">
            <h3>Đơn Hàng #${order.order_id}</h3>
            <span class="status">${order.status.toUpperCase()}</span>
          </div>

          <div class="card-body">
            <p><strong>Ngày:</strong> ${order.orderDate}</p>
            <p><strong>Loại đơn:</strong> ${order.order_type}</p>
 

            <p><strong>Sản phẩm:</strong><br>${productList}</p>

            <p><strong>Người nhận:</strong> ${order.receiver_name} (${
          order.receiver_phone
        })</p>

            ${
              order.order_type === "DELIVERY"
                ? `<p><strong>Địa chỉ giao:</strong> ${order.delivery_address}</p>`
                : ""
            }

            <p><strong>Thanh toán:</strong> ${paymentMethod}</p>

            <p><strong>Tổng tiền:</strong> 
              ${Number(order.final_amount).toLocaleString()} VND
            </p>
          </div>

          <div class="card-actions">
            <button class="btn-small" onclick="viewOrderDetails('${
              order.order_id
            }')">
              Xem Chi Tiết
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    container.innerHTML = html;
  }

  window.viewOrderDetails = async function viewOrderDetails(orderId) {
    // Đổi URL khi mở popup (SPA style)
    // if (window.location.pathname !== `/admin/orders/${orderId}`) {
    //   history.pushState({ orderId }, "", `/admin/orders/${orderId}`);
    // }

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
                <span class="modal-info-value" id="modalStatus">${
                  order.data.status
                }</span>
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
  };
  function closeOrderModal() {
    document.getElementById("orderModal").classList.add("hidden");
    document.body.style.overflow = "auto";
    // if (window.location.pathname !== "/admin/orders") {
    //   history.pushState({}, "", "/admin/orders");
    // }
  }

  async function fetchPointsHistory() {
    try {
      const response = await fetch("/data/user");
      const result = await response.json();
      console.log("Points history data:", result.user.point_history);
      renderPointsHistory(result.user.point_history);
    } catch (error) {
      console.error("Error fetching points history:", error);
    }
  }

  fetchPointsHistory();

  function renderPointsHistory(pointsData) {
    const container = document.querySelector(
      "#points-history .points-history-list"
    );
    if (!container) return;

    container.innerHTML = "";

    if (!pointsData || pointsData.length === 0) {
      container.innerHTML = `<p class="no-data">Chưa có lịch sử thay đổi điểm.</p>`;
      return;
    }

    const sortedPoints = pointsData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const html = sortedPoints
      .map((item) => {
        const isIncrease = item.change > 0;
        const changeClass = isIncrease ? "points-increase" : "points-decrease";
        const changeIcon = isIncrease ? "+" : "";

        return `
        <div class="points-history-item">
          <div class="points-item-left">
            <div class="points-icon ${changeClass}">
              <i class="fas fa-${isIncrease ? "arrow-up" : "arrow-down"}"></i>
            </div>
            <div class="points-item-info">
              <h4 class="points-item-title">${
                item.reason || "Thay đổi điểm"
              }</h4>
              <p class="points-item-date">${formatDate(item.created_at)}</p>
              ${
                item.order_id
                  ? `<p class="points-item-order">Đơn hàng #${item.order_id}</p>`
                  : ""
              }
            </div>
          </div>
          <div class="points-item-right">
            <span class="points-change ${changeClass}">
              ${changeIcon}${item.change} điểm
            </span>
           
          </div>
        </div>
      `;
      })
      .join("");

    container.innerHTML = html;
  }

  // Handle Edit Form Submission
  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    // Update display values
    const detailItems = document.querySelectorAll(
      ".user-details-grid .detail-item"
    );
    if (detailItems[0])
      detailItems[0].querySelector(".detail-value").textContent = fullname;
    if (detailItems[1])
      detailItems[1].querySelector(".detail-value").textContent = email;
    if (detailItems[2])
      detailItems[2].querySelector(".detail-value").textContent = address;

    try {
      const response = await fetch("/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: fullname, email, phone, address }),
      });

      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }
      alert("Thông tin đã được cập nhật thành công!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
    }
    // Close form
    editForm.classList.add("hidden");
    toggleEditBtn.textContent = "Chỉnh Sửa";
    toggleEditBtn.style.backgroundColor = "#24A148";
  });
}

// Back Button
const btnBack = document.querySelector(".btn-back");
if (btnBack) {
  btnBack.addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
  });
}

// Logout Button
const btnLogout = document.querySelector(".btn-logout");
if (btnLogout) {
  btnLogout.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Bạn chắc chắn muốn đăng xuất?")) {
      // Redirect to login page
      window.location.href = "/auth/logout";
    }
  });
}

// Avatar Edit Button
const btnEditAvatar = document.querySelector(".btn-edit-avatar");
if (btnEditAvatar) {
  btnEditAvatar.addEventListener("click", () => {
    // Tạo input file ẩn
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn một tệp ảnh");
        return;
      }

      // Kiểm tra kích thước (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB");
        return;
      }

      // Hiển thị loading
      const btn = document.querySelector(".btn-edit-avatar");
      const originalText = btn.textContent;
      btn.textContent = "Đang tải...";
      btn.disabled = true;

      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch("/profile/upload-avatar", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Upload thất bại");
        }

        // Cập nhật ảnh đại diện
        const avatarImg = document.querySelector(".user-avatar1");
        if (avatarImg) {
          avatarImg.src = result.avatar + "?t=" + new Date().getTime();
        }

        alert("Cập nhật ảnh đại diện thành công!");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("Có lỗi xảy ra: " + (error.message || "Vui lòng thử lại"));
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  });
}
