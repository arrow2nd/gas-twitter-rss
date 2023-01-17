const config = PropertiesService.getScriptProperties().getProperties()
const ignoreUsernames = getIgnoreUsernames()
const muteWords = getMuteWords()

/**
 * ツイートを検索
 * @param {string[]} keywords 検索ワード
 * @returns {any[]} 検索結果の配列
 */
function fetchSearchResults(keywords) {
  const requests = createRequests(keywords)
  const responses = UrlFetchApp.fetchAll(requests)

  const results = responses.map((res, i) => {
    const json = JSON.parse(res.getContentText())
    return createOembedData(keywords[i], json)
  })

  return results.filter(Boolean).flat()
}

/**
 * 検索ワードからリクエストを作成する
 * @param {string[]} keywords 検索ワード
 * @returns {any[]} リクエスト
 */
function createRequests(keywords) {
  return keywords.map((keyword) => {
    const urlParams = createUrlParam({
      query: encodeURIComponent(`${keyword} -is:retweet -is:reply`),
      max_results: '10',
      expansions: 'author_id,attachments.media_keys',
      'tweet.fields': 'created_at,id,text,entities',
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
 * 埋め込み用データを作成
 * @param {string} keyword 検索ワード
 * @param {any} json JSONオブジェクト
 * @returns {any[] | null} 埋め込み用データ
 */
function createOembedData(keyword, json) {
  const data = json?.data
  const users = json?.includes?.users
  const media = json?.includes?.media

  // 検索結果が無い
  if (!data || !users) {
    return null
  }

  const results = data
    .map((tweet) => {
      const author = users.find(({ id }) => id === tweet.author_id)

      // ワードミュート
      for (const muteWord of muteWords) {
        if (tweet.text.includes(muteWord)) {
          return null
        }
      }

      // ユーザミュート
      if (ignoreUsernames.includes(author.username)) {
        return null
      }

      // 添付画像を取得
      const mediaUrl = getMediaUrl(tweet, media)

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

/**
 * 画像URLを取得
 * @param {any} tweet ツイートフィールド
 * @param {any[]} media メディアフィールド
 * @return {string | undefined} 画像URL
 */
function getMediaUrl(tweet, media) {
  const attachments = tweet?.attachments

  // 添付メディアが存在する
  if (attachments && media) {
    const mediaKey = attachments.media_keys[0]
    return media.find(({ media_key }) => media_key === mediaKey)?.url
  }

  // リンク先のOGP画像を返す
  return tweet.entities?.urls?.[0].images?.[0].url
}
