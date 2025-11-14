let currentEditingId = null;

// DOM Elements
const createBlogBtn = document.querySelector(".btn-create-blog");
const blogDrawer = document.getElementById("blogDrawer");
const blogDrawerOverlay = document.getElementById("blogDrawerOverlay");
const blogForm = document.getElementById("blogForm");
const drawerTitle = document.getElementById("drawerTitle");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const cancelBtn = document.getElementById("cancelBtn");
const blogsGrid = document.getElementById("blogsGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const statusFilter = document.getElementById("statusFilter");
const blogModal = document.getElementById("blogModal");
const blogModalOverlay = document.getElementById("blogModalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");
const titleInput = document.getElementById("title");
const slugInput = document.getElementById("slug");
const thumbnailInput = document.getElementById("thumbnail");
const thumbnailPreview = document.getElementById("thumbnailPreview");
const advancedFilterBtn = document.querySelector(".btn-advanced-filter");
// Initialize CKEditor
let editor = null;
let editorInitialized = false;

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  if (createBlogBtn) {
    createBlogBtn.addEventListener("click", openCreateBlogDrawer);
  }
  if (advancedFilterBtn) {
    advancedFilterBtn.addEventListener("click", openCreateBlogDrawer);
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", closeBlogDrawer);
  }

  if (blogDrawerOverlay) {
    blogDrawerOverlay.addEventListener("click", closeBlogDrawer);
  }

  if (blogForm) {
    blogForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitBlog();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeBlogModal);
  }

  if (blogModalOverlay) {
    blogModalOverlay.addEventListener("click", closeBlogModal);
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderBlogs);
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", renderBlogs);
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", renderBlogs);
  }

  if (thumbnailInput) {
    thumbnailInput.addEventListener("change", previewThumbnail);
  }

  if (titleInput) {
    titleInput.addEventListener("input", function () {
      const slug = this.value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      if (slugInput) {
        slugInput.value = slug;
      }
    });
  }

  renderBlogs();
});

// Khởi tạo CKEditor chỉ khi cần thiết
function initializeCKEditor() {
  if (editorInitialized) return; // Nếu đã khởi tạo rồi thì không làm gì

  const ClassicEditor = window.ClassicEditor;
  const contentElement = document.getElementById("content");

  if (!contentElement) {
    console.error("Content element not found");
    return;
  }

  ClassicEditor.create(contentElement)
    .then((newEditor) => {
      editor = newEditor;
      editorInitialized = true;
      console.log("CKEditor initialized successfully");
    })
    .catch((error) => {
      console.error("CKEditor initialization error:", error);
    });
}

function openCreateBlogDrawer() {
  currentEditingId = null;
  if (blogForm) {
    blogForm.reset();
  }
  if (editor) {
    editor.setData("");
  }
  if (thumbnailPreview) {
    thumbnailPreview.innerHTML = "";
  }
  if (drawerTitle) {
    drawerTitle.textContent = "Tạo blog mới";
  }
  navigateTo("/admin/blogs/create");
  openBlogDrawer();
}

function openEditBlogDrawer(id) {
  navigateTo(`/admin/blogs/${id}/edit`);
  const blog = blogsData.find((b) => b.blog_id === id);
  if (!blog) return;

  currentEditingId = id;

  const titleInput = document.getElementById("title");
  const slugInput = document.getElementById("slug");
  const descriptionInput = document.getElementById("description");
  const typeSelect = document.getElementById("type");
  const statusSelect = document.getElementById("status");
  const metaTitleInput = document.getElementById("metaTitle");
  const metaDescriptionInput = document.getElementById("metaDescription");

  if (titleInput) titleInput.value = blog.title;
  if (slugInput) slugInput.value = blog.slug;
  if (descriptionInput) descriptionInput.value = blog.description;
  if (typeSelect) typeSelect.value = blog.type;
  if (statusSelect) statusSelect.value = blog.status;
  if (metaTitleInput) metaTitleInput.value = blog.meta_title || "";
  if (metaDescriptionInput)
    metaDescriptionInput.value = blog.meta_description || "";

  if (editor) {
    editor.setData(blog.content);
  }

  if (blog.thumbnail) {
    const thumbnailPreview = document.getElementById("thumbnailPreview");
    if (thumbnailPreview) {
      const img = document.createElement("img");
      img.src = blog.thumbnail;
      thumbnailPreview.innerHTML = "";
      thumbnailPreview.appendChild(img);
    }
  }

  if (drawerTitle) {
    drawerTitle.textContent = "Chỉnh sửa blog";
  }
  openBlogDrawer();
}

function openBlogDrawer() {
  if (blogDrawer) {
    blogDrawer.classList.add("open");
  }
  if (blogDrawerOverlay) {
    blogDrawerOverlay.classList.add("active");
  }
  document.body.style.overflow = "hidden";
  // Khởi tạo CKEditor khi drawer mở lần đầu
  initializeCKEditor();
}

function closeBlogDrawer() {
  if (blogDrawer) {
    blogDrawer.classList.remove("open");
    navigateTo("/admin/blogs");
  }
  if (blogDrawerOverlay) {
    blogDrawerOverlay.classList.remove("active");
  }
  document.body.style.overflow = "auto";
}

function closeBlogModal() {
  if (blogModal) {
    blogModal.classList.remove("open");
    navigateTo("/admin/blogs");
  }
  if (blogModalOverlay) {
    blogModalOverlay.classList.remove("active");
  }
  document.body.style.overflow = "auto";
}

function previewThumbnail(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target.result;
      if (thumbnailPreview) {
        thumbnailPreview.innerHTML = "";
        thumbnailPreview.appendChild(img);
      }
    };
    reader.readAsDataURL(file);
  }
}

async function submitBlog() {
  if (!blogForm) return;

  const formData = new FormData(blogForm);
  const content = editor ? editor.getData() : "";

  const submitFormData = new FormData();
  submitFormData.append("title", formData.get("title"));
  submitFormData.append("slug", formData.get("slug"));
  submitFormData.append("description", formData.get("description"));
  submitFormData.append("type", formData.get("type"));
  submitFormData.append("status", formData.get("status"));
  submitFormData.append("content", content);
  submitFormData.append("meta_title", formData.get("metaTitle") || "");
  submitFormData.append(
    "meta_description",
    formData.get("metaDescription") || ""
  );

  // Thêm thumbnail nếu có
  const thumbnailFile = formData.get("thumbnail");
  if (thumbnailFile && thumbnailFile.size > 0) {
    submitFormData.append("thumbnail", thumbnailFile);
  }

  try {
    if (currentEditingId) {
      // GỌI API UPDATE

      const response = await fetch(`/admin/data/blogs/update`, {
        method: "PUT",
        body: submitFormData,
      });

      const result = await response.json();
      console.log("Blog updated successfully:", result);
      closeBlogDrawer();
      renderBlogs();
    } else {
      // GỌI API CREATE

      const response = await fetch(`/admin/data/blogs/create`, {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();
      console.log("Blog created successfully:", result);
      closeBlogDrawer();
      renderBlogs();
    }
  } catch (error) {
    console.error("Error submitting blog:", error);
  }
}

async function handleDeleteBlog(blogId) {
  Swal.fire({
    title: "Xóa blog?",
    text: "Bạn có chắc chắn muốn xóa blog này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    confirmButtonColor: "#e74c3c",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/admin/data/blogs/${blogId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          Swal.fire("Đã xóa!", "Blog đã được xóa thành công.", "success");
          // Có thể gọi hàm load lại danh sách
          renderBlogs();
        } else {
          Swal.fire("Lỗi!", "Không thể xóa blog.", "error");
        }
      } catch (err) {
        Swal.fire("Lỗi!", err.message, "error");
      }
    }
  });
}

function navigateTo(path) {
  history.pushState({}, "", path);
}

