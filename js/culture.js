// =========================================================
// Ora Khmer — culture.html
// Renders one horizontal card per document in the "cultures"
// Firestore collection. Document ID doubles as the slug used
// by traditions/tradition.html?slug=<id>. Cards alternate the
// image side left/right by position, same as the original
// static markup.
// =========================================================

import { db } from "./firebase-init.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function cardHTML(slug, c, index) {
  const imageFirst = index % 2 === 0;
  const imgCol = `
        <div class="col-md-6 ${imageFirst ? "" : "order-md-2"}">
            <div class="side-img-wrapper">
                <img src="images/${c.image}" alt="${c.alt}">
            </div>
        </div>`;
  const bodyCol = `
        <div class="col-md-6 ${imageFirst ? "" : "order-md-1"}">
            <div class="card-body p-4 p-lg-5 d-flex flex-column">
                <span class="culture-tag">${c.tag}</span>
                <h2 class="culture-name">${c.name}</h2>
                <p class="culture-description">${c.description}</p>
                <a href="traditions/tradition.html?slug=${slug}" class="btn btn-discover">Discover</a>
            </div>
        </div>`;

  return `
    <div class="col culture-card-wrapper">
        <div class="horizontal-culture-card">
            <div class="row g-0 align-items-center">
                ${imgCol}
                ${bodyCol}
            </div>
        </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("culture-grid");

  try {
    const q = query(collection(db, "cultures"), orderBy("order"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      grid.innerHTML = `<p class="text-muted">No cultural traditions found yet.</p>`;
      return;
    }

    grid.innerHTML = snapshot.docs
      .map((docSnap, index) => cardHTML(docSnap.id, docSnap.data(), index))
      .join("");
  } catch (err) {
    console.error("Failed to load cultures from Firestore:", err);
    grid.innerHTML = `<p class="text-danger">Couldn't load Living Culture content right now. Please try again later.</p>`;
  }
});
