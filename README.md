# Iratu

A static, product led store page for Iratu, leather loafers made to order in Kenya. Orders are requests sent over WhatsApp, not automatic payments.

## Products

| Style | Colour | Image |
| --- | --- | --- |
| Mũthuri, woven leather loafer | Brown | `Irratu/8c1c5d15-5226-4956-ace5-365e1dfa0029.png` |
| Mũthuri, woven leather loafer | Black | `Irratu/bfdf848a-4d2f-4869-9ddc-ba743b9d4e68(1).png` |
| Mũgendi, two tone leather loafer | Brown | `Irratu/a19f54c3-32ce-4f60-9190-836cd4781630_medium.png` |
| Mũgendi, two tone leather loafer | Black | `Irratu/8e389851-5322-4c0b-8ecb-5d7511afa1d9_1_medium.png` |

KSh 4,000 a pair, EU sizes 39 to 45. Making time is around five days and must be confirmed with each customer before payment.

## Photos

These are temporary reference images, not Iratu's own photography. Replace them with original photos of the actual shoes before a wider launch, or confirm you may use them commercially.

When replacing a photo:

1. Change the `src` of the `<img>` for that product in `index.html`.
2. The two Mũthuri photos are wrapped in `<picture>` with a lighter WebP copy in `Irratu/optimized/`. Replace or remove that `<source>` too, otherwise browsers will keep showing the old WebP.
3. Square photos work best. Images are shown contained in a square frame, never cropped or stretched.

The two Mũgendi images are only 180 to 240 px wide and will look soft on large or high density screens. Real photography at around 1000 px fixes this.

## Ordering

Open `script.js` to change `WHATSAPP_NUMBER` (international digits, no plus sign). Product names and descriptions used in the WhatsApp message are in `MODELS` at the top of the same file.

## Files

- `index.html`, `styles.css`, `script.js`: the whole site, no build step.
- `fonts/`: self hosted Instrument Serif (SIL Open Font License, see `fonts/OFL.txt`).
- `Irratu/`: product photos. `Irratu/optimized/` holds lighter WebP copies.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server.

## Deployment

Static site, suitable for Netlify or GitHub Pages. Not deployed. No social share image is set yet because it needs the final public URL.
