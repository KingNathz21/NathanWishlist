# Nathan's Wishlist — database setup

GitHub Pages hosts the website. Cloudflare D1 stores the data and a Cloudflare Worker provides the API. The Worker is serverless; nothing needs to stay running on your PC.

## 1. Create a separate database
From this folder run:

```powershell
npx wrangler login
npx wrangler d1 create nathan-wishlist
```

Copy the returned database ID into a copy of `wrangler.toml.example` named `wrangler.toml`.

## 2. Create the tables
```powershell
npx wrangler d1 execute nathan-wishlist --remote --file=./schema.sql
```

## 3. Deploy the API
```powershell
npx wrangler deploy
```

Copy the Worker URL into `wishlist-firebase-config.js` as `window.WISHLIST_API_BASE`. Commit and push the change.

## 4. Import the existing wishes
Open `/admin.html`, sign in with the authorised Google account, and choose **Import existing wishes** once. It imports the current static list as Main Wishlist items. Existing name/link matches are skipped if you repeat the import.

## Security
The Worker verifies Firebase ID-token signatures and permits only the authorised UID. Google sign-in must be enabled in Firebase Authentication and `kingnathz21.github.io` must be an authorised domain. Never commit Cloudflare API tokens or private credentials.

## Features
- A product can belong to Main, Christmas, or both.
- Purchased products remain recorded.
- Archive and restore previous wishes.
- Edit products across both lists; permanent deletion is separate.
- Product link previews attempt to read Open Graph metadata. Retailers may block automated lookups, so details remain editable.
