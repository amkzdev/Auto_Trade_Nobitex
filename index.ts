import { AmdDependency } from "typescript"
import { NobitexEndPoint } from "./api/nobitex"
import { nobitexApi } from "./config/api"
import { nobitexSymbolsRial, nobitexSymbolsUSDT } from "./variables/nobitex"

setInterval(async () => {

    console.log('Tracking...', (new Date()).toLocaleString())

    //Calculate Change Percent 

    const responses = await Promise.all(nobitexSymbolsUSDT.slice(0,2).map(async (symbol) => ({
        data: (await nobitexApi.get(NobitexEndPoint.OHLC, {
            params:
            {
                symbol:'BTCIRT',
                resolution: '1',
                to: Math.floor(Date.now() / 1000),
                from: Math.floor((Date.now() - (1000 * 60 * 60)) / 1000)
            }

        })).data,
        symbol
    }

    ))

    )

    console.log(responses)


}, Number(process.env.NODE_TRACK_TIME_INTERVAL) * 1000 * 60)

