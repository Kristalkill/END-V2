import { Message } from 'discord.js'
import Command from '@classes/Command'

export default class Reverse extends Command {
  async run (message: Message, args: string[]): Promise<void | Message> {
    const { reverse_successful } = this.language.commands.reverse.parameters
    if (!args) return this.embed.error(reverse_successful, message)
    const reversed = args.join(' ').split('').reverse().join('')
    return this.embed.okay(reversed, message)
  }
}
