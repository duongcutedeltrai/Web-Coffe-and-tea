document.addEventListener('DOMContentLoaded', function () {

    setupEventListeners();


});

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterUsers);
    document.getElementById('roleFilter').addEventListener('change', filterUsers);
    document.getElementById('statusFilter').addEventListener('change', filterUsers);
    document.getElementById('dateFilter').addEventListener('change', filterUsers);

    // Modal close on outside click
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('userModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

//mo modal
function openAddModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Thêm người dùng mới';
    document.getElementById('passwordGroup').style.display = 'block';
    document.getElementById('userForm').reset();
    document.getElementById('avatarPreview').innerHTML = '<i class="fas fa-user"></i>';
    document.getElementById('userModal').style.display = 'block';
}

//dong modal
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    editingUserId = null;
}

//preview avatar
function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('avatarPreview').innerHTML =
                `<img src="${e.target.result}" alt="Avatar preview">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

