import path from "node:path";
import { homedir } from "os";

export const sourceWidgetsDir = path.join(__dirname, "widgets");
export const widgetsDir = path.join(homedir(), "Desktop", "widgets");
export const widgetsJsonPath = path.join(widgetsDir, "widgets.json");
