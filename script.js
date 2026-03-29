// ===== AUTH GUARD — runs instantly before DOM =====
(function () {
  const publicPages = ["login.html", "signup.html"];
  const page = location.pathname.split("/").pop() || "index.html";
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!publicPages.includes(page) && !user) {
    location.href = "login.html";
  }
})();

// ===== INJECT PROFILE BUTTON =====
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("profile-btn-container");
  if (!container) return;
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!user) return;

  const initials = (user.name || user.username || "U")[0].toUpperCase();
  const avatarHTML = user.image
    ? `<img src="${user.image}" alt="avatar" class="pd-avatar-img">`
    : `<div class="pd-avatar-initials">${initials}</div>`;

  container.innerHTML = `
    <div id="profileDropdownWrap" class="profile-dropdown-wrap">
      <button class="profile-trigger-btn" onclick="toggleProfileDropdown(event)" title="My Profile">
        <div class="profile-avatar-small">
          ${user.image
            ? `<img src="${user.image}" alt="avatar">`
            : `<span>${initials}</span>`}
        </div>
        <span class="profile-username-label">${user.username || user.name}</span>
        <i class="fa-solid fa-chevron-down profile-chevron"></i>
      </button>

      <div class="profile-dropdown" id="profileDropdown">
        <div class="pd-user-header">
          <div class="pd-avatar-wrap">${avatarHTML}</div>
          <div class="pd-user-info">
            <div class="pd-user-name">${user.name}</div>
            <div class="pd-user-email">${user.email}</div>
          </div>
        </div>
        <div class="pd-sep"></div>
        <a href="profile.html" class="pd-menu-item">
          <i class="fa-solid fa-user-circle"></i>
          <span>My Profile</span>
        </a>
        <div class="pd-sep"></div>
        <button class="pd-menu-item pd-logout-btn" onclick="logout()">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>`;
});

function toggleProfileDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById("profileDropdown");
  if (dd) dd.classList.toggle("open");
}

document.addEventListener("click", function (e) {
  const wrap = document.getElementById("profileDropdownWrap");
  if (wrap && !wrap.contains(e.target)) {
    const dd = document.getElementById("profileDropdown");
    if (dd) dd.classList.remove("open");
  }
});

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "login.html";
}
