interface OrderBookResponseType {
    status: 'ok' | string,
    lastUpdate: number,
    bids: Array<[string, string]>,
    asks: Array<[string, string]>
}