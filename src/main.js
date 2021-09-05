const config = PropertiesService.getScriptProperties().getProperties()

function doGet() {
  const searchWords = getSearchWords()
  let items = []

  for (const keyword of searchWords) {
    let searchResults = []

    try {
      searchResults = fetchSearchResults(config.twitterToken, keyword)
    } catch (err) {
      throw new Error(err)
    }

    // 検索結果が無い
    if (searchResults === null) continue

    items = items.concat(searchResults)
  }

  return createXML(items)
}
