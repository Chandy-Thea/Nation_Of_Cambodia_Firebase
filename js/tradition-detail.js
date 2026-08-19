// =========================================================
// Ora Khmer — traditions/tradition.html
// Reads ?slug= from the URL, fetches the matching document
// from the "cultures" Firestore collection (doc ID == slug),
// and renders it.
// =========================================================

import { db } from "../js/firebase-init.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function notFoundHTML() {
  return `
    <div class="text-center py-5">
        <h1 class="tradition-title">Tradition Not Found</h1>
        <p class="tradition-description mx-auto">We couldn't find the cultural tradition you're looking for.</p>
        <a href="../culture.html" class="btn btn-dark rounded-pill px-5 py-2 fw-medium mt-3">Back to Living Culture</a>
    </div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tradition-content");
  const slug = new URLSearchParams(window.location.search).get("slug");

  if (!slug) {
    container.innerHTML = notFoundHTML();
    return;
  }

  try {
    const snap = await getDoc(doc(db, "cultures", slug));

    if (!snap.exists()) {
      container.innerHTML = notFoundHTML();
      return;
    }

    const c = snap.data();
    document.title = `${c.name} - Ora Khmer`;

    container.innerHTML = `
        <div class="tradition-hero-wrapper my-4">
            <img src="../images/${c.image}" alt="${c.alt}">
        </div>
        <span class="tradition-type">${c.tag}</span>
        <h1 class="tradition-title">${c.name}</h1>
        <p class="tradition-description">${c.description}</p>
    `;
  } catch (err) {
    console.error("Failed to load tradition from Firestore:", err);
    container.innerHTML = `
        <div class="text-center py-5">
            <h1 class="tradition-title">Something Went Wrong</h1>
            <p class="tradition-description mx-auto">Couldn't load this tradition right now. Please try again later.</p>
            <a href="../culture.html" class="btn btn-dark rounded-pill px-5 py-2 fw-medium mt-3">Back to Living Culture</a>
        </div>`;
  }
});