async function viewBlogDetails(id) {
  console.log("Viewing blog details for ID:", id);
  navigateTo(`/admin/blogs/${id}`);
  try {
    const response = await fetch(`/admin/data/blogs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch blog details");
    }
    const blog = await response.json();
    console.log("Blog details:", blog);
    const modalContent = document.getElementById("modalContent");
    if (modalContent) {
      const publishDate = blog.published_at
        ? new Date(blog.published_at).toLocaleDateString("vi-VN")
        : "Chưa xuất bản";

      modalContent.innerHTML = `
        <div class="blog-detail-header">
            <h2 class="blog-detail-title">${blog.title}</h2>
            <div class="blog-detail-meta">
                <span class="detail-badge">📝 ${getTypeLabel(blog.type)}</span>
                <span class="detail-badge">📅 ${publishDate}</span>
                <span class="detail-badge">👁️ ${blog.view_count} lượt xem</span>
                <span class="detail-badge">✍️ ${blog.author}</span>
            </div>
        </div>
        ${
          blog.thumbnail
            ? `<img src="${blog.thumbnail}" alt="${blog.title}" class="blog-detail-thumbnail">`
            : ""
        }
        <div class="blog-detail-content">
            ${blog.content}
        </div>
    `;
      modalContent.setAttribute("data-blog-id", id);
      blogModal.classList.add("open");
      blogModalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  } catch (error) {
    console.error("Error fetching blog details:", error);
  }
}

async function renderBlogs() {
  try {
    const response = await fetch("/admin/data/blogs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      blogsData = await response.json();
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
  let filteredBlogs = blogsData;

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  const typeValue = typeFilter ? typeFilter.value : "";
  const statusValue = statusFilter ? statusFilter.value : "";

  filteredBlogs = filteredBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm) ||
      blog.description.toLowerCase().includes(searchTerm);
    const matchesType = !typeValue || blog.type === typeValue;
    const matchesStatus = !statusValue || blog.status === statusValue;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (filteredBlogs.length === 0) {
    if (blogsGrid) {
      blogsGrid.innerHTML = "";
    }
    if (emptyState) {
      emptyState.style.display = "block";
    }
    return;
  }

  if (emptyState) {
    emptyState.style.display = "none";
  }

  if (blogsGrid) {
    blogsGrid.innerHTML = filteredBlogs
      .map(
        (blog) => `
        <div class="blog-card">
            <div class="blog-thumbnail" style="background-image: url('${
              blog.thumbnail
            }'); background-size: cover; background-position: center;"></div>
            <div class="blog-card-content">
                <span class="blog-type">${getTypeLabel(blog.type)}</span>
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-description">${blog.description}</p>
                <div class="blog-meta">
                    <span>${new Date(blog.created_at).toLocaleDateString(
                      "vi-VN"
                    )}</span>
                    <span class="blog-status ${blog.status.toLowerCase()}">${getStatusLabel(
          blog.status
        )}</span>
                </div>
                <div class="blog-card-actions">
                    <button class="btn-icon btn-view" onclick="viewBlogDetails('${
                      blog.blog_id
                    }')">Xem</button>
                    <button class="btn-icon btn-edit" onclick="openEditBlogDrawer('${
                      blog.blog_id
                    }')">Sửa</button>
                    <button class="btn-icon btn-delete" onclick="handleDeleteBlog('${
                      blog.blog_id
                    }')">Xóa</button>
                </div>
            </div>
        </div>
    `
      )
      .join("");
  }
}
function editBlog() {
  const modalContent = document.getElementById("modalContent");
  if (!modalContent) return;

  const blogId = modalContent.getAttribute("data-blog-id");
  if (!blogId) return;

  // Đóng modal chi tiết
  closeBlogModal();

  // Mở drawer chỉnh sửa
  openEditBlogDrawer(blogId);
}

function getTypeLabel(type) {
  const labels = {
    NEWS: "Tin tức",
    PROMOTION: "Khuyến mãi",
    PRODUCT: "Sản phẩm",
    EVENT: "Sự kiện",
    GUIDE: "Hướng dẫn",
  };
  return labels[type] || type;
}

function getStatusLabel(status) {
  const labels = {
    DRAFT: "Bản nháp",
    PUBLISHED: "Đã xuất bản",
    ARCHIVED: "Đã lưu trữ",
  };
  return labels[status] || status;
}

// ====== XỬ LÝ TRUY CẬP TRỰC TIẾP TỪ URL ======
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Tạo mới blog
  if (path.endsWith("/create")) {
    openCreateBlogDrawer();
    return;
  }

  // Chỉnh sửa blog (/admin/blogs/:id/edit)
  const editMatch = path.match(/\/admin\/blogs\/(\d+)\/edit$/);
  if (editMatch) {
    const id = editMatch[1];
    openEditBlogDrawer(id);
    return;
  }

  // Xem chi tiết blog (/admin/blogs/:id)
  const viewMatch = path.match(/\/admin\/blogs\/(\d+)$/);
  if (viewMatch) {
    const id = viewMatch[1];
    viewBlogDetails(id);
    return;
  }
});
window.addEventListener("popstate", () => {
  const path = window.location.pathname;

  // Đóng hết trước
  closeBlogModal();
  closeBlogDrawer();

  // Nếu URL có /create
  if (path.endsWith("/create")) {
    openBlogDrawer();
  }
  // Nếu URL có /:id
  else if (path.match(/\/admin\/blogs\/(\d+)$/)) {
    const id = path.match(/\/admin\/blogs\/(\d+)$/)[1];
    openBlogModal(id);
  }
});
