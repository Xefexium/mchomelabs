import { RCON } from 'minecraft-server-util'
import { Request, Response } from 'express'
import logger from './logger';

const client = new RCON()

client.on('message', async (data) => {
    logger.info(data);
});

const rconCommand = async (command: any) => {
    let output
    try {
        await client.connect('localhost', 25575)
        await client.login('1234')
        output = await client.execute(command)
    }
    catch (err) {
        output = 'Could not connect to Server RCON!\nCheck that server is running and ports are open!'
        logger.error(output)
    }
    finally {
        client.close()
    }
    logger.info(command)
    output = output.toString().replaceAll('/', '\n/') // make commands appear on new lines
    output = output.toString().replace('\n', '') // remove first replacement
    return output
}

export const postCommand = async (req: Request, res: Response) => {
    const command = req.body.command
    const output = await rconCommand(command)
    const outputLines = output.split('\n')
    res.json(outputLines)
}