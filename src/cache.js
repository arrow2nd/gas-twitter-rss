const cache = CacheService.getScriptCache()

/**
 * キャッシュを更新する
 * @param {Array} items 検索結果
 */
function updateCache(items) {
  const output = HtmlService.createTemplateFromFile('template')
  output.items = items

  const content = output.evaluate().getContent()

  // 2時間キャッシュを保持する
  cache.put('content', content, 120 * 60)
}

/**
 * キャッシュしたXMLを取得する
 * @return {String} XML
 */
function getCacheXml() {
  const content = cache.get('content')

  return ContentService.createTextOutput(content).setMimeType(
    ContentService.MimeType.XML
  )
}
