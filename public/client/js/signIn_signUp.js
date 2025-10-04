let isRegisterMode = false;
let isForgotPasswordMode = false;
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra biến showForm do server truyền xuống
  if (typeof showForm !== "undefined") {
    if (showForm === "register") {
      switchToRegister();
    } else if (showForm === "login") {
      switchToLogin();
    } else switchToForgotPassword();
  }
});
// const loginImageUrl =
//   "https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/484831242_1057200206430372_431870730670613622_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=mIQHCt5ERCEQ7kNvwFR0Gyl&_nc_oc=AdnxefWlksEnF0qblYf1HJ9lkg5Or7a0UjFQ6MW8le8GnRn_d1jgDOjmjr0dN1yxg5yNRsNm-xSHs8fGRopEpEMk&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=TdH3iDlTxRtWhFFHcAH-jg&oh=00_Afb82DBShDeNbOHHyrTWDEgMOJXy-DfdWHnXvBMK4-mmuA&oe=68CCAA99";

// const registerImageUrl =
//   "https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/518279644_1153587333458325_8776620748699647719_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Ammb4ICfS6kQ7kNvwEyVbd8&_nc_oc=AdlrMEbymNLxMLVRu4-DnQbxB_IDCiMhnQoqkNl937hNeTodN4u4OUJx9oxVpM3e3TRthDwTXKxkXNRkF_JcUikI&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=IpLYseFP-eQ44Ovb2UIG5A&oh=00_AfbE-OjZX24rjzbQhcUq7-rW-QH-VpAdZzT70EtJLuEkBw&oe=68CCC507";

// const forgotPasswordImageUrl =
//   "https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/481706959_1045724690911257_2699527036090553896_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=HgQctRQMLV4Q7kNvwEWXzmd&_nc_oc=Adn_Ae66LqJ9eBHoKGC7ldoP3rC9LKuhec9ABsuN9R3zaDtqfUQ9yu6VBcPUodl7O6EIrqFbYg8ish17Iz0-eDlB&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=-tQQhJ9xsQnVAfyh9-ouRQ&oh=00_Afbs9TK6SAUWOXisMZ6-o-3nfiEDQEOnOc7s4_bdRgRk9w&oe=68CCC873";

const loginImageUrl = "/images/client/bgLogin.jpg";
const registerImageUrl = "/images/client/bgRegister.jpg";
const forgotPasswordImageUrl = "/images/client/bgForgotPassword.jpg";
function switchImage(newImageUrl) {
  const backgroundImage = document.querySelector(".background-image");

  // Fade out current image
  backgroundImage.classList.add("fade-out");

  // Change image source after fade out completes
  setTimeout(() => {
    backgroundImage.src = newImageUrl;
    backgroundImage.classList.remove("fade-out");
  }, 800);
}

function switchToRegister() {
  if (isRegisterMode) return;

  isRegisterMode = true;
  isForgotPasswordMode = false;
  showForm = "register";
  const container = document.querySelector(".auth-container");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");

  switchImage(registerImageUrl);
  window.history.pushState({}, "", "/auth/register");
  // Add register mode class for sliding animation
  container.classList.add("register-mode");

  // Switch forms with delay for smooth transition
  setTimeout(() => {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    forgotPasswordForm.classList.add("hidden");
  }, 250);
}

function switchToLogin() {
  // if (!isRegisterMode) return;

  isRegisterMode = false;
  isForgotPasswordMode = false;
  showForm = "login";
  const container = document.querySelector(".auth-container");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");

  switchImage(loginImageUrl);
  window.history.pushState({}, "", "/auth/login");
  // Remove register mode class for sliding animation
  container.classList.remove("register-mode");

  // Switch forms with delay for smooth transition
  setTimeout(() => {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    forgotPasswordForm.classList.add("hidden");
  }, 250);
}

function switchToForgotPassword() {
  if (isForgotPasswordMode) return;

  isForgotPasswordMode = true;
  isRegisterMode = false;
  const container = document.querySelector(".auth-container");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");

  switchImage(forgotPasswordImageUrl);
  window.history.pushState({}, "", "/auth/forgot-password");

  // Add register mode class for sliding animation (reuse same animation)
  container.classList.add("register-mode");

  // Switch forms with delay for smooth transition
  setTimeout(() => {
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    forgotPasswordForm.classList.remove("hidden");
  }, 250);
}

// Password toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const passwordToggles = document.querySelectorAll(".password-toggle");

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);

      // Toggle eye icon (you can add different SVG for closed eye)
      const svg = this.querySelector("svg");
      if (type === "text") {
        svg.style.opacity = "0.5";
      } else {
        svg.style.opacity = "1";
      }
    });
  });

  // Form submission handlers
  const forms = document.querySelectorAll(".auth-form");
  // forms.forEach((form) => {
  //   form.addEventListener("submit", function (e) {
  //     e.preventDefault();
  //     console.log("Form submitted:", this);
  //     // Add your form submission logic here
  //   });
  // });
});
