export const concatWords = (items: string[]) => ''.concat(...items)


export const createFormData = (dataObj: { [key: string]: any }) => {
    var form_data = new FormData();

    for (var key in dataObj) {
        if (typeof dataObj[key] != 'undefined') {

            if (dataObj[key] instanceof File)
                form_data.append(key, dataObj[key]);

            else if (typeof dataObj[key] == 'object')
                form_data.append(key, JSON.stringify(dataObj[key]));

            else
                form_data.append(key, dataObj[key]);
        }
    }

    return form_data
}


export const createTradeMessage = ({ side, date, price, symbol, totalPrice, volume, id, totalOrderPrice , stopLimitPrice  , stopPrice }:
    {
        side: 'sell' | 'buy'
        symbol: string,
        date: string,
        volume: number,
        price: number,
        totalPrice: number,
        id: string,
        totalOrderPrice:number,
        stopPrice?: number,
        stopLimitPrice?:number

    }) => `${side == 'buy' ? '🟢 خرید' : '🔴 فروش'} ${symbol}
تاریخ ایجاد: ${date}
حجم: ${volume}
قیمت : ${price}
قیمت نهایی سفارش : ${totalPrice}
ایدی سفارش:${id}
stopLimitPrice : ${stopLimitPrice}
stopPrice : ${stopPrice}

ارزش کل ( تتر) : ${totalOrderPrice}

#${symbol}`