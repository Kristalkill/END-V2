import Command from '@classes/Command'
import { Message, MessageEmbed } from 'discord.js'
import { humanizeDuration } from '../../index'

export default class Shards extends Command {
  async run (message: Message): Promise<void | Message> {
    try {
      const shard_text = this.language.commands.shards.parameters.shard
      const shard = this.client.shard
      const embed = new MessageEmbed().setTitle('Shards')
      const [cpu, memory, channels, guilds, emojis, users, ping, uptime] = [
        (await shard.broadcastEval('(process.cpuUsage().user/1024/1024/100)')),
        (await shard.broadcastEval('process.memoryUsage().heapUsed')),
        (await shard.fetchClientValues('channels.cache.size')),
        (await shard.fetchClientValues('guilds.cache.size')),
        (await shard.fetchClientValues('emojis.cache.size')),
        (await shard.fetchClientValues('users.cache.size')),
        (await shard.fetchClientValues('ws.ping')),
        (await shard.broadcastEval('this.uptime'))
      ]
      for (let i = 0; i < this.client.options.shardCount; i++) {
        embed.addField(
          '** **',
          shard_text.translate({
            uptime: humanizeDuration.humanize(uptime[i], {
              round: true,
              language: 'en'
            }),
            ping: Math.round(ping[i]),
            cpu: cpu[i].toFixed(2),
            memory: this.client.utils.formatBytes(memory[i]),
            guilds: guilds[i],
            user: users[i],
            channels: channels[i],
            emojis: emojis[i],
            i: ++i

          }),
          true
        )
      }
      return message.channel.send(embed)
    } catch (e) {
      console.log(e)
    }
  }
}
