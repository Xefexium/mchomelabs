import axios from "axios"
import React from "react"

const base_url = 'http://localhost:3001'

export const command = async (command) => {
    const response = await axios.post(base_url + '/command', { command: command })
    return parseColorCodes(response.data)
}

const parseColorCodes = (data) => {
    let indexes = []
    let styleMap = {
        '§0': 'color:#000000',
        '§1': 'color:#0000AA',
        '§2': 'color:#00AA00',
        '§3': 'color:#00AAAA',
        '§4': 'color:#AA0000',
        '§5': 'color:#AA00AA',
        '§6': 'color:#FFAA00',
        '§7': 'color:#AAAAAA',
        '§8': 'color:#555555',
        '§9': 'color:#5555FF',
        '§a': 'color:#55FF55',
        '§b': 'color:#55FFFF',
        '§c': 'color:#FF5555',
        '§d': 'color:#FF55FF',
        '§e': 'color:#FFFF55',
        '§f': 'color:#FFFFFF',
        '§l': 'font-weight:bold',
        '§m': 'text-decoration:line-through',
        '§n': 'text-decoration:underline',
        '§o': 'font-style:italic',
    };

    data = data.replace(/\n|\\n/g, '<br>')

    let codes = data.match(/§.{1}/g) || []

    for (let i = 0; i < codes.length; i++) {
        indexes.push(data.indexOf(codes[i]))
        data = data.replace(codes[i], '\x00\x00')
    }

    

    return parseStyle(data)
}