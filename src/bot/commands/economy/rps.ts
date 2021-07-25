import Command from '@classes/Command'
import { Collection, CollectorFilter, Message, MessageEmbed, MessageReaction, Snowflake } from 'discord.js'

export default class Rps extends Command {
  async run (message: Message, [bet_args]: string[]): Promise<void | Message> {
    const {
      min_bet,
      no_have_money,
      emoji,
      win,
      win_text,
      lose,
      lose_text,
      draw,
      draw_text
    } = this.language.commands.rps.parameters
    const bet = parseInt(bet_args)
    if (!bet || bet < 1) return await this.embed.error(min_bet, message)
    if (bet * 2 > message.member.options.Economy.money) return await this.embed.error(no_have_money, message)
    const chooseArr = ['🗻', '🤚', '✌️']
    const embed = new MessageEmbed()
      .setColor('#ffffff')
      .setFooter(message.guild.me.displayName, this.client.user.displayAvatarURL())
      .setDescription(emoji)
      .setTimestamp()
    const send_message: Message = await message.channel.send(embed)
    const botChoice: string = chooseArr[Math.floor(Math.random() * chooseArr.length)]
    chooseArr.forEach(emoji => send_message.react(emoji))
    const filter: CollectorFilter = (reaction, user) =>
      chooseArr.includes(reaction.emoji.name) && user.id === message.author.id
    const reacted = await send_message.awaitReactions(filter, {
      time: 60000,
      max: 1
    }).then((collected: Collection<Snowflake, MessageReaction>) => collected.first() && collected.first().emoji.name) || botChoice
    if ((reacted === '🗻' && botChoice === '✌️') || (reacted === '🤚' && botChoice === '🗻') || (reacted === '✌️' && botChoice === '🤚')) {
      embed.setTitle(win)
      embed.setDescription(
        win_text.translate({
          emojis: `${reacted}/${botChoice}`,
          win: bet * 2
        })
      )
      message.member.options.Economy.money += bet * 2
    } else if (reacted === botChoice) {
      embed.setTitle(draw)
      embed.setDescription(
        draw_text.translate({
          emojis: `${reacted}/${botChoice}`
        })
      )
    } else {
      embed.setTitle(lose)
      embed.setDescription(
        lose_text.translate({
          emojis: `${reacted}/${botChoice}`,
          lose: bet * 2
        })
      )
      message.member.options.Economy.money -= bet * 2
    }
    await send_message.edit(embed)
  }
}
