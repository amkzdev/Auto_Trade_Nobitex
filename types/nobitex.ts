import { nobitexSymbolsTypes } from "../variables/nobitex";

export interface OrderBookResponseType {
    status: NobitexStatusType,
    lastUpdate: number,
    bids: Array<[string, string]>,
    asks: Array<[string, string]>
}

export type NobitexStatusType = 'ok' | 'no_data' | 'error'

export interface OHLCResponseType {
    s: NobitexStatusType,
    t: Array<number>,
    c: Array<number>,
    o: Array<number>,
    h: Array<number>,
    l: Array<number>,
    v: Array<number>,

}

export interface SendNobitexSpotOrderType {
    type: 'sell' | 'buy'
    srcCurrency: string // nobitexSymbolsTypes;
    dstCurrency: 'rls' | 'usdt';
    amount: number;
    price?: number;
    clientOrderId: string;
    execution?: 'market' | 'limit',
    // stopPrice?:number,
    // mode?:'oco',
    // stopLimitPrice	?:number
}

export interface SendOrderResponseType { 
    status:NobitexStatusType,
    order: {
        id: number,
        type: 'sell' | 'buy',
        execution: 'StopMarket' | string,
        market: string,
        srcCurrency: string,
        dstCurrency: string,
        price: number  |string,
        amount: number,
        param1: number,
        totalPrice: number,
        totalOrderPrice: number,
        matchedAmount: number,
        unmatchedAmount: number,
        status: OrderStatusType,
        partial: false,
        fee: number,
        created_at: string
        averagePrice: number,
        clientOrderId: string,
      }
}

export type OrderStatusType = 'open' |'active' |'inactive'