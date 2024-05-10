import path from "node:path";
import { homedir } from "os";

export const config = {
  applicationName: "Electron Widgets",
  sourceWidgetsDir: path.join(__dirname, "widgets"),
  widgetsDir: path.join(homedir(), "electron-widgets"),
  widgetsJsonPath: path.join(
    path.join(homedir(), "electron-widgets"),
    "widgets.json",
  ),
  iconPath: path.join(__dirname, "assets", "electron.png"),
  homePath: path.join(homedir()),
  sourceCodeUrl:
    "https://api.github.com/repos/sametcn99/electron-widgets/zipball",
};
