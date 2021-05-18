import { searchResult } from './twitter'

/**
 * XMLを作成
 *
 * @param items 検索結果
 * @returns XML
 */
export const createXML = (items: searchResult[]) => {
  const output = HtmlService.createTemplateFromFile('template')
  output.items = items

  const result = output.evaluate()

  return ContentService.createTextOutput(result.getContent()).setMimeType(
    ContentService.MimeType.XML
  )
}
