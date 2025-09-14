// // Product Groups Data
// const productGroups = [
//   {
//     id: 1,
//     name: "Đồ uống",
//     description: "Tất cả các loại đồ uống bao gồm trà, cà phê, nước ép và nước lọc",
//     productCount: 12,
//     image: "/drinks-beverages-coffee-tea.jpg",
//     createdDate: "2024-01-10",
//   },
//   {
//     id: 2,
//     name: "Salad",
//     description: "Salad tươi và các món rau củ",
//     productCount: 8,
//     image: "/fresh-salad-vegetables.jpg",
//     createdDate: "2024-01-10",
//   },
//   {
//     id: 3,
//     name: "Món nước",
//     description: "Súp, nước dùng và các món ăn dạng lỏng",
//     productCount: 6,
//     image: "/soup-broth-liquid-food.jpg",
//     createdDate: "2024-01-10",
//   },
//   {
//     id: 4,
//     name: "Món chính",
//     description: "Các món ăn chính, cơm và các món ăn no",
//     productCount: 15,
//     image: "/main-course-rice-dishes.jpg",
//     createdDate: "2024-01-10",
//   },
//   {
//     id: 5,
//     name: "Khai vị",
//     description: "Món khai vị và các món ăn nhỏ trước bữa chính",
//     productCount: 9,
//     image: "/appetizer-starter-food.jpg",
//     createdDate: "2024-01-12",
//   },
//   {
//     id: 6,
//     name: "Tráng miệng",
//     description: "Các món ngọt và tráng miệng",
//     productCount: 7,
//     image: "/dessert-sweet-cake.jpg",
//     createdDate: "2024-01-12",
//   },
// ]

// // DOM Elements
// const addGroupBtn = document.getElementById("addGroupBtn")
// const addGroupModal = document.getElementById("addGroupModal")
// const editGroupModal = document.getElementById("editGroupModal")
// const closeAddModal = document.getElementById("closeAddModal")
// const closeEditModal = document.getElementById("closeEditModal")
// const cancelAdd = document.getElementById("cancelAdd")
// const cancelEdit = document.getElementById("cancelEdit")
// const addGroupForm = document.getElementById("addGroupForm")
// const editGroupForm = document.getElementById("editGroupForm")
// //const groupsGrid = document.getElementById("groupsGrid")
// const groupsTableBody = document.getElementById("groupsTableBody")

// // Initialize page
// document.addEventListener("DOMContentLoaded", () => {
//   //renderGroups()
//   //renderTable()
//   updateStatistics()
//   setupEventListeners();
//   setupImageUpload();
// })

// // Event Listeners
// function setupEventListeners() {
//   // Modal controls
//   addGroupBtn.addEventListener("click", () => openModal(addGroupModal))
//   closeAddModal.addEventListener("click", () => closeModal(addGroupModal))
//   closeEditModal.addEventListener("click", () => closeModal(editGroupModal))
//   cancelAdd.addEventListener("click", () => closeModal(addGroupModal))
//   cancelEdit.addEventListener("click", () => closeModal(editGroupModal))

//   // Close modal when clicking outside
//   window.addEventListener("click", (e) => {
//     if (e.target === addGroupModal) closeModal(addGroupModal)
//     if (e.target === editGroupModal) closeModal(editGroupModal)
//   })

//   editGroupForm.addEventListener("submit", handleEditGroup)
// }

// function setupImageUpload() {
//   const addImageInput = document.getElementById("groupImage")
//   const addImagePreview = document.getElementById("imagePreview")
//   const editImageInput = document.getElementById("editGroupImage")
//   const editImagePreview = document.getElementById("editImagePreview")

//   addImageInput.addEventListener("change", (e) => handleImagePreview(e, addImagePreview))
//   editImageInput.addEventListener("change", (e) => handleImagePreview(e, editImagePreview))
// }

// function handleImagePreview(event, previewElement) {
//   const file = event.target.files[0]
//   if (file) {
//     const reader = new FileReader()
//     reader.onload = (e) => {
//       previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview">`
//       previewElement.classList.add("has-image")
//     }
//     reader.readAsDataURL(file)
//   }
// }

// // Modal functions
// function openModal(modal) {
//   modal.style.display = "block"
//   document.body.style.overflow = "hidden"
// }

// function closeModal(modal) {
//   modal.style.display = "none"
//   document.body.style.overflow = "auto"

//   // Reset forms
//   if (modal === addGroupModal) {
//     addGroupForm.reset()
//     resetImagePreview("imagePreview")
//   } else if (modal === editGroupModal) {
//     resetImagePreview("editImagePreview")
//   }
// }

// function resetImagePreview(previewId) {
//   const preview = document.getElementById(previewId)
//   preview.innerHTML = `
//     <i class="fas fa-image"></i>
//     <span>Chọn hình ảnh</span>
//   `
//   preview.classList.remove("has-image")
// }

// // Render functions
// // function renderGroups() {
// //   groupsGrid.innerHTML = ""

// //   productGroups.forEach((group) => {
// //     const groupCard = createGroupCard(group)
// //     groupsGrid.appendChild(groupCard)
// //   })
// // }

// function createGroupCard(group) {
//   const card = document.createElement("div")
//   card.className = "group-card"

//   const formattedDate = new Date(group.createdDate).toLocaleDateString("vi-VN")

