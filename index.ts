import { AmdDependency } from "typescript"
import { NobitexEndPoint } from "./api/nobitex"
import { nobitexApi } from "./config/api"
import { nobitexSymbolsRial, nobitexSymbolsUSDT } from "./variables/nobitex"
import { OHLCResponseType } from "./types/nobitex"

setInterval(async () => {

    console.log('Tracking...', (new Date()).toLocaleString())

    //Calculate Change Percent 

    try {

        var data: Array<{ symbol: string, data: OHLCResponseType }> = await Promise.all(nobitexSymbolsUSDT.map(async (symbol) => ({
            data: (await nobitexApi.get(NobitexEndPoint.OHLC, {
                params:
                {
                    symbol: symbol,
                    resolution: '5',
                    to: Math.floor(Date.now() / 1000),
                    from: Math.floor((Date.now() - (1000 * 60 * 60)) / 1000)
                }

            })).data,
            symbol
        }

        ))

        )

        try {
            data.forEach(item => {
                //Calculate 15 minute with 2% Up
                console.log('----------------------------------------------------------------')
                console.log(item.symbol)
                console.log('Last 5 Minutes is ' , item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 4])
                console.log('----------------------------------------------------------------')
                if (item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 4] > 1.01
                    &&
                    item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 6] > 1.02
                    &&
                    item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 13] > 1.04
                ) {

                    console.log('Symbol', item.symbol, 'Is Awsome')
                    /// The Symbol Is Offff!!!
                }
            })

        } catch (error) {
            console.log('---Error in Processing Data---')
            console.log(error)
            console.log('----------------------------')
        }

    } catch (error) {

        console.log('---Error in Fetching Data---')
        console.log(error)
        console.log('----------------------------')


    }


    // console.log(responses)


}, Number(process.env.NODE_TRACK_TIME_INTERVAL) * 1000 * 60)

