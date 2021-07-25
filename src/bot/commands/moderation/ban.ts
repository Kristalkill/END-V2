import Command from '@classes/Command'
import { Message } from 'discord.js'

export default class Ban extends Command {
  async run (message: Message, [user, reason_arg, days_arg]: string[]): Promise<void | Message> {
    const member = await this.member(message, user)
    if (this.stop) return
    const { successfully_banned, cant_ban } = this.language.commands.ban.parameters
    if (member.bannable === true) {
      const days = parseInt(days_arg) || Infinity
      const reason = reason_arg || this.language.basically.undefined
      await member.ban({
        days,
        reason
      })
      return this.embed.okay(successfully_banned.translate({
        name: member.user.username,
        days,
        reason
      }), message)
    } else return this.embed.error(cant_ban, message)
  }
}
