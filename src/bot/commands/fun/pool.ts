import { Message } from 'discord.js'
import Command from '@classes/Command'

export default class pool extends Command {
  async run (message: Message, args: string[]): Promise<void | Message> {
    if (!args) return this.embed.error(this.language.commands.poll.parameters.specify_text, message)
    const description = args.join(' ')
    const pool = await this.embed.fun(this.language.commands.poll.parameters.vote, message, null, description)
    await pool.react('✅')
    await pool.react('⛔')
  }
}
