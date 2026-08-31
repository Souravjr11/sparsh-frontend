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
// ===== ADD-ONS (Wedding/Birthday) =====
function getSelectedAddons() {
  // Collect all checked add-on checkboxes from the page
  return Array.from(document.querySelectorAll(".addon-section input[type='checkbox']:checked"))
    .map((cb) => cb.value);
}

function clearAddons() {
  document.querySelectorAll(".addon-section input[type='checkbox']").forEach(cb => cb.checked = false);
}
function openWhatsApp({
  band = "",
  date = "",
  name = "",
  phone = "",
  eventType = ""
} = {}) {

  const addons = getSelectedAddons();
  const addonsText = addons.length ? addons.join(", ") : "None";
if (!band && !eventType) {
  alert("Please select an event or band first");
  return;
}
  const message =
`Hello, I want to book an event.

Event Type: ${eventType || "Not selected"}
Band: ${band}
Date: ${date}
Name: ${name}
Phone: ${phone}

Add-ons:
${addonsText}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = url;   // mobile
  } else {
    window.open(url, "_blank");   // PC
  }
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
  const menuIcon = document.querySelector(".menu-icon");

  function closeMobileMenu() {
    navMenu?.classList.remove("active");
    overlay?.classList.remove("active");
    menuIcon?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  window.toggleMenu = function () {
    if (!navMenu || !overlay) return;
    const isOpen = navMenu.classList.toggle("active");
    overlay.classList.toggle("active", isOpen);
    menuIcon?.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  };

  overlay?.addEventListener("click", () => {
    closeMobileMenu();
  });

  document.querySelectorAll("#navMenu a").forEach(a => {
    a.addEventListener("click", () => {
      closeMobileMenu();
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

  /* ===== Book Now shortcut & Category Selector ===== */
  window.bookNow = function (bandName) {
    const bandSelect = document.getElementById("bookBand");
    const bookingEl = document.getElementById("booking");

    if (bandSelect && bookingEl) {
      for (let i = 0; i < bandSelect.options.length; i++) {
        if (bandSelect.options[i].value.toLowerCase().includes(bandName.toLowerCase())) {
          bandSelect.selectedIndex = i;
          break;
        }
      }
      const y = bookingEl.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      window.location.href = `booking.html?band=${encodeURIComponent(bandName)}#booking`;
    }
  };

  window.selectEventCategory = function (categoryName, btnEl) {
    const bandSelect = document.getElementById("bookBand");
    if (bandSelect) {
      for (let i = 0; i < bandSelect.options.length; i++) {
        const opt = bandSelect.options[i];
        if (opt.value.toLowerCase().includes(categoryName.toLowerCase())) {
          bandSelect.selectedIndex = i;
          break;
        }
      }
    }
    document.querySelectorAll(".booking-cat-card").forEach(c => c.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");

    const bookingEl = document.getElementById("booking");
    if (bookingEl) {
      const y = bookingEl.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Set min date on date picker to today
  const dateInput = document.getElementById("bookDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  // Pre-fill selection if coming with ?band= or ?package=
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const bandParam = urlParams.get("band") || urlParams.get("package") || urlParams.get("event");
    if (bandParam) {
      const bandSelect = document.getElementById("bookBand");
      if (bandSelect) {
        for (let i = 0; i < bandSelect.options.length; i++) {
          if (bandSelect.options[i].value.toLowerCase().includes(bandParam.toLowerCase())) {
            bandSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  } catch (e) {}

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
          clearAddons();
        } else {
          if (bookMsg) bookMsg.innerText = data.message || "Booking failed. Try again.";
        }
      })
      .catch(() => {
        if (bookMsg) bookMsg.innerText = "Backend not reachable";
      });
  });
function setupPartBooking(fullBtnId, partBtnId, noteId, bookBtnId, eventType) {
  const fullBtn = document.getElementById(fullBtnId);
  const partBtn = document.getElementById(partBtnId);
  const note = document.getElementById(noteId);
  const bookBtn = document.getElementById(bookBtnId);

  if (!fullBtn || !partBtn || !note || !bookBtn) return;

  function setFullMode() {
    fullBtn.classList.add("active");
    partBtn.classList.remove("active");
    bookBtn.style.display = "none";
    note.innerText = "Full package booking is selected. You can also choose Part Booking for only add-ons.";
  }

  function setPartMode() {
    partBtn.classList.add("active");
    fullBtn.classList.remove("active");
    bookBtn.style.display = "block";
    note.innerText = "Part Booking is selected. Choose add-ons below and book only those services.";
  }

  fullBtn.addEventListener("click", setFullMode);
  partBtn.addEventListener("click", setPartMode);

  bookBtn.addEventListener("click", () => {
    const addons = getSelectedAddons();
    if (!addons.length) {
      alert("Please select at least one add-on service.");
      return;
    }

    openWhatsApp({
      eventType: eventType + " (Part Booking)",
      band: "Not required",
      date: "To be decided",
      name: "",
      phone: ""
    });
  });

  setFullMode(); // default
}

// Setup for wedding + birthday
setupPartBooking("fullBookingBtnW", "partBookingBtnW", "bookingTypeNoteW", "bookAddonsBtnW", "Wedding");
setupPartBooking("fullBookingBtnB", "partBookingBtnB", "bookingTypeNoteB", "bookAddonsBtnB", "Birthday");
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
window.openBandDetails = function (band) {
  const modal = document.getElementById("bandModal");
  if (!modal) {
    alert("bandModal not found in HTML");
    return;
  }

  document.getElementById("mName").innerText = band.name || "";
  document.getElementById("mPrice").innerText = band.price || "Contact for price";
  document.getElementById("mGenres").innerText = (band.genres || []).join(", ");
  document.getElementById("mDurations").innerText = (band.durations || []).join(" • ");
  document.getElementById("mLocation").innerText = band.location || "-";
  document.getElementById("mDesc").innerText = band.desc || "";

  const rating = band.rating || "-";
  const reviews = band.reviews || "0";
  document.getElementById("mRatingText").innerText = `${rating} (${reviews})`;

  const img = document.getElementById("mImg");
  if (img) {
    img.src = band.img || "";
    img.style.display = band.img ? "block" : "none";
  }

  const vid = document.getElementById("mVideo");
  const ytBtn = document.getElementById("mYtBtn");
  const iframe = document.getElementById("mIframe");

  if (iframe) {
    iframe.src = "";
    iframe.style.display = "none";
  }

  if (band.video) {
    if (band.video.includes("youtube.com") || band.video.includes("youtu.be")) {
      if (vid) {
        vid.pause();
        vid.removeAttribute("src");
        vid.style.display = "none";
      }
      if (ytBtn) {
        let ytLink = band.video;
        if (ytLink.includes("/embed/")) {
          const id = ytLink.split("/embed/")[1].split("?")[0];
          ytLink = `https://youtu.be/${id}`;
        }
        ytBtn.href = ytLink;
        ytBtn.style.display = "inline-flex";
      }
    } else {
      if (vid) {
        vid.src = band.video;
        vid.style.display = "block";
      }
      if (ytBtn) ytBtn.style.display = "none";
    }
  } else {
    if (vid) {
      vid.pause();
      vid.removeAttribute("src");
      vid.load();
      vid.style.display = "none";
    }
    if (ytBtn) ytBtn.style.display = "none";
  }

  const bookBtn = document.getElementById("mBookBtn");
  if (bookBtn) {
    bookBtn.onclick = function () {
      window.closeBandDetails();
      window.bookNow(band.name);
    };
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
};

window.closeBandDetails = function () {
  const modal = document.getElementById("bandModal");
  const vid = document.getElementById("mVideo");
  const ytBtn = document.getElementById("mYtBtn");
  const iframe = document.getElementById("mIframe");
  if (vid) {
    vid.pause();
    vid.removeAttribute("src");
    vid.style.display = "none";
  }
  if (iframe) {
    iframe.src = "";
    iframe.style.display = "none";
  }
  if (ytBtn) {
    ytBtn.style.display = "none";
  }
  if (modal) modal.style.display = "none";
  document.body.style.overflow = "";
};

// Close when tapping outside the modal box
document.addEventListener("click", (e) => {
  const modal = document.getElementById("bandModal");
  if (!modal || modal.style.display !== "flex") return;
  if (e.target === modal) window.closeBandDetails();
});

// Close with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("bandModal");
    if (modal && modal.style.display === "flex") {
      window.closeBandDetails();
    }
  }
});

