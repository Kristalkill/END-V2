import Command from '@classes/Command'
import {Message} from 'discord.js'


export default class kick extends Command {
  public async run ({guild, channel, mentions, author}: Message, [user, reason_arg]: string[]): Promise<Message> {
    const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user)
    if (this.stop) return
    const { kicked, cant_kick } = this.language.commands.kick.parameters
    if (member.kickable === true) {
      const reason = reason_arg || this.language.basically.undefined
      await member.kick(reason)
      return this.embed.okay(kicked.translate({
          name: member.user.username,
          reason
      }), channel)
    } else return this.embed.error(cant_kick, channel)
  }
}
