$(document).ready(function () {
    document.getElementById("toggle").checked = true;
    // --- Popup ---
    const overlay = $("#overlay");
    $(document).on("click", ".popup_update--btn", () =>
        overlay.addClass("active")
    );
    $(document).on("click", ".back-btn", () => overlay.removeClass("active"));

    // --- Button chọn Price / Status ---
    $(".price-option").on("click", function () {
        $(".price-option").removeClass("active");
        $(this).addClass("active");
    });

    $(".status-btn").on("click", function () {
        $(".status-btn").removeClass("active");
        $(this).addClass("active");
        $(".input__status").val($(this).data("status"));
    });

    // --- Format VND ---
    function formatVND(value) {
        if (!value) return "";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(Number(value));
    }

    function vndToInt(vndString) {
        return parseInt(String(vndString || "").replace(/[^\d]/g, "")) || 0;
    }

    // --- Toggle Pricing ---
    let priceTypeSize = true; // true = giá theo size, false = giá cố định
    $("#togglePricing").on("click", function () {
        priceTypeSize = !priceTypeSize;
        if (priceTypeSize) {
            $(".sizes__form").css("display", "flex");
            $(this).text("Giá cố định");
            $("#priceInput").attr("placeholder", "Nhập giá theo size");
            $("#Default_hidden").val(""); // reset giá cố định
        } else {
            $(".sizes__form").css("display", "none");
            $(this).text("Thêm size");
            $("#priceInput").attr("placeholder", "Nhập giá cố định");
            priceInput.val("");
            $("#sizeM_hidden").val("");
            $("#sizeL_hidden").val("");
            $("#sizeXL_hidden").val("");
            $(".size").each(function () {
                const size = $(this).data("size"); // M / L / XL
                $(this).val(`${size}:`);
            });
            prices = { M: 0, L: 0, XL: 0 };
        }
    });

    // --- Size Buttons & Input Price ---
    const sizeButtons = $(".size");
    const priceInput = $("#priceInput");
    let prices = { M: 0, L: 0, XL: 0 };
    let currentSize = "M";

    // Cập nhật nhãn nút size
    function updateButtonLabels() {
        sizeButtons.each(function () {
            const $btn = $(this);
            const size = $btn.data("size");
            const label =
                prices[size] > 0
                    ? `${size}: ${formatVND(prices[size])}`
                    : `${size}:`;
            const data = vndToInt(label.split(":")[1]);
            if (size == "M") {
                $("#sizeM_hidden").val(data);
            } else if (size == "L") {
                $("#sizeL_hidden").val(data);
            } else if (size == "XL") {
                $("#sizeXL_hidden").val(data);
            }
            $btn.val(label);
        });
    }

    // Khởi tạo nút size
    sizeButtons.each(function () {
        const $btn = $(this);
        let size = $btn.data("size") || $btn.text().trim();
        $btn.data("size", size);
        $btn.val(`${size}:`); // luôn hiển thị M: L: XL:
        if (size === currentSize) $btn.addClass("active");
    });

    // Click size -> active + hiển thị số thực để edit
    sizeButtons.on("click", function () {
        sizeButtons.removeClass("active");
        $(this).addClass("active");
        currentSize = $(this).data("size");
        priceInput.val(prices[currentSize] > 0 ? prices[currentSize] : "");
        priceInput.focus();
    });

    // Nhập giá
    priceInput.on("input", function () {
        const raw = $(this).val().replace(/[^\d]/g, "");
        if (priceTypeSize) {
            // Giá theo size
            prices[currentSize] = raw ? parseInt(raw, 10) : 0;
            updateButtonLabels();
        } else {
            // Giá cố định
            $("#Default_hidden").val(raw);
        }
    });

    // Blur: format VND hiển thị
    priceInput.on("blur", function () {
        if (priceTypeSize) {
            priceInput.val(
                prices[currentSize] > 0 ? formatVND(prices[currentSize]) : ""
            );
        } else {
            const val = $("#Default_hidden").val();
            priceInput.val(val ? formatVND(val) : "");
        }
    });

    // Reset form sau submit
    function resetSizes() {
        sizeButtons.each(function () {
            const size = $(this).data("size");
            $(this).val(`${size}:`); // nhãn luôn M: L: XL:
            prices[size] = 0;
            $(this).removeClass("active");
        });
        currentSize = "M";
        sizeButtons.filter(`[data-size="${currentSize}"]`).addClass("active");
    }

    // --- Toggle số lượng ---
    const toggle = $("#toggle");
    const cupInput = $("#cupInput");

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
    toggleCheck();

    // --- Upload ảnh ---
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

    // --- Submit form ---
    $(".product-form").on("submit", function (e) {
        e.preventDefault();

        // Lưu giá ẩn
        $("#sizeM_hidden").val(prices.M);
        $("#sizeL_hidden").val(prices.L);
        $("#sizeXL_hidden").val(prices.XL);

        $(".error-message").remove();
        $("input, textarea, select").removeClass("is-invalid");

        const formData = new FormData(this);
        $.ajax({
            url: "/api/admin/products",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.success) {
                    $(".product-form")[0].reset();
                    sizeButtons.each(function () {
                        const size = $(this).data("size");
                        $(this).val(`${size}:`);
                        prices[size] = 0;
                        $(this).removeClass("active");
                    });
                    $(".preview-item img").attr("src", "");
                    $("#overlay").removeClass("active");
                    currentSize = "M";
                    resetSizes();
                    sizeButtons
                        .filter(`[data-size="${currentSize}"]`)
                        .addClass("active");
                    Swal.fire({
                        title: "Đã thêm sản phẩm mới thành công!",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#3aa555ff",
                        draggable: true,
                    });
                } else if (res.errors) {
                    res.errors.forEach((err) => {
                        const input = err.field.match(/size[MLX]/i)
                            ? $("#priceInput")
                            : $(`[name="${err.field}"]`);
                        input.addClass("is-invalid");
                        input.after(
                            `<div class="error-message text-danger">${err.message}</div>`
                        );
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
});
