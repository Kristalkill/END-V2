import Command from '@classes/Command'
import { User_Economy } from '@interfaces/MongoDB'
import { Message } from 'discord.js'

export default class add extends Command {
    permission = {
      user: ['ADMINISTRATOR']
    }

    settings = {
      author: true
    }

    async run (message: Message, [user, typed, amount]: string[]): Promise<void | Message> {
      const member = await this.member(message, user)
      if (this.stop === true) return
      const types = (['level', 'money', 'rep', 'xp'].find(x => {
        return typed?.toLowerCase() === x
      })) as Exclude<keyof User_Economy, 'box'>
      if (!types) return this.embed.error(this.language.commands.add.parameters.specify_type, message)
      if (!amount) return this.embed.error(this.language.commands.add.parameters.specify_amount, message)
      const data = await this.get_data(message.guild.id, member.id)
      data.Economy[types] += Math.floor(parseInt(amount))
      await this.client.db.save('users', data)
      await this.embed.okay(this.language.commands.add.parameters.successful_text.translate({
        type: types,
        amount: amount,
        name: member.user.username
      }), message)
    }
}
