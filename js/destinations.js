// =========================================================
// Ora Khmer — destinations.html
// Renders one card per document in the "provinces" Firestore
// collection. Document ID doubles as the slug used by
// provinces/province.html?slug=<id>.
// =========================================================

import { db } from "./firebase-init.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function cardHTML(slug, p) {
  return `
    <div class="col">
        <div class="temple-card">
            <div class="temple-img-wrapper">
                <img src="images/${p.image}" alt="${p.alt}">
            </div>
            <div class="card-body p-3 d-flex flex-column">
                <span class="temple-type">${p.tag}</span>
                <h3 class="temple-name">${p.name}</h3>
                <a href="provinces/province.html?slug=${slug}" class="btn btn-discover">Discover</a>
            </div>
        </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("destinations-grid");

  try {
    const q = query(collection(db, "provinces"), orderBy("order"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      grid.innerHTML = `<p class="text-muted">No destinations found yet.</p>`;
      return;
    }

    grid.innerHTML = snapshot.docs
      .map(docSnap => cardHTML(docSnap.id, docSnap.data()))
      .join("");
  } catch (err) {
    console.error("Failed to load provinces from Firestore:", err);
    grid.innerHTML = `<p class="text-danger">Couldn't load destinations right now. Please try again later.</p>`;
  }
});
