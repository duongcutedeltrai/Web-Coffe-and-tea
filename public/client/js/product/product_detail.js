function formatVND(amount) {
    return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}

function pdToggleFavorite(button) {
    button.classList.toggle("active");
    button.style.transform = "scale(1.2)";
    setTimeout(() => (button.style.transform = ""), 200);
}

// =========================
//  SIZE SELECTION
// =========================
const sizeOptions = document.querySelectorAll(".size-option");
const priceEl = document.querySelector(".price");
sizeOptions.forEach((option) => {
    option.addEventListener("click", () => {
        sizeOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");
        const newPrice = parseInt(option.dataset.price, 10);
        if (!isNaN(newPrice)) priceEl.textContent = formatVND(newPrice);
    });
});

// =========================
//  REVIEW SYSTEM
// =========================
let selectedRating = 0;
let uploadedImages = []; // ⚡ Chỉ chứa File object
const maxImages = 3;

// Star rating
const ratingStars = document.querySelectorAll(".star-rating");
const submitButton = document.getElementById("submitReview");

ratingStars.forEach((star) => {
    star.addEventListener("click", function () {
        selectedRating = Number(this.dataset.rating);
        updateStars(selectedRating);
        updateSubmitButton();
    });

    star.addEventListener("mouseenter", function () {
        updateStars(Number(this.dataset.rating));
    });
});

document.getElementById("ratingStars").addEventListener("mouseleave", () => {
    updateStars(selectedRating);
});

function updateStars(rating) {
    ratingStars.forEach((star, index) =>
        star.classList.toggle("active", index < rating)
    );
}

// =========================
//  IMAGE UPLOAD
// =========================
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const uploadLabel = document.getElementById("uploadLabel");

imageUpload.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
        if (uploadedImages.length < maxImages) {
            uploadedImages.push(file); // ✅ Lưu File object thật
        }
    });

    renderImagePreviews();
    e.target.value = ""; // reset input
});

function renderImagePreviews() {
    imagePreview.innerHTML = "";

    uploadedImages.forEach((file, index) => {
        const imgBox = document.createElement("div");
        imgBox.className = "image-icon-box";
        imgBox.style.cssText = `
            position: relative;
            width: 100px;
            height: 100px;
        `;

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file); // ✅ hiển thị ảnh từ File object
        img.style.cssText = `
            width:100px; height:100px; object-fit:cover;
            border-radius:8px; box-shadow: 0 0 0 0.2rem rgba(139,69,19,0.1);
            margin-top: 15px;
        `;

        const btn = document.createElement("button");
        btn.textContent = "×";
        btn.className = "remove-image";
        btn.style.cssText = `
            position:absolute; top:3px; right:3px;
            background:#714024; color:white;
            border-radius:50%; width:20px; height:20px;
            cursor:pointer; font-size:14px; line-height:17px;
        `;
        btn.onclick = () => removeImage(index);

        imgBox.append(img, btn);
        imagePreview.appendChild(imgBox);
    });

    uploadLabel.style.display =
        uploadedImages.length >= maxImages ? "none" : "flex";
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderImagePreviews();
}

// =========================
//  SUBMIT REVIEW
// =========================
submitButton.addEventListener("click", async () => {
    const reviewText = document.getElementById("reviewText").value.trim();
    const pathParts = window.location.pathname.split("/");
    const productId = pathParts[pathParts.length - 1];

    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("rating", selectedRating);
    formData.append("comment", reviewText);

    // ✅ append file thực
    uploadedImages.forEach((file) => formData.append("images", file));

    try {
        const res = await fetch("/feedback", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Đánh giá thất bại");
        }

        Swal.fire({
            title: "Đánh giá thành công",
            icon: "success",
            confirmButtonColor: "#8d5521ff",
        });

        resetReviewForm();
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("reviewModal")
        );
        modal.hide();
    } catch (err) {
        console.error(err);
        Swal.fire({
            title: err.message,
            icon: "error",
            confirmButtonColor: "#8d5521ff",
            confirmButtonText: "Thoát",
        });
    }
});

function resetReviewForm() {
    selectedRating = 0;
    uploadedImages = [];
    document.getElementById("reviewText").value = "";
    updateStars(0);
    renderImagePreviews();
    updateSubmitButton();
}

function updateSubmitButton() {
    submitButton.disabled = selectedRating === 0;
}

// Reset khi đóng modal
document
    .getElementById("reviewModal")
    .addEventListener("hidden.bs.modal", resetReviewForm);

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".rating-fill").forEach(function (bar) {
        const percent = bar.getAttribute("data-percent");
        if (percent) {
            bar.style.width = percent + "%";
        }
    });
});
