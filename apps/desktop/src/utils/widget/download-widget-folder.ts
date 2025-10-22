// import { dialog } from "electron";
// import path from "node:path";
// import StreamZip from "node-stream-zip";
// import { config } from "../../lib/config";
// import { existsSync, rmSync, writeFileSync } from "node:fs";

// /**
//  * Downloads and copies the widgets folder if it doesn't already exist.
//  * @returns {Promise<void>} A promise that resolves when the operation is complete.
//  */
// export async function downloadAndCopyWidgetsFolderIfNeeded(): Promise<void> {
//   // Check if the widgets directory exists
//   if (!existsSync(config.widgetsDir)) {
//     console.log("Directory is not found. Copying...");
//     await downloadAndCopyWidgetsFolder();
//   }
// }

// /**
//  * Downloads and copies the widgets folder from a remote URL.
//  * @returns {Promise<void>} A promise that resolves when the operation is complete.
//  */
// export async function downloadAndCopyWidgetsFolder(): Promise<void> {
//   try {
//     // Fetch the zip file from the URL
//     const arrayBuffer = await fetch(config.sourceCodeUrl).then((res) => {
//       if (!res.ok) {
//         throw new Error(`Failed to download folder. HTTP status ${res.status}`);
//       }
//       return res.blob().then((blob) => blob.arrayBuffer());
//     });

//     // Define the path where the zip file will be saved
//     const zipPath = path.join(config.homePath, "widgets.zip");
//     // Write the array buffer to a file
//     writeFileSync(zipPath, new Uint8Array(arrayBuffer));
//     // Open the zip file
//     const zip = new StreamZip.async({ file: zipPath });
//     // Get the entries of the zip file
//     const entries = await zip.entries();
//     // Define the path of the extracted zip file
//     const extractedZipPath = path
//       .join(`${Object.keys(entries)[0]}`, "public", "widgets")
//       .replace(/\\/g, "/");
//     // Extract the zip file to the widgets directory
//     await zip.extract(extractedZipPath, config.widgetsDir);
//     // Close the zip file
//     await zip.close();
//     // Remove the zip file
//     rmSync(zipPath);
//   } catch (error) {
//     // If there's an error, show it
//     dialog.showErrorBox("Error downloading folder", `${error}`);
//   }
// }
