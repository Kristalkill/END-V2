import { Message, MessageEmbed, NewsChannel, TextChannel } from 'discord.js'
import Command from '@classes/Command'

export default class ChannelInfo extends Command {
  async run (message: Message, [channel_args]: string[]): Promise<void | Message> {
    const channel = await this.Channel(message, channel_args)
    if (this.stop) return
    const Embed = new MessageEmbed()
      .setTitle('Channel Info')
      .setDescription(`Name: ${channel.name}
            ID: \`${channel.id}\`
            Type: ${channel.type}
            Parent: ${channel.parent ?? 'None'}`)
      .setTimestamp()
    if (['news', 'text'].includes(channel.type)) {
      if (channel.type === 'text') {
        Embed.description += `\nRateLimit: \`${(channel as TextChannel).rateLimitPerUser || 0}\``
      }
      Embed.description += `\nTopic: ${(channel as TextChannel | NewsChannel).topic || 'None'}`
    }
    return message.channel.send(Embed)
  }
}
