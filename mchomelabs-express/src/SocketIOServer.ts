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

    const emitServerStatus = (serverStatus: ServerStatus) => {
        socketServer.emit('serverStatus', serverStatus)
    }

    const emitServerLog = (log: string) => {
        socketServer.emit('serverLog', log)
    }



    return { setupSocketServer, emitServerStatus, emitServerLog }
}



export default SocketIOServer