import { CssStylesheetAST, parse, stringify } from '@adobe/css-tools'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { config } from '../../lib/config'
import { dialog } from 'electron'

export const cssFileNames = new Set([
  'style.css',
  'styles.css',
  'index.css',
  'main.css',
  'widget.css',
])

export function parseCSS(css: string): CssStylesheetAST {
  return parse(css)
}

export function stringifyCSS(css: CssStylesheetAST) {
  return stringify(css)
}

export function parseCSSFile(file: string): CssStylesheetAST {
  return parseCSS(readFileSync(file, 'utf-8'))
}

export function stringifyCSSFile(file: string) {
  return stringifyCSS(parseCSSFile(file))
}

export function findCssFile(widgetKey: string) {
  for (const cssFileName of cssFileNames) {
    const filePath = `${config.widgetsDir}/${widgetKey}/${cssFileName}`
    if (existsSync(filePath)) {
      return filePath
    }
  }
  dialog.showErrorBox(
    'Error',
    `No CSS file found for widget ${widgetKey}. Please create a CSS file with one of the following names: ${Array.from(
      cssFileNames,
    ).join(', ')}`,
  )
  throw new Error(`No CSS file found for widget ${widgetKey}`)
}

export function parseWidgetCss(widgetKey: string) {
  const cssFilePath = findCssFile(widgetKey)
  return parseCSSFile(cssFilePath)
}

export function stringifyWidgetCss(widgetKey: string) {
  const cssFilePath = findCssFile(widgetKey)
  return stringifyCSSFile(cssFilePath)
}

export function writeWidgetCss(widgetKey: string, css: CssStylesheetAST) {
  const cssFilePath = findCssFile(widgetKey)
  return writeFileSync(cssFilePath, stringify(css))
}
