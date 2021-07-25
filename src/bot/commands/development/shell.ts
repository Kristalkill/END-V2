import Command from '@classes/Command'
import { Message } from 'discord.js'

export default class Shell extends Command {
    settings = {
      category: 'development',
      public: false
    }

    async run (message: Message, args: string[]): Promise<void | Message> {
      return message.channel
        .send('Я обробатываю...!!!!')
        .then(async (msg) =>
          msg.edit(
            await import('child_process').then(x => x.execSync(args.join(' ')).toString('utf8') + ' ')
          )
        )
    }
}
