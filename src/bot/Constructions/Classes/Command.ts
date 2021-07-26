import {
    Command_Basic,
    Command_Interface,
    Command_Permissions,
    command_return,
    Command_Settings
} from '@interfaces/Command'
import {
    Collection,
    CollectorFilter, DMChannel,
    Guild,
    GuildChannel,
    GuildMember,
    Message,
    MessageEmbed, NewsChannel,
    Role,
    Snowflake, TextChannel,
    User
} from 'discord.js'
import Client from '@kernel/Client'
import * as natural from 'natural'
import Embed from './Embed'
import * as English from '@languages/en'
import Language from '@languages/Language'
import {Guild_Interface, User_Interface} from '@interfaces/MongoDB'
import {User_basic} from "@util/Base Values/MongoDB";

export default class Command implements Command_Interface {
    public language: Language = English
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
      community: true,
      nsfw: false,
      author: false,
      no_bots: true,
      premium: false
    };

    public stop?: boolean = false;
    public guild!: Guild_Interface
    public user!: User_Interface

    public constructor (public client: Client) {}

    public async run(_message: Message, _args: string[]): Promise<command_return> {
        throw new Error('Method not implemented.')
    }

    public name_sort(map_filtered: string[] | undefined, value: string): string | undefined {
        if(!map_filtered) return;
        return map_filtered.sort((a, b) => natural.JaroWinklerDistance(value, b) - natural.JaroWinklerDistance(value, a))[0]
    }

    public async check_member (channel: TextChannel | NewsChannel | DMChannel,authorID:string, member: GuildMember | undefined): Promise<boolean> {
        this.stop = true
        if (this.settings.author === false) {
            if (!member) await this.embed.error(this.language.basically.no_member, channel)
            else if (member.id === authorID) await this.embed.error(this.language.basically.no_author, channel)
            else {
                this.stop = false
                return true
            }
        } else {
            if (this.settings.no_bots === true && member.user.bot) await this.embed.error(this.language.basically.bot, channel)
            else {
                this.stop = false
                return true
            }
        }
        return false
    }

    protected async get_data (guild_id: string, member_id: string): Promise<User_Interface> {
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

    protected async member ({mentions, guild, channel, authorID } : {mentions:Collection<string,User>, guild:Guild,channel:TextChannel|NewsChannel|DMChannel, authorID:Snowflake}, user_args?: string): Promise<GuildMember | undefined> {
      const user:User | Snowflake = mentions.filter((m: User) => m.id !== this.client?.user?.id).first() || (user_args ?? '')
      const member: GuildMember| undefined = (guild?.member(user)) || (await get_member(this))

      async function get_member (command: Command) {
        if (!user_args) return;
        const cache = guild?.members.cache
        const names = cache?.map((x:GuildMember) => (x.nickname || x.user.username))
        const fined = command.name_sort(names, user_args)
        if(!fined) return;
        if (natural.JaroWinklerDistance(fined, user_args) > 0.7) {
          return cache?.find((x:GuildMember) => (x.nickname || x.user.username) === fined)
        }
      }
      if (await this.check_member(channel, authorID, member)) return member
    }

    protected async Channel (guild: Guild, mentions:Collection<string,GuildChannel>,channel: TextChannel | NewsChannel | DMChannel, channel_args: string | null): Promise<TextChannel | NewsChannel | undefined> {
      const _channel = guild?.channels.cache.get(channel_args || '') || mentions.first()
      if (_channel) return _channel as TextChannel | NewsChannel
      else {
        this.stop = true
        await this.embed.error('Provide channel', channel)
      }
    }

    protected async Role (guild: Guild, mentions:Collection<string,Role>,channel: TextChannel | NewsChannel | DMChannel,role_args: string | null, check = true): Promise<Role | undefined> {
      const role = guild?.roles.cache.get(role_args || '') || mentions.first() || undefined
      if (role) return role
      else if(check === true) {
        this.stop = true
        await this.embed.error('Provide role', channel)
      }
    }

    protected Guild (id: string): Guild | undefined {
      return this.client.guilds.cache.get(id)
    }

    protected async fetch (args: string): Promise<string> {
      return await fetch(args).then((r: Response) => r.json()).then(r => r.image || r.url)
    }

    protected async paginate (channel: TextChannel | NewsChannel | DMChannel, guild: Guild , author:User, pages: Map<number, MessageEmbed>, emojis: string[]): Promise<void> {
      let page = 1
      const msg = await channel.send(pages.get(1) as MessageEmbed)
      for (const emoji of emojis) {
        await msg.react(emoji)
      }
      const filter: CollectorFilter = (_reaction, user) => user.id === author.id
      const collector = msg.createReactionCollector(filter, {
        time: 60000
      })
        const hasPermission = guild.me.hasPermission('MANAGE_MESSAGES')
        collector.on('collect', async (reaction) => {
        switch (reaction.emoji.name) {
          case 'rewind':
            page = 1
            await msg.edit(pages.get(page) as MessageEmbed)
            break
          case 'arrow_left':
            page === 1 ? (page = pages.size) : page--
            await msg.edit(pages.get(page) as MessageEmbed)
            break
          case 'smart_button':
            await collector.stop('User want it')
            await msg.delete()
            break
          case 'arrow_right':
            page === pages.size ? (page = 1) : page++
            await msg.edit(pages.get(page) as MessageEmbed)
            break
          case 'fast_forward':
            page = pages.size
            await msg.edit(pages.get(page) as MessageEmbed)
            break
          default:
            await reaction.remove()
        }
        if (hasPermission) return reaction.users.remove(author.id)
      })
      collector.on('end', async () => {
        if (hasPermission) {
          await msg.reactions.removeAll()
        }
      })
    }
}
