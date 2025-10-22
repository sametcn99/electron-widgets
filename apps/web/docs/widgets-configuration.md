# Widgets Configuration (`widgets.json`)

The `widgets.json` file is responsible for managing the configuration of your widgets. When a widget is set to be visible, the application reads its configuration from this file and creates the widget accordingly.

## Widget Configuration Types

The configuration for each widget must adhere to the following structure:

```typescript
interface WidgetConfig {
  title: string;
  visible: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  locked: boolean;
  alwaysOnTop: boolean;
}
```

### Fields Description
- **title**: The name of the widget, which should match the folder name of the widget.
- **visible**: Determines whether the widget is visible (`true`) or not (`false`).
- **width**: The width of the widget in pixels.
- **height**: The height of the widget in pixels.
- **x**: The x-coordinate of the widget's position on the screen.
- **y**: The y-coordinate of the widget's position on the screen.
- **locked**: Indicates if the widget's position and size are locked (`true`) or not (`false`).
- **alwaysOnTop**: Specifies if the widget should always stay on top of other windows (`true`) or not (`false`).

## Example Configuration File

Below is an example of how the `widgets.json` file might look with configurations for two widgets:

```json
{
  "your widget name": {
    "title": "your widget name",
    "visible": false,
    "locked": false,
    "width": 404,
    "height": 539,
    "x": 131,
    "y": 180,
    "alwaysOnTop": false
  },
  "your widget name 2": {
    "title": "your widget name 2",
    "visible": false,
    "locked": false,
    "width": 366,
    "height": 160,
    "x": 511,
    "y": 69,
    "alwaysOnTop": false
  }
}
```

### Important Note

Ensure that the `title` of each widget in the configuration matches the folder name of the respective widget. This consistency is crucial for the proper functioning of the widgets within the application.