const API = "https://sparsh-backend-1prm.onrender.com";
console.log("JS Loaded");

const WHATSAPP_NUMBER = "919903634178";

/* ===============================
   HELPERS
=============================== */
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "yes";
}

function requireLogin(msg = "Please login to book.") {
  const loginMsg = document.getElementById("loginMsg");
  if (loginMsg) loginMsg.innerText = msg;
  window.openLogin();
}

function openWhatsApp({ band = "", date = "", name = "", phone = "" } = {}) {
  const message =
`Hello, I want to book a band.
Band: ${band}
Date: ${date}
Name: ${name}
Phone: ${phone}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (isMobile()) window.location.href = url;
  else window.open(url, "_blank");
}

/* ===============================
   PACKAGE TIER + DESTINATION
=============================== */

// Keep selected destinations here
window.__selectedDest = window.__selectedDest || {};

window.selectTier = function (panelId, tier) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  // Activate pill
  const pills = panel.querySelectorAll(".pill");
  pills.forEach(p => p.classList.remove("active"));

  const map = { low: 0, mid: 1, high: 2 };
  if (pills[map[tier]]) pills[map[tier]].classList.add("active");

  // Show tier box
  const boxes = panel.querySelectorAll(".tier-box");
  boxes.forEach(box => {
    box.classList.toggle("active", box.dataset.tier === tier);
  });
};

window.selectDestination = function (group, label) {
  const wrap = document.querySelector(`.dest-pills[data-dest-group="${group}"]`);
  if (!wrap) return;

  wrap.querySelectorAll(".dest-pill").forEach(b => b.classList.remove("active"));
  const btn = Array.from(wrap.querySelectorAll(".dest-pill"))
    .find(b => b.textContent.trim() === label);
  if (btn) btn.classList.add("active");

  window.__selectedDest[group] = label;
};

window.bookPackage = function (eventType, tier, packageName, destGroup) {
  const destination = (window.__selectedDest && window.__selectedDest[destGroup])
    ? window.__selectedDest[destGroup]
    : "Local";

  const message =
`Hello, I want to book an event package.
Event: ${eventType}
Tier: ${tier}
Package: ${packageName}
Destination: ${destination}
Date: (to be decided)
Location: (to be decided)`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (isMobile()) window.location.href = url;
  else window.open(url, "_blank");
};

/* ===============================
   SERVICES DROPDOWN FIX
   - Opens panel UNDER clicked card
   - Clicking pills/buttons DOES NOT close panel
=============================== */

function placePanelUnderCard(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const card = document.querySelector(`.event-card[data-panel="${panelId}"]`);
  const grid = document.querySelector(".services-grid");
  if (!card || !grid) return;

  // Insert panel right after the clicked card (so it appears under it)
  grid.insertBefore(panel, card.nextSibling);
}

window.togglePanel = function (panelId) {
  if (panelId === "weddingPanel") showCelebration("wedding");
if (panelId === "birthdayPanel") showCelebration("birthday");

  const panels = ["weddingPanel", "birthdayPanel", "carnivalPanel"];

  // Move the panel under the clicked card FIRST
  if (panels.includes(panelId)) {
    placePanelUnderCard(panelId);
  }

  // Open/close only one
  panels.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === panelId) el.classList.toggle("active");
    else el.classList.remove("active");
  });

  // Active card highlight
  document.querySelectorAll(".event-card[data-panel]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.panel === panelId);
  });

  // Hide bands when opening a package panel
  const bands = document.getElementById("bands");
  if (bands) bands.classList.add("bands-hidden");

  // Smooth scroll to opened panel
  const p = document.getElementById(panelId);
  if (p && p.classList.contains("active")) {
    p.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

window.openBands = function () {
  // Close service panels
  ["weddingPanel", "birthdayPanel", "carnivalPanel"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });

  // Highlight bands card
  document.querySelectorAll(".event-card[data-panel]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.panel === "bands");
  });

  const bands = document.getElementById("bands");
  if (bands) {
    bands.classList.remove("bands-hidden");
    bands.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// IMPORTANT: prevent clicks INSIDE dropdown from bubbling
function stopCloseOnInnerClicks() {
  document.querySelectorAll(".service-panel").forEach(panel => {
    panel.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // pills + destination pills + any buttons inside panel
  document.querySelectorAll(".service-panel button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
}

/* ===============================
   LOGIN MODAL
=============================== */
window.openLogin = function () {
  const m = document.getElementById("loginModal");
  if (m) m.style.display = "flex";
};

window.closeLogin = function () {
  const m = document.getElementById("loginModal");
  if (m) m.style.display = "none";
};

window.openWhatsAppFromForm = function () {
  const name = document.getElementById("bookName")?.value.trim() || "";
  const phone = document.getElementById("bookPhone")?.value.trim() || "";
  const band = document.getElementById("bookBand")?.value || "";
  const date = document.getElementById("bookDate")?.value || "";
  openWhatsApp({ band, date, name, phone });
};

/* ===============================
   DOM READY
=============================== */
document.addEventListener("DOMContentLoaded", function () {

  // Loader
  const loader = document.getElementById("pageLoader");
  window.addEventListener("load", () => {
    if (!loader) return;
    loader.classList.add("hide");
    setTimeout(() => loader.remove(), 500);
  });

  // Mobile menu
  const navMenu = document.getElementById("navMenu");
  const overlay = document.getElementById("overlay");

  window.toggleMenu = function () {
    if (!navMenu || !overlay) return;
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  overlay?.addEventListener("click", () => {
    navMenu?.classList.remove("active");
    overlay?.classList.remove("active");
  });

  document.querySelectorAll("#navMenu a").forEach(a => {
    a.addEventListener("click", () => {
      navMenu?.classList.remove("active");
      overlay?.classList.remove("active");
    });
  });

  // Stop dropdown from hiding on pill click
  stopCloseOnInnerClicks();

  /* ===== AUTH UI ===== */
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  function updateAuthUI() {
    const loggedIn = isLoggedIn();

    const badge = document.getElementById("userBadge");
    const nameEl = document.getElementById("userName");
    const photoEl = document.getElementById("userPhoto");

    if (loggedIn) {
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline";

      if (badge) badge.style.display = "flex";
      if (nameEl) nameEl.innerText = localStorage.getItem("userName") || "User";
      if (photoEl) photoEl.src = localStorage.getItem("userPhoto") || "";
    } else {
      if (loginBtn) loginBtn.style.display = "inline";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (badge) badge.style.display = "none";
    }
  }

  updateAuthUI();
  window.addEventListener("auth-updated", () => {
    updateAuthUI();
    loadMyBookings();
  });

  function loadMyBookings() {
    const section = document.getElementById("myBookings");
    const msg = document.getElementById("myBookingsMsg");
    const list = document.getElementById("myBookingsList");

    if (!section || !msg || !list) return;

    if (!isLoggedIn()) {
      section.style.display = "none";
      return;
    }

    const email = (localStorage.getItem("userName") || "").toLowerCase();
    if (!email) {
      section.style.display = "none";
      return;
    }

    msg.innerText = "Loading...";
    section.style.display = "block";

    fetch(`${API}/my-bookings/${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          msg.innerText = data.message || "Failed to load bookings";
          list.innerHTML = "";
          return;
        }

        if (!data.bookings || data.bookings.length === 0) {
          msg.innerText = "No bookings yet.";
          list.innerHTML = "";
          return;
        }

        msg.innerText = "";
        list.innerHTML = data.bookings.map(b => `
          <div class="booking-card" style="background:#111;color:#fff;padding:12px;border-radius:10px;margin:10px 0;">
            <b>Band:</b> ${b.band}<br>
            <b>Date:</b> ${b.date}<br>
            <b>Name:</b> ${b.name}<br>
            <b>Phone:</b> ${b.phone}<br>
            <small>${new Date(b.createdAt).toLocaleString()}</small>
          </div>
        `).join("");
      })
      .catch(() => {
        msg.innerText = "Backend not reachable";
        list.innerHTML = "";
      });
  }

  loadMyBookings();

  /* ===== LOGIN / REGISTER ===== */
  const confirmPassword = document.getElementById("confirmPassword");
  const registerBtn = document.getElementById("registerBtn");
  const toggleRegister = document.getElementById("toggleRegister");
  const loginMsg = document.getElementById("loginMsg");

  function setModeRegister() {
    if (!loginMsg) return;
    loginMsg.innerText = "";
    if (confirmPassword) confirmPassword.style.display = "block";
    if (registerBtn) registerBtn.style.display = "block";
    if (toggleRegister) toggleRegister.style.display = "none";
  }

  toggleRegister?.addEventListener("click", setModeRegister);

  loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value.trim() || "";

    if (!email || !password) {
      if (loginMsg) loginMsg.innerText = "Please enter email and password";
      return;
    }

    fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("loggedIn", "yes");
          localStorage.setItem("userName", email);
          localStorage.setItem("userPhoto", "");

          updateAuthUI();
          if (loginMsg) loginMsg.innerText = "Login successful";
          setTimeout(window.closeLogin, 800);
        } else {
          if (loginMsg) loginMsg.innerText = data.message || "Invalid email or password";
        }
      })
      .catch(() => {
        if (loginMsg) loginMsg.innerText = "Backend not reachable";
      });
  });

  registerBtn?.addEventListener("click", function () {
    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value.trim() || "";
    const confirm = confirmPassword?.value.trim() || "";

    if (!email || !password || !confirm) {
      if (loginMsg) loginMsg.innerText = "Please fill all fields";
      return;
    }

    if (password !== confirm) {
      if (loginMsg) loginMsg.innerText = "Passwords do not match";
      return;
    }

    fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (loginMsg) loginMsg.innerText = "Account created! Now login.";
          if (registerBtn) registerBtn.style.display = "none";
          if (confirmPassword) confirmPassword.style.display = "none";
        } else {
          if (loginMsg) loginMsg.innerText = data.message || "Registration failed";
        }
      })
      .catch(() => {
        if (loginMsg) loginMsg.innerText = "Backend not reachable";
      });
  });

  logoutBtn?.addEventListener("click", async () => {
    if (window.googleLogout) {
      try { await window.googleLogout(); } catch (e) {}
    }

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");

    updateAuthUI();

    const section = document.getElementById("myBookings");
    if (section) section.style.display = "none";

    const badge = document.getElementById("userBadge");
    if (badge) badge.style.display = "none";
  });

  /* ===== Book Now shortcut ===== */
  window.bookNow = function (bandName) {
    if (!isLoggedIn()) {
      requireLogin("Login first to book a band.");
      return;
    }

    const bandSelect = document.getElementById("bookBand");
    if (bandSelect) bandSelect.value = bandName;

    const bookingEl = document.getElementById("booking");
    if (bookingEl) {
      const y = bookingEl.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  /* ===== Booking form ===== */
  const bookingForm = document.getElementById("bookingForm");
  const bookMsg = document.getElementById("bookMsg");

  bookingForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!isLoggedIn()) {
      if (bookMsg) bookMsg.innerText = "Please login first to submit booking.";
      requireLogin("Login first to submit booking.");
      return;
    }

    const name = document.getElementById("bookName")?.value.trim() || "";
    const phone = document.getElementById("bookPhone")?.value.trim() || "";
    const band = document.getElementById("bookBand")?.value || "";
    const date = document.getElementById("bookDate")?.value || "";
    const email = (localStorage.getItem("userName") || "").toLowerCase();

    if (!name || !phone || !band || !date) {
      if (bookMsg) bookMsg.innerText = "Please fill all booking details";
      return;
    }

    fetch(`${API}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, band, date, email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (bookMsg) bookMsg.innerText = "Booking saved! Opening WhatsApp...";
          loadMyBookings();
          document.getElementById("myBookings")?.scrollIntoView({ behavior: "smooth" });

          openWhatsApp({ band, date, name, phone });
          bookingForm.reset();
        } else {
          if (bookMsg) bookMsg.innerText = data.message || "Booking failed. Try again.";
        }
      })
      .catch(() => {
        if (bookMsg) bookMsg.innerText = "Backend not reachable";
      });
  });

});
function showCelebration(type){
  const layer = document.getElementById("celebrationLayer");
  if (!layer) return;

  const sets = {
  wedding: ["💐","🌸","🌺","💍","✨"],
  birthday: ["🎉","🎊","🥳","✨","🎈"],
  carnival: ["🎆","✨","🎇","🌟","💥"]
};


  const icons = sets[type] || ["✨"];
  const count = 22; // how many particles

  // center-ish area near the clicked section
  const yBase = Math.max(140, window.scrollY + 220);
  const yView = yBase - window.scrollY;

  for (let i = 0; i < count; i++){
    const el = document.createElement("div");
    el.className = "fx";
    el.textContent = icons[Math.floor(Math.random() * icons.length)];

    const x = Math.random() * window.innerWidth;
    const y = yView + (Math.random() * 120 - 60); // around center
    const s = (Math.random() * 18 + 18).toFixed(0) + "px";
    const dx = (Math.random() * 320 - 160).toFixed(0) + "px";
    const dy = (-Math.random() * 260 - 120).toFixed(0) + "px";
    const r = (Math.random() * 240 - 120).toFixed(0) + "deg";

    el.style.setProperty("--x", x + "px");
    el.style.setProperty("--y", y + "px");
    el.style.setProperty("--s", s);
    el.style.setProperty("--dx", dx);
    el.style.setProperty("--dy", dy);
    el.style.setProperty("--r", r);

    layer.appendChild(el);

    // remove after animation
    setTimeout(() => el.remove(), 1500);
  }
}
