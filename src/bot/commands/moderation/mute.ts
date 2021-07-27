import Command from '@classes/Command'
import {Message} from 'discord.js'

import ms from 'ms'
import {humanizeDuration} from '@kernel/Client'



import { Mute_Interface } from '@interfaces/MongoDB'

export default class mute extends Command {
  public async run ({guild, channel, mentions, author}: Message, [user_args, number, ...args]: string[]) {
    try {
      const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user_args)
      if (this.stop) return
      let mute_role
      if (this.guild.Moderation.mute_role === '0' || guild.roles.cache.has(this.guild.Moderation.mute_role) === false) {
        mute_role = guild.roles.cache.find((x) =>
          /(В)?[Mм][uyу][t(ьт)]([eеd])?/gi.test(x.name)
        )
        if (!mute_role) {
          mute_role = await guild.roles.create({
            data: {
              name: 'Muted',
              color: '#000000',
              permissions: []
            },
            reason: 'Need a Mute role'
          })
          for (const [, channel] of guild.channels.cache) {
            await channel.updateOverwrite(mute_role, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            })
          }
        }
        this.guild.Moderation.mute_role = mute_role.id
        await this.client.db.save('guilds', this.guild)
      } else mute_role = this.guild.Moderation.mute_role
      const time = number ? ms(number) : Infinity
      const reason: string = args.toString() || this.language.basically.undefined
      const res = await this.client.db.getOne<Mute_Interface>('mutes', {
        guildID: guild.id,
        id: member.id
      })
      if (res) {
        return this.embed.error(this.language.commands.mute.parameters.muted.translate({
            member,
            reason: res.reason,
            time: humanizeDuration.humanize(res.time - Date.now(), {
                round: true,
                language: this.guild.language || 'en'
            })
        }), channel)
      } else {
        const mute_object = {
          guildID: guild.id,
          userID: member.id,
          reason: reason,
          time: time + Date.now(),
          channelID: channel.id
        }
        await this.client.db.insert_one<Mute_Interface>('mutes', mute_object)
        this.client.db._mutes.set(`${guild.id}${member.id}`, mute_object)
        await member.roles.add(mute_role)
        return channel.send(
          this.language.commands.mute.parameters.muted_text.translate({
            member: member,
            reason: reason,
            time: time !== Infinity ? humanizeDuration.humanize(time, {
              round: true,
              language: this.guild.language || 'en'
            }) : this.language.commands.mute.parameters.forever
          })
        )
      }
    } catch (e) {
      console.error(e)
    }
  }
}
