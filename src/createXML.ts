import { searchResult } from './twitter'

function createXML(items: searchResult[]) {
  const output = HtmlService.createTemplateFromFile('template')
  output.items = items

  const result = output.evaluate()

  const xml = ContentService.createTextOutput(result.getContent()).setMimeType(
    ContentService.MimeType.XML
  )

  return xml
}

export { createXML }
