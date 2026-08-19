// =========================================================
// Ora Khmer — provinces/province.html
// Reads ?slug= from the URL, fetches the matching document
// from the "provinces" Firestore collection (doc ID == slug),
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
        <h1 class="province-title">Province Not Found</h1>
        <p class="province-description mx-auto">We couldn't find the destination you're looking for.</p>
        <a href="../destinations.html" class="btn btn-dark rounded-pill px-5 py-2 fw-medium mt-3">Back to Destinations</a>
    </div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("province-content");
  const slug = new URLSearchParams(window.location.search).get("slug");

  if (!slug) {
    container.innerHTML = notFoundHTML();
    return;
  }

  try {
    const snap = await getDoc(doc(db, "provinces", slug));

    if (!snap.exists()) {
      container.innerHTML = notFoundHTML();
      return;
    }

    const p = snap.data();
    document.title = `${p.name} - Ora Khmer`;

    container.innerHTML = `
        <div class="province-hero-wrapper my-4">
            <img src="../images/${p.image}" alt="${p.alt}">
        </div>
        <span class="province-type">${p.tag}</span>
        <h1 class="province-title">${p.name}</h1>
        <p class="province-description">${p.description}</p>
    `;
  } catch (err) {
    console.error("Failed to load province from Firestore:", err);
    container.innerHTML = `
        <div class="text-center py-5">
            <h1 class="province-title">Something Went Wrong</h1>
            <p class="province-description mx-auto">Couldn't load this destination right now. Please try again later.</p>
            <a href="../destinations.html" class="btn btn-dark rounded-pill px-5 py-2 fw-medium mt-3">Back to Destinations</a>
        </div>`;
  }
});
