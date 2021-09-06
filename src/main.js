const config = PropertiesService.getScriptProperties().getProperties()

function doGet() {
  // スプレッドシートから検索ワードを取得
  const searchWords = getSearchWordsFromSS()

  // 検索
  const results = fetchSearchResults(config.twitterToken, searchWords)
  const oembedHtmls = fetchOembedHTMLs(config.twitterToken, results)

  // 整形
  const items = createOembedItems(searchWords, oembedHtmls, results)

  return createXML(items)
}
