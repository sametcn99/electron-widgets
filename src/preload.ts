/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
import { loadWidgets, setupWindowControls } from "./utils/dom/main-dom";

/**
 * Handles setting up event listeners and initializing UI elements on DOM ready
 */
window.addEventListener("DOMContentLoaded", async () => {
  loadWidgets();
  setupWindowControls();
});
