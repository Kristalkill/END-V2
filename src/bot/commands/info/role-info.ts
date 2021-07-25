import { Message, MessageEmbed } from 'discord.js'
import Command from '@classes/Command'

export default class roleInfo extends Command {
  async run (message: Message, [role_args]: string[]): Promise<void | Message> {
    const role = await this.Role(message, role_args)
    if (this.stop) return
    return message.channel.send(new MessageEmbed()
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
