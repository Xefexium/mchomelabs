import pidusage from 'pidusage'
import child_process from 'child_process'
import { Request, Response } from 'express'
import { getIO } from './app'


const MCServerManager = () => {
    let serverProcess: child_process.ChildProcessWithoutNullStreams

    const ERROR_SERVER_NOT_RUNNING = 'Server not running - Check status'
    const MC_SERVER_LOCATION = '/Users/adamtorres/Projects/mchomelabs/server'
    const JAR_FILE_NAME = 'server.jar'

    const isServerRunning = () => {
        const isRunning = !!serverProcess && serverProcess.kill(0)
        if (isRunning)
            getIO().emit('Server Down')
        else 
            getIO().emit('Server Up')
        return isRunning
    }

    const getServerPID = (req: Request, res: Response) => {
        if (isServerRunning()) {
            res.status(404).json(ERROR_SERVER_NOT_RUNNING)
            return
        }

        res.json({ pid: serverProcess?.pid })
    }

    const getServerStatus = (req: Request, res: Response) => {
        let pid = serverProcess?.pid ?? -1
        if (isServerRunning()) {
            res.status(404).json(ERROR_SERVER_NOT_RUNNING)
            return
        }

        pidusage(pid, (err, stats) => {
            if (err || !isServerRunning())
                res.status(404).json(ERROR_SERVER_NOT_RUNNING)
            else
                res.send({isRunnning: isServerRunning(), stats: stats})
        })
    }

    const postStartServer = (req: Request, res: Response) => {
        serverProcess = child_process.spawn('java ', ['-Xmx1024M', '-Xms1024M', '-jar', JAR_FILE_NAME, 'nogui'], { detached: true, shell: true, cwd: MC_SERVER_LOCATION })
        console.info(`Server started - PID ${serverProcess.pid}`)
        res.json({ pid: serverProcess.pid })
    }

    const postForceStopServer = (req: Request, res: Response) => {
        if (isServerRunning()) {
            res.status(404).json(ERROR_SERVER_NOT_RUNNING)
            return
        }

        serverProcess.kill()
        console.info(`Force stopped server - PID ${serverProcess.pid}`)
        res.json('Force stopped server')
    }

    return {
        isServerRunning, getServerPID, getServerStatus, postStartServer, postForceStopServer
    }
}

export default MCServerManager