# Divyansh Singh — Personal Portfolio

A responsive single-page portfolio built with plain HTML, CSS, JavaScript and Bootstrap 5 (CDN). No build step or framework is required.

## Folder structure

```text
portfolio/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    ├── Divyansh_Singh_Resume.pdf
    └── images/
        ├── avatar.png
        ├── college.png
        ├── school.png
        ├── favicon.png
        ├── certs/
        │   ├── isro.png
        │   └── infosys.png
        ├── projects/
        │   ├── chat-app.png
        │   ├── inventory-system.png
        │   ├── college-erp.png
        │   └── ecommerce-platform.png
        ├── day/
        │   ├── bird-sprite.webp
        │   ├── branch.webp
        │   ├── cloud.webp
        │   ├── hills.jpg
        │   ├── leaf-photo-1.webp
        │   ├── leaf-photo-2.webp
        │   └── leaf-photo-3.webp
        ├── space/
        │   ├── moon.png
        │   ├── ufo.png
        │   ├── satellite.png
        │   ├── astronaut.png
        │   └── astronaut-floating.png
        └── skills/
            ├── python.png
            ├── javascript.png
            ├── django.png
            ├── drf.png
            ├── django-channels.png
            ├── daphne.png
            ├── rest-api.png
            ├── celery.png
            ├── websockets.png
            ├── html.png
            ├── css.png
            ├── bootstrap.png
            ├── postgresql.png
            ├── mysql.png
            ├── sqlite.png
            ├── redis.png
            ├── git.png
            ├── github.png
            ├── docker.png
            ├── postman.png
            ├── nginx.png
            ├── gunicorn.png
            ├── cloudinary.png
            └── render.png
```

## Run the site

Open `index.html` directly in a browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. An internet connection is needed for Bootstrap, Bootstrap Icons and Google Fonts from their CDNs.

## Images to replace

The repository includes generated placeholder artwork for most images. Replace each file with your own asset while keeping the same filename, or update the matching `src` in `index.html`. The skill icons are already replaced with real project logos.

| File | Suggested content | Suggested size |
| --- | --- | --- |
| `assets/images/avatar.png` | Your portrait, square crop, face centred | 800 × 800 px |
| `assets/images/college.png` | College logo | 400 × 400 px |
| `assets/images/school.png` | School logo | 400 × 400 px |
| `assets/images/favicon.png` | Browser tab icon | 128 × 128 px |
| `assets/images/projects/chat-app.png` | Screenshot of the chat application | 1200 × 750 px |
| `assets/images/projects/inventory-system.png` | Screenshot of the inventory dashboard | 1200 × 750 px |
| `assets/images/projects/college-erp.png` | Screenshot of the College ERP dashboard | 1200 × 750 px |
| `assets/images/projects/ecommerce-platform.png` | Screenshot of the e-commerce storefront | 1200 × 750 px |
| `assets/images/certs/isro.png` | ISRO certificate scan | 1400 × 990 px |
| `assets/images/certs/infosys.png` | Infosys certificate scan | 1400 × 990 px |
| `assets/Divyansh_Singh_Resume.pdf` | Your final resume PDF | A4, single or multi-page |

Skill icons live in `assets/images/skills/` and use the filenames referenced in the Skills section of `index.html`. They are 160 × 160 px local renders of project logos sourced from [Devicon](https://devicon.dev/) and [Simple Icons](https://simpleicons.org/), with the Daphne mark from the Wappalyzer technology icon set. All logos remain trademarks of their respective owners.

## Customisation notes

- **Theme:** dark is the default. The light/dark toggle stores the choice in `localStorage` under `portfolio-theme`.
- **Animated background:** dark mode uses the supplied artwork in `assets/images/space/` (`moon.png`, `satellite.png`, `astronaut-floating.png`). The `2b. Animated space and sky background` block of `css/style.css` draws a three-layer starfield, cyan-white shooting stars, drifting asteroids, an occasional asteroid collision, and the floating moon, satellite and astronaut. Light mode hides the space scene and shows a separate nature scene from `assets/images/day/` (`bird-sprite.webp`, `branch.webp`, `cloud.webp`, `hills.jpg`, `leaf-photo-*.webp`) with soft clouds, leafy branches, distant hills, drifting leaves, and 3–5 flapping 2D birds. `DayBirdsModule` in `js/main.js` moves the birds to random sky targets so they change direction naturally. Hero objects fade out after the hero while the sky backdrop continues behind the page. `prefers-reduced-motion` disables the decorative motion.
- **Section flight dividers:** the six `.flight-divider` elements between sections draw a scroll-linked smoke trail. Dark mode uses the airplane; light mode replaces it with a four-bird flock whose wings flap via the shared bird sprite and which turns to face the current scroll direction. Progress is driven by `FlightModule` in `js/main.js`; edit the `0.9` / `0.45` viewport multipliers to change when the vehicle crosses. The travel distance is theme-aware so the wider flock stays inside the divider. Reduced motion shows a static line without the plane or birds.
- **Hero skill orbit:** edit the five `<span class="orbit-skill">` items inside `.skill-orbit` in `index.html` to change the rotating top skills.
- **Accent colour:** change the `--accent`, `--accent-strong`, `--accent-rgb` and related variables at the top of `css/style.css`.
- **Contact form:** `index.html` currently uses the placeholder action `https://formspree.io/f/your-form-id`. Replace `your-form-id` with your real Formspree form ID to receive submissions. Until then, the JavaScript falls back to opening the visitor's email app with the form content filled in.
- **Resume:** replace `assets/Divyansh_Singh_Resume.pdf` with your latest resume. The hero button already points to that path and uses the `download` attribute.
- **Links:** LinkedIn, GitHub, live demo URLs, project repository URLs, email address and resume path can be updated directly in `index.html`.

## Features

- Sticky, collapsible navbar with active-section highlighting
- Typing animation in the hero
- Separate animated scenes for each theme: a dark space scene with starfield, shooting stars, asteroids and a floating moon/satellite/astronaut; a nature scene with leafy branches, drifting clouds, distant hills, floating leaves and 3–5 flapping birds that change direction
- Scroll-linked smoke-trail dividers with an airplane in dark mode and a four-bird flock in light mode
- Rotating orbit of top-five skill logos around the hero portrait
- Dark/light theme with saved preference
- Fade-up reveals with `IntersectionObserver`
- Scroll progress bar and back-to-top button
- Responsive Bootstrap grid and mobile-first layout
- Multi-column footer with quick links, contact details and social links
- Certificate preview modals
- Lazy-loaded images, semantic landmarks, alt text and visible focus states
- `prefers-reduced-motion` support
