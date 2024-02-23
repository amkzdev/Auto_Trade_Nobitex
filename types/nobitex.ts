export interface OrderBookResponseType {
    status: NobitexStatusType,
    lastUpdate: number,
    bids: Array<[string, string]>,
    asks: Array<[string, string]>
}

export type NobitexStatusType = 'ok' | 'no_data' | 'error'

export interface OHLCResponseType {
    s: NobitexStatusType,
    t:Array<number>,
    c:Array<number>,
    o:Array<number>,
    h:Array<number>,
    l:Array<number>,    
    v:Array<number>,    
    
}