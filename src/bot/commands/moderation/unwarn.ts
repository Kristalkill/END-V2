import Command from '@classes/Command'
import {Message} from 'discord.js'

export default class UnWarn extends Command {
  public async run ({channel, mentions, author, guild}: Message, [user]: string[]): Promise<Message> {
    const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user)
    if (!this.stop) return
    const { already_zero, unwarn_successful } = this.language.commands.unwarn.parameters
    const { db } = this.client
    const data = await this.get_data(guild.id, member.id)
    if (data.warn <= 0) return this.embed.error(already_zero, channel)
      --data.warn
    await db.save('users', data)
    return this.embed.okay(unwarn_successful.translate({
      moder: author,
      member: member.user.tag,
      warns: `${data.warn}/${data.warn || 0}`
    }), channel)
  }
}
