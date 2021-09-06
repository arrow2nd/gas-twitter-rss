/**
 * XMLを作成
 *
 * @param items 検索結果
 * @returns XML
 */
function createXML(items) {
  const output = HtmlService.createTemplateFromFile('template')
  output.items = items

  const content = output.evaluate().getContent()

  return ContentService.createTextOutput(content).setMimeType(
    ContentService.MimeType.XML
  )
}
