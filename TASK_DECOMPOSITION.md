TASK_DECOMPOSITION.md
HW 1 — Production Enterprise Data-Grid (WCAG 2.2 AA)
1. Objective
Build a reusable Data-Grid with sorting, filtering, pagination, keyboard interaction, and accessible status announcements. Target Lighthouse scores are 100/100 for Accessibility and Best Practices, verified in a documented test environment. A Lighthouse score alone does not prove WCAG conformance.
2. Architectural Constraints
- Use Vanilla HTML5, modern CSS, and ES6+ JavaScript only.
- Do not use jQuery, Bootstrap, Tailwind, front-end frameworks, or external script CDNs.
- Prefer native semantic HTML; avoid unnecessary <div> containers.
- Use const by default and let only when reassignment is required.
- Never insert untrusted/user-provided values with innerHTML. Create elements and use textContent for text.
- Use a mobile-first workflow and verify the layout at 375px before desktop testing.
- Keep data operations, keyboard behavior, and DOM rendering separated into small, testable functions.
- Make small, focused Git commits. Do not bundle the entire assignment into one implementation step.
3. Specification Notes
- The supplied data-grid-contract.ts uses TypeScript, which conflicts with the JavaScript-only constraint above. Unless the instructor explicitly requires a .ts file, express the same generic contract as JSDoc in data-grid-contract.js; do not add a TypeScript build tool just for the contract.
- The brief requires native table elements and also states an invariant for role="grid", role="row", and role="gridcell". These semantics must be reviewed together before implementation: adding ARIA grid roles changes the expected keyboard interaction model. Preserve native table semantics unless the assignment explicitly requires the ARIA grid roles; if those roles are mandatory, implement and test the complete grid keyboard model rather than adding roles decoratively.
4. Work Breakdown Structure (WBS)
WBS ID	Work Package	Deliverable	Acceptance Criteria
1.0	Inspect and document setup	Project structure review; this file	Existing files, run instructions, and project constraints are understood before coding.
1.1	Define the data contract	data-grid-contract.js with JSDoc, unless .ts is explicitly required	Documents column definitions, input data, row-selection callback, and accessible name.
1.2	Build semantic structure	HTML table, caption/name, headers, body, controls	Uses <table>, <thead>, <tbody>, <th scope="col">, and native <button> elements where appropriate; no unnecessary <div> layout.
1.3	Render records safely	Data-rendering module	Renders configured columns and rows; displays empty state; untrusted strings are inserted as text, never through innerHTML.
1.4	Add sorting	Sorting logic and sort controls	Sortable columns support ascending/descending order, with accessible state and predictable behavior.
1.5	Add filtering	Filter control and filter logic	Has a programmatic label, filters the expected fields, and announces result changes accessibly.
1.6	Add pagination	Pagination controls and state	Previous/next/page-size behavior is correct; controls disable when unavailable; filtering/sorting cannot leave the view on an invalid page.
1.7	Add row selection	Selection state and callback	Enter/Space behavior follows the chosen interaction contract; selection is exposed to keyboard and assistive-technology users.
1.8	Add keyboard navigation	Focus management and key handling	Required arrow keys and Enter/Space work consistently; focus is visible; native control behavior is not accidentally broken.
1.9	Accessibility and responsive styling	CSS, accessible labels, status announcements	Contrast is at least 4.5:1 for normal text; focus, names, roles, states, errors, and status changes are checked; 375px viewport is usable.
1.10	Verify and document	Test checklist and Lighthouse evidence	Functional, keyboard, screen-reader, contrast, responsive, and Lighthouse checks are recorded; failures are fixed and retested.


5. Implementation Sequence
1. Inspect the repository and confirm how the project is run.
2. Finalize the JavaScript data contract and the table-versus-grid semantic decision.
3. Build only the HTML structure and verify its semantics.
4. Render sample data safely; test empty data and unusual text values.
5. Implement sorting, then filtering, then pagination, testing each separately.
6. Implement selection and keyboard behavior for the selected semantic model.
7. Add accessible feedback and mobile-first styling; check 375px before desktop.
8. Run functional and accessibility checks, fix findings, and record Lighthouse results.
6. Git Workflow
- Review git status before each commit and stage only files for the completed subtask.
- Use focused commit messages, for example:
  - docs: add data-grid task decomposition
  - feat(contract): define data-grid interfaces
  - feat(html): add semantic data-grid structure
  - feat(render): render rows safely
  - feat(sort): add accessible column sorting
  - feat(filter): add data filtering
  - feat(pagination): add page controls
  - test(a11y): verify keyboard and accessibility behavior
- Do not claim a feature or score is complete until it has been tested.
7. Definition of Done
- [ ] Sorting, filtering, pagination, and row selection work as specified.
- [ ] Native semantic HTML is used appropriately and no unnecessary <div> layout is introduced.
- [ ] No unsafe innerHTML rendering of untrusted input exists.
- [ ] Required keyboard interactions, visible focus, and screen-reader announcements are tested.
- [ ] Text contrast and applicable WCAG 2.2 AA requirements are checked.
- [ ] The 375px viewport is verified before desktop.
- [ ] Lighthouse Accessibility and Best Practices each report 100/100 in the documented test environment.
- [ ] Test evidence, setup instructions, and incremental Git history are available.