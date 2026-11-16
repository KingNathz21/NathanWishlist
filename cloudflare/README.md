# Nathan's Wishlist — Cloudflare D1 and private admin

This folder contains a separate D1 database schema and Worker API for the Christmas and Main wishlists. The private admin page reuses the Firebase Google sign-in project used by RouteFlow London (rflofficial).

## Security

- The only permitted Firebase UID is configured in the Worker: the admin UID supplied for Nathan's Google account.
- The Worker verifies Firebase ID-token signatures, issuer, audience and expiry, then checks the UID on every admin API request.
- The admin page also checks the UID before displaying its dashboard. This front-end check is only for presentation; the Worker check is the actual security boundary.
- No public registration or password is used by the wishlist admin.
- The API allows public read-only access to wishlist items, but all create, edit and delete endpoints require the authorised Firebase account.

## Create the database

Create a brand-new D1 database named nathan-wishlist. Do not use the RouteFlow London database.

```powershell
npx wrangler d1 create nathan-wishlist
```

Copy the database ID returned by Cloudflare into a copy of wrangler.toml.example named wrangler.toml, replacing the placeholder.

## Create the tables

From this folder:

```powershell
npx wrangler d1 execute nathan-wishlist --remote --file=./schema.sql
```

## Deploy the API

```powershell
npx wrangler deploy
```

The Worker exposes:

- GET /api/health — checks the D1 binding.
- GET /api/items?list=main and GET /api/items?list=christmas — public read-only wishlist data.
- GET /api/admin/items?list=main or christmas — protected admin list.
- POST /api/admin/items — protected create.
- PATCH /api/admin/items/:id — protected edit.
- DELETE /api/admin/items/:id — protected delete.

## Connect the admin page

After deployment, copy the Worker URL into wishlist-firebase-config.js as window.WISHLIST_API_BASE. For example:

```js
window.WISHLIST_API_BASE = "https://your-worker-name.your-subdomain.workers.dev";
```

The Firebase web app configuration is already copied from RouteFlow's public firebase-config.js. Confirm that Google sign-in is enabled in Firebase Authentication and that kingnathz21.github.io is listed under Authentication → Settings → Authorised domains. Use the same Google account whose Firebase UID is allowlisted in cloudflare/worker.js.

## Existing wishlist data

The current static wishlist contains 69 items. Once the D1 database is created, the existing items need importing into D1 so the new admin can manage the full collection. The database starts empty; existing static items will not appear in the admin until that import and frontend connection are completed.

## Important

Never put Cloudflare API tokens, service-account credentials, private keys or passwords in the public repository. The Firebase browser API key is a public identifier; Firebase ID-token verification and the server-side UID allowlist enforce access.
