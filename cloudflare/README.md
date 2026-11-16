# Nathan's Wishlist — Cloudflare D1

This folder contains the separate D1 database schema and a read-only Worker API for the Christmas and Main wishlists.

## Important separation

Create a brand-new D1 database named `nathan-wishlist`. Do not use the RouteFlow London database.

## Create the database

From a terminal with Wrangler installed:

```powershell
npx wrangler d1 create nathan-wishlist
```

Copy the database ID returned by Cloudflare into a copy of `wrangler.toml.example` named `wrangler.toml`, replacing the placeholder.

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

- `GET /api/health` — checks the D1 binding.
- `GET /api/items?list=main` — reads the Main Wishlist.
- `GET /api/items?list=christmas` — reads the Christmas Wishlist.

The API is intentionally read-only at this stage. Do not put Cloudflare API tokens, database credentials, or admin secrets in the public GitHub Pages code. Protected admin editing will be added separately using server-side authentication.

## Current website status

The GitHub Pages site has its new two-list selector and red theme. It continues to use the existing static wishlist data until the new D1 database has been created and the Worker deployed. This avoids showing a broken empty site before the Cloudflare setup is complete.
