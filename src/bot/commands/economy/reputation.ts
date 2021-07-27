import Command from '@classes/Command'
import {Message, MessageEmbed} from 'discord.js'
import {humanizeDuration} from '@kernel/Client'




export default class Reputation extends Command {
  public async run({guild, channel, mentions, author}: Message, [user_args, typed]: string[]): Promise<Message> {
    const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user_args)
    if (this.stop) return;
    const {time_no_come, up, down, have} = this.language.commands.rep.parameters
    const data = await this.get_data(guild.id, member.user.id)
    const embed = new MessageEmbed()
    if (this.user.time._rep > Date.now()) {
      await this.embed.error(time_no_come.translate({
        time_no_come: humanizeDuration.humanize(this.user.time._rep - Date.now(), {
          round: true, language: this.guild.language || 'en'
        })
      }), channel)
    }
    if (['remove', 'minus', '-'].includes(typed?.toLowerCase())) {
      data.Economy.rep--
      embed.setTitle(up)
    } else {
      data.Economy.rep++
      embed.setTitle(down)
    }
    embed.setDescription(have.translate({
          name: member.user.username,
          rep: data.Economy.rep
        })
    )
    this.user.time._rep = Date.now() + 14400000
    await this.client.db.save('users', data)
    await channel.send(embed)
  }
}
