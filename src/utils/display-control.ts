import { dialog, screen } from "electron";
import { config } from "../lib/config";
import { getWidgetsJson, setWidgetsJson } from "./widget/widgets-folder";
import { windowManager } from "./browser-windows/window-manager";

export function displayControl() {
  const data = getWidgetsJson(config.widgetsJsonPath);
  let totalWidth: number = 0;
  let minHeight: number = 0;
  screen.getAllDisplays().forEach((display) => {
    // get the minimum height of the display
    if (display.bounds.height < minHeight || minHeight === 0) {
      minHeight = display.bounds.height;
    }
    totalWidth += display.bounds.width;
  });
  const outOfBoundsWidgets: WidgetConfig[] = [];
  // get widget width and height from widgets.json if with or height is not in totalwidth or totalheight then set it to 0
  Object.entries(data).forEach(([, value]) => {
    const widget = value; // Declare the 'widget' variable
    const widgetMaxWidth = widget.x + widget.width;
    const widgetMaxHeight = widget.y + widget.height;

    if (
      widgetMaxWidth > totalWidth ||
      widgetMaxHeight > minHeight ||
      widget.x < 0 ||
      widget.y < 0
    ) {
      console.log(`Widget ${widget.title} is out of bounds.`);
      outOfBoundsWidgets.push(widget);
    }
  });
  if (outOfBoundsWidgets.length > 0) {
    dialog
      .showMessageBox({
        buttons: ["Yes", "No"],
        detail: `There are ${outOfBoundsWidgets.length} widgets that may be out of bounds.`,
        type: "question",
        title: "Warning",
        message: `There are ${outOfBoundsWidgets.length} widgets that may be out of bounds. Do you want to set the width and height to default for all of them?`,
      })
      .then((result) => {
        if (result.response === 0) {
          outOfBoundsWidgets.forEach((widget: WidgetConfig) => {
            widget.x = 50;
            widget.y = 50;
            widget.locked = false;
            setWidgetsJson(data, config.widgetsJsonPath);
            windowManager.reCreateWidget(widget.title);
          });
          windowManager.reloadMainWindow();
        }
      });
  }
}
