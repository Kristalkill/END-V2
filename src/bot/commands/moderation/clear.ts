import Command from '@classes/Command'
import {Message} from 'discord.js'


export default class Clear extends Command {
  public async run ({channel}: Message, [count]: string[]): Promise<Message> {
    if (channel.type !== 'dm') {
      const { enter_number, message_removed } = this.language.commands.clear.parameters
      const amount = parseInt(count, 10)
      if (amount < 1 || amount > 99) return this.embed.error(enter_number, channel)
        const list = await channel.messages.fetch({ limit: amount })
      channel.bulkDelete(list, true).then(messages => {
        this.embed.okay(message_removed.translate({size: messages.size}), channel)
      })
      return;
    }
  }
}
