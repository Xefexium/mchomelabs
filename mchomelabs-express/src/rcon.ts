import { RCON } from 'minecraft-server-util'
import { Request, Response } from 'express'

const client = new RCON()

client.on('message', async (data) => {
    console.log(data);
});

const rconCommand = async (command: any) => {

    await client.connect('localhost', 25575)
    await client.login('1234')

    let output = await client.execute(command)
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