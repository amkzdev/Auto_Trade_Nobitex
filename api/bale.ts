import { baleAPI } from "../config/api";

export const BaleEndPoint = Object.freeze({
    SEND_MESSAGE_URL: "sendMessage",
    SEND_MESSAGE: async (message: string) => baleAPI.post(BaleEndPoint.SEND_MESSAGE_URL, {
        chat_id: '4579795580',
        text: message
    }),
    SEND_MESSAGE_TRADES: async (message: string) => baleAPI.post(BaleEndPoint.SEND_MESSAGE_URL, {
        chat_id: '5598293765',
        text: message
    }),
    SEND_MESSAGE_IN_SIGNAL: async (message: string) => baleAPI.post(BaleEndPoint.SEND_MESSAGE_URL, {
        chat_id: '4556601091',
        text: message
    })
})