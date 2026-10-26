# Iratu

Iratu is a story led, made to order footwear website for handcrafted leather shoes made in Kenya.

## First collection

- **Mũthuri** — the woven loafer, the classic character.
- **Mũgendi** — the two tone loafer, the traveller character.
- Both styles are planned in brown and black.
- Price: KSh 4,000 per pair.
- Sizes: EU 39–45.
- Making time is currently estimated at around five days, but the final lead time must be confirmed with the maker for every order.

## Product images

The repository was empty when the first website files were added. Upload the original product images to `assets/` using these names:

- `muthuri-woven-brown.png`
- `muthuri-woven-black.png`
- `mugendi-two-tone-brown.png`
- `mugendi-two-tone-black.png`

The live code references these exact paths. The brown Mũthuri image currently has a temporary external fallback to the reference image supplied by Robin. Replace it with an original Iratu photograph before public launch.

## Ordering setup

Orders are requests via WhatsApp, not automatic payments. Before launch, open `script.js` and set `WHATSAPP_NUMBER` to Iratu's business number in international digits only, with no plus sign or spaces. For example, use the actual number beginning with `254`, not the example in this README.

The customer is told that the order is not confirmed until Iratu confirms sizing, production timing, payment and delivery. Do not promise five-day delivery until the maker confirms a reliable lead time.

## Run locally

Open `index.html` in a browser. No build step or framework is required.

## Deploy

This is a static site suitable for Netlify, GitHub Pages or another static host. Deployment has intentionally not been triggered.
