# Iratu

A static site for Iratu, a Kenyan footwear label starting with two leather loafers. Orders are requests sent over WhatsApp, not automatic payments.

## Page structure

Header, image led hero, short collection introduction, one section per style (Mũthuri, then Mũgendi), Behind Iratu, how to order, FAQ, footer, and the order dialog. There is no cart, checkout, stock counter or review system.

## Styles and colours

Each style is one product with a colour selector. Choosing a colour swaps the image and carries into the order form and the WhatsApp message.

| Style | Colour | Image |
| --- | --- | --- |
| Mũthuri, woven leather loafer | Brown | `Irratu/8c1c5d15-5226-4956-ace5-365e1dfa0029.png` |
| Mũthuri, woven leather loafer | Black | `Irratu/bfdf848a-4d2f-4869-9ddc-ba743b9d4e68(1).png` |
| Mũgendi, two tone leather loafer | Brown | `Irratu/a19f54c3-32ce-4f60-9190-836cd4781630_medium.png` |
| Mũgendi, two tone leather loafer | Black | `Irratu/8e389851-5322-4c0b-8ecb-5d7511afa1d9_1_medium.png` |

KSh 4,000 a pair, EU sizes 39 to 45. Making time is around five days and must be confirmed with each customer before payment. Delivery is charged separately if applicable.

## Photos

These are temporary reference images, not Iratu's own photography. The page says so. Replace them with original photos of the actual shoes before a wider launch, or confirm you may use them commercially.

To replace a photo, update every place its path appears:

1. The `<img>` for that product in `index.html` (hero and style section).
2. The matching radio button's `data-src` (and `data-webp` for Mũthuri) in `index.html`.
3. The `images` entry for that style and colour in `MODELS` in `script.js`. The order dialog thumbnail uses it.
4. The two Mũthuri photos also have a lighter WebP copy in `Irratu/optimized/`. Replace or remove those, or browsers will keep showing the old WebP.

Square photos work best. Images are contained in a square frame and never cropped or stretched. The two Mũgendi images are only 180 to 240 px wide and look soft when large. Real photography at around 1000 px fixes this.

## Ordering

Open `script.js` to change `WHATSAPP_NUMBER` (international digits, no plus sign). The footer link in `index.html` also contains the number.

## Files

- `index.html`, `styles.css`, `script.js`: the whole site, no build step.
- `fonts/`: self hosted Instrument Serif (SIL Open Font License, see `fonts/OFL.txt`).
- `Irratu/`: product photos. `Irratu/optimized/` holds lighter WebP copies.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server.

## Deployment

Static site, suitable for Netlify or GitHub Pages. No social share image is set yet because it needs the final public URL.
