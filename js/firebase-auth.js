import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAyHOMVCG77WfcKCcVc5g6G5i-jwSCLAVw",
  authDomain: "eventique-group-of-events.firebaseapp.com",
  projectId: "eventique-group-of-events",
  storageBucket: "eventique-group-of-events.firebasestorage.app",
  messagingSenderId: "798028196131",
  appId: "1:798028196131:web:001bec52ac00f2d35ac496",
  measurementId: "G-DB67QX6JWE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

function finishLogin(user) {
  if (!user) return;
  localStorage.setItem("loggedIn", "yes");
  localStorage.setItem("userName", user.displayName || user.email || "User");
  localStorage.setItem("userEmail", (user.email || "").toLowerCase());
  localStorage.setItem("userPhoto", user.photoURL || "");
  window.dispatchEvent(new Event("auth-updated"));

  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
  console.log("✅ Logged in successfully as:", user.displayName || user.email);
}

// ✅ Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    finishLogin(user);
  }
});

// ✅ Global Google Login function
window.googleLogin = async function () {
  try {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
      const result = await signInWithPopup(auth, provider);
      if (result && result.user) {
        finishLogin(result.user);
      }
    }
  } catch (e) {
    console.error("Google Login Error:", e);
    if (e.code === "auth/unauthorized-domain") {
      alert("⚠️ Firebase Domain Error: Current domain (" + window.location.hostname + ") is not authorized in Firebase Console > Authentication > Settings > Authorized domains.");
    } else if (e.code === "auth/popup-blocked" || e.code === "auth/popup-closed-by-user") {
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectErr) {
        console.error("Redirect login error:", redirectErr);
      }
    } else {
      alert("Google Login: " + (e.message || e.code));
    }
  }
};

// ✅ Global Google Logout function
window.googleLogout = async function () {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn("SignOut notice:", e);
  }
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userPhoto");
  window.dispatchEvent(new Event("auth-updated"));
  console.log("Logged out successfully");
};

// ✅ Handle redirect result on page load
(async function bootAuth() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      finishLogin(result.user);
    }
    window.dispatchEvent(new Event("auth-updated"));
  } catch (e) {
    console.error("Auth boot error:", e);
  }
})();
