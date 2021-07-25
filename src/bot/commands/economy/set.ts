import { Message } from 'discord.js'
import { User_Economy } from '@interfaces/MongoDB'
import Command from '@classes/Command'

export default class set extends Command {
  async run (message: Message, [user, typed, amount]: string[]): Promise<void | Message> {
    const member = await this.member(message, user)
    if (this.stop === true) return null
    const types = (['level', 'money', 'rep', 'xp'].find(x => {
      return typed?.toLowerCase() === x
    })) as Exclude<keyof User_Economy, 'box'>
    if (!types) {
      await this.embed.error(this.language.commands.add.parameters.specify_type, message)
      return null
    }
    if (!amount) {
      await this.embed.error(this.language.commands.add.parameters.specify_amount, message)
      return null
    }
    const data = await this.get_data(message.guild.id, member.id)
    data.Economy[types] = Math.floor(parseInt(amount))
    await this.client.db.save('users', data)
    await this.embed.okay(this.language.commands.add.parameters.successful_text.translate({
      type: types,
      amount: amount,
      name: member.user.username
    }), message)
  }
}
