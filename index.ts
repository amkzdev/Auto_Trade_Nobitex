import { NobitexEndPoint } from "./api/nobitex"
import { nobitexApi } from "./config/api"

setInterval(async () => {

    console.log('Tracking...', (new Date()).toLocaleString())

    const response = await nobitexApi.get(NobitexEndPoint.ORDERBOOK_SYMBOL('BTCUSDT'))

    console.log(response.data)

}, Number(process.env.NODE_TRACK_TIME_INTERVAL) * 1000 * 60)

