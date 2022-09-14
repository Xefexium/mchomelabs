import { RCON } from 'minecraft-server-util'
import { Request, Response } from 'express'
import logger from './logger';

const client = new RCON()

client.on('message', async (data) => {
    logger.info('Command output returned: ', data);
});

const rconCommand = async (command: any) => {
    logger.info(`Command Issued: ${command}`)
    let output
    try {
        await client.connect('localhost', 25575)
        await client.login('1234')
        output = await client.execute(command)
    }
    catch (err) {
        output = 'Could not connect to Server RCON - Check that server is running and ports are open!'
        logger.error(`RCON Service Errored ${command}`)
    }
    finally {
        client.close()
    }
    logger.info(`Command Output:  ${command}`)
    return output
}

export const postCommand = async (req: Request, res: Response) => {
    const command = req.body.command
    const output = await rconCommand(command)
    res.json(output)
}