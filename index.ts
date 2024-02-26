import { NobitexEndPoint } from "./api/nobitex"
import { baleAPI, kavehAPI, nobitexApi } from "./config/api"
import { TETTER_TRADE_WAGE_PERCENT, nobitexSymbolsUSDT } from "./variables/nobitex"
import { NobitexStatusType, OHLCResponseType, OrderBookResponseType, OrderListType, SendNobitexSpotOrderType, SendOrderResponseType } from "./types/nobitex"
import { KavehEndPoint } from "./api/kaveh"
import { BaleEndPoint } from "./api/bale"
import { concatWords, createFormData, createTradeMessage } from "./utils"
import { AxiosResponse } from "axios"




// nobitexApi.post<FormData, AxiosResponse<SendOrderResponseType>, FormData>(NobitexEndPoint.SEND_ORDER,
//     createFormData({
//         amount: 0.2420,
//         clientOrderId: `BUY-btc-${(new Date()).getTime()}`,
//         dstCurrency: 'usdt',
//         srcCurrency: 'btc',
//         type: 'buy',
//         execution: 'market',
//     }), {
//     headers: { 'Content-Type': 'application/json' }
// }).then(e => console.log(e, e.data))
//     .catch(e => console.log(e))

var isTokenMessageSend = false

setInterval(async () => {

    console.log('Tracking...', (new Date()).toLocaleString())

    //Calculate Change Percent 

    var orders: OrderListType['orders'] = []

    if (process.env.TRADING == '1') {


        try {

            const { data: ordersData } = await nobitexApi.get<OrderListType, AxiosResponse<OrderListType>, OrderListType>(NobitexEndPoint.ORDER_LIST)
            if (ordersData.status == 'ok')
                orders = ordersData.orders

        } catch (error) {
            BaleEndPoint.SEND_MESSAGE(' توکن پرید / خطا در دریافت اطلاعات سفارش ها')
            if (!isTokenMessageSend) {
                kavehAPI.get(KavehEndPoint.VERIFY, {
                    params: {
                        // token: `${item.symbol}-${(new Date()).toLocaleString()}]`,
                        token: 'Token',
                        receptor: '09199660906',
                        template: 'verifyCode'
                    }
                })
                isTokenMessageSend = true
            }
        }
    }


    try {

        var data: Array<{ symbol: string, data: OHLCResponseType }> = await Promise.all(nobitexSymbolsUSDT.map(async (symbol) => ({
            data: (await nobitexApi.get(NobitexEndPoint.OHLC, {
                params:
                {
                    symbol: symbol,
                    resolution: '5',
                    to: Math.floor(Date.now() / 1000),
                    from: Math.floor((Date.now() - (1000 * 60 * 180)) / 1000)
                }

            })).data,
            symbol
        }

        ))

        )

        try {
            data.forEach(async item => {
                //Calculate 15 minute with 1% Up
                if (
                    // item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 4] > 1.01
                    // &&
                    // //Calculate 30 minute with 2% Up
                    // item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 7] > 1.02
                    // &&
                    //Calculate 1 Hour with 4% Up
                    item.data.s == 'ok' &&
                    (item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 5]) > 1.025
                ) {

                    try {

                        console.log(item.symbol, (new Date()).toLocaleString())

                        BaleEndPoint.SEND_MESSAGE(`${item.symbol} 
                        در 15 دقیقه اخیر ${(((item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 5]) - 1) * 100).toFixed(2)}% رشد داشته است.
                                قیمت پایانی فعلی : ${item.data.c[item.data.c.length - 1]}
                                قیمت پایانی یک ربع پیش : ${item.data.c[item.data.c.length - 5]}
                                 تاریخ  : ${(new Date()).toLocaleDateString()}
                                 ساعت  : ${(new Date()).toLocaleTimeString()}
                                 #تحلیل
                                 `)




                        const averageVolume = item.data.v.slice(-6).reduce((pv, cv) => pv += cv, 0) / 6

                        if (
                            (
                                ((item.data.c[item.data.c.length - 1] / item.data.o[item.data.c.length - 1]) > 1.01)
                                ||
                                ((item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 2]) > 1.02)
                            )
                            && (item.data.v[item.data.c.length - 1] / averageVolume) >= 3) {


                            BaleEndPoint.SEND_MESSAGE(
                                concatWords([
                                    item.symbol,
                                    ` پامپ شده است و شرایط انجام معامله را دارد.
                                        حجم معامله بیش از سه برابر میانگین 30 دقیقه اخیر`,
                                    ((item.data.c[item.data.c.length - 1] / item.data.o[item.data.c.length - 1]) > 1.01) ?
                                        ` قیمت پایانی و آغازین بیش از 1 درصد اختلاف دارند
                                        ${(((item.data.c[item.data.c.length - 1] / item.data.o[item.data.c.length - 5]) - 1) * 100).toFixed(2)}%`
                                        :
                                        ` قیمت پایانی کندل فعلی و کندل پیشین پیش از 2 درصد اختلاف دارند.
                                        ${(((item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 2]) - 1) * 100).toFixed(2)}%
                                        `,
                                    ` #معامله
                                        قیمت پایانی فعلی : ${item.data.c[item.data.c.length - 1]}
                                        قیمت آغازین  : ${item.data.o[item.data.c.length - 5]}
                                         تاریخ کندل  : ${(new Date(item.data.t[item.data.c.length - 5] * 1000)).toLocaleTimeString()}
                                         تاریخ  : ${(new Date()).toLocaleDateString()}
                                         ساعت  : ${(new Date()).toLocaleTimeString()}
                                        `
                                ])
                            )

                            if (process.env.TRADING == '1') {

                                ///Get Balance

                                try {

                                    const { data } = await nobitexApi.post<{ balance: number, status: NobitexStatusType }>(NobitexEndPoint.BALANCE, { currency: 'usdt' })

                                    if (Number(data?.balance ?? 0) > 5.3 && orders?.findIndex(o => o?.clientOrderId?.includes(item.symbol)) == -1) {

                                        try {
                                            //Send Buy Order




                                            const { data } = await nobitexApi.post<FormData, AxiosResponse<SendOrderResponseType>, FormData>(NobitexEndPoint.SEND_ORDER,
                                                createFormData({
                                                    amount: Number(((5.3) / item.data.c[item.data.c.length - 1]).toFixed(4)),
                                                    clientOrderId: `BUY-${item.symbol}-${(new Date()).getTime()}`,
                                                    dstCurrency: 'usdt',
                                                    srcCurrency: item.symbol.replace('USDT', '').toLowerCase(),
                                                    type: 'buy',
                                                    execution: 'market',
                                                }), {
                                                headers: { 'Content-Type': 'application/json' }
                                            })

                                            if (data.status == 'ok') {
                                                kavehAPI.get(KavehEndPoint.VERIFY, {
                                                    params: {
                                                        // token: `${item.symbol}-${(new Date()).toLocaleString()}]`,
                                                        token: 'Traded',
                                                        receptor: '09199660906',
                                                        template: 'verifyCode'
                                                    }
                                                })

                                                await BaleEndPoint.SEND_MESSAGE_TRADES(createTradeMessage({
                                                    date: data.order.created_at,
                                                    id: data.order.clientOrderId,
                                                    price: Number((data.order.totalOrderPrice / data.order.amount).toFixed(4)),
                                                    side: 'buy',
                                                    symbol: item.symbol,
                                                    totalPrice: data?.order?.totalPrice || 0,
                                                    volume: data.order.amount,
                                                    totalOrderPrice: data?.order?.totalOrderPrice || 0
                                                }))

                                                await BaleEndPoint.SEND_MESSAGE(`
                                                سفارش خرید با موفقیت ثبت شد در حال تلاش برای ثبت سفارش فروش.
                                                وضعیت : ${data.status}
                                                طرف : ${data.order.type}
                                                ایدی : ${data.order.id}
                                                قیمت : ${data.order.price}
                                                نماد : ${data.order.srcCurrency} / ${data.order.dstCurrency}
                                                حجم : ${data.order.amount}
                                                تاریخ ایجاد : ${data.order.created_at}
                                                ${(new Date()).toLocaleString()}

                                                `)

                                                //Send Sell Order

                                                // if (data.status == 'ok') {
                                                try {

                                                    console.log('Ready For SELL')

                                                    console.log({
                                                        amount: data.order.amount * (1 - TETTER_TRADE_WAGE_PERCENT),
                                                        clientOrderId: `SELL-${item.symbol}-${(new Date()).getTime()}`,
                                                        dstCurrency: 'usdt',
                                                        srcCurrency: item.symbol.replace('USDT', '').toLowerCase(),
                                                        type: 'sell',
                                                        execution: 'limit',
                                                        price: ((data.order?.totalOrderPrice / data.order?.amount) * 1.03)
                                                    })
                                                    
                                                    await BaleEndPoint.SEND_MESSAGE(JSON.stringify({
                                                        amount: data.order.amount * (1 - TETTER_TRADE_WAGE_PERCENT),
                                                        clientOrderId: `PRE-SELL-${item.symbol}-${(new Date()).getTime()}`,
                                                        dstCurrency: 'usdt',
                                                        srcCurrency: item.symbol.replace('USDT', '').toLowerCase(),
                                                        type: 'sell',
                                                        execution: 'limit',
                                                        price: ((data.order?.totalOrderPrice / data.order?.amount) * 1.03)
                                                    }))

                                                    var { data: sellData } = await nobitexApi.post<SendOrderResponseType, AxiosResponse<SendOrderResponseType>, FormData>(NobitexEndPoint.SEND_ORDER,
                                                        createFormData({
                                                            amount: data.order.amount * (1 - TETTER_TRADE_WAGE_PERCENT),
                                                            client: `SELL-${item.symbol}-${(new Date()).getTime()}`,
                                                            dstCurrency: 'usdt',
                                                            srcCurrency: item.symbol.replace('USDT', '').toLowerCase(),
                                                            type: 'sell',
                                                            execution: 'limit',
                                                            price: ((data.order?.totalOrderPrice / data.order?.amount) * 1.03)
                                                        }),
                                                        { headers: { 'Content-Type': 'application/json' } }
                                                    )

                                                    await BaleEndPoint.SEND_MESSAGE(JSON.stringify(sellData))

                                                    await BaleEndPoint.SEND_MESSAGE_TRADES(createTradeMessage({
                                                        date: sellData?.order?.created_at,
                                                        id: sellData?.order?.clientOrderId ?? sellData?.order?.client,
                                                        price: Number((sellData.order.totalPrice / sellData.order.amount).toFixed(4)),
                                                        side: 'sell',
                                                        symbol: item.symbol,
                                                        totalPrice: sellData?.order?.totalPrice || 0,
                                                        volume: sellData.order.amount,
                                                        totalOrderPrice: sellData?.order?.totalOrderPrice || 0
                                                    }))

                                                    if (sellData.status == 'ok') {




                                                        BaleEndPoint.SEND_MESSAGE(`
                                                            سفارش فروش با موفقیت ثبت شد.
                                                            طرف : ${sellData.order.type}
                                                            ایدی : ${sellData.order.id}
                                                            قیمت : ${sellData.order.price}
                                                            نماد : ${sellData.order.srcCurrency} / ${data.order.dstCurrency}
                                                            حجم : ${sellData.order.amount}
                                                            تاریخ ایجاد : ${sellData.order.created_at}
                                                            
                                                            ${(new Date()).toLocaleString()}
            
                                                            `)
                                                    }

                                                } catch (error) {

                                                    BaleEndPoint.SEND_MESSAGE(JSON.stringify({
                                                        amount: data.order.amount * (1 - TETTER_TRADE_WAGE_PERCENT),
                                                        clientOrderId: `SELL-${item.symbol}-${(new Date()).getTime()}`,
                                                        dstCurrency: 'usdt',
                                                        srcCurrency: item.symbol.replace('USDT', '').toLowerCase(),
                                                        type: 'sell',
                                                        execution: 'limit',
                                                        price: ((data.order?.totalOrderPrice / data.order?.amount) * 1.03)
                                                    }))

                                                    BaleEndPoint.SEND_MESSAGE(`
                                                        خطا در ثبت سفارش فروش
                                                        
                                                        ${(new Date()).toLocaleString()}
        
                                                        ${error?.response?.data.toString()}

                                                        ${error?.response?.toString()}

                                                        ${error?.toString()}
                                                        `)
                                                }
                                                // }


                                            }

                                        } catch (error) {

                                            BaleEndPoint.SEND_MESSAGE(JSON.stringify({
                                                amount: Number(((5.4) / item.data.c[item.data.c.length - 1]).toFixed(4)),
                                                clientOrderId: `BUY - ${item.symbol} - ${(new Date()).toLocaleString()}`,
                                                dstCurrency: 'usdt',
                                                srcCurrency: item.symbol.replace('USDT', '').toLowerCase(),
                                                type: 'buy',
                                                execution: 'market',
                                            }))

                                            BaleEndPoint.SEND_MESSAGE(`
                                                خطا در ثبت سفارش خرید
                                                
                                                amount:${Number(((5.4) / item.data.c[item.data.c.length - 1]).toFixed(4))},
                                                clientOrderId: ${`BUY - ${item.symbol} - ${(new Date()).toLocaleString()}`},
                                                dstCurrency: 'usdt',
                                                srcCurrency: ${item.symbol.replace('USDT', '').toLowerCase()},

                                                ${(new Date()).toLocaleString()}

                                                ${error?.response?.data?.toString()}

                                                ${error?.toString()}
                                                `)
                                        }

                                    }

                                    else {
                                        if (Number(data?.balance ?? 0) <= 5.4)
                                            BaleEndPoint.SEND_MESSAGE('موجودی تتری حساب کمتر از 5.4 دلار است.')
                                        else if (orders.findIndex(o => o.clientOrderId.includes(item.symbol)) != -1)
                                            BaleEndPoint.SEND_MESSAGE(`برای نماد ${item.symbol} قبلا خرید انجام شده است.`)
                                        else
                                            BaleEndPoint.SEND_MESSAGE('خطای جدید')

                                    }

                                    ///Trade


                                } catch (error) {
                                    console.log('Error', error)
                                    BaleEndPoint.SEND_MESSAGE(`
                                    خطا در دریافت موجودی حساب به تتر
                                    
                                    ${(new Date()).toLocaleString()}

                                    ${error?.toString()}
                                    `)
                                    kavehAPI.get(KavehEndPoint.VERIFY, {
                                        params: {
                                            // token: `${item.symbol}-${(new Date()).toLocaleString()}]`,
                                            token: item.symbol,
                                            receptor: '09199660906',
                                            template: 'verifyCode'
                                        }
                                    })

                                }



                            }


                        }


                    } catch (error) {
                        console.log('--------------------------------')
                        console.log('Error in Sending Message')
                        console.log(item.symbol, (new Date()).toLocaleString())
                        console.log('--------------------------------')
                    }
                }
            })

        } catch (error) {
            BaleEndPoint.SEND_MESSAGE(`خطا در محاسبات`)
            console.log('---Error in Processing Data---')
            console.log(error)
            console.log('----------------------------')
        }

    } catch (error) {
        BaleEndPoint.SEND_MESSAGE(`خطا در دریافت اطلاعات`)

        console.log('---Error in Fetching Data---')
        console.log(error)
        console.log('----------------------------')


    }


    // console.log(responses)


}, Number(process.env.NODE_TRACK_TIME_INTERVAL) * 1000 * 60)





