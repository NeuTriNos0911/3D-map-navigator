# 3D Map Navigator

Interactive 3D store navigation prototype built with HTML, CSS, JavaScript, Three.js, and a GLB store model.

## Project Snapshot

- Search-driven landing page for selecting a store location.
- 3D store map viewer with orbit controls.
- Product/category search that highlights matching sections of the store model.
- Lightweight static frontend that can be hosted with GitHub Pages or any static server.

## Tech Stack

- HTML
- CSS
- JavaScript
- Three.js
- GLB 3D model assets

## How To Run

Open `code.html` in a browser, search for `delhi`, and the app will open the 3D map viewer.

For the best local experience, serve the folder with a small static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/code.html
```

## Project Structure

```text
.
|-- code.html        # Location search page
|-- styles.css       # Landing page styling
|-- logo.png         # Brand/logo asset
`-- map/
    |-- index.html   # 3D viewer page
    |-- main.js      # Three.js scene, GLB loading, and search highlighting
    |-- style.css    # 3D viewer styling
    `-- storemap.glb # Store model
```

## Recruiter Notes

This project demonstrates static web development, 3D model integration, browser-based interaction design, and practical use of Three.js for navigation-style user experiences.
