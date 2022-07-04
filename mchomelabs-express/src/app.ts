import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Application } from 'express'
import { postCommand } from './rcon'
import System from './system'

const app: Application = express()
const port: number = 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const options: cors.CorsOptions = { origin: 'http://localhost:3000' };
app.use(cors(options));

app.post('/command', postCommand)

const system = System()
app.get('/serverPID', system.getServerPID)
app.get('/serverStats', system.getServerStats)
app.post('/startServer', system.postStartServer)
app.post('/forceStopServer', system.postForceStopServer)

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})