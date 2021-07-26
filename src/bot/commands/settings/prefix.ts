import Command from '@classes/Command'
import {Message} from 'discord.js'

export default class prefix extends Command {
  public async run ({channel, member}: Message, args: string[]) {
    const { successfully, member_successfully, no_prefix } = this.language.commands.prefix.parameters
    if (args.length > 0) {
      this.guild.prefix = args[0].toLowerCase()
      return this.embed.basic({
        title: successfully,
        description: member_successfully.translate({
          member: member.user.username,
          args: args[0]
        })
      }, channel)
    } else return this.embed.error(no_prefix, channel)
  }
}
