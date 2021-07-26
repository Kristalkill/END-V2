import Command from '@classes/Command'
import {Message} from 'discord.js'


export default class Pay extends Command {
  public async run ({guild, channel, mentions, author}: Message, [user_args, count]: string[]): Promise<Message> {
    const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user_args)
    if (this.stop) return null
    const money = parseInt(count, 10)
    if (!money || money < 1 || money > 10000000) return await this.embed.error(this.language.commands.pay.parameters.enter_valid_value, channel)
      const data = await this.get_data(guild.id, member.id)
    if (this.user.Economy.money < money) return await this.embed.error(this.language.commands.pay.parameters.no_have_coins, channel)
      this.user.Economy.money -= money
    data.Economy.money += money
    await this.client.db.save('users', data)
    await this.embed.okay(this.language.commands.pay.parameters.successfully_text.translate({
        member: member.user.username,
        author: author.username,
        args1: money
    }), channel)
  }
}
