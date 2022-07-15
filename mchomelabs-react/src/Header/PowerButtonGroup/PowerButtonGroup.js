import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import React, { useEffect, useState } from 'react'
import { forceStopServer, getServerRunning, startServer } from '../../services/server'
import styles from './PowerButtonGroup.module.css'

const PowerButtonGroup = () => {

    const [isServerRunning, setIsServerRunning] = useState(undefined)

    useEffect(() => {
        const interval = setInterval(async () => {
            const isRunning = await getServerRunning()
            setIsServerRunning(isRunning.data.isServerRunning)
        }, 5000);

        return () => clearInterval(interval)
    }, [isServerRunning])

    const handleStartServer = async () => {
        await startServer()
        setIsServerRunning(true)
    }

    const handleForceStopServer = async () => {
        await forceStopServer()
    }

    const StartButton = <Button onClick={handleStartServer} color="primary">Start Server</Button>
    const StopButton = <Button onClick={handleForceStopServer} color="error">Force Stop Server</Button>

    return (
        <div className={styles.buttonGroup}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                {isServerRunning ? StopButton : StartButton}
            </ButtonGroup>
        </div>
    )
}

export default PowerButtonGroup