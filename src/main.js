function doGet() {
  return getCacheXml()
}

function fetch() {
  // スプレッドシートから検索ワードを取得
  const searchWords = getSearchWords()

  // Twitterで検索
  const results = fetchSearchResults(searchWords)

  // キャッシュを更新
  updateCache(results)
}
