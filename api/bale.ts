import { baleAPI } from "../config/api";

export const BaleEndPoint = Object.freeze({
    SEND_MESSAGE_URL: "sendMessage",
    SEND_MESSAGE: async (message: string) => baleAPI.post(BaleEndPoint.SEND_MESSAGE_URL, {
        chat_id: '4579795580',
        text: message
    })
})