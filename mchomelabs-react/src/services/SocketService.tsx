import io, { Socket } from 'socket.io-client'

interface ServerResponse {
    isServerRunning: boolean
    status: string
}

let socketClient: Socket
let log: string

const SocketService = () => {

    if (!socketClient) {
        socketClient = io('http://localhost:3001')
        socketClient.connect()
        socketClient.on('serverLog', (response: string) => log = response)
        socketClient.on('serverStatus', (response: ServerResponse) => minecraftServerStatus = response)
    }

    let minecraftServerStatus: ServerResponse

    const getServerStatus = () => {
        if (!minecraftServerStatus) {
            minecraftServerStatus = {
                isServerRunning: false,
                status: 'Minecraft server status unknown'
            }
        }

        return minecraftServerStatus
    }

    const getServerLog = () => {
        return log
    }



    return { getServerStatus, getServerLog }
}

export default SocketService