import axios from "axios";

export const nobitexApi = axios.create({
    baseURL:process.env.NOBITEX_API,
    headers:{
        Authorization:`Token ${process.env.NOBITEX_API_TOKEN}`,
        UserAgent:`rBot/amkztracker`
    }
})