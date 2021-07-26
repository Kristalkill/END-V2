import {Message, MessageEmbed} from 'discord.js'
import Command from '@classes/Command'

export default class Avatar extends Command {
  public async run ({guild, channel, mentions, author, member}: Message, [user]: string[]): Promise<Message> {
    const _member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user) || member
    if (this.stop === true) return
    await channel.send(new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`${this.language.commands.avatar.parameters.avatar} ${_member.user.username}!`)
      .setImage(_member.user.avatarURL({
        dynamic: true
      }))
      .setTimestamp())
  }
}
