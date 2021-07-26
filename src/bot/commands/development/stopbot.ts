import Command from '@classes/Command'
import {Message} from 'discord.js'


export default class Stop_bot extends Command {
    public settings = {
      category: 'development',
      community: false
    }

    public async run (message: Message): Promise<Message> {
      await this.embed.okay('I go to offline', message.channel)
        return process.exit()
    }
}
