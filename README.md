
# Production Enterprise Data Grid

An accessible, responsive employee data grid built with vanilla HTML5, CSS, and JavaScript ES modules.

## Features

- Semantic HTML table structure
- Runtime validation of grid properties
- Column sorting in ascending and descending order
- Case-insensitive filtering across configured columns
- Pagination and configurable page size
- Keyboard navigation between grid cells
- Row selection with `Enter` and `Space`
- ARIA labels and live status announcements
- Responsive layout and visible keyboard focus

## Project Structure

```text
.
├── index.html
├── style.css
├── data-grid.js
├── data-grid-contract.js
└── README.md
```

## Getting Started

1. Clone or download the repository.
2. Open the project folder in a code editor.
3. Start a local development server, such as VS Code Live Server.
4. Open `index.html` through the local server.

The project uses JavaScript ES modules and should be served over HTTP rather than opened directly with a `file://` URL.

## Keyboard Interaction

- Arrow keys: Move between grid cells.
- Home: Move to the first cell in the current row.
- End: Move to the last cell in the current row.
- Enter: Select the current row.
- Space: Toggle the current row's selection.

## Accessibility Verification

Verify keyboard operation, visible focus, sorting, filtering, pagination, empty states, and screen-reader announcements.

Run Lighthouse Accessibility and Best Practices audits in a supported browser.

A Lighthouse score alone does not establish full WCAG 2.2 AA conformance. Manual keyboard and screen-reader testing is also required.

## Technology Constraints

- Vanilla HTML5
- CSS
- Modern JavaScript (ES modules)
- No frontend frameworks or external UI libraries
