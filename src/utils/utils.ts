import { config } from "../lib/config";
import { watch } from "chokidar";
import { windowManager } from "./browser-windows/window-manager";

/**
 * Merges two widget configurations, with the properties from the `preset` taking precedence over the `source`.
 * @param source - The source widget configuration.
 * @param preset - The preset widget configuration.
 * @returns A new object that is a merge of the `preset` and `source` configurations.
 */
export function mergeWithPreset(
  source: WidgetConfig,
  preset: WidgetConfig,
): WidgetConfig {
  return Object.assign({}, preset, source);
}

// Watch the widgets directory and its subdirectories for changes
export function hotReloadWidgets() {
  // Initialize a watcher on the directory specified by `config.widgetsDir`
  const watcher = watch(config.widgetsDir, {
    // Ignore any files or directories that start with a dot
    ignored: /(^|[/\\])\../,
    // Keep the watcher running as long as the program is running
    persistent: true,
    // Do not trigger 'add' events for existing files when the watcher is started
    ignoreInitial: true,
    // Options for waiting for the write operation to finish before triggering 'add' or 'change' events
    awaitWriteFinish: {
      // The amount of time in milliseconds for a file size to remain constant before emitting its event
      stabilityThreshold: 1000,
      // The polling interval in milliseconds (defaults to 100)
      pollInterval: 100,
    },
  });

  watcher.on("change", (path, stats) => {
    // log what widget directory has changed
    console.log(path, stats);

    console.log("Widgets directory changed.");
    // If an existing file is changed, reload the widgets
    windowManager.reloadAllWidgets();
  });
}
