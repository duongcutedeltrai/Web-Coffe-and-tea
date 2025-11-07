$(document).ready(function () {
    const firstSize = $("#firstSize").text().trim();
    let pricingMode = firstSize === "DEFAULT" ? "default" : "size";
    let isLoading = false;
    let prices = {
        defaultPrice: "",
        sizeM: "",
        sizeL: "",
        sizeXL: "",
    };
  if (sessionStorage.getItem("openPopup") === "true") {
        sessionStorage.removeItem("openPopup"); // xóa flag
        $(".popup_update--btn").trigger("click"); // mở popup
    };
    function setPricingMode(mode) {
        if (mode !== pricingMode) {
            if (mode === "default") {
                // Reset size inputs to 0
                prices.sizeM = "0";
                prices.sizeL = "0";
                prices.sizeXL = "0";
                $("#sizeM").val("");
                $("#sizeL").val("");
                $("#sizeXL").val("");
                $("#sizeMFormatted").text("0 VNĐ");
                $("#sizeLFormatted").text("0 VNĐ");
                $("#sizeXLFormatted").text("0 VNĐ");
            } else {
                // Reset default input to 0
                prices.defaultPrice = "0";
                $("#defaultPrice").val("");
                $("#defaultPriceFormatted").text("0 VNĐ");
            }
        }

        pricingMode = mode;
        updateDisplay();
    }

    function updateDisplay() {
        // Toggle buttons
        $("#defaultBtn").toggleClass("active", pricingMode === "default");
        $("#sizeBtn").toggleClass("active", pricingMode === "size");

        // Show/hide sections
        $("#defaultSection").toggleClass("hidden", pricingMode !== "default");
        $("#sizeSection").toggleClass("hidden", pricingMode !== "size");
    }

    function handleInputChange(field, value) {
        const numericValue = value.replace(/[^0-9]/g, ""); // chỉ lấy số
        prices[field] = numericValue || "";

        // luôn đồng bộ value của input
        $("#" + field).val(prices[field]);

        updateFormattedPrice(field, prices[field]);
    }

    function updateFormattedPrice(field, value) {
        const formattedValue = formatPrice(value);
        const displayElement = $("#" + field + "Formatted");
        if (displayElement.length) {
            displayElement.text(formattedValue ? `${formattedValue} VNĐ` : "");
        }
    }

    function formatPrice(price) {
        if (!price) return "";
        return new Intl.NumberFormat("vi-VN").format(parseFloat(price));
    }

    async function handleSubmit() {
        if (isLoading) return;
        setLoading(true);
        hideMessage();

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            showMessage("Cập nhật giá thành công!", "success");

            setTimeout(() => hideMessage(), 3000);
        } catch (error) {
            showMessage("Có lỗi xảy ra khi cập nhật giá!", "error");
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        prices = {
            defaultPrice: "",
            sizeM: "",
            sizeL: "",
            sizeXL: "",
        };

        $("#defaultPrice, #sizeM, #sizeL, #sizeXL").val("");
        $(
            "#defaultPriceFormatted, #sizeMFormatted, #sizeLFormatted, #sizeXLFormatted"
        ).text("");
        hideMessage();
    }

    function setLoading(loading) {
        isLoading = loading;
        const $submitBtn = $("#submitBtn");
        const $submitText = $("#submitText");
        const $resetBtn = $("#resetBtn");

        if (loading) {
            $submitBtn.prop("disabled", true);
            $resetBtn.prop("disabled", true);
            $submitText.html(
                '<div class="loading-spinner"></div> Đang cập nhật...'
            );
        } else {
            $submitBtn.prop("disabled", false);
            $resetBtn.prop("disabled", false);
            $submitText.html(`
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17,21 17,13 7,13 7,21"/>
          <polyline points="7,3 7,8 15,8"/>
        </svg>
        Cập Nhật Giá
      `);
        }
    }

    function showMessage(text, type) {
        $("#message")
            .text(text)
            .attr("class", `message ${type}`)
            .removeClass("hidden");
    }

    function hideMessage() {
        $("#message").addClass("hidden");
    }

    // --- Bind events ---
    $("#defaultBtn").on("click", () => setPricingMode("default"));
    $("#sizeBtn").on("click", () => setPricingMode("size"));

    $("#defaultPrice").on("input", (e) =>
        handleInputChange("defaultPrice", e.target.value)
    );
    $("#sizeM").on("input", (e) => handleInputChange("sizeM", e.target.value));
    $("#sizeL").on("input", (e) => handleInputChange("sizeL", e.target.value));
    $("#sizeXL").on("input", (e) =>
        handleInputChange("sizeXL", e.target.value)
    );

    $("#priceForm").on("submit", (e) => {
        e.preventDefault();
        handleSubmit();
    });

    $("#resetBtn").on("click", () => handleReset());

    // --- Init ---
    updateDisplay();
    ["defaultPrice", "sizeM", "sizeL", "sizeXL"].forEach((field) => {
        const value = $("#" + field).val();
        if (value) {
            prices[field] = value.replace(/[^0-9]/g, "");
            $("#" + field).val(prices[field]); // đồng bộ lại value input
            updateFormattedPrice(field, prices[field]);
        }
    });
});
document.getElementById("toggle").checked = true;

