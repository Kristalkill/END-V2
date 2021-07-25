import Command from '@classes/Command'
import { Message } from 'discord.js'

export default class prefix extends Command {
  async run (message: Message, args: string[]) {
    const member = message.member
    const { successfully, member_successfully, no_prefix } = this.language.commands.prefix.parameters
    if (args[0]) {
      message.guild.settings.prefix = args[0].toLowerCase()
      return this.embed.basic({
        title: successfully,
        description: member_successfully.translate({
          member: member.user.username,
          args: args[0]
        })
      }, message)
    } else return this.embed.error(no_prefix, message)
  }
}
