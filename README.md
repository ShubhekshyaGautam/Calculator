# Tape Calculator

A small, responsive calculator with a receipt-style paper tape. Built with plain HTML, CSS, and vanilla JavaScript—no libraries or frameworks.

## Features

- Addition, subtraction, multiplication, division, decimals, percent, sign change, clear, and backspace
- Chained calculations with a hand-written calculator state machine
- Rounded results to avoid common floating-point display errors
- Clear feedback when dividing by zero, plus a 12-digit input limit
- Receipt tape that records each calculation, scrolls to the newest entry, and lets you reuse a result
- Animated tape tear-off control
- Keyboard support for digits, decimal point, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, and `Escape`
- Responsive layout, visible keyboard focus, and reduced-motion support

## Run it

No installation or build step is needed. Open `index.html` in a modern web browser, or serve the project folder with any static file server.

The display and styles are in `style.css`; the calculator behavior is in `script.js`. Google Fonts are loaded from Google Fonts when a network connection is available, with local system font fallbacks.

## Controls

| Action | Control |
| --- | --- |
| Enter numbers and decimals | Number keys and `.` |
| Choose an operation | `+`, `-`, `*`, `/` |
| Calculate and print to tape | `Enter` or `=` |
| Remove the last digit | `Backspace` |
| Clear the calculator | `Escape` or `C` |
| Change sign or apply percent | On-screen `±` or `%` |
| Reuse a result | Select its entry on the tape |
| Clear the tape | **Tear off tape** |

## Project files

```text
.
├── index.html   # Calculator and tape markup
├── style.css    # Palette, layout, responsive styles, and animations
├── script.js    # Calculator state, keyboard input, and tape behavior
└── README.md    # Project documentation
```

## Design

The interface pairs a cream vanilla calculator with cherry cola controls and an off-white receipt tape. Change the palette in the CSS custom properties at the top of `style.css`.
