import {  nobitexSymbolsTypes } from "../variables/nobitex";

export const NobitexEndPoint = Object.freeze ({
    ORDERBOOK  : "v2/orderbook",
    ORDERBOOK_SYMBOL :(symbol:nobitexSymbolsTypes)=>`v2/orderbook/${symbol}`,
    OHLC:'/market/udf/history',
})