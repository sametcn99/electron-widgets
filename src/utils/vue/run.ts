import { exec } from "child_process";

/**
 * Asynchronously runs a Vue.js project at the specified path on the specified port.
 *
 * @param projectPath The path to the Vue.js project directory.
 * @param port The port number on which to run the project.
 * @returns A Promise that resolves when the project is running, or rejects with an error.
 */
export async function runVueProject(
  projectPath: string,
  port: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Execute npm run preview command with specified port
    const npmRun = exec(`npm run preview -- --port ${port}`, {
      cwd: projectPath,
    });
    console.log(`npm run preview -- --port ${port}`);

    // Handle stdout and stderr for npm run preview
    if (npmRun.stdout && npmRun.stderr) {
      npmRun.stdout.on("data", (data) => {
        console.log(data);
      });

      npmRun.stderr.on("data", (err) => {
        console.error(err);
      });

      // After npm run preview completes
      npmRun.on("close", (code) => {
        if (code !== 0) {
          // If npm run failed, reject with an error
          reject(new Error(`npm run failed with code ${code}`));
          return;
        }

        // npm run process completed successfully, resolve the Promise
        console.log("npm run process completed");
        resolve();
      });
    } else {
      // If failed to capture stdout or stderr for npm run, reject with an error
      reject(new Error("Failed to capture stdout or stderr for npm run"));
    }
  });
}
