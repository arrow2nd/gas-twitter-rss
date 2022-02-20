const config = PropertiesService.getScriptProperties().getProperties()
const ignoreUsernames = getIgnoreUsernames()
const ignoreClients = getIgnoreClients()

/**
 * ツイートを検索
 * @param {Array<String>} keywords 検索ワード
 * @returns {Array} 検索結果の配列
 */
function fetchSearchResults(keywords) {
  const requests = createRequests(keywords)
  const responses = UrlFetchApp.fetchAll(requests)

  const results = responses.map((res, i) => {
    const json = JSON.parse(res.getContentText())
    const data = json?.data
    const users = json?.includes?.users

    // 検索結果が無い
    if (!data || !users) {
      return null
    }

    return formatTweets(keywords[i], data, users, json?.includes?.media)
  })

  return results.filter(Boolean).flat()
}

/**
 * 検索ワードからリクエストを作成する
 * @param {Array<String>} keywords 検索ワード
 * @returns {Array} リクエスト
 */
function createRequests(keywords) {
  return keywords.map((keyword) => {
    const urlParams = createUrlParam({
      query: encodeURIComponent(`${keyword} -is:retweet -is:reply`),
      max_results: '10',
      expansions: 'author_id,attachments.media_keys',
      'tweet.fields': 'created_at,id,source,text',
      'user.fields': 'name,username',
      'media.fields': 'url'
    })

    return {
      url: `https://api.twitter.com/2/tweets/search/recent?${urlParams}`,
      headers: {
        Authorization: `Bearer ${config.twitterToken}`
      }
    }
  })
}

/**
 * ツイートデータをを整形する
 * @param {String} keyword 検索ワード
 * @param {Array} data ツイート
 * @param {Array} users ユーザー情報
 * @param {Array | undefined} media メディア情報
 * @returns {Array} 整形後のツイートデータ
 */
function formatTweets(keyword, data, users, media) {
  const results = data
    .map((tweet) => {
      const author = users.find(({ id }) => id === tweet.author_id)

      // 除外対象ならnullを返す
      if (
        ignoreClients.includes(tweet.source) ||
        ignoreUsernames.includes(author.username)
      ) {
        return null
      }

      // 添付画像を取得
      const mediaKey = tweet?.attachments?.media_keys[0]
      const mediaUrl =
        mediaKey && media?.find(({ media_key }) => media_key === mediaKey)?.url

      // 投稿日時をRSS用のフォーマットに直す
      const date = Utilities.formatDate(
        new Date(tweet.created_at),
        'Asia/Tokyo',
        'E, d MMM YYYY HH:mm:ss Z'
      )

      return {
        title: `【${keyword}】${truncate(tweet.text, 20)}`,
        name: author.name,
        username: author.username,
        text: tweet.text,
        url: `https://twitter.com/${author.username}/status/${tweet.id}`,
        mediaUrl,
        date
      }
    })
    .filter(Boolean)

  console.log(`${keyword} : ${results.length}`)

  return results
}
