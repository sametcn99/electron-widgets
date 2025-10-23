import { app } from 'electron'
import path from 'node:path'
import { homedir } from 'os'

export const config = {
  applicationName: 'Electron Widgets',
  // Use the packaged/public widgets directory as the source to copy
  // into the user's Documents/widgets on first run.
  sourceWidgetsDir: path.join(app.getAppPath(), 'public', 'widgets'),
  widgetsDir: path.join(app.getPath('documents'), 'widgets'),
  widgetsJsonPath: path.join(
    app.getPath('documents'),
    'widgets',
    'widgets.json',
  ),
  // Resolve icon from public assets to work in dev and prod
  iconPath: path.join(app.getAppPath(), 'public', 'assets', 'electron.png'),
  homePath: path.join(homedir()),
  sourceCodeUrl:
    'https://api.github.com/repos/sametcn99/electron-widgets/zipball',
}
