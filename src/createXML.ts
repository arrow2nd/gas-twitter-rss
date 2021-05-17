import { searchResult } from './twitter'

export const createXML = (items: searchResult[]) => {
  const output = HtmlService.createTemplateFromFile('template')
  output.items = items

  const result = output.evaluate()

  return ContentService.createTextOutput(result.getContent()).setMimeType(
    ContentService.MimeType.XML
  )
}
