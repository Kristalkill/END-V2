import Command from '@classes/Command'
import {Message} from 'discord.js'

export default class Warn extends Command {
  public async run ({channel, author, guild, mentions}: Message, [user, reason]: string[]): Promise<Message| undefined> {
    const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user)
    if (!this.stop) return;
    const { warn_successful } = this.language.commands.unwarn.parameters
    const { db } = this.client
    const data = await this.get_data(guild.id, member.id)
    ++data.warn
    await db.save('users', data)
    return this.embed.okay(warn_successful.translate({
      moder: author,
      member: member.user.tag,
      reason,
      warns: `${data.warn}/${data.warn || 0}`
    }), channel)
  }
}
