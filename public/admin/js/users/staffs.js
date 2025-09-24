document.addEventListener("DOMContentLoaded", function () {
    initSearch()
});


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