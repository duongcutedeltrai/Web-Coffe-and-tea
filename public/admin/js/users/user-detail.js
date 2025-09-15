// Tab switching functionality
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Modal functionality
function openUpdateModal() {
    const modal = document.getElementById('updateModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeUpdateModal() {
    const modal = document.getElementById('updateModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openChartModal() {
    const modal = document.getElementById('chartModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        updateChart('monthly'); // default
        myChart.resize();
    }, 50);
}
function closeChartModal() {
    const modal = document.getElementById('chartModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Chart
const ctx = document.getElementById("myChart").getContext("2d");
const chartData = {
    daily: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [300, 200, 1500, 70, 50, 220, 60] },
    weekly: { labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"], data: [1200, 1900, 800, 2200] },
    monthly: { labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], data: [3500, 4200, 3900, 4500, 4800, 5000] },
};
let myChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [], datasets: [{
            label: "Doanh số",
            data: [],
            backgroundColor: "rgba(183,28,28,0.6)",
            borderRadius: 8
        }]
    },
    options: { scales: { y: { ticks: { callback: val => val >= 1000000 ? val / 1000000 + "M" : val >= 1000 ? val / 1000 + "k" : val } } } }
});
function updateChart(type) {
    myChart.data.labels = chartData[type].labels;
    myChart.data.datasets[0].data = chartData[type].data;
    myChart.update();
}

// Chart modal tabs
document.querySelectorAll('#chartModal .tab').forEach(tab => {
    tab.addEventListener('click', () => {
        updateChart(tab.getAttribute('data-type'));
        document.querySelectorAll('#chartModal .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Close modal on background click
document.getElementById('updateModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeUpdateModal(); });
document.getElementById('chartModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeChartModal(); });


// Close modal when clicking outside
document.getElementById('updateModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeUpdateModal();
    }
});

document.getElementById('chartModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeChartModal();
    }
});


// Form submission
document.getElementById('updateForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Show loading state
    const saveText = document.getElementById('saveText');
    const saveLoading = document.getElementById('saveLoading');
    const submitBtn = e.target.querySelector('.btn-save');

    saveText.style.display = 'none';
    saveLoading.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Update customer info in the header
        const name = document.getElementById('updateName').value;
        const email = document.getElementById('updateEmail').value;
        const phone = document.getElementById('updatePhone').value;

        document.getElementById('customerName').textContent = name;
        document.getElementById('customerEmail').textContent = `📧 ${email}`;
        document.getElementById('customerPhone').textContent = `📱 ${phone}`;

        // Show success message
        alert('✅ Cập nhật thông tin khách hàng thành công!');

        // Reset loading state
        saveText.style.display = 'inline';
        saveLoading.style.display = 'none';
        submitBtn.disabled = false;

        // Close modal
        closeUpdateModal();
    }, 2000);
});

// Go back functionality
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Simulate going back to user list
        alert('Quay lại danh sách khách hàng...');
    }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function () {
    // Add hover effects to info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Lấy username trực tiếp từ EJS, fallback nếu rỗng
    let username = "<%= user.username %>".trim();
    if (!username) {
        username = "Nguyễn Văn An"; // Fallback giá trị mẫu nếu EJS không render đúng
        console.warn('Username từ EJS rỗng, sử dụng fallback.');
    }

    const customerName = document.getElementById("customerName");
    customerName.textContent = ""; // reset để chạy typewriter

    let i = 0;
    function typeWriter() {
        if (i < username.length) {
            customerName.textContent += username[i];
            i++;
            setTimeout(typeWriter, 100);
        } else {
            console.log('Typewriter hoàn tất:', customerName.textContent);
        }
    }

    // Luôn chạy typewriter nếu có username
    if (username) {
        typeWriter();
    } else {
        console.error('Không có username để chạy typewriter.');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeUpdateModal();
    }

    // Ctrl+E to open edit modal
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        openUpdateModal();
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});