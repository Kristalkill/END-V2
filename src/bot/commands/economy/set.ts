import {Message} from 'discord.js'

import { User_Economy } from '@interfaces/MongoDB'
import Command from '@classes/Command'

export default class set extends Command {
  public async run ({guild, channel, mentions, author}: Message, [user, typed, amount]: string[]): Promise<Message> {
    const member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user)
    if (this.stop === true) return null
    const types = (['level', 'money', 'rep', 'xp'].find(x => {
      return typed?.toLowerCase() === x
    })) as Exclude<keyof User_Economy, 'box'>
    if (!types) {
      await this.embed.error(this.language.commands.add.parameters.specify_type, channel)
        return null
    }
    if (!amount) {
      await this.embed.error(this.language.commands.add.parameters.specify_amount, channel)
        return null
    }
    const data = await this.get_data(guild.id, member.id)
    data.Economy[types] = Math.floor(parseInt(amount, 10))
    await this.client.db.save('users', data)
    await this.embed.okay(this.language.commands.add.parameters.successful_text.translate({
        type: types,
        amount: amount,
        name: member.user.username
    }), channel)
  }
}
