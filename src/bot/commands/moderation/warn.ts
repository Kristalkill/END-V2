import Command from '@classes/Command'
import { Message } from 'discord.js'

export default class Warn extends Command {
  async run (message: Message, [user, reason]: string[]): Promise<void | Message> {
    const member = await this.member(message, user)
    if (!this.stop) return
    const { warn_successful } = this.language.commands.unwarn.parameters
    const { db } = this.client
    const data = await this.get_data(message.guild.id, member.id)
    ++data.warn
    await db.save('users', data)
    return this.embed.okay(warn_successful.translate({
      moder: message.author,
      member: message.guild.member(message.author).user.tag,
      reason,
      warns: `${data.warn}/${data.warn || 0}`
    }), message)
  }
}