// emailjs
//     .send('tracker_2024', 'template_ml2qval', {
//         message: `${item.symbol} در 15 دقیقه اخیر ${(((item.data.c[item.data.c.length - 1] / item.data.c[item.data.c.length - 5]) - 1) * 100).toFixed(2)}% رشد داشته است.
//         قیمت پایانی فعلی : ${item.data.c[item.data.c.length - 1]}
//         قیمت پایانی یک ربع پیش : ${item.data.c[item.data.c.length - 5]}
//         تاریخ  : ${(new Date()).toLocaleDateString()}
//         ساعت  : ${(new Date()).toLocaleTimeString()}`,
//         to_name: 'خودم',
//         from_name: item.symbol
//     }, {
//         publicKey: 'UQDXzFdSyxsFtOgyH',
//         privateKey: '_wZA6I-x2ksWVSWDJmpYP', // optional, highly recommended for security reasons
//     })
//     .then(
//         (response) => {
//             console.log('SUCCESS!', response.status, response.text);
//         },
//         (err) => {
//             kavehAPI.get(KavehEndPoint.VERIFY, {
//                 params: {
//                     // token: `${item.symbol}-${(new Date()).toLocaleString()}]`,
//                     token: item.symbol,
//                     receptor: '09199660906',
//                     template: 'verifyCode'
//                 }
//             })
//         },
//     );