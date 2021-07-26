import {Message, MessageEmbed} from 'discord.js'
import Command from '@classes/Command'

export default class roleInfo extends Command {
  public async run ({guild, channel, mentions}: Message, [role_args]: string[]): Promise<Message> {
    const role = await this.Role(guild, mentions.roles, channel, role_args)
    if (this.stop) return
    return channel.send(new MessageEmbed()
      .setTitle(role.name)
      .setDescription(`
                ID: \`${role.id}\`
                Color: \`${role.hexColor}\`
                Position: \`${role.rawPosition || 0}\`
                Mentionable: ${role.mentionable ? 'Yes' : 'No'}
                Members Have \`${role.members.size}\`
            `)
      .setTimestamp())
  }
}