/* ===============================
   GALLERY FILTER & LIGHTBOX
=============================== */
let currentLightboxIndex = 0;
let visibleGalleryCards = [];

function getActiveGalleryCards() {
  const cards = Array.from(document.querySelectorAll(".gallery-card"));
  return cards.filter(c => !c.classList.contains("hidden"));
}

window.openLightbox = function (index) {
  visibleGalleryCards = getActiveGalleryCards();
  if (!visibleGalleryCards.length) return;

  if (index < 0) index = visibleGalleryCards.length - 1;
  if (index >= visibleGalleryCards.length) index = 0;
  currentLightboxIndex = index;

  const card = visibleGalleryCards[index];
  const lightbox = document.getElementById("galleryLightbox");
  const imgEl = document.getElementById("lightboxImg");
  const videoEl = document.getElementById("lightboxVideo");
  const iframeEl = document.getElementById("lightboxIframe");
  const titleEl = document.getElementById("lightboxTitle");
  const descEl = document.getElementById("lightboxDesc");
  const counterEl = document.getElementById("lightboxCounter");

  if (!lightbox) return;

  const isVideo = card.dataset.category && card.dataset.category.includes("video") && card.dataset.video;
  const ytBtn = document.getElementById("lightboxYtBtn");

  if (isVideo) {
    if (imgEl) imgEl.style.display = "none";
    const vSrc = card.dataset.video;
    if (vSrc.includes("youtube.com") || vSrc.includes("youtu.be")) {
      let ytSrc = vSrc;
      if (ytSrc.includes("youtu.be/")) {
        const id = ytSrc.split("youtu.be/")[1].split("?")[0];
        ytSrc = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
      if (iframeEl) {
        iframeEl.src = ytSrc;
        iframeEl.style.display = "block";
      }
      if (videoEl) {
        videoEl.pause();
        videoEl.removeAttribute("src");
        videoEl.style.display = "none";
      }
      if (ytBtn) {
        ytBtn.href = card.dataset.ytlink || "https://youtu.be/SAKvJzuPcxg";
        ytBtn.style.display = "inline-flex";
      }
    } else {
      if (videoEl) {
        videoEl.src = vSrc;
        videoEl.style.display = "block";
        videoEl.play().catch(() => {});
      }
      if (iframeEl) {
        iframeEl.src = "";
        iframeEl.style.display = "none";
      }
      if (ytBtn) ytBtn.style.display = "none";
    }
  } else {
    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.load();
      videoEl.style.display = "none";
    }
    if (iframeEl) {
      iframeEl.src = "";
      iframeEl.style.display = "none";
    }
    if (ytBtn) ytBtn.style.display = "none";
    if (imgEl) {
      imgEl.src = card.dataset.src || "";
      imgEl.alt = card.dataset.title || "Gallery image";
      imgEl.style.display = "block";
    }
  }

  if (titleEl) titleEl.innerText = card.dataset.title || "";
  if (descEl) descEl.innerText = card.dataset.desc || "";
  if (counterEl) counterEl.innerText = `${index + 1} / ${visibleGalleryCards.length}`;

  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

window.closeLightbox = function () {
  const lightbox = document.getElementById("galleryLightbox");
  const videoEl = document.getElementById("lightboxVideo");
  const iframeEl = document.getElementById("lightboxIframe");
  const ytBtn = document.getElementById("lightboxYtBtn");
  if (videoEl) {
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();
    videoEl.style.display = "none";
  }
  if (iframeEl) {
    iframeEl.src = "";
    iframeEl.style.display = "none";
  }
  if (ytBtn) {
    ytBtn.style.display = "none";
  }
  if (lightbox) {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
};

window.navigateLightbox = function (direction) {
  window.openLightbox(currentLightboxIndex + direction);
};

// Initialize gallery filters and card click handlers
document.addEventListener("DOMContentLoaded", function () {
  const filterTabs = document.querySelectorAll(".filter-tab");
  const galleryCards = document.querySelectorAll(".gallery-card");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", function () {
      filterTabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      const filter = this.dataset.filter;

      galleryCards.forEach(card => {
        const categories = (card.dataset.category || "").split(" ");
        if (filter === "all" || categories.includes(filter)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });

      visibleGalleryCards = getActiveGalleryCards();
    });
  });

  galleryCards.forEach(card => {
    card.addEventListener("click", function () {
      visibleGalleryCards = getActiveGalleryCards();
      const idx = visibleGalleryCards.indexOf(this);
      if (idx !== -1) {
        window.openLightbox(idx);
      }
    });
  });

  // Lightbox keyboard controls
  document.addEventListener("keydown", function (e) {
    const lightbox = document.getElementById("galleryLightbox");
    if (!lightbox || lightbox.style.display !== "flex") return;

    if (e.key === "Escape") {
      window.closeLightbox();
    } else if (e.key === "ArrowLeft") {
      window.navigateLightbox(-1);
    } else if (e.key === "ArrowRight") {
      window.navigateLightbox(1);
    }
  });
});
