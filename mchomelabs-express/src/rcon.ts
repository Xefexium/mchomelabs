import { RCON } from 'minecraft-server-util'
import { Request, Response } from 'express'
import Server from './MCServerManager'

const client = new RCON()

client.on('message', async (data) => {
    console.info(data);
});

const rconCommand = async (command: any) => {

    const server = Server()

    if (!server.isServerRunning())
        return 'Server not running! Start server and try again!'

    await client.connect('localhost', 25575)
    await client.login('1234')

    let output = await client.execute(command)
    console.info(command)
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