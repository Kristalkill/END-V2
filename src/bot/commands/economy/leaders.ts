import Command from '@classes/Command'
import { Message, MessageEmbed } from 'discord.js'
import { User_Economy, User_Interface } from '@interfaces/MongoDB'

function chunk (data: User_Interface[], number: number) {
  return data.map((_: User_Interface, i: number) => (i % number === 0 ? data.slice(i, i + number) : null)).filter(Boolean)
}

export default class leaders extends Command {
  async run (message: Message, [leaders]: string[]): Promise<void | Message> {
    const type_leaders: Exclude<keyof User_Economy, 'box'> = (leaders
      ? await (['level', 'money', 'rep', 'xp'].find(x => {
          return leaders?.toLowerCase() === x
        }))
      : 'level') as Exclude<keyof User_Economy, 'box'>
    const obj = {
      level: ':star:',
      money: '💸',
      rep: ':thumbsup:',
      xp: '<a:pepeshooting:852655313928061029>'
    }
    const res = chunk((await this.client.db.getMany<User_Interface>('users', { guildID: message.guild.id }))
      .sort((x: User_Interface, y: User_Interface): number => {
        return y.Economy[type_leaders] - x.Economy[type_leaders]
      })
      .filter(x => message.guild.members.cache.has(x.userID) === true), 10)
    if (res.length === 0) {
      await message.channel.send(new MessageEmbed().setColor('RED').setTitle('Leaders').setDescription(this.language.commands.lb.parameters.empty))
      return null
    }
    let number = 1
    const pages = []
    console.log(res)
    for (const page of res) {
      const number_page: number = pages.length + 1
      pages[number_page] = new MessageEmbed().setColor('RED').setTitle('Leaders')
      for (const data of page) {
        pages[number_page].addField(
                    `${number++}. ${this.client.users.cache.get(data.userID).tag}`,
                    `**Level** : ${data.Economy.level}${obj.level},**XP** : ${data.Economy.xp}${obj.xp}, ${data.Economy.money}${obj.money}, ${data.Economy.rep}${obj.rep}`
        )
      }
    }
    await message.channel.send(pages[1])
  }
}
