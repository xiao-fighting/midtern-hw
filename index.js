import linebot from 'linebot'
// 引用dotenv 套件
import dotenv from 'dotenv'

import rp from 'request-promise'

// 讀取.env檔
dotenv.config()

// 宣告機器人的資訊  {json}
// 去 .env 讀取 CHANNEL_ID  等等
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 當收到訊息時
// bot.on('message', event => {
//   if (event.message.type === 'text') {
//     event.reply(event.message.text)
//   }
// })

// 當收到訊息時
// 回傳 會是  the JSON string in the response  (json: true)
bot.on('message', async (event) => {
  let msg = ''
  try {
    const data = await rp({ url: 'https://kktix.com/events.json', json: true })
    msg = data.entry[0].title
  } catch (error) {
    msg = '發生錯誤'
  }
  event.reply(msg)
})

// 在port 啟動  localhost:3000/
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
