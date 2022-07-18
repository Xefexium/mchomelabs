import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Application } from 'express'
import { postCommand } from './rcon'
import MCServerManager from './MCServerManager'
import logger from './logger'
import * as dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
const port: number = 3001
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const options: cors.CorsOptions = { origin: 'http://localhost:3000' };
app.use(cors(options));

const system = MCServerManager(process.env.SERVER_PATH)

app.post('/command', postCommand)
app.get('/serverPID', system.getServerPID)
app.get('/serverRunning', system.getServerRunning)
app.post('/startServer', system.postStartServer)
app.get('/systemStats', system.getSystemStats)
app.post('/forceStopServer', system.postForceStopServer)

app.listen(port, function () {
    logger.info(`App is listening on port ${port} !`)
})
