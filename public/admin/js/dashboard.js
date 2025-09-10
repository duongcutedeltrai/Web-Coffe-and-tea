// script.js
document.addEventListener('DOMContentLoaded', async function () {
    // ================================
    // Initialize Charts
    // ================================
    initializeSalesChart();
    initializeOrderChart();

    // ================================
    // Sidebar Navigation Active Link
    // ================================
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ================================
    // Sidebar Toggle (Desktop)
    // ================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        // Khôi phục trạng thái toggle từ localStorage
        if (localStorage.getItem("sb|sidebar-toggle") === "true") {
            document.body.classList.add("sb-sidenav-toggled");
        }

        sidebarToggle.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.classList.toggle("sb-sidenav-toggled");
            localStorage.setItem("sb|sidebar-toggle", document.body.classList.contains("sb-sidenav-toggled"));
        });
    }

    // ================================
    // Sidebar Toggle (Mobile)
    // ================================
    addMobileSidebarToggle();

    // ================================
    // Animate Stat Cards on Scroll
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card').forEach(card => observer.observe(card));

    // ================================
    // Hover Effect on Table Rows
    // ================================
    document.querySelectorAll('.table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#f8f9fa';
            this.style.transition = 'background-color 0.3s ease';
        });
        row.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
        });
    });
});

// ================================
// Chart Functions
// ================================
function initializeSalesChart() {
    const ctx = document.getElementById('salesChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales',
                data: [12, 19, 15, 25, 22, 30, 35, 32, 28, 33, 40, 35],
                borderColor: '#c41e3a',
                backgroundColor: 'rgba(196, 30, 58, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#c41e3a',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, border: { display: false } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' }, border: { display: false } }
            },
            elements: { point: { hoverBackgroundColor: '#c41e3a' } }
        }
    });
}

function initializeOrderChart() {
    const ctx = document.getElementById('orderChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Dine In', 'Take Away', 'Delivery'],
            datasets: [{
                data: [45, 30, 25],
                backgroundColor: ['#4facfe', '#f093fb', '#ffd89b'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 20, font: { size: 12 } }
                }
            }
        }
    });
}

// ================================
// Mobile Sidebar Toggle
// ================================
function addMobileSidebarToggle() {
    const existing = document.querySelector('.mobile-hamburger');
    if (existing) return; // tránh tạo nhiều lần

    const hamburger = document.createElement('button');
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    hamburger.className = 'btn btn-outline-secondary d-md-none mobile-hamburger';
    hamburger.style.cssText = 'position: fixed; top: 1rem; left: 1rem; z-index: 1001;';
    document.body.appendChild(hamburger);

    const sidebar = document.querySelector('.sidebar');
    hamburger.addEventListener('click', () => sidebar.classList.toggle('show'));

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });
}
