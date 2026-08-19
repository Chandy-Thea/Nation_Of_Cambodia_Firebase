# Ora Khmer — Firebase setup

The site now reads its province and culture content from **Firestore**
instead of hardcoded arrays. Two collections are used:

| Collection  | Doc ID (slug)         | Used by                                   |
|-------------|------------------------|--------------------------------------------|
| `provinces` | e.g. `siem-reap`       | `destinations.html`, `provinces/province.html` |
| `cultures`  | e.g. `apsara-dance`    | `culture.html`, `traditions/tradition.html`     |

Each document has the same fields as before:
`order` (number, for sort), `name`, `tag`, `image`, `alt`, `description`.

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com and create a project.
2. Add a **Web app** (</> icon) — you don't need Hosting for this step.
3. Copy the `firebaseConfig` object it gives you.
4. Enable **Firestore Database** (Build > Firestore Database > Create database, start in production mode).

## 2. Add your config to the site

Paste your config into `js/firebase-config.js`:

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## 3. Load the data

You have two options:

### Option A — Firebase console (manual, quick for a handful of docs)
Firestore Database > Start collection > name it `provinces` (then `cultures`),
and add each document using the doc ID and fields from `provinces.json` /
`cultures.json` in this folder.

### Option B — seed script (recommended, loads everything at once)
```bash
npm install firebase-admin
# download a service account key from
# Project settings > Service accounts > Generate new private key
# save it as firebase/service-account.json
node seed-firestore.js
```

## 4. Security rules

The site only *reads* this data, so lock writes down. In Firestore Database
> Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /provinces/{provinceId} {
      allow read: if true;
      allow write: if false;
    }
    match /cultures/{cultureId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Files in this folder

- `provinces.json` — the 10 provinces currently on the site.
- `cultures.json` — the 4 Living Culture entries currently on the site.
- `seed-firestore.js` — one-time script to push both into Firestore.
