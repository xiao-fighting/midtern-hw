import linebot from 'linebot'
// 引用dotenv 套件
import dotenv from 'dotenv'

import rp from 'request-promise'
// import cheerio from 'cheerio'

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
  let msg = []
  // const temp = []
  try {
    const data = await rp({ url: 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvOutdoorEdu.aspx', json: true })
    // console.log(data.length)

    if (event.message.type === 'text') {
      for (let i = 0; i < data.length; i++) {
        if (data[i].County.includes(event.message.text)) {
          msg.push({ type: 'text', text: data[i].FarmNm_CH + '\n' + data[i].WebURL + '\n' + '欲前往農場地點則請輸入農場名稱' })
          // msg.push({
          //   type: 'location',
          //   title: data[i].FarmNm_CH,
          //   address: data[i].Address_CH,
          //   latitude: data[i].Latitude,
          //   longitude: data[i].Longitude
          // })
        } else if (data[i].FarmNm_CH.includes(event.message.text)) {
          msg.push({
            type: 'location',
            title: data[i].FarmNm_CH,
            address: data[i].Address_CH,
            latitude: data[i].Latitude,
            longitude: data[i].Longitude
          })
        }
      }
    } else {
      msg = '請輸入文字'
    }
  } catch (error) {
    msg = '發生錯誤'
  }
  console.log(msg)
  event.reply(msg)
})

// 在port 啟動  localhost:3000/
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
