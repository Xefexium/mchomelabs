import axios from "axios"
import { toHtml } from "../util/mcparser"

const base_url = 'http://localhost:3001'

export const command = async (command) => {
    const response = await axios.post(base_url + '/command', {command: command})
    const html = await Promise.resolve(toHtml(response.data[0]))
    return html
}