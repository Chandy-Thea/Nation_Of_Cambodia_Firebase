// =========================================================
// Ora Khmer — Firestore seed script
//
// Pushes provinces.json and cultures.json into your Firestore
// database, using the document keys as document IDs (which
// double as the "slug" used throughout the site).
//
// SETUP:
//   1. npm install firebase-admin
//   2. In the Firebase console: Project settings > Service accounts
//      > Generate new private key. Save the downloaded file next
//      to this script as "service-account.json".
//   3. node seed-firestore.js
// =========================================================
 
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const provinces = require("./provinces.json");
const cultures = require("./cultures.json");
const serviceAccount = require("./service-account.json");
 
const app = initializeApp({
  credential: cert(serviceAccount)
});
 
const db = getFirestore(app);
 
async function seedCollection(collectionName, data) {
  const batch = db.batch();
 
  Object.entries(data).forEach(([slug, fields]) => {
    const ref = db.collection(collectionName).doc(slug);
    batch.set(ref, fields);
  });
 
  await batch.commit();
  console.log(`Seeded ${Object.keys(data).length} documents into "${collectionName}"`);
}
 
(async () => {
  try {
    await seedCollection("provinces", provinces);
    await seedCollection("cultures", cultures);
    console.log("Done.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
})();