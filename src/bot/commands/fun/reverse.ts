import {Message} from 'discord.js'

import Command from '@classes/Command'

export default class Reverse extends Command {
  public async run ({channel}: Message, args: string[]): Promise<Message> {
    const { reverse_successful } = this.language.commands.reverse.parameters
    if (!args) return this.embed.error(reverse_successful, channel)
      const reversed = args.join(' ').split('').reverse().join('')
    return this.embed.okay(reversed, channel)
  }
}
