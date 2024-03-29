import { exec } from "child_process";

export async function buildVueProject(projectPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const npmInstall = exec("npm install", { cwd: projectPath });
    if (npmInstall.stdout && npmInstall.stderr) {
      npmInstall.stdout.on("data", (data) => {
        console.log(data);
      });

      npmInstall.stderr.on("data", (err) => {
        console.error(err);
      });

      npmInstall.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`npm install failed with code ${code}`));
          return;
        }

        const npmRunBuild = exec("npm run build", { cwd: projectPath });

        if (npmRunBuild.stdout && npmRunBuild.stderr) {
          npmRunBuild.stdout.on("data", (data) => {
            console.log(data);
          });

          npmRunBuild.stderr.on("data", (err) => {
            console.error(err);
          });

          npmRunBuild.on("close", (code) => {
            if (code !== 0) {
              reject(new Error(`npm run build failed with code ${code}`));
              return;
            }

            console.log("Build process completed");
            resolve();
          });
        } else {
          reject(
            new Error("Failed to capture stdout or stderr for npm run build"),
          );
        }
      });
    } else {
      reject(new Error("Failed to capture stdout or stderr for npm install"));
    }
  });
}

export async function runVueProject(
  projectPath: string,
  port: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const npmRun = exec(`npm run preview -- --port ${port}`, {
      cwd: projectPath,
    });
    console.log(`npm run preview -- --port ${port}`);
    if (npmRun.stdout && npmRun.stderr) {
      npmRun.stdout.on("data", (data) => {
        console.log(data);
      });

      npmRun.stderr.on("data", (err) => {
        console.error(err);
      });

      npmRun.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`npm run failed with code ${code}`));
          return;
        }

        console.log("npm run process completed");
        resolve();
      });
    } else {
      reject(new Error("Failed to capture stdout or stderr for npm run"));
    }
  });
}
