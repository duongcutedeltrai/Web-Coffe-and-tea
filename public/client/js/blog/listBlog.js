// Sample data
let products = [];
const blogPosts = [
  {
    id: "1",
    title: "CBD Oil for Dogs: What You Need to Know",
    excerpt:
      "Discover the comprehensive guide to CBD oil for your canine companions. Learn about benefits, dosage, safety considerations, and what veterinarians recommend for your furry friends' wellness journey.",
    image: "dog-with-treats.jpg",
    date: "Sunday Sep. 13, 2025",
    comments: 0,
    category: "Pet Care",
  },
  {
    id: "2",
    title: "Edible Dessert Chart: Quick and Easy Guide to Taking Weed Edibles",
    excerpt:
      "Master the art of understanding edible potency and dosing with our comprehensive chart. Learn how to calculate the right dose, understand different types of edibles, and consume responsibly.",
    image: "edible-desserts.jpg",
    date: "September 12, 2025",
    comments: 0,
    category: "Guides",
  },
  {
    id: "3",
    title: "The OCS Guide to Entertaining With Cannabis",
    excerpt:
      "Elevate your social gatherings with expert tips on hosting cannabis-friendly events. Explore etiquette, product selection, pairing suggestions, and how to create an welcoming atmosphere for all guests.",
    image: "cannabis-entertaining.jpg",
    date: "September 12, 2025",
    comments: 0,
    category: "Lifestyle",
  },
];
const blogList = document.getElementById("blog-list");
function renderBlogPosts(posts) {
  blogList.innerHTML = ""; // reset container
  posts.forEach((post, index) => {
    const article = document.createElement("article");
    article.className = "blog-card";
    article.style.transitionDelay = `${index * 0.1}s`;
    article.innerHTML = `
      <div class="blog-img">
        <img src="${post.thumbnail}" alt="${post.title}">
      </div>
      <div class="blog-content">
        <div>
          <div class="meta">
            ${post.type ? `<span class="category">${post.type}</span>` : ""}
            <div><i class="fa-solid fa-calendar" style="color: #71320e;margin-right:6px;"></i>
            <time>${new Date(post.created_at).toLocaleDateString("en-US", {month: 'short', day: 'numeric', year:'numeric'})}</time></div>
          </div>
          <h2 class="blog-title">${post.title}</h2>
          <p class="blog-excerpt">${post.description || post.excerpt || ""}</p>
        </div>
        <a href="blogs/${post.blog_id}" class="read-more">Đọc bài viết →</a>
      </div>
    `;
    blogList.appendChild(article);
  });
  revealCards(); // thêm animation scroll
}

async function fetchBlogPosts() {
  try {
    const res = await fetch("http://localhost:3000/admin/data/blogs");
    if (!res.ok) throw new Error("Failed to fetch blogs");
    const data = await res.json();
    renderBlogPosts(data);
    dataFlashsale = localStorage.getItem("flashsale-product");
    products = dataFlashsale ? JSON.parse(dataFlashsale) : [];
  } catch (err) {
    console.error("Lỗi khi fetch blog posts:", err);
    blogList.innerHTML = `<p>Không thể tải bài viết.</p>`;
  }
}
// Header fade-in
const header = document.querySelector(".header");
window.addEventListener("load", () => {
  setTimeout(() => header.classList.add("show"), 100);
});

function revealCards() {
  const cards = document.querySelectorAll(".blog-card");
  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    // Hiển thị card đầu tiên ngay lập tức
    if (index === 0) {
      card.classList.add("visible");
    } else if (rect.top < window.innerHeight + 100) {
      card.classList.add("visible");
    }
  });
}

// Gọi ngay khi load trang
window.addEventListener("DOMContentLoaded", revealCards);
window.addEventListener("DOMContentLoaded", fetchBlogPosts);
// Gọi khi scroll
window.addEventListener("scroll", revealCards);
