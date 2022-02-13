const config = PropertiesService.getScriptProperties().getProperties()

function doGet() {
  return getCacheXml()
}

function fetch() {
  // スプレッドシートから検索ワードを取得
  const searchWords = getSearchWordsFromSS()

  // Twitterで検索
  const results = fetchSearchResults(config.twitterToken, searchWords)

  // キャッシュを更新
  const items = createOembedItems(results)
  updateCache(items)
}
