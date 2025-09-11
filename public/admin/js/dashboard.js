// ================================
// Sidebar Toggle (Desktop + Mobile)
// ================================
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');

if (sidebarToggle && sidebar) {
    // Khôi phục trạng thái toggle (chỉ dùng cho desktop)
    if (localStorage.getItem("sb|sidebar-toggle") === "true") {
        document.body.classList.add("sb-sidenav-toggled");
    }

    sidebarToggle.addEventListener("click", (event) => {
        event.preventDefault();

        if (window.innerWidth <= 768) {
            // Mobile: mở/đóng sidebar
            sidebar.classList.toggle("show");
        } else {
            // Desktop: thu gọn/mở rộng sidebar
            document.body.classList.toggle("sb-sidenav-toggled");
            localStorage.setItem(
                "sb|sidebar-toggle",
                document.body.classList.contains("sb-sidenav-toggled")
            );
        }
    });

    // Đóng sidebar khi click ngoài (mobile)
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove("show");
            }
        }
    });
}
