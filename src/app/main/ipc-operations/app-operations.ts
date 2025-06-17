import { app, dialog, ipcMain } from "electron";
import { exec } from "child_process";
import { opmlToJSON } from "opml-to-json";
import { IpcChannels } from "../../../lib/ipc-channels";
import { fsSize, getStaticData } from "systeminformation";
import { showNotification } from "../../../utils";
import { existsSync, readFileSync, writeFileSync } from "fs-extra";
import { config } from "../../../lib/config";
import path from "path";
import Parser from "rss-parser";

// Handles the 'get-app-version' IPC message by returning the app version.
ipcMain.handle(IpcChannels.GET_APP_VERSION, () => {
  return app.getVersion();
});

// Handles the 'open-external-link' IPC message by opening the provided URL in the default browser.
ipcMain.handle(IpcChannels.OPEN_EXTERNAL, (event, url) => {
  exec(`start "" "${url}"`, (error) => {
    if (error) {
      console.error(`Error opening file: ${error}`);
      dialog.showErrorBox("Error opening file", `${error}`);
    }
  });
});

// Handles the 'get-disk-usage' IPC message by returning the disk usage information.
ipcMain.handle(IpcChannels.GET_DISK_USAGE, () => {
  try {
    const disks = fsSize();
    return disks;
  } catch (e) {
    console.error(e);
    dialog.showErrorBox("Error getting disk usage", `${e}`);
  }
});

// Handles the 'get-location' IPC message by retrieving the user's location.
// This function uses the systeminformation library to get the user's location.
// If the location is successfully retrieved, it is returned as a string.
// If an error occurs, an error message is shown.
ipcMain.handle(IpcChannels.GET_LOCATION, async () => {
  try {
    const location = fetch("http://ip-api.com/json/").then((response) =>
      response.json(),
    );
    return location;
  } catch (error) {
    console.error("Error getting location:", error);
    dialog.showErrorBox("Error getting location", `${error}`);
  }
});

// Handles the 'show-notification' IPC message by showing a notification.
// This function creates a notification with the provided title and message
// and shows it to the user.
ipcMain.handle(IpcChannels.RSS_FEED_PARSER, async (event, url) => {
  const response = await fetch(url).then((response) => response.text());
  const data = response.toString();
  const parser = new Parser();

  const feed = parser.parseString(data);
  return feed;
});

// Handles the 'rss-feed-parser' IPC message by parsing an RSS feed.
// This function uses the rss-parser library to parse an RSS feed from the provided URL.
ipcMain.handle(IpcChannels.OPML_TO_JSON, async (event, xml) => {
  const data = await opmlToJSON(xml);
  return data;
});

/**
 * Handles retrieving system information.
 * @returns The system information.
 */
ipcMain.handle(IpcChannels.SYSTEM_INFO, async () => {
  const data = await getStaticData();
  return data;
});

// Handles the 'show-notification' IPC message by showing a notification.
ipcMain.handle(IpcChannels.SHOW_NOTIFICATION, (event, title, body) => {
  showNotification(title, body);
});

// Handles the 'read-custom-data' IPC message by reading custom data from a file.
ipcMain.handle(
  IpcChannels.READ_CUSTOM_DATA,
  (event, widgetKey: string, filePath: string) => {
    const dirPath = path.join(config.widgetsDir, widgetKey, filePath);
    if (!existsSync(dirPath)) {
      return "";
    } else {
      const data = readFileSync(dirPath, "utf8");
      return data;
    }
  },
);

// Handles the 'write-custom-data' IPC message by writing custom data to a file.
ipcMain.handle(
  IpcChannels.WRITE_CUSTOM_DATA,
  (event, widgetKey: string, filePath: string, data: string) => {
    const dirPath = path.join(config.widgetsDir, widgetKey, filePath);
    data = JSON.stringify(data, null, 2);
    writeFileSync(dirPath, data);
  },
);
