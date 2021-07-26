import Command from '@classes/Command'
import { User_Economy } from '@interfaces/MongoDB'
import {Message} from 'discord.js'


export default class add extends Command {
    public permission = {
      user: ['ADMINISTRATOR']
    }

    public settings = {
      author: true
    }

    public async run ({guild, channel, mentions, author}: Message, [user, typed, amount]: string[]): Promise<Message> {
      const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user)
      if (this.stop === true) return
      const types = (['level', 'money', 'rep', 'xp'].find(x => {
        return typed?.toLowerCase() === x
      })) as Exclude<keyof User_Economy, 'box'>
      if (!types) return this.embed.error(this.language.commands.add.parameters.specify_type, channel)
        if (!amount) return this.embed.error(this.language.commands.add.parameters.specify_amount, channel)
        const data = await this.get_data(guild.id, member.id)
      data.Economy[types] += Math.floor(parseInt(amount, 10))
      await this.client.db.save('users', data)
      await this.embed.okay(this.language.commands.add.parameters.successful_text.translate({
          type: types,
          amount: amount,
          name: member.user.username
      }), channel)
    }
}
