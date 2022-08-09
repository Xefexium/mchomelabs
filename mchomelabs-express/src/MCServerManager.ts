import pidusage from 'pidusage'
import child_process from 'child_process'
import { Request, Response } from 'express'
import logger from './logger'
import ServerStatus from './ServerStatus'
import { exit } from 'process'

const MCServerManager = (SERVER_PATH: string | undefined) => {
    let serverProcess: child_process.ChildProcessWithoutNullStreams

    const MC_SERVER_LOCATION = SERVER_PATH
    const JAR_FILE_NAME = 'server.jar'

    const isServerRunning = () : boolean => {
        const isRunning = !!serverProcess && serverProcess.kill(0)
        if (isRunning) {
            logger.info(ServerStatus.RUNNING)
        }
        else {
            logger.info(ServerStatus.NOT_RUNNING)
        }

        return isRunning
    }

    const getServerPID = (req: Request, res: Response) => {
        res.json({pid: serverProcess.pid})
    }

    const getServerRunning = (req: Request, res: Response) => {
        res.json({isServerRunning: isServerRunning()})
    }

    const getSystemStats = (req: Request, res: Response) => {
        let pid = serverProcess?.pid ?? -1

        pidusage(pid, (err, stats) => {
            if (err)
                logger.error(err)
            res.send(stats)
        })
    }

    const postStartServer = (req: Request, res: Response) => {
        if (!isServerRunning()) {
            logger.info('Starting Server')
            serverProcess = child_process.spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', MC_SERVER_LOCATION + JAR_FILE_NAME, 'nogui'], { cwd: MC_SERVER_LOCATION, windowsHide: true })
            logger.info(ServerStatus.RUNNING)
            // serverProcess.stdout.on('data', (data) => {
            //     logger.info(data)
            // })
            serverProcess.on('error', (error) => {
                logger.error(error)
            })
            serverProcess.on('uncaughtException', (error) => {
                logger.error(error)
            })
            process.on('exit', () => {
                logger.info('Express server stopped. Server exiting.')
                serverProcess.kill()
                exit()
            })
            process.on('SIGINT', () => {
                logger.info('Express server interrupted. Server exiting.')
                serverProcess.kill()
                exit()
            })
            logger.info(`Server started - PID ${serverProcess.pid}`)
        }
        else {
            logger.info('Server running')
        }
        res.json({isServerRunning: isServerRunning(), pid: serverProcess.pid})
    }

    const postForceStopServer = (req: Request, res: Response) => {
        serverProcess?.kill()
        logger.info(`Force stopped server - PID ${serverProcess.pid}`)
        res.json('Force stopped server')
    }

    return {
        isServerRunning, getServerPID, getServerRunning, getSystemStats, postStartServer, postForceStopServer
    }
}

export default MCServerManager