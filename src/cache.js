const cache = CacheService.getScriptCache()

/**
 * キャッシュを更新する
 * @param items 検索結果
 */
function updateCache(items) {
  const output = HtmlService.createTemplateFromFile('template')
  output.items = items

  const content = output.evaluate().getContent()

  // 1時間キャッシュを保持する
  cache.put('content', content, 60 * 60)
}

/**
 * キャッシュしたXMLを取得する
 * @returns XML
 */
function getCacheXml() {
  const content = cache.get('content')

  // キャッシュが無いなら生成する
  if (content === null) {
    updateCache()
  }

  return ContentService.createTextOutput(content).setMimeType(
    ContentService.MimeType.XML
  )
}
