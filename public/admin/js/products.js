// Menu data
const menuItems = [
    {
        id: 1,
        name: "Kiwi New Zealand",
        price: { M: 3.2, L: 4.2, XL: 5.2 },
        rating: 3,
        image: "/images/products/Phê nâu.jpg",
    },
    {
        id: 2,
        name: "Kiwi New Zealand",
        price: { M: 3.2, L: 4.2, XL: 5.2 },
        rating: 4,
        image: "/images/products/Phê nâu.jpg",
    },
    {
        id: 3,
        name: "Kiwi New Zealand",
        price: { M: 3.2, L: 4.2, XL: 5.2 },
        rating: 4,
        image: "/images/products/Phê nâu.jpg",
    },
    {
        id: 4,
        name: "Kiwi New Zealand",
        price: { M: 3.2, L: 4.2, XL: 5.2 },
        rating: 4,
        image: "/images/products/Phê nâu.jpg",
    },
    {
        id: 5,
        name: "Kiwi New Zealand",
        price: { M: 3.2, L: 4.2, XL: 5.2 },
        rating: 4,
        image: "/images/products/Phê nâu.jpg",
    },
    {
        id: 6,
        name: "Kiwi New Zealand",
        price: { M: 3.2, L: 4.2, XL: 5.2 },
        rating: 4,
        image: "/images/products/Phê nâu.jpg",
    },
    {
        id: 7,
        name: "Kiwi New Zealand",
        price: { M: 3.2, L: 4.2, XL: 5.2 },
        rating: 4,
        image: "/images/products/Phê nâu.jpg",
    },
    {
        id: 8,
        name: "Kiwi New Zealand",
        price: { M: 3.2, L: 4.2, XL: 5.2 },
        rating: 4,
        image: "/images/products/Phê nâu.jpg",
    },
];

// DOM Elements
const categoryItems = document.querySelectorAll(".category-image img");
const searchInput = document.querySelector(".search-input");
const menuGrid = document.querySelector(".menu-grid");
const resetFilterBtn = document.querySelector(".reset-filter");

const categoryNav = document.querySelector(".explore__menu--list");
const categoryNavContainer = document.querySelector(".category-nav-container");
const scrollLeftBtn = document.getElementById("scrollLeft");
const scrollRightBtn = document.getElementById("scrollRight");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    renderMenuItems();
    setupEventListeners();
    initScrollNavigation();
});
function initScrollNavigation() {
    checkScrollButtons();

    // Scroll left button
    scrollLeftBtn.addEventListener("click", function () {
        categoryNav.scrollBy({
            left: -200,
            behavior: "smooth",
        });
    });

    // Scroll right button
    scrollRightBtn.addEventListener("click", function () {
        categoryNav.scrollBy({
            left: 200,
            behavior: "smooth",
        });
    });

    // Check scroll position on scroll
    categoryNav.addEventListener("scroll", checkScrollButtons);

    // Check on window resize
    window.addEventListener("resize", checkScrollButtons);
}

function checkScrollButtons() {
    const container = categoryNav;
    const isScrollable = container.scrollWidth > container.clientWidth;
    const isAtStart = container.scrollLeft <= 0;
    const isAtEnd =
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth - 1;

    // Show/hide arrows based on scroll position and content overflow
    if (isScrollable) {
        scrollLeftBtn.classList.toggle("show", !isAtStart);
        scrollRightBtn.classList.toggle("show", !isAtEnd);
        categoryNavContainer.classList.add("show-fade");
    } else {
        scrollLeftBtn.classList.remove("show");
        scrollRightBtn.classList.remove("show");
        categoryNavContainer.classList.remove("show-fade");
    }
}
// Event Listeners
function setupEventListeners() {
    // Category navigation
    categoryItems.forEach((item) => {
        item.addEventListener("click", function () {
            categoryItems.forEach((cat) => cat.classList.remove("active"));
            this.classList.add("active");
            showToast(
                `Switched to ${this.querySelector("span").textContent} category`
            );
        });
    });

    // Search functionality
    searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        filterMenuItems(searchTerm);
    });

    // Reset filter
    resetFilterBtn.addEventListener("click", function () {
        searchInput.value = "";
        categoryItems.forEach((cat) => cat.classList.remove("active"));
        categoryItems[0].classList.add("active");
        renderMenuItems();
        showToast("Filters reset");
    });

    // Add new dish
    document
        .querySelector(".add-new-card")
        .addEventListener("click", function () {
            showToast("Add new dish feature coming soon!");
        });
}

// Render menu items
function renderMenuItems() {
    const addNewCard = document.querySelector(".add-new-card");
    menuGrid.innerHTML = "";
    menuGrid.appendChild(addNewCard);

    menuItems.forEach((item) => {
        const menuCard = createMenuCard(item);
        menuGrid.appendChild(menuCard);
    });
}

// Create menu card
function createMenuCard(item) {
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
    
                <div class="menu-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="menu-info">
                 <div class="menu__info-header">
                    <div class="rating">
                        ${generateStars(item.rating)}
                    </div>
                     <div class="type">
                        Trà sữa
                    </div>
                  </div>  
                    <h3>${item.name}</h3>
                    <div class="size-options">
                        <button class="size-btn" data-size="M"><span class="product_size">M</span> <span class="product_price">66.000 đ</span></button>
                        <button class="size-btn active" data-size="L"><span class="product_size">L</span> <span class="product_price">66.000 đ</span></button>
                        <button class="size-btn" data-size="XL"><span class="product_size">XL</span> <span class="product_price">66.000 đ</span></button>
                    </div>
                   
                </div>
                 <div class="product__edit" ><p>Chỉnh sửa sản phẩm</p></div>
            `;

    // Size selection
    const sizeButtons = card.querySelectorAll(".size-btn");
    const priceElement = card.querySelector(".price");
    // const productCart = card.querySelectorAll(".menu-card");
    const edit = card.querySelector(".product__edit");

    sizeButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            sizeButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
            const size = this.dataset.size;
            priceElement.textContent = `$${item.price[size]}`;
        });
    });
    // Hover trên card để show/hide edit
    card.addEventListener("mouseenter", () => {
        edit.classList.add("editShow");
    });
    card.addEventListener("mouseleave", () => {
        edit.classList.remove("editShow");
    });
    // // Add to cart
    // card.querySelector(".add-btn").addEventListener("click", function () {
    //     const activeSize = card.querySelector(".size-btn.active").dataset.size;
    //     showToast(`Added ${item.name} (${activeSize}) to cart`);

    //     // Animation effect
    //     this.style.transform = "scale(0.8)";
    //     setTimeout(() => {
    //         this.style.transform = "scale(1)";
    //     }, 150);
    // });

    return card;
}

// Generate star rating
function generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Filter menu items
function filterMenuItems(searchTerm) {
    const filteredItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
    );

    const addNewCard = document.querySelector(".add-new-card");
    menuGrid.innerHTML = "";
    menuGrid.appendChild(addNewCard);

    filteredItems.forEach((item) => {
        const menuCard = createMenuCard(item);
        menuGrid.appendChild(menuCard);
    });
}

// Toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    // Hide toast
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Pagination functionality
document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
        document
            .querySelectorAll(".page-btn")
            .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        showToast(`Switched to page ${this.textContent}`);
    });
});