//   card.innerHTML = `
//         <div class="group-card-header">
//             <div class="group-title">
//                 <div class="group-name">
//                     <img src="${group.image}" alt="${group.name}" class="group-image">
//                     <h3>${group.name}</h3>
//                 </div>
//                 <span class="group-badge">${group.productCount} sản phẩm</span>
//             </div>
//         </div>
//         <div class="group-card-content">
//             <p class="group-description">${group.description}</p>
//             <div class="group-footer">
//                 <span class="group-date">Tạo: ${formattedDate}</span>
//                 <div class="group-actions">
//                     <button class="btn-icon edit" onclick="editGroup(${group.id})">
//                         <i class="fas fa-edit"></i>
//                     </button>
//                     <button class="btn-icon delete" onclick="deleteGroup(${group.id})">
//                         <i class="fas fa-trash"></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     `

//   return card
// }

// // function renderTable() {
// //   groupsTableBody.innerHTML = ""

// //   productGroups.forEach((group) => {
// //     const row = createTableRow(group)
// //     groupsTableBody.appendChild(row)
// //   })
// // }

// // function createTableRow(group) {
// //   const row = document.createElement("tr")
// //   const formattedDate = new Date(group.createdDate).toLocaleDateString("vi-VN")

// //   row.innerHTML = `
// //         <td>
// //             <div class="table-group-name">
// //                 <img src="${group.image}" alt="${group.name}" class="table-group-image">
// //                 <span>${group.name}</span>
// //             </div>
// //         </td>
// //         <td>${group.description}</td>
// //         <td>
// //             <span class="table-badge">${group.productCount}</span>
// //         </td>
// //         <td>${formattedDate}</td>
// //         <td>
// //             <div class="group-actions">
// //                 <button class="btn-icon edit" onclick="editGroup(${group.id})">
// //                     <i class="fas fa-edit"></i>
// //                 </button>
// //                 <button class="btn-icon delete" onclick="deleteGroup(${group.id})">
// //                     <i class="fas fa-trash"></i>
// //                 </button>
// //             </div>
// //         </td>
// //     `

// //   return row
// // }

// function updateStatistics() {
//   const totalGroups = productGroups.length
//   const totalProducts = productGroups.reduce((sum, group) => sum + group.productCount, 0)
//   const averageProducts = Math.round(totalProducts / totalGroups)

//   document.getElementById("totalGroups").textContent = totalGroups
//   document.getElementById("totalProducts").textContent = totalProducts
//   document.getElementById("averageProducts").textContent = averageProducts
// }

// // function handleAddGroup(e) {
// //   e.preventDefault();
// //   const formData = new FormData(addGroupForm);
// //   fetch("/admin/categories", {
// //     method: "POST",
// //     body: formData
// //   })
// //     .then(res => res.json())
// //     .then(data => {
// //       console.log("Server response:", data);
// //       // Có thể xử lý thêm UI ở đây nếu muốn
// //       closeModal(addGroupModal);
// //       alert("Thêm nhóm sản phẩm thành công!");
// //     })
// //     .catch(err => {
// //       console.error("Error:", err);
// //       alert("Có lỗi xảy ra khi thêm nhóm!");
// //     });
// // }

// function editGroup(id) {
//   const group = productGroups.find((g) => g.id === id)
//   if (!group) return

//   // Populate edit form
//   document.getElementById("editGroupId").value = group.id
//   document.getElementById("editGroupName").value = group.name
//   document.getElementById("editGroupDescription").value = group.description

//   // Show current image in preview
//   const editImagePreview = document.getElementById("editImagePreview")
//   editImagePreview.innerHTML = `<img src="${group.image}" alt="Current image">`
//   editImagePreview.classList.add("has-image")

//   openModal(editGroupModal)
// }

// function handleEditGroup(e) {
//   e.preventDefault()

//   const formData = new FormData(editGroupForm)
//   const groupId = Number.parseInt(document.getElementById("editGroupId").value)
//   const imageFile = formData.get("groupImage")

//   const groupIndex = productGroups.findIndex((g) => g.id === groupId)
//   if (groupIndex === -1) return

//   let imageUrl = productGroups[groupIndex].image // Keep existing image

//   if (imageFile && imageFile.size > 0) {
//     // In a real application, upload new image to server
//     imageUrl = URL.createObjectURL(imageFile)
//   }

//   // Update group
//   productGroups[groupIndex] = {
//     ...productGroups[groupIndex],
//     name: formData.get("groupName"),
//     description: formData.get("groupDescription"),
//     image: imageUrl,
//   }

//   //renderGroups()
//  // renderTable()
//   closeModal(editGroupModal)

//   alert("Cập nhật nhóm sản phẩm thành công!")
// }

// function deleteGroup(id) {
//   if (!confirm("Bạn có chắc chắn muốn xóa nhóm sản phẩm này?")) return

//   const groupIndex = productGroups.findIndex((g) => g.id === id)
//   if (groupIndex === -1) return

//   productGroups.splice(groupIndex, 1)

//   //renderGroups()
//  // renderTable()
//   updateStatistics()

//   // Show success message
//   alert("Xóa nhóm sản phẩm thành công!")
// }

// // Utility functions
// function formatDate(dateString) {
//   return new Date(dateString).toLocaleDateString("vi-VN")
// }

// // Export functions for potential external use
// window.productGroupsManager = {
//   //addGroup: handleAddGroup,
//   editGroup: editGroup,
//   deleteGroup: deleteGroup,
//   getGroups: () => productGroups,
//   refreshDisplay: () => {
//     //renderGroups()
//     renderTable()
//     updateStatistics()
//   },
// }
