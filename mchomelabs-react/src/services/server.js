import axios from "axios"

const base_url = 'http://localhost:3001'

export const startServer = async () => {
    return await axios.post(base_url + '/startServer')
}

export const forceKillServer = async () => {
    return await axios.post(base_url + '/forceKillServer')
}

export const getServerRunning = async () => {
    return await axios.get(base_url + '/serverRunning')
}