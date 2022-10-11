import io, { Socket } from 'socket.io-client'

interface ServerResponse {
    isServerRunning: boolean
    status: string
}

let socketClient: Socket

const SocketService = () => {

    if (!socketClient) {
        socketClient = io('http://localhost:3001')
        socketClient.connect()
        socketClient.on('minecraftServerStatus', (response: ServerResponse) => minecraftServerStatus = response)
    }

    let minecraftServerStatus: ServerResponse

    const getMinecraftServerStatus = () => {
        if (!minecraftServerStatus) {
            minecraftServerStatus = {
                isServerRunning: false,
                status: 'Minecraft server status unknown'
            }
        }

        return minecraftServerStatus
    }

    return { getMinecraftServerStatus }
}

export default SocketService