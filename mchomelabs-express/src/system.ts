import pidusage from 'pidusage'
import child_process from 'child_process'
import { Request, Response } from 'express'
import { ServerResponse } from 'http'


const System = () => {
    let serverProcess: child_process.ChildProcessWithoutNullStreams

    const ERROR_SERVER_NOT_RUNNING = 'Server not running - Check status'
    const MC_SERVER_LOCATION = '/Users/adamtorres/Projects/mchomelabs/server'
    const JAR_FILE_NAME = 'server.jar'

    const getServerPID = (req: Request, res: Response) => {
        let pid = serverProcess?.pid ?? -1
        if (pid == -1) {
            res.status(404).json(ERROR_SERVER_NOT_RUNNING)
            return
        }

        res.json({ pid: pid })
    }

    const getServerStats = (req: Request, res: Response) => {
        let pid = serverProcess?.pid ?? -1
        if (pid == -1) {
            res.status(404).json(ERROR_SERVER_NOT_RUNNING)
            return
        }

        pidusage(pid, (err, stats) => {
            if (err)
                res.status(404).json(ERROR_SERVER_NOT_RUNNING)
            else
                res.send(stats)
        })

    }

    const postStartServer = (req: Request, res: Response) => {
        serverProcess = child_process.spawn('java ', ['-Xmx1024M', '-Xms1024M', '-jar', JAR_FILE_NAME, 'nogui'], { detached: true, shell: true, cwd: MC_SERVER_LOCATION })
        console.log(`Server started - PID ${serverProcess.pid}`)
        res.json({ pid: serverProcess.pid })
    }

    const postForceStopServer = (req: Request, res: Response) => {
        let pid = serverProcess?.pid ?? -1
        if (pid == -1) {
            res.status(404).json(ERROR_SERVER_NOT_RUNNING)
            return
        }

        serverProcess.kill()
        console.log(`Force stopped server - PID ${serverProcess.pid}`)
        res.json({ pid: serverProcess.pid })
    }

    return {
        getServerPID, getServerStats, postStartServer, postForceStopServer
    }
}

export default System