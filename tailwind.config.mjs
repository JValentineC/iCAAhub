/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Adjust this path to match your project structure
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        abyss: {
          "base-100": "#fdfdfd",
          "base-200": "rgb(56, 56, 56)",
          "base-300": "oklch(92% 0 0)",
          "base-content": "#b9123f",
          primary: "#b9123f",
          "primary-content": "rgb(40, 40, 39)",
          secondary: "#fdfdfd",
          "secondary-content": "rgb(40, 40, 39)",
          accent: "rgb(56, 56, 56)",
          "accent-content": "#fdfdfd",
          neutral: "rgb(56, 56, 56)",
          "neutral-content": "rgb(248, 48, 48)",
          info: "rgb(40, 40, 39)",
          "info-content": "#fdfdfd",
          success: "rgb(40, 40, 39)",
          "success-content": "rgb(248, 48, 48)",
          warning: "#b9123f",
          "warning-content": "oklch(12% 0.042 264.695)",
          error: "rgb(248, 48, 48)",
          "error-content": "rgb(40, 40, 39)",
          "radius-selector": "0.25rem",
          "radius-field": "1rem",
          "radius-box": "2rem",
          "size-selector": "0.25rem",
          "size-field": "0.21875rem",
          border: "4px",
          depth: "0",
          noise: "0",
        },
      },
    ],
  },
};
