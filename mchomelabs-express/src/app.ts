import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Application } from 'express'
import { postCommand } from './rcon'
import { Server } from 'socket.io'
import http from 'http'
import MCServerManager from './MCServerManager'

const app: Application = express()
const port: number = 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const options: cors.CorsOptions = { origin: 'http://localhost:3000' };
app.use(cors(options));

const server = http.createServer(app)
const io = new Server(server)

const system = MCServerManager()

io.on('connection', (socket) => {
    console.info('Socket Connected')
    system.isServerRunning()
})

app.post('/command', postCommand)
app.get('/serverPID', system.getServerPID)
app.get('/serverStatus', system.getServerStatus)
app.post('/startServer', system.postStartServer)
app.post('/forceStopServer', system.postForceStopServer)

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

export const getIO = () => {
    return io;
}