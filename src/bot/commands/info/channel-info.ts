import {Message, MessageEmbed} from 'discord.js'
import Command from '@classes/Command'

export default class ChannelInfo extends Command {
  public async run({guild, channel, mentions}: Message, [channel_args]: string[]): Promise<Message> {
    const _channel = await this.Channel(guild, mentions.channels, channel, channel_args)
    if (this.stop) return
      const Embed = new MessageEmbed()
          .setTitle('Channel Info')
          .setDescription(`Name: ${_channel.name}
            ID: \`${_channel.id}\`
            Type: ${_channel.type}
            Parent: ${_channel.parent ?? 'None'}`)
          .setTimestamp()
      if (['news', 'text'].includes(_channel.type)) {
        if (_channel.type === 'text') {
          Embed.description += `\nRateLimit: \`${(_channel).rateLimitPerUser || 0}\``
        }
        Embed.description += `\nTopic: ${(_channel).topic || 'None'}`
      return channel.send(Embed)
    }
  }
}
