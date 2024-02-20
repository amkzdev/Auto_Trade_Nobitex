import axios from "axios";

export const nobitexApi = axios.create({
    baseURL:process.env.NOBITEX_API,
    headers:{
        Authorization:`Token ${process.env.NOBITEX_API_TOKEN}`,
        UserAgent:`rBot/amkztracker`
    }
})

export const kavehAPI = axios.create({
    baseURL:`${process.env.KAVEH_API}/${process.env.KAVEH_NEGAR_API_KEY}`,
})
