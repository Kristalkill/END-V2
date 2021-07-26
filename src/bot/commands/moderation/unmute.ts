import Command from '@classes/Command'
import {Message} from 'discord.js'

import { Mute_Interface } from '@interfaces/MongoDB'

export default class unmute extends Command {
  public async run ({guild,channel,author,mentions }: Message, [user]: string[]) {
    const mute_role =
            this.guild.Moderation.mute_role ||
            guild.roles.cache.find((x) =>
              /(В)?[Mм][uyу][t(ьт)]([eеd])?/gi.test(x.name)
            ).id
    const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users},user)
    const data = await this.client.db.getOne<Mute_Interface>('mutes', {
      guildID: guild.id,
      id: member.id
    })
    const { not_muted, un_muted } = this.language.commands.unmute.parameters
    if (member.roles.cache.has(mute_role) === false || !data) return await this.embed.error(not_muted, channel)
      await this.client.db.delete<Mute_Interface>('mutes', {
      guildID: guild.id,
      id: member.id
    })
    await member.roles.remove(mute_role)
    return this.embed.okay(un_muted, channel)
  }
}
