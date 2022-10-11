import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Application } from 'express'
import { postCommand } from './rcon'
import MCServerRoutes from './MCServerRoutes'
import logger from './logger'
import SocketIOServer from './SocketIOServer'

const port: number = 3001
const app: Application = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const options: cors.CorsOptions = { origin: `http://localhost:3000` };
app.use(cors(options));
const httpServer = app.listen(port, function () {
    logger.info(`App is listening on port ${port} !`)
})

SocketIOServer().setupSocketServer(httpServer)

const system = MCServerRoutes()
app.get('/serverPID', system.getServerPID)
app.get('/systemStats', system.getSystemStats)
app.post('/command', postCommand)
app.post('/startServer', system.postStartServer)
app.post('/forceStopServer', system.postForceStopServer)


