import { NobitexEndPoint } from "./api/nobitex"
import { baleAPI, kavehAPI, nobitexApi } from "./config/api"
import { nobitexSymbolsUSDT } from "./variables/nobitex"
import { OHLCResponseType } from "./types/nobitex"
import { KavehEndPoint } from "./api/kaveh"
import emailjs from '@emailjs/nodejs';
import { BaleEndPoint } from "./api/bale"
import { concatWords } from "./utils"

// const templateParams = {
//     message: 'بیت کوین در 5  دقیقه اخیر رشد داشته',
//     from_name: 'BTCUSDT',
//     to_name:'خودم'
//   };


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
                    from: Math.floor((Date.now() - (1000 * 60 * 180)) / 1000)
                }

            })).data,
            symbol
        }

        ))

        )

        try {
            data.forEach(item => {
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
                            // BaleEndPoint.SEND_MESSAGE(`${item.symbol}


                            // #معامله
                            // قیمت پایانی فعلی : ${item.data.c[item.data.c.length - 1]}
                            // قیمت آغازین  : ${item.data.o[item.data.c.length - 5]}
                            //  تاریخ کندل  : ${(new Date(item.data.t[item.data.c.length - 5] * 1000)).toLocaleTimeString()}
                            //  تاریخ  : ${(new Date()).toLocaleDateString()}
                            //  ساعت  : ${(new Date()).toLocaleTimeString()}
                            // `)

                        }

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


                    } catch (error) {
                        console.log('--------------------------------')
                        console.log('Error in Sending Message')
                        console.log(item.symbol, (new Date()).toLocaleString())
                        console.log('--------------------------------')
                    }
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

