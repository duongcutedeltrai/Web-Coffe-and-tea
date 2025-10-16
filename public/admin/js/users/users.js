let editingUserId = null;


document.addEventListener("DOMContentLoaded", function () {
    // setupEventListeners();
    initTabs()
    initSearch()
    initFilters();
    initModalEvents();
});

function initTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const pagination = document.getElementById("staffPagination");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabName = btn.dataset.tab;

            // Remove active
            tabButtons.forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

            // Add active
            btn.classList.add("active");
            const targetTab = document.getElementById(tabName + "Tab");
            if (targetTab) targetTab.classList.add("active");

            // Hiển thị/ẩn pagination
            if (tabName === "all") {
                pagination.style.display = "block";
            } else {
                pagination.style.display = "none";
            }
        });
    });

    // Khi load page, hiển thị pagination nếu allTab active
    const activeTab = document.querySelector(".tab-content.active");
    if (activeTab && activeTab.id === "allTab") {
        pagination.style.display = "block";
    } else {
        pagination.style.display = "none";
    }
}

// search staff
// search staff
function initSearch() {
    const searchInput = document.getElementById("staffSearchInput");
    const staffTableBody = document.getElementById("staffTableBody");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", async (e) => {

        const q = e.target.value.trim();

        try {
            const res = await fetch(`/admin/staff/search?username=${encodeURIComponent(q)}&email=${encodeURIComponent(q)}`);
            const data = await res.json();
            staffTableBody.innerHTML = "";

            data.forEach(staff => {
                const tr = document.createElement("tr");
                tr.setAttribute("onclick", `window.location='/admin/staff/detail_staff/${staff.user_id}'`);
                tr.style.cursor = "pointer";

                tr.innerHTML = `
                    <td>${staff.username}</td>
                    <td>${staff.email}</td>
                    <td>
                        ${staff.roles.name === "ADMIN"
                        ? `<span class="role-badge admin">Admin</span>`
                        : `<span class="role-badge staff">${staff.staff_detail?.position || ""}</span>`
                    }
                    </td>
                    <td>${staff.gender || ""}</td>
                    <td>
                        <div style="display:flex; gap:20px; position:relative; left:100px;">
                            ${staff.status === "ACTIVE"
                        ? `
                                        <form action="/admin/staff/lock-staff/${staff.user_id}" method="post">
                                            <button type="submit" class="btn btn-warning btn-lock">Khóa</button>
                                        </form>
                                    `
                        : `
                                        <form action="/admin/staff/unlock-staff/${staff.user_id}" method="post">
                                            <button type="submit" class="btn btn-success btn-unlock">Mở khóa</button>
                                        </form>
                                    `
                    }
                            <form action="/admin/staff/delete-staff/${staff.user_id}" method="post">
                                <button type="submit" class="btn btn-danger">Xóa</button>
                            </form>
                        </div>
                    </td>
                `;

                staffTableBody.appendChild(tr);


            });

            if (data.length === 0) {
                staffTableBody.innerHTML = "<tr><td colspan = '5'>Không có nhân viên nào </td></td>"
            }
        } catch (err) {
            console.error(err);
        }
    });
}


function initFilters() {
    const roleFilter = document.getElementById("roleFilter");
    const statusFilter = document.getElementById("statusFilter");
    const dateFilter = document.getElementById("dateFilter");

    [roleFilter, statusFilter, dateFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener("change", filterUsers);
        }
    });
}

function initModalEvents() {
    const modal = document.getElementById("userModal");

    // Đóng modal khi click ngoài
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function openAddModal() {
    editingUserId = null;
    document.getElementById("modalTitle").textContent = "Thêm người dùng mới";
    document.getElementById("passwordGroup").style.display = "block";
    document.getElementById("userForm").reset();
    document.getElementById("avatarPreview").innerHTML = '<i class="fas fa-user"></i>';
    document.getElementById("userModal").style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("userModal");
    if (modal) modal.style.display = "none";
    editingUserId = null;
}

// Preview avatar
function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("avatarPreview").innerHTML = `<img src="${e.target.result}" alt="Avatar preview">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/* ============================
   Placeholder hàm filterUsers
   (cần định nghĩa logic lọc theo backend)
=============================== */
function filterUsers() {
    // TODO: logic lọc role/status/date
    console.log("Filter users triggered");
}







