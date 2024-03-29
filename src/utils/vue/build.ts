import { exec } from "child_process";

/**
 * Asynchronously builds a Vue.js project located at the specified path.
 *
 * @param projectPath The path to the Vue.js project directory.
 * @returns A Promise that resolves when the build process is complete, or rejects with an error.
 */
export async function buildVueProject(projectPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Execute npm install command
    const npmInstall = exec("npm install", { cwd: projectPath });

    // Handle stdout and stderr for npm install
    if (npmInstall.stdout && npmInstall.stderr) {
      npmInstall.stdout.on("data", (data) => {
        console.log(data);
      });

      npmInstall.stderr.on("data", (err) => {
        console.error(err);
      });

      // After npm install completes
      npmInstall.on("close", (code) => {
        if (code !== 0) {
          // If npm install failed, reject with an error
          reject(new Error(`npm install failed with code ${code}`));
          return;
        }

        // Execute npm run build command
        const npmRunBuild = exec("npm run build", { cwd: projectPath });

        // Handle stdout and stderr for npm run build
        if (npmRunBuild.stdout && npmRunBuild.stderr) {
          npmRunBuild.stdout.on("data", (data) => {
            console.log(data);
          });

          npmRunBuild.stderr.on("data", (err) => {
            console.error(err);
          });

          // After npm run build completes
          npmRunBuild.on("close", (code) => {
            if (code !== 0) {
              // If npm run build failed, reject with an error
              reject(new Error(`npm run build failed with code ${code}`));
              return;
            }

            // Build process completed successfully, resolve the Promise
            console.log("Build process completed");
            resolve();
          });
        } else {
          // If failed to capture stdout or stderr for npm run build, reject with an error
          reject(
            new Error("Failed to capture stdout or stderr for npm run build"),
          );
        }
      });
    } else {
      // If failed to capture stdout or stderr for npm install, reject with an error
      reject(new Error("Failed to capture stdout or stderr for npm install"));
    }
  });
}
