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
  apiKey: "AIzaSyB5YtmBKUQdhqGKINm87jBYDB-N8EIny48",
  authDomain: "sparsh-events.firebaseapp.com",
  projectId: "sparsh-events",
  storageBucket: "sparsh-events.firebasestorage.app",
  messagingSenderId: "376857740098",
  appId: "1:376857740098:web:aeefed1a0096732777fedb",
  measurementId: "G-41KHPYMDR3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function finishLogin(user) {
  localStorage.setItem("loggedIn", "yes");
  localStorage.setItem("userName", (user.email || "").toLowerCase());
  localStorage.setItem("userPhoto", user.photoURL || "");
  window.dispatchEvent(new Event("auth-updated"));

  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
}

// ✅ listens for user after redirect (mobile)
onAuthStateChanged(auth, (user) => {
  console.log("AUTH STATE:", user);
  
  if (user) finishLogin(user);
});


window.googleLogin = async function () {
  try {
    // Try popup first (works on many devices)
    await signInWithPopup(auth, provider);
  } catch (e) {
    // Popup blocked / not supported → use redirect
    console.warn("Popup failed, using redirect:", e);
    await signInWithRedirect(auth, provider);
  }
};


window.googleLogout = async function () {
  await signOut(auth);
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userName");
  localStorage.removeItem("userPhoto");
  window.dispatchEvent(new Event("auth-updated"));
};

(async function bootAuth() {
  try {
    await setPersistence(auth, browserLocalPersistence);

    // ✅ complete redirect flow if present
    await getRedirectResult(auth);

    // ✅ fallback: trigger UI update even if redirectResult is null
    // (onAuthStateChanged will still catch the user)
    window.dispatchEvent(new Event("auth-updated"));
  } catch (e) {
    console.error("Auth boot error:", e);
  }
})();
