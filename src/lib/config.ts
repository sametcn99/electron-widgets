import { app } from 'electron'
import path from 'node:path'
import { homedir } from 'os'

export const config = {
  applicationName: 'Electron Widgets',
  sourceWidgetsDir: path.join(__dirname, 'widgets'),
  widgetsDir: path.join(app.getPath('documents'), 'widgets'),
  widgetsJsonPath: path.join(
    app.getPath('documents'),
    'widgets',
    'widgets.json'
  ),
  iconPath: path.join(__dirname, 'assets', 'electron.png'),
  homePath: path.join(homedir()),
  sourceCodeUrl:
    'https://api.github.com/repos/sametcn99/electron-widgets/zipball'
}
