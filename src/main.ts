import { getSearchWords } from './sheets'
import { searchResult, fetchSearchResults } from './twitter'
import { createXML } from './createXML'

const config = PropertiesService.getScriptProperties().getProperties()

function doGet() {
  const searchWords = getSearchWords()
  let items: searchResult[] = []

  for (const keyword of searchWords) {
    let searchResults: searchResult[] | null

    try {
      searchResults = fetchSearchResults(config.twitterToken, keyword)
    } catch (err) {
      throw new Error(err)
    }

    // 検索結果が無い
    if (searchResults === null) {
      console.log(`[ NotFound ] ${keyword}`)
      continue
    }

    console.log(`[ Found ] ${keyword}`)

    items = items.concat(searchResults)
  }

  console.log('[ Success ]')

  return createXML(items)
}
