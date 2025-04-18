import { app, dialog } from 'electron'
import { exec } from 'child_process'
import { opmlToJSON } from 'opml-to-json'
import { IpcChannels } from '../../../../lib/ipc-channels'
import { fsSize, getStaticData } from 'systeminformation'
import { showNotification } from '../../../../utils'
import { existsSync, readFileSync, writeFileSync } from 'fs-extra'
import { config } from '../../../../lib/config'
import path from 'path'
import Parser from 'rss-parser'
import { IpcHandlerBase } from './ipc-handler-base'

/**
 * Handles app-level operations such as getting app version,
 * opening external links, disk usage, etc.
 */
export class AppOperationsHandler extends IpcHandlerBase {
  /**
   * Registers all app operations IPC handlers.
   */
  public register(): void {
    this.registerHandler(IpcChannels.GET_APP_VERSION, this.handleGetAppVersion.bind(this))
    this.registerHandler(IpcChannels.OPEN_EXTERNAL, this.handleOpenExternal.bind(this))
    this.registerHandler(IpcChannels.GET_DISK_USAGE, this.handleGetDiskUsage.bind(this))
    this.registerHandler(IpcChannels.GET_LOCATION, this.handleGetLocation.bind(this))
    this.registerHandler(IpcChannels.RSS_FEED_PARSER, this.handleRssFeedParser.bind(this))
    this.registerHandler(IpcChannels.OPML_TO_JSON, this.handleOpmlToJson.bind(this))
    this.registerHandler(IpcChannels.SYSTEM_INFO, this.handleSystemInfo.bind(this))
    this.registerHandler(IpcChannels.SHOW_NOTIFICATION, this.handleShowNotification.bind(this))
    this.registerHandler(IpcChannels.READ_CUSTOM_DATA, this.handleReadCustomData.bind(this))
    this.registerHandler(IpcChannels.WRITE_CUSTOM_DATA, this.handleWriteCustomData.bind(this))
  }

  /**
   * Handles the 'get-app-version' IPC message by returning the app version.
   * @returns The app version.
   */
  private handleGetAppVersion(): string {
    return app.getVersion()
  }

  /**
   * Handles the 'open-external-link' IPC message by opening the provided URL in the default browser.
   * @param event - The event object.
   * @param url - The URL to open.
   */
  private handleOpenExternal(event: Electron.IpcMainInvokeEvent, url: string): void {
    exec(`start "" "${url}"`, (error) => {
      if (error) {
        console.error(`Error opening file: ${error}`)
        dialog.showErrorBox('Error opening file', `${error}`)
      }
    })
  }

  /**
   * Handles the 'get-disk-usage' IPC message by returning the disk usage information.
   * @returns The disk usage information.
   */
  private handleGetDiskUsage(): Promise<any> {
    try {
      const disks = fsSize()
      return disks
    } catch (e) {
      console.error(e)
      dialog.showErrorBox('Error getting disk usage', `${e}`)
      return Promise.reject(e)
    }
  }

  /**
   * Handles the 'get-location' IPC message by retrieving the user's location.
   * @returns The user's location.
   */
  private async handleGetLocation(): Promise<any> {
    try {
      const location = await fetch('http://ip-api.com/json/').then((response) =>
        response.json()
      )
      return location
    } catch (error) {
      console.error('Error getting location:', error)
      dialog.showErrorBox('Error getting location', `${error}`)
      return Promise.reject(error)
    }
  }

  /**
   * Handles the 'rss-feed-parser' IPC message by parsing an RSS feed.
   * @param event - The event object.
   * @param url - The URL of the RSS feed.
   * @returns The parsed RSS feed.
   */
  private async handleRssFeedParser(event: Electron.IpcMainInvokeEvent, url: string): Promise<any> {
    const response = await fetch(url).then((response) => response.text())
    const data = response.toString()
    const parser = new Parser()

    const feed = parser.parseString(data)
    return feed
  }

  /**
   * Handles the 'opml-to-json' IPC message by converting OPML to JSON.
   * @param event - The event object.
   * @param xml - The OPML XML string.
   * @returns The JSON object.
   */
  private async handleOpmlToJson(event: Electron.IpcMainInvokeEvent, xml: string): Promise<any> {
    const data = await opmlToJSON(xml)
    return data
  }

  /**
   * Handles retrieving system information.
   * @returns The system information.
   */
  private async handleSystemInfo(): Promise<any> {
    const data = await getStaticData()
    return data
  }

  /**
   * Handles the 'show-notification' IPC message by showing a notification.
   * @param event - The event object.
   * @param title - The notification title.
   * @param body - The notification body.
   */
  private handleShowNotification(event: Electron.IpcMainInvokeEvent, title: string, body?: string): void {
    showNotification(title, body)
  }

  /**
   * Handles the 'read-custom-data' IPC message by reading custom data from a file.
   * @param event - The event object.
   * @param widgetKey - The widget key.
   * @param filePath - The file path.
   * @returns The custom data.
   */
  private handleReadCustomData(event: Electron.IpcMainInvokeEvent, widgetKey: string, filePath: string): string {
    const dirPath = path.join(config.widgetsDir, widgetKey, filePath)
    if (!existsSync(dirPath)) {
      return ''
    } else {
      const data = readFileSync(dirPath, 'utf8')
      return data
    }
  }

  /**
   * Handles the 'write-custom-data' IPC message by writing custom data to a file.
   * @param event - The event object.
   * @param widgetKey - The widget key.
   * @param filePath - The file path.
   * @param data - The data to write.
   */
  private handleWriteCustomData(event: Electron.IpcMainInvokeEvent, widgetKey: string, filePath: string, data: string): void {
    const dirPath = path.join(config.widgetsDir, widgetKey, filePath)
    data = JSON.stringify(data, null, 2)
    writeFileSync(dirPath, data)
  }
}
