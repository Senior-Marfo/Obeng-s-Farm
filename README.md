# Opoku Farms

Website for Opoku Farms: farm-fresh eggs and live chickens.

| Product | Price |
|---|---|
| Small eggs (crate of 30) | GH₵ 40 |
| Medium eggs (crate of 30) | GH₵ 45 |
| Large eggs (crate of 30) | GH₵ 55 |
| Extra Large eggs (crate of 30) | GH₵ 65 |
| Live chicken (fowl) | GH₵ 300 each |

## Run
Open `index.html` in a browser. No build step is needed. 
## Live site
Once GitHub Pages is on, the site is at https://senior-marfo.github.io/Obeng-s-Farm/

To turn it on: repository **Settings → Pages → Build and deployment**, set **Source** to *Deploy from a branch*, choose **main** and **/ (root)**, then **Save**. After a minute or two the site is live. Every change pushed to `main` updates it automatically.

## Settings
Edit the `CONFIG` block at the top of `js/app.js`:
- `whatsapp`: the farm's WhatsApp number in international format, e.g. `233241234567`
- `phoneDisplay`: the phone number shown on the site, e.g. `024 123 4567`

To change prices or photos, edit the `EGGS` and `FOWL` lists in the same file.
Eggs are shown as drawn egg shapes sized to match each grade. The chicken photos are stored in the `images/` folder; to use your own farm photos, replace those files and keep the same names.
The chicken photos come from Wikimedia Commons under a Creative Commons licence. The site credits them under "Photo credits" in the footer; keep those credits for as long as the photos are used.
