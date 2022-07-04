import pidusage from 'pidusage'
import child_process from 'child_process'

let serverProcess: child_process.ChildProcessWithoutNullStreams

const SERVER_NOT_RUNNING = 'Server not running - Check status'

const getServerPID = () => {
    let pid = serverProcess.pid
    let message

    if (!pid)
        message = SERVER_NOT_RUNNING
    else
        message = `Server running under pid: ${pid}`

    return {
        pid: pid,
        message: message
    }
}

const getTotalMemory = () => {
    if (!serverProcess.pid)
        return SERVER_NOT_RUNNING

    let serverStats
    pidusage(serverProcess.pid, (err, stats) => {
        serverStats = stats
    })

    return serverStats
}

const startServer = () => {
    serverProcess = child_process.spawn('../mc_server/run.sh', { shell: true })
    return serverProcess.pid
}

const stopServer = () => {

}