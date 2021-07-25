import { Command_Basic, Command_Interface, Command_Permissions, Command_Settings } from '@interfaces/Command'
import { CollectorFilter, Guild, GuildChannel, GuildMember, Message, MessageEmbed, Role } from 'discord.js'
import Client from '../../kernel/Client'
import * as natural from 'natural'
import Embed from './Embed'
import Language from '../../languages/Language'
import { User_basic } from '@util/Base Values/MongoDB'
import { User_Interface } from '@interfaces/MongoDB'

export default class Command implements Command_Interface {
    public language: Language;
    public permissions: Command_Permissions = {
      bot: [],
      user: []
    };

    public args = 0;
    public basic: Command_Basic = {
      aliases: []
    }

    public embed: Embed = this.client.embed;
    public settings: Command_Settings = {
      public: true,
      nsfw: false,
      author: false,
      no_bots: true,
      premium: false
    };

    public stop?: boolean = false;

    public constructor (readonly client: Client) {
    }

    name_sort (map_filtered: string[], value: string): string[] {
      return map_filtered.sort((a, b) => natural.JaroWinklerDistance(value, b) - natural.JaroWinklerDistance(value, a))
    }

    run (message: Message, args: string[]): Promise<Error | void | Message> {

    }

    async check_member (message: Message, member: GuildMember): Promise<boolean | void> {
      this.stop = true
      if (!member) await this.embed.error(this.language.basically.no_member, message)
      else if (this.settings.no_bots === true && member.user.bot) await this.embed.error(this.language.basically.bot, message)
      else if (this.settings.author === false && member.id === message.author.id) await this.embed.error(this.language.basically.no_author, message)
      else {
        this.stop = false
        return true
      }
      return false
    }

    async get_data (guild_id: string, member_id: string): Promise<User_Interface> {
      let data = await this.client.db.getOne<User_Interface>('users', {
        guildID: guild_id,
        userID: member_id
      })
      if (!data) {
        await this.client.db.insert_one<User_Interface>('users', await User_basic(member_id, guild_id))
        data = await this.client.db.getOne<User_Interface>('users', {
          guildID: guild_id,
          userID: member_id
        })
      }
      return data
    }

    async member (message: Message, user_args: string | null): Promise<GuildMember | null> {
      const member: GuildMember = (message.guild.member(message.mentions.users.filter(m => m.id !== message.guild.me.id).first() || user_args)) || (await get_member(this))

      async function get_member (command: Command) {
        if (!user_args) return null
        const cache = message.guild.members.cache
        const fined = command.name_sort(cache.map(x => (x.nickname || x.user.username)), user_args)[0]
        if (natural.JaroWinklerDistance(fined, user_args) > 0.7) {
          return cache.find(x => (x.nickname || x.user.username) === fined)
        }
      }

      if (await this.check_member(message, member) === true) return member
    }

    async Channel (message: Message, channel_args: string | null): Promise<GuildChannel | undefined> {
      const channel = message.guild.channels.cache.get(channel_args) || message.mentions.channels.first()
      if (channel) return channel
      else {
        this.stop = true
        await this.embed.error('Provide channel', message)
      }
    }

    async Role (message: Message, role_args: string | null): Promise<Role | undefined> {
      const role = message.guild.roles.cache.get(role_args) || message.mentions.roles.first() || undefined
      if (role) return role
      else {
        this.stop = true
        await this.embed.error('Provide role', message)
      }
    }

    Guild (id: string): Guild | undefined {
      return this.client.guilds.cache.get(id)
    }

    async fetch (args: string): Promise<string> {
      return await fetch(args).then((r: Response) => r.json()).then(r => r.image || r.url)
    }

    protected async paginate (message: Message, pages: Map<number, MessageEmbed>, emojis: string[]): Promise<void> {
      let page = 1
      const msg = await message.channel.send(pages.get(page))
      for (const emoji of emojis) {
        await msg.react(emoji)
      }
      const filter: CollectorFilter = (reaction, user) => user.id === message.author.id
      const collector = msg.createReactionCollector(filter, {
        time: 6000
      })
      collector.on('collect', async (reaction) => {
        switch (reaction.emoji.name) {
          case 'rewind':
            page = 1
            await msg.edit(pages.get(page))
            break
          case 'arrow_left':
            page === 1 ? (page = pages.size) : page--
            await msg.edit(pages.get(page))
            break
          case 'smart_button':
            await collector.stop('User want it')
            await msg.delete()
            break
          case 'arrow_right':
            page === pages.size ? (page = 1) : page++
            await msg.edit(pages.get(page))
            break
          case 'fast_forward':
            page = pages.size
            await msg.edit(pages.get(page))
            break
          default:
            await reaction.remove()
        }
        if (message.guild.me.hasPermission('MANAGE_MESSAGES')) return reaction.users.remove(message.author.id)
      })
      collector.on('end', async () => {
        if (message.guild.me.hasPermission('MANAGE_MESSAGES')) {
          await msg.reactions.removeAll()
        }
      })
    }
}
