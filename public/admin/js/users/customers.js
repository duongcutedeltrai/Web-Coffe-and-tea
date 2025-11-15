document.addEventListener("DOMContentLoaded", function () {
    initSearch();
});

function initSearch() {
    const searchInput = document.getElementById("customerSearchInput");
    const customerTableBody = document.getElementById("customerTableBody");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", async (e) => {
        const q = e.target.value.trim();

        try {
            const res = await fetch(
                `/admin/customer/search?username=${encodeURIComponent(
                    q
                )}&email=${encodeURIComponent(q)}`
            );
            const data = await res.json();

            customerTableBody.innerHTML = "";

            data.forEach((customer) => {
                const tr = document.createElement("tr");
                tr.setAttribute(
                    "onclick",
                    `window.location='/admin/customer/detail_staff/${customer.user_id}'`
                );
                tr.style.cursor = "pointer";

                // Tính tổng tiền đơn hàng
                const total = (customer.orders || []).reduce(
                    (sum, order) => sum + (order.total_amount || 0),
                    0
                );
                const totalFormatted = new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(total);

                tr.innerHTML = `
                    <td>${customer.username}</td>
                    <td>${customer.email}</td>
                    <td>${customer.gender || ""}</td>
                    <td>${customer.orders ? customer.orders.length : 0}</td>
                    <td>
                        <div style="display:flex; gap:20px; position:relative; left:100px;">
                            ${
                                customer.status === "ACTIVE"
                                    ? `
                                        <form action="/admin/customer/lock-staff/${customer.user_id}" method="post">
                                            <button type="submit" class="btn btn-warning btn-lock">Khóa</button>
                                        </form>
                                    `
                                    : `
                                        <form action="/admin/customer/unlock-staff/${customer.user_id}" method="post">
                                            <button type="submit" class="btn btn-success btn-unlock">Mở khóa</button>
                                        </form>
                                    `
                            }
                            <form action="/admin/customer/delete-staff/${
                                customer.user_id
                            }" method="post">
                                <button type="submit" class="btn btn-danger">Xóa</button>
                            </form>
                        </div>
                    </td>
                `;

                customerTableBody.appendChild(tr);
            });

            if (data.length === 0) {
                customerTableBody.innerHTML =
                    "<tr><td colspan='6'>Không có khách hàng nào</td></tr>";
            }
        } catch (err) {
            console.error(err);
        }
    });
}
