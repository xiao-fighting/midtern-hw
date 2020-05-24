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
  let msg = []
  try {
    //  https://data.coa.gov.tw/Query/ServiceDetail.aspx?id=242    (農業體驗戶外教育休閒農場)
    // https://data.coa.gov.tw/Query/ServiceDetail.aspx?id=193  (農村地方美食小吃特色料理)
    let data1 = ''
    let data2 = ''
    const aaa = []

    const func = async (x) => {
      try {
        if (x === 0) {
          data1 = rp({ uri: 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvOutdoorEdu.aspx', json: true })
          return data1
        }
        if (x === 1) {
          data2 = rp({ uri: 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx', json: true })
          return data2
        }
      } catch (error) {
        console.log(error + '第50行')
      }
    }
    if (event.message.type === 'text') {
      if (event.message.text.includes('$$')) {
        const re = await func(0)

        for (let i = 0; i < re.length; i++) {
          if ((re[i].County.includes(event.message.text.slice(2))) || (re[i].Township.includes(event.message.text.slice(2)))) {
            aaa.push({ type: 'text', text: '🌱 ' + re[i].FarmNm_CH + '\n' + '💡 ' + re[i].WebURL + '\n' + '🏮 ' + re[i].Facebook + '\n' + '🚗 欲使用Google map，請輸入$$農場名稱' })
          } else if (re[i].FarmNm_CH.includes(event.message.text.slice(2))) {
            msg.push({
              type: 'location',
              title: re[i].FarmNm_CH,
              address: re[i].Address_CH,
              latitude: re[i].Latitude,
              longitude: re[i].Longitude
            })
          }
        }
        if (aaa.length <= 5) {
          for (const j of aaa) {
            msg.push(j)
          }
        } else {
          aaa.splice(4, Number(aaa.length - 4))
          for (const k of aaa) {
            msg.push(k)
          }
          msg.push('欲知更多農場，請點選 https://ezgo.coa.gov.tw/ ')
        }
      } else if (event.message.text.includes('@@')) {
        const re = await func(1)
        for (let i = 0; i < re.length; i++) {
          if ((re[i].Address.includes(event.message.text.slice(2))) || (re[i].Town.includes(event.message.text.slice(2)))) {
            aaa.push({
              type: 'text',
              text: '🍱 ' + re[i].Name + ' \n' + '📞 ' + re[i].Tel + ' \n' + '🚘 ' + re[i].Address
            },
              {
                type: 'image',
                originalContentUrl: re[i].PicURL,
                previewImageUrl: re[i].PicURL
              }
            )
          }
        }
        if (aaa.length <= 5) {
          for (const j of aaa) {
            msg.push(j)
          }
        } else {
          aaa.splice(4, Number(aaa.length - 4))
          for (const k of aaa) {
            msg.push(k)
          }
          msg.push('欲知更多美食，請點選 https://ezgo.coa.gov.tw/zh-TW/Front/Tianma ')
        }
      }
    } else {
      msg = '請輸入文字'
    }
  } catch (error) {
    msg = '發生錯誤' + error
  }
  console.log(msg)
  event.reply(msg)
})

// 監聽，路徑在根目錄
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
