document.addEventListener("DOMContentLoaded", function () {
    initSearch();
    calenderStaff();
    initCalendarStaff();
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
            const res = await fetch(
                `/admin/staff/search?username=${encodeURIComponent(
                    q
                )}&email=${encodeURIComponent(q)}`
            );
            const data = await res.json();
            staffTableBody.innerHTML = "";

            data.forEach((staff) => {
                const tr = document.createElement("tr");
                tr.setAttribute(
                    "onclick",
                    `window.location='/admin/staff/detail_staff/${staff.user_id}'`
                );
                tr.style.cursor = "pointer";

                tr.innerHTML = `
                    <td>${staff.username}</td>
                    <td>${staff.email}</td>
                    <td>
                        ${staff.roles.name === "ADMIN"
                        ? `<span class="role-badge admin">Admin</span>`
                        : `<span class="role-badge staff">${staff.staff_detail?.position || ""
                        }</span>`
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
                            <form action="/admin/staff/delete-staff/${staff.user_id
                    }" method="post">
                                <button type="submit" class="btn btn-danger">Xóa</button>
                            </form>
                        </div>
                    </td>
                `;

                staffTableBody.appendChild(tr);
            });

            if (data.length === 0) {
                staffTableBody.innerHTML =
                    "<tr><td colspan = '5'>Không có nhân viên nào </td></td>";
            }
        } catch (err) {
            console.error(err);
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalCalender");
    const shiftCards = modal.querySelectorAll(".shift-card");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = modal.querySelector(".btn-cancel");

    let selectedStaffId = null;
    let selectedDayOfWeek = null;
    let selectedShiftId = null;
    let currentCell = null;

    // Mapping shift ID sang tên và class
    const shiftMapping = {
        1: { name: "Sáng (07h-15h)", class: "shift-morning" },
        2: { name: "Chiều (14h-22h)", class: "shift-afternoon" },
        3: { name: "Tối (22h-06h)", class: "shift-night" },
        4: { name: "Nghỉ", class: "shift-off" }
    };

    // Click vào cell trong bảng lịch
    document.querySelectorAll(".shift-cell").forEach(cell => {
        cell.addEventListener("click", e => {
            e.stopPropagation();

            selectedStaffId = Number(cell.dataset.staffId);
            selectedDayOfWeek = Number(cell.dataset.dayOfWeek);
            currentCell = cell; // Lưu lại cell hiện tại

            // Đặt vị trí modal gần cell
            const rect = cell.getBoundingClientRect();
            modal.style.left = `${rect.left + window.scrollX}px`;
            modal.style.top = `${rect.bottom + window.scrollY + 5}px`;
            modal.removeAttribute("hidden");

            // Reset selection
            shiftCards.forEach(c => c.classList.remove("selected"));
            selectedShiftId = null;
            saveBtn.disabled = true;
        });
    });

    // Chọn ca
    shiftCards.forEach(card => {
        card.addEventListener("click", () => {
            shiftCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedShiftId = Number(card.dataset.shiftId);
            saveBtn.disabled = false;
        });
    });

    // Lưu thay đổi
    saveBtn.addEventListener("click", async () => {
        if (!selectedStaffId || !selectedDayOfWeek || !selectedShiftId) {
            alert("Vui lòng chọn ca làm việc");
            return;
        }

        const res = await fetch(`/admin/staff/update-calander/${selectedStaffId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                shiftId: selectedShiftId,
                dayOfWeek: selectedDayOfWeek
            })
        });

        const result = await res.json();

        if (result.success && currentCell) {

            const shiftName = result.data.shiftName;


            let shiftClass = 'shift-off';
            if (shiftName.includes('Sáng')) shiftClass = 'shift-morning';
            else if (shiftName.includes('Chiều')) shiftClass = 'shift-afternoon';
            else if (shiftName.includes('Tối')) shiftClass = 'shift-night';

            // Update UI
            currentCell.classList.remove('shift-morning', 'shift-afternoon', 'shift-night', 'shift-off');
            currentCell.classList.add(shiftClass);
            currentCell.textContent = shiftName;

            modal.setAttribute("hidden", true);
            showSuccessMessage("Cập nhật lịch làm việc thành công!");
        } else {
            alert("Cập nhật thất bại. Vui lòng thử lại.");
        }
    });

    // Hủy
    cancelBtn.addEventListener("click", () => {
        modal.setAttribute("hidden", true);
    });

    // Click ngoài modal thì đóng
    document.addEventListener("click", e => {
        if (!modal.contains(e.target) && !e.target.classList.contains('shift-cell')) {
            modal.setAttribute("hidden", true);
        }
    });
});
