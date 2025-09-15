const openBtn = document.querySelector(".popup_update--btn");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");

openBtn.addEventListener("click", () => {
    overlay.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
});

// Đổi trạng thái button chọn (Price, Status)
document.querySelectorAll(".price-option").forEach((btn) => {
    btn.addEventListener("click", () => {
        document
            .querySelectorAll(".price-option")
            .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

document.querySelectorAll(".status-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document
            .querySelectorAll(".status-btn")
            .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
    });
});
function formatVND(value) {
    if (value === null || value === undefined || value === "") return "";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(value));
}
function vndToInt(vndString) {
    let numericString = String(vndString || "").replace(/[^\d]/g, "");
    return numericString ? parseInt(numericString, 10) : 0;
}

// --- main ---
const sizeButtons = document.querySelectorAll(".size-btn");
const priceInput = document.getElementById("priceInput");
const prices = { M: 0, L: 0, XL: 0 };
let currentSize = "M";

// fallback parse kích thước từ value (trước dấu ':')
function parseSizeFromValue(val) {
    if (!val) return "";
    return String(val).split(":")[0].trim();
}

// Khởi tạo: đảm bảo dataset.size tồn tại cho mọi nút
sizeButtons.forEach((btn) => {
    let size = btn.dataset.size;
    if (!size || size === "") {
        // fallback: parse từ value hoặc textContent
        size =
            parseSizeFromValue(
                btn.value || btn.getAttribute("value") || btn.textContent
            ) || btn.textContent.trim();
        btn.dataset.size = size;
    }
    // set label ban đầu
    btn.value = prices[size] > 0 ? `${size}: ${formatVND(prices[size])}` : size;

    // active nếu đúng default
    if (size === currentSize) btn.classList.add("active");
});

function updateButtonLabels() {
    sizeButtons.forEach((btn) => {
        const size = btn.dataset.size || parseSizeFromValue(btn.value) || "";
        const label =
            prices[size] > 0 ? `${size}: ${formatVND(prices[size])}` : size;
        btn.value = label;
    });
}

// Click size -> active + show raw number to edit
sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        sizeButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        currentSize = btn.dataset.size;
        priceInput.value =
            prices[currentSize] > 0 ? String(prices[currentSize]) : "";
        priceInput.focus();
    });
});

// Input: chỉ lưu số (không set lại priceInput.value để không mất caret)
priceInput.addEventListener("input", (e) => {
    const raw = String(e.target.value).replace(/[^\d]/g, "");
    prices[currentSize] = raw ? parseInt(raw, 10) : 0;

    // cập nhật nhãn cho tất cả nút (an toàn, vì không thay đổi priceInput.value ở event này)
    updateButtonLabels();
});

// Blur: format hiện trong ô input
priceInput.addEventListener("blur", () => {
    if (prices[currentSize] > 0)
        priceInput.value = formatVND(prices[currentSize]);
    else priceInput.value = "";
});

/////upload ảnh
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

// Khi chọn file
fileInput.addEventListener("change", handleFiles);

// Cho phép kéo thả file
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#4a68d6";
});
dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "#ccc";
});
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#ccc";
    handleFiles({ target: { files: e.dataTransfer.files } });
});

// Xử lý hiển thị preview
function handleFiles(e) {
    preview.style.display = "block";
    preview.innerHTML = ""; // clear preview cũ
    const files = e.target.files;
    [...files].forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = document.createElement("img");
            img.src = ev.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

const toggle = document.getElementById("toggle");
const inputBox = document.getElementById("inputBox");
const inputQuantity = document.getElementById("cupInput");

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        cupInput.value = ""; // xoá giá trị thật bên trong
        cupInput.placeholder = "Không giới hạn";
        cupInput.readOnly = true;
    } else {
        cupInput.placeholder = "Nhập số lượng";
        cupInput.readOnly = false;
    }
});
