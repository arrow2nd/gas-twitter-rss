type searchResult = {
  id: string
  userName: string
  screenName: string
  text: string
  date: string
  url: string
  imageUrl: string
  imageExt: string
}

// ツイートを検索
function searchTweets(token: string, keyword: string): any[] {
  // RTを除外
  let query = encodeURIComponent(`${keyword} -filter:retweets`)

  const params = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const res = UrlFetchApp.fetch(
    `https://api.twitter.com/1.1/search/tweets.json?q=${query}&count=10&result_type=recent`,
    params
  )

  const json = JSON.parse(res.getContentText())

  return json.statuses
}

/**
 * 検索結果を取得
 *
 * @param token ベアラートークン
 * @param search 検索情報
 * @returns 検索結果
 */
function fetchSearchResults(
  token: string,
  keyword: string
): searchResult[] | null {
  const tweets = searchTweets(token, keyword)

  if (tweets.length <= 0) {
    return null
  }

  const results: searchResult[] = tweets.map((e) => {
    const id = e.id_str
    const screenName = e.user.screen_name
    const createdAt = Utilities.formatDate(
      new Date(e.created_at),
      'Asia/Tokyo',
      'E, d MMM YYYY HH:mm:ss Z'
    )
    const imageUrl = e.entities.media
      ? e.entities.media[0].media_url_https
      : e.user.profile_image_url_https.replace('_normal', '_bigger')
    const imageExt = imageUrl.match(/\.([A-Za-z]{3,4}$)/)[1]

    return {
      id: id,
      userName: e.user.name,
      screenName: screenName,
      text: e.text,
      date: createdAt,
      url: `https://twitter.com/${screenName}/status/${id}`,
      imageUrl: imageUrl,
      imageExt: imageExt
    }
  })

  return results
}

export { searchResult, fetchSearchResults }
