import path from "node:path";
import os from "node:os";

export const sourceWidgetsDir = path.join(__dirname, "widgets");
export const widgetsDir = path.join(os.homedir(), "Desktop", "widgets");
export const widgetsJsonPath = path.join(widgetsDir, "widgets.json");