const overlay = $("#overlay");
const priceInput = $("#priceInput");
let priceTypeSize = true; // true = giá theo size, false = giá cố định

// --- Format VND ---
function formatVND(value) {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(value));
}

// --- Cập nhật label + hidden cho 1 size ---

// --- Popup mở ---
$(document).on("click", ".popup_update--btn", () => {
    overlay.addClass("active");
});

$(document).on("click", ".back-btn", () => overlay.removeClass("active"));

// --- Toggle số lượng ---
const toggle = $("#toggle");
const cupInput = $("#cupInput");
if(cupInput.val()==-1){
     toggle.prop("checked", true);
     cupInput
            .val("-1")
            .attr({ placeholder: "Không giới hạn", readonly: true })
            .hide();
}
else{
    toggle.prop("checked", false);
    
}
function toggleCheck() {
    if (toggle.prop("checked")) {
        cupInput
            .val("-1")
            .attr({ placeholder: "Không giới hạn", readonly: true })
            .hide();
    } else {
        cupInput
            .val("")
            .attr({ placeholder: "Nhập số lượng", readonly: false })
            .show();
    }
}
toggle.on("change", toggleCheck);

$(".status-btn").on("click", function () {
    $(".status-btn").removeClass("active"); // bỏ active tất cả
    $(this).addClass("active");             // set active nút vừa click
    $(".input__status").val($(this).data("status")); // gán giá trị status vào input ẩn
});

///logic categories
const productCategoryId = $("#CategoryProduct").text().trim();
if (productCategoryId) {
    $("#category").val(productCategoryId);
}
const dropArea = $("#dropArea");
const fileInput = $("#fileInput");
const preview = $("#preview");
function handleFiles(files) {
    preview.show().empty();
    [...files].forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const item = $(`
                <div class="preview-item">
                    <img src="${ev.target.result}" class="preview-img"/>
                    <button type="button" class="remove-btn">&times;</button>
                </div>
            `);
            preview.append(item);
        };
        reader.readAsDataURL(file);
    });
}

fileInput.on("change", function () {
    handleFiles(this.files);
    // $("fileInput").val(this.file);
});

dropArea.on("dragover", (e) => {
    e.preventDefault();
    dropArea.css("border-color", "#4a68d6");
});
dropArea.on("dragleave", () => dropArea.css("border-color", "#ccc"));
dropArea.on("drop", (e) => {
    e.preventDefault();
    dropArea.css("border-color", "#ccc");
    handleFiles(e.originalEvent.dataTransfer.files);
});

// Xóa ảnh khi click nút remove
preview.on("click", ".remove-btn", function () {
    $(this).closest(".preview-item").remove();

    // Nếu không còn ảnh nào, ẩn khung preview
    if (preview.children().length === 0) {
        preview.hide();
        $("#fileInput").val()="";
    }
});


// --- Submit form ---
$(".product-form").on("submit", function (e) {
    e.preventDefault();
    const path = window.location.pathname;
    $(".error-message").remove();

    const formData = new FormData(this);

    $.ajax({
        url: path,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.success) {
                console.log("Response:", res);
                $(".product-form")[0].reset();
               
                Swal.fire({
                    title: "Đã chỉnh sửa thành công thành công!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3aa555ff",                   
                    draggable: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Reload trang để gọi backend lấy dữ liệu mới
                        window.location.reload();
                        // hoặc: window.location.href = window.location.href;
                    }
                });
            } else if (res.errors) {
                res.errors.forEach((err) => {
                     const input = $(`[name="${err.field}"]`);
                    if (input.length) {
                        input.addClass("is-invalid");

                        // Nếu đã có message cũ, xóa đi để không bị trùng
                        input.next(".error-message").remove();

                        input.after(
                            `<div class="error-message text-danger">${err.message}</div>`
                        );
                    }
                });
            } else {
                alert("❌ " + res.message);
            }
        },
        error: function (xhr) {
            let errMsg = "Lỗi server";
            if (xhr.responseJSON && xhr.responseJSON.message)
                errMsg = xhr.responseJSON.message;
            Swal.fire("Lỗi hình ảnh", errMsg, "error");
        },
    });
});
