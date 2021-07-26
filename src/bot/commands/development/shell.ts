import Command from '@classes/Command'
import { Message } from 'discord.js'

export default class Shell extends Command {
    public settings = {
      category: 'development',
      community: false
    }

    public async run ({channel}: Message, args: string[]): Promise<Message> {
      return channel
        .send('Я обробатываю...!!!!')
        .then(async (msg) =>
          msg.edit(
            await import('child_process').then(x => x.execSync(args.join(' ')).toString('utf8') + ' ')
          )
        )
    }
}
