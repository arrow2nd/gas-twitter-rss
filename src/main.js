const config = PropertiesService.getScriptProperties().getProperties()

function doGet() {
  // スプレッドシートから検索ワードを取得
  const searchWords = getSearchWordsFromSS()

  // 検索
  const results = fetchSearchResults(config.twitterToken, searchWords)

  // 整形
  const items = createOembedItems(results)

  return createXML(items)
}
