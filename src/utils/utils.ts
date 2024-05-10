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
