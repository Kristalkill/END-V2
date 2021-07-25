import Command from '@classes/Command'
import { Message } from 'discord.js'

export default class Stop_bot extends Command {
    settings = {
      category: 'development',
      public: false
    }

    async run (message: Message): Promise<void | Message> {
      await this.embed.okay('I go to offline', message)
      return process.exit()
    }
}
