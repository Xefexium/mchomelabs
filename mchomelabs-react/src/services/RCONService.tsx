import axios from "axios"

const base_url = 'http://localhost:3001'

export const command = async (command: string) => {
    const response = await axios.post(base_url + '/command', { command: command })
    return removeColorCodes(response.data)
}

const removeColorCodes = (data: string) => {
    data = data.replace(/§.{1}/g, '')
    return data
}