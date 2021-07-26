import Command from '@classes/Command'
import {Message} from 'discord.js'


export default class extends Command {
  public run (message: Message): Promise<Message> {
    const { presences, channels } = message.guild
    const [all, bots] = presences.cache.partition(m => m.user.bot === false)
    const [emojis, animated_emojis] = message.guild.emojis.cache.partition(emoji => emoji.animated === false)
    let [text, voice, categories, news, store] = Array(5).fill(0)
    for (const channel of channels.cache.values()) {
      switch (channel.type) {
        case 'text':
          text++
          break
        case 'voice':
          voice++
          break
        case 'category':
          categories++
          break
        case 'news':
          news++
          break
        case 'store':
          store++
          break
      }
    }
    let [online, offline, dnd, idle] = Array(4).fill(0)
    for (const channel of message.guild.presences.cache.values()) {
      switch (channel.status) {
        case 'online':
          online++
          break
        case 'offline':
          offline++
          break
        case 'dnd':
          dnd++
          break
        case 'idle':
          idle++
          break
      }
    }
    return this.embed.basic({
        title: `Server ${message.guild.name}`,
        description: message.guild.description,
        color: 0x00FFFF,
        fields: [
            {
                name: 'Server info',
                value: `ID: \`${message.guild.id}\`
                      Owner: ${message.guild.owner} (\`${message.guild.owner.id}\`)
                      Boost:  Tier:\`${message.guild.premiumTier ?? 'None'}(${message.guild.premiumSubscriptionCount || 0})\`,
                      VerificationLevel: \`${message.guild.verificationLevel}\`
                      Region: \`${message.guild.region}\`
                      Updates Channel ${message.guild.publicUpdatesChannel || 'None'}
                      Rules Channel: ${message.guild.rulesChannel || 'None'}
                      System Channel: ${message.guild.systemChannel || 'None'}`
            },
            {
                name: `Members[${message.guild.members.cache.size}]`,
                value: `Users: **${all.size}**
                              Online: **${online}**
                              Dnd: **${dnd}**
                              Idle: **${idle}**
                              Offline: **${offline}**
                              Bots: **${bots.size}**`,
                inline: true
            },
            {
                name: `Channels [${message.guild.channels.cache.size}]`,
                value: `Text: **${text}**
                              Voice: **${voice}**
                              Category: **${categories}**
                              News: **${news}**
                              Store: **${store}**`,
                inline: true
            },
            {
                name: 'Stats',
                value: `Roles amount: **${message.guild.roles.cache.size}**
                              Voice online: **${message.guild.members.cache.filter(m => m.voice !== undefined).size}**
                              Animated emojis: **${animated_emojis.size}**
                              Emojis: **${emojis.size}**`,
                inline: true
            }
        ],
        thumbnail: {
            url: message.guild.iconURL({
                dynamic: true
            })
        },
        footer: {
            text: 'END'
        }
    }, message.channel)
  }
}
