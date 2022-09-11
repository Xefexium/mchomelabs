import axios from "axios"

const base_url = 'http://localhost:3001'

export const command = async (command) => {
    const response = await axios.post(base_url + '/command', { command: command })
    return removeColorCodes(response.data)
}

const removeColorCodes = (data) => {
    data = data.replace(/§.{1}/g, '')
    return data
}