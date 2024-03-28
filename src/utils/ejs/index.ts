import ejs from "ejs";
import { widgetsDir } from "../../lib/constants";
import { writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export function renderEjsFiles() {
  const files = getEjsFiles(widgetsDir);
  files.forEach((file) => {
    ejs.renderFile(file, (err, html) => {
      if (err) {
        console.error(err);
        return;
      }
      const outputFilePath = file.replace(".ejs", ".html");
      writeFileSync(outputFilePath, html);
      console.log(`Rendered ${file} to ${outputFilePath}`);
    });
  });
}

function getEjsFiles(dir: string): string[] {
  try {
    const files: string[] = [];
    const entries = readdirSync(dir);
    entries.forEach((entry) => {
      const fullPath = join(dir, entry);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) {
        const nestedFiles = getEjsFiles(fullPath);
        files.push(...nestedFiles);
      } else if (stats.isFile() && entry.endsWith(".ejs")) {
        files.push(fullPath);
      }
    });
    return files;
  } catch (err) {
    console.error(`Error while getting EJS files from directory: ${dir}`);
    return [];
  }
}
