import Command from '@classes/Command'
import {humanizeDuration} from '@kernel/Client'



import {Message} from 'discord.js'


export default class Bonus extends Command {
  public run ({channel}: Message): Promise<Message> {
    if (this.user.time._bonus > Date.now()) {
      const time = humanizeDuration.humanize(this.user.time._bonus - Date.now())
      return this.embed.error(this.language.commands.bonus.parameters.already_take.translate({time: time}), channel)
    } else {
      this.user.time._bonus = Date.now() + 86400000
      this.user.Economy.money += this.guild.Economy.bonus
      return this.embed.okay(this.language.commands.bonus.parameters.successful_text.translate({bonus: this.guild.Economy.bonus}), channel)
    }
  }
}
