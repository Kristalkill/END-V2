import {Message} from 'discord.js'

import Command from '@classes/Command'

export default class pool extends Command {
  public async run ({channel}: Message, args: string[]): Promise<Message> {
    if (args.length < 1) return this.embed.error(this.language.commands.poll.parameters.specify_text, channel)
    const description = args.join(' ')
    const pool = await this.embed.fun(this.language.commands.poll.parameters.vote, channel, null, description)
    await pool.react('✅')
    await pool.react('⛔')
  }
}
