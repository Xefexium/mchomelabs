import { Server as HttpServer } from 'http'
import { Server as SocketServer } from "socket.io"
import ServerStatus from './ServerStatus'

let socketServer: SocketServer

const SocketIOServer = () => {

    const setupSocketServer = (server: HttpServer) => {
        if (!socketServer)
            socketServer = new SocketServer(server, {
                cors: {
                    origin: 'http://localhost:3000',
                    methods: ['GET', 'POST']
                }
            })
    }

    const emitMinecraftServerStatus = (serverStatus: ServerStatus) => {
        socketServer.emit('minecraftServerStatus', serverStatus)
    }



    return { setupSocketServer, emitMinecraftServerStatus }
}



export default SocketIOServer