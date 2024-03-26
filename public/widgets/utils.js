import {
    readFileSync,
    writeFile,
} from "node:fs";
import path from "path";
import { homedir } from "os";

let widgetsJsonPath = path.join(
    homedir(),
    "Desktop",
    "widgets",
    "widgets.json"
);

/**
 * Reads the widgets.json file and returns its contents as a string.
 * @param widgetsJsonPath - The path to the widgets.json file.
 * @returns The contents of the widgets.json file as a string.
 * @throws If an error occurs while reading the file.
 */
export function getWidgetsJson() {
    try {
        const widgetsData = readFileSync(widgetsJsonPath, "utf-8");
        return widgetsData;
    } catch (error) {
        console.error("Failed to read widgets.json:", error);
        throw error;
    }
}

/**
 * Writes the given JSON data to the widgets.json file located at the given path.
 * @param jsonData - The JSON data to write.
 * @param widgetsJsonPath - The path to the widgets.json file.
 */
export async function setWidgetsJson(
    jsonData,
) {
    try {
        console.log("Writing to widgets.json:", widgetsJsonPath);
        await writeFile(widgetsJsonPath, jsonData, (err) => {
            if (err) {
                console.error(`Error writing to widgets.json: ${err}`);
                return;
            }
            console.log("Data has been written to widgets.json");
        });
    } catch (err) {
        console.error(`Error writing to widgets.json:`, err);
    }
}