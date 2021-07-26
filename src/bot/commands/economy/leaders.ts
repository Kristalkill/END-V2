import Command from '@classes/Command'
import {Message, MessageEmbed} from 'discord.js'
import {User_Economy, User_Interface} from '@interfaces/MongoDB'

function chunk (data: User_Interface[], number: number) {
  return data.map((_: User_Interface, i: number) => (i % number === 0 ? data.slice(i, i + number) : null)).filter(Boolean)
}

export default class leaders extends Command {
  public async run({guild, channel}: Message, [leaders]: string[]): Promise<Message> {
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
    const res = chunk((await this.client.db.getMany<User_Interface>('users', {guildID: guild.id}))
        .sort((x: User_Interface, y: User_Interface): number => {
          return y.Economy[type_leaders] - x.Economy[type_leaders]
        })
        .filter(x => guild.members.cache.has(x.userID) === true), 10)
    const embed = new MessageEmbed().setColor('RED').setTitle('Leaders')
    let number = 0;
    if (res.length === 0) {
      return await channel.send(embed.setDescription(this.language.commands.lb.parameters.empty))
    } else if (res.length === 1) {
      res[0].map((data: User_Interface) =>
          embed.addField(
              `${++number}. ${this.client.users.cache.get(data.userID).tag}`,
              `**Level** : ${data.Economy.level}${obj.level},**XP** : ${data.Economy.xp}${obj.xp}, ${data.Economy.money}${obj.money}, ${data.Economy.rep}${obj.rep}`
          )
      )
      return await channel.send(embed)
    }
    const pages = new Map()
    for (const page of res) {
      const Embed = embed
      for (const data of page) {
        Embed.addField(
            `${++number}. ${this.client.users.cache.get(data.userID).tag}`,
            `**Level** : ${data.Economy.level}${obj.level},**XP** : ${data.Economy.xp}${obj.xp}, ${data.Economy.money}${obj.money}, ${data.Economy.rep}${obj.rep}`
        )
      }
      pages.set(number, Embed)
    }
  }
}
