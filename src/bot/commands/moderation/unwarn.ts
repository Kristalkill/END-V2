import Command from '@classes/Command'
import { Message } from 'discord.js'

export default class UnWarn extends Command {
  async run (message: Message, [user]: string[]): Promise<void | Message> {
    const member = await this.member(message, user)
    if (!this.stop) return
    const { already_zero, unwarn_successful } = this.language.commands.unwarn.parameters
    const { db } = this.client
    const data = await this.get_data(message.guild.id, member.id)
    if (data.warn <= 0) return this.embed.error(already_zero, message)
    --data.warn
    await db.save('users', data)
    return this.embed.okay(unwarn_successful.translate({
      moder: message.author,
      member: message.guild.member(message.author).user.tag,
      warns: `${data.warn}/${data.warn || 0}`
    }), message)
  }
}
