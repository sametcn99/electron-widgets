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

export function hotReloadWidgets() {
  // Watch the widgets directory and its subdirectories for changes
  const watcher = watch(config.widgetsDir, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  });

  watcher.on("change", () => {
    // If an existing file is changed, reload the widgets
    windowManager.reloadAllWidgets();
  });
}
