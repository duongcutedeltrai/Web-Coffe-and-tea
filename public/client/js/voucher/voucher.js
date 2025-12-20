 const vouchers = [
     
    ];
let products = [];
    // Utility functions
    function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    function formatDateLong(dateString) {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    function isExpired(endDate) {
      return new Date(endDate) < new Date();
    }

    function getMembershipName(membership) {
      const names = {
        bronze: "Bronze",
        silver: "Silver",
        gold: "Gold",
        platinum: "Platinum",
      };
      return names[membership] || membership;
    }

    // Render voucher cards
    function renderVouchers() {
      const grid = document.getElementById("voucherGrid");
      grid.innerHTML = vouchers
        .map(
          (voucher) => `
        <div class="voucher-card" onclick="openModal(${JSON.stringify(voucher).replace(/"/g, '&quot;')})">
          <div class="voucher-card-header">
            ${voucher.is_for_new_user ? '<span class="voucher-badge">⭐ Mới</span>' : ""}
            <div class="voucher-code">${voucher.code}</div>
            <div class="voucher-description">${voucher.description}</div>
          </div>

          <div class="discount-box">
            <div class="discount-value">${voucher.discount_percent ? voucher.discount_percent + "%" : "₫" + voucher.discount_price}</div>
            <div class="discount-label">Giảm giá</div>
          </div>

          <div class="voucher-card-content">
            ${
              isExpired(voucher.end_date)
                ? `
              <div class="status-box status-expired">
                <p>Đã hết hạn</p>
                <p class="usage-text">Kết thúc vào ${formatDate(voucher.end_date)}</p>
              </div>
            `
                : `
              <div class="status-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <span class="detail-label">Đã sử dụng</span>
                  <span class="detail-value">${voucher.promotion_usage.length}/${voucher.max_usage_count}</span>
                </div>
                <div class="usage-bar">
                  <div class="usage-fill" style="width: ${Math.min((voucher.promotion_usage.length / voucher.max_usage_count) * 100, 100)}%"></div>
                </div>
              </div>
            `
            }

            <div style="margin-top: 1rem;">
              <div class="detail-row">
                <span class="detail-label">Đơn hàng tối thiểu:</span>
                <span class="detail-value">${Number.parseInt(voucher?.min_order_amount||0).toLocaleString()}đ</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Hết hạn:</span>
                <span class="detail-value">${formatDate(voucher.end_date)}</span>
              </div>
            </div>

            <div class="membership-section">
              <span class="membership-label">Áp dụng cho:</span>
              <div class="membership-badges">
                ${voucher.applicable_membership.map((m) => `<span class="membership-badge">${getMembershipName(m)}</span>`).join("")}
              </div>
            </div>

            <button class="btn-view-details" ${isExpired(voucher.end_date) ? "disabled" : ""}>
              Xem Chi Tiết
              <span>→</span>
            </button>
          </div>
        </div>
      `
        )
        .join("");
    }

    // Modal functions
    function openModal(voucher) {
      const usagePercentage = (voucher.promotion_usage.length / voucher.max_usage_count) * 100;
      const expired = isExpired(voucher.end_date);

      const modalBody = document.getElementById("modalBody");
      modalBody.innerHTML = `
        <div class="modal-section">
          <div class="code-copy-section">
            <span class="code-copy-label">Mã Giảm Giá</span>
            <div class="code-copy-container">
              <div class="code-display">${voucher.code}</div>
              <button class="btn-copy" onclick="copyCode('${voucher.code}')">
                <span id="copyIcon"></span>
                <span id="copyText">Sao Chép</span>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-section">
          <div class="info-grid">
            <div class="info-box ${expired ? "expired" : "status"}">
              <span class="info-box-label">Trạng Thái</span>
              <div class="info-box-value">${expired ? "Đã Hết Hạn" : "Hoạt Động"}</div>
            </div>
            <div class="info-box">
              <span class="info-box-label">Giảm Giá</span>
              <div class="info-box-value">${voucher.discount_percent ? voucher.discount_percent + "%" : "₫" + voucher.discount_price}</div>
            </div>
          </div>
        </div>

        <div class="modal-section">
          <span class="section-title">Mô Tả</span>
          <div class="description-box">${voucher.description}</div>
        </div>

        <div class="modal-section">
          <span class="section-title">Thời Hạn</span>
          <div class="dates-section">
            <div class="date-item">
              <span class="detail-label">Ngày Bắt Đầu:</span>
              <span class="detail-value">${formatDateLong(voucher.start_date)}</span>
            </div>
            <div class="date-item">
              <span class="detail-label">Ngày Kết Thúc:</span>
              <span class="detail-value">${formatDateLong(voucher.end_date)}</span>
            </div>
          </div>
        </div>

        <div class="modal-section">
          <span class="section-title">Thống Kê Sử Dụng</span>
          <div class="usage-stats">
            <div class="usage-info">
              <span class="detail-label">Lần Sử Dụng:</span>
              <span class="detail-value">${voucher.promotion_usage.length} / ${voucher.max_usage_count}</span>
            </div>
            <div class="usage-bar">
              <div class="usage-fill" style="width: ${Math.min(usagePercentage, 100)}%"></div>
            </div>
            <div class="usage-percentage">${Math.round(usagePercentage)}% đã sử dụng</div>
          </div>
        </div>

        <div class="modal-section">
          <span class="section-title">Điều Kiện Áp Dụng</span>
          <div class="date-item">
            <span class="detail-label">Đơn Hàng Tối Thiểu:</span>
            <span class="detail-value">${Number.parseInt(voucher.min_order_amount||0).toLocaleString()}đ</span>
          </div>
        </div>

        <div class="modal-section">
          <span class="section-title">Cấp Độ Thành Viên</span>
          <div class="membership-badges">
            ${voucher.applicable_membership.map((m) => `<span class="membership-badge">${getMembershipName(m)}</span>`).join("")}
          </div>
        </div>

        ${
          voucher.is_for_new_user
            ? `
          <div class="modal-section">
            <div class="special-info">⭐ Voucher này chỉ áp dụng cho khách hàng mới</div>
          </div>
        `
            : ""
        }

        <div class="modal-actions">
          <button class="btn-modal btn-close-modal" onclick="closeModal()">Đóng</button>
          <button class="btn-modal btn-copy-modal" onclick="copyCode('${voucher.code}')" ${expired ? "disabled" : ""}>
            Sao Chép Mã
          </button>
        </div>
      `;

      document.getElementById("modalOverlay").classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      document.getElementById("modalOverlay").classList.remove("active");
      document.body.style.overflow = "auto";
    }

    function copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        const copyIcon = document.getElementById("copyIcon");
        const copyText = document.getElementById("copyText");
        if (copyIcon) copyIcon.textContent = "✓";
        if (copyText) copyText.textContent = "Đã Sao Chép!";
        setTimeout(() => {
          if (copyIcon) copyIcon.textContent = "";
          if (copyText) copyText.textContent = "Sao Chép";
        }, 2000);
      });
    }

    // Close modal on overlay click
    document.getElementById("modalOverlay").addEventListener("click", (e) => {
      if (e.target === document.getElementById("modalOverlay")) {
        closeModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });

  async function loadVouchers() {


  try {
    const res = await fetch("http://localhost:3000/admin/data/promotions/voucher", {
      headers: {
        // Nếu cần token thì bật dòng dưới:
        // "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      throw new Error("Lỗi khi gọi API: " + res.status);
    }

    const data = await res.json();

    // Giả sử API trả về danh sách voucher
    const voucherss = Array.isArray(data) ? data : data.data || [];

    voucherss.forEach((item) => {
     vouchers.push(item);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="4" style="color:red;text-align:center;">Lỗi tải dữ liệu</td></tr>`;
  }
}

    document.addEventListener("DOMContentLoaded", async () => {
  await loadVouchers();
 dataFlashsale = localStorage.getItem("flashsale-product");
    products = dataFlashsale ? JSON.parse(dataFlashsale) : [];
  renderVouchers(); // Nếu bạn cần render thêm sau khi load
});