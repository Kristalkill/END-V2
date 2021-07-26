import Command from '@classes/Command'
import {Message} from 'discord.js'


export default class Ban extends Command {
  public async run ({guild, channel, mentions, author}: Message, [user, reason_arg, days_arg]: string[]): Promise<Message> {
    const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user)
    if (this.stop) return
    const { successfully_banned, cant_ban } = this.language.commands.ban.parameters
    if (member.bannable === true) {
      const days = parseInt(days_arg, 10) || Infinity
      const reason = reason_arg || this.language.basically.undefined
      await member.ban({
        days,
        reason
      })
      return this.embed.okay(successfully_banned.translate({
          name: member.user.username,
          days,
          reason
      }), channel)
    } else return this.embed.error(cant_ban, channel)
  }
}
