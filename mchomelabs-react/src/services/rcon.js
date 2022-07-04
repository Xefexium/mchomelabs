import axios from "axios"

const base_url = 'http://localhost:3001'

export const command = async (command) => {
    return await axios.post(base_url + '/command', {command: command})
}