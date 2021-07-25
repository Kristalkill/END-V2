import { Message, MessageEmbed, version } from 'discord.js'
import Command from '@classes/Command'
import { humanizeDuration } from '../../index'

export default class BotInfo extends Command {
  async run (message: Message): Promise<void | Message> {
    const shard = this.client.shard
    const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue
    const [cpu, memory, channels, guilds, emojis, users, ping] = [
      (await shard.broadcastEval('(process.cpuUsage().user/1024/1024/100)')).reduce(reducer),
      (await shard.broadcastEval('process.memoryUsage().heapUsed')).reduce(reducer),
      (await shard.fetchClientValues('channels.cache.size')).reduce(reducer),
      (await shard.fetchClientValues('guilds.cache.size')).reduce(reducer),
      (await shard.fetchClientValues('emojis.cache.size')).reduce(reducer),
      (await shard.fetchClientValues('users.cache.size')).reduce(reducer),
      (await shard.fetchClientValues('ws.ping')).reduce(reducer) / shard.ids.length
    ].flat()
    return message.channel.send(new MessageEmbed().setTitle('**Показатели бота**')
      .setColor('RANDOM')
      .setThumbnail(message.guild.me.user.displayAvatarURL())
      .addField(
        '**Technical**',
                `>>> **<:cpu:709750871692542142> | CPU:** ${cpu.toFixed(2)}%
              **<:ram:709751455610961972> | RAM:**  ${this.client.utils.formatBytes(memory)}
              **🕑 | Uptime:**  ${humanizeDuration.humanize(this.client.uptime, { round: true, language: 'en' })}
              **⚙ | Command Count:**  ${this.client.commands.size}
              **💡 | Discord.js:**  v${version}
              **Discord API:** ${new Date().getTime() - message.createdTimestamp}ms
              **Bot Ping:** ${ping}ms.`,
                true
      )
      .addField(
        '**👥 | Social**',
                `>>> **:man_artist_tone3: | Users:**  ${users}
                **🌐 | Guilds:**  ${guilds}
                **🗨 | Channels:**  ${channels}
                **🤣 | Emojis:**  ${emojis}`,
                true
      )
    )
  }
}
