import {
  GuildMember,
  Message,
  MessageEmbed,
  MessageReaction,
  NewsChannel,
  PermissionResolvable, PermissionString,
  TextChannel, User
} from 'discord.js'
import Client from '@kernel/Client'
import { Block_Interface, Guild_Interface, User_Interface } from '@interfaces/MongoDB'
import Language from '../../languages/Language'
import { humanizeDuration } from '../../index'
import Command from '@classes/Command'
import { Guild_basic, User_basic } from '@util/Base Values/MongoDB'
import {Command_Settings} from "@interfaces/Command";

interface Usage {
    _id?: any,
    name: string,
    count: number
}

export default class {
  public constructor(private client: Client) {
  }

  public async reaction_on_message(message: Message): Promise<Message | MessageReaction | undefined> {
    if (!message || message.channel.type === 'dm' || !message.guild || !message.member || !message.guild.me) return;

    const {channel, content, author, embeds} = message
    const {owner, preferredLocale, me} = message.guild

    const authorID = author.id
    const guildID = message.guild.id

    this.check_bump(channel, embeds[0], authorID, content)
    if (author.bot) return;

    const {db} = this.client
    const [res, Block_res, data] = await this.database_check(guildID, authorID, owner.id, preferredLocale)

    if (data && res) {
      const language: Language = await this.language(res.language)
      if (!me?.hasPermission(['SEND_MESSAGES'])) return owner?.send(new MessageEmbed().setDescription(language.events.message.give_basic_law))
      await this.Economy_Update(channel, author.username, [data, res], language)
      const prefix = await this.get_prefix(me.user, res.prefix, content)
      const [cmd, ...args] = content
          .slice(prefix.length)
          .trim()
          .split(/ +/g)
      const command: Command | undefined = this.client.commands.find((c: Command) =>
          (c.basic.name === cmd.toLowerCase() || c.basic.aliases.includes(cmd.toLowerCase()))
      )
      if (command && prefix) {
        if (Block_res) return await message.react('733299144311177257')
        const {permissions} = command
        if (!this.client.owners.includes(message.author.id)) {
          await this.command_check(command.settings, channel, [res._premium, data.time._premium], language)
          await this.manage_col_downs(authorID, db.cool_downs, channel, [res._premium, data.time._premium], [language.events.message.slow_mode, res.language])
          const user_permission = this.permission_check(channel, message.member, permissions.user)
          if (user_permission) {
            return await this.client.embed.error(language.events.message.no_enough_laws.translate({
              need: user_permission,
              user: `${message.member} you`
            }), channel)
          }
        }
        const bot_permission = this.permission_check(channel, me, permissions.bot)
        if (bot_permission) {
          return await this.client.embed.error(language.events.message.no_enough_laws.translate({
            need: bot_permission,
            user: 'i'
          }), channel)
        }
        command.language = language
        command.guild = res
        command.user = data
        command.run(message, args).catch(error => {
          (this.client.channels.cache.get('851080532665958447') as TextChannel).send(new MessageEmbed({
            description: error.toString()
          }))
        })
        let command_usage: Usage = await db.getOrInsert<Usage>('commands', {name: command.basic.name}, {
          name: command.basic.name,
          count: 0
        })
        command_usage.count++
        await db.save('commands', command_usage)
        await db.save('guilds', command.guild)
        await db.save('users', command.user)
      } else if (message.mentions.users.has(me.id)) return await message.channel.send(new MessageEmbed().setTitle(`${language.events.message.prefix} ${res.prefix}`));
    }
  }

  /*
  private async inviteCheck (message: Message): Promise<boolean> {
    if (
      message.guild?.settings.Moderation.auto === true &&
            !message.member.hasPermission('ADMINISTRATOR') &&
            !(message.channel instanceof DMChannel) && message.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES') &&
            new RegExp(
              '((?:(?:http|https)://)?(?:www.)?((?:disco|discord|discordapp).(?:com|gg|io|li|me|net|org)(?:/invite)?/([a-z0-9-.]+)))',
              'i'
            ).test(message.content)
    ) {
      const fetchInvite = await this.client.fetchInvite(message.content).catch(null)

      if (fetchInvite && fetchInvite.guild.id !== message.guild.id) {
        await message.delete().catch(null)

        await message.channel.send(
                    `${fetchInvite.guild.name}(\`${fetchInvite.guild.id}\`) ОТ ${message.author}(\`${message.author.id}\`)`
        )

        return true
      }
    }
  }
  */
  private async manage_col_downs(authorID: string, cool_downs: Map<string, number>, channel: TextChannel | NewsChannel, [guild_time, user_time]: number[], [slow_mode_text, language]: [any, string]) {
    const cool_down = cool_downs.get(authorID)
    const data = Date.now()
    if (cool_down) {
      return await this.client.embed.error(slow_mode_text.translate({
        time: humanizeDuration.humanize(cool_down - data, {
          round: true,
          language: language
        })
      }), channel)
    } else {
      if (guild_time < data && user_time < data) {
        this.set_cool_down(authorID, 5000)
      } else {
        this.set_cool_down(authorID, 1500)
      }
    }
  }

  private async command_check({
                                nsfw,
                                community,
                                premium
                              }: Command_Settings, channel: TextChannel | NewsChannel, [guild_time, user_time]: number[], language: Language) {
    if (nsfw === true && !channel.nsfw) {
      await this.client.embed.error(language.events.message.only_nsfw, channel)
      return true
    } else if (community === false) return true;
    else if (premium === true && guild_time < Date.now() && user_time < Date.now()) {
      await this.client.embed.error('This command only for premium guilds or users', channel)
      return true
    }
    return false;
  }

  private permission_check(channel: TextChannel | NewsChannel, member: GuildMember, permission: PermissionResolvable): string[] {
    return this.client.utils.formatArray(channel.permissionsFor(member)?.missing(permission ? this.client.defaultPerms.add(permission) : this.client.defaultPerms).map(this.formatPerms))
  }

  private formatPerms(perm: PermissionString): PermissionString {
    return perm
        .toLowerCase()
        .replace(/(^|"|_)(\S)/g, (s: string) => s.toUpperCase())
        .replace(/_/g, ' ')
        .replace(/Guild/g, 'Server')
        .replace(/Use Vad/g, 'Use Voice Activity') as PermissionString
  }

  private async get_prefix(me: User, db_prefix: string, content: string): Promise<string> {
    const id = me?.id
    return [
      `<@${id}>`,
      `<@!${id}>`,
      `${db_prefix}`
    ].find((prefix) => content.toLowerCase().startsWith(prefix.toLowerCase())) || ''
  }

  private async database_check(guildID: string, userID: string, ownerID: string | undefined, preferredLocale: string): Promise<[Guild_Interface, Block_Interface, User_Interface]> {
    const {db} = this.client
    let res = await db.getOne<Guild_Interface>('guilds', {guildID: guildID})
    const Block_res = await db.getOne<Block_Interface>('blocks', {id: userID})
    let data = await db.getOne<User_Interface>('users', {guildID: guildID, userID: userID})
    if (!res && ownerID) {
      await db.insert_one<Guild_Interface>('guilds', Guild_basic(guildID, ownerID, preferredLocale))
      res = await db.getOne<Guild_Interface>('guilds', {guildID: guildID})
    }
    if (!data) {
      await db.insert_one<User_Interface>('users', User_basic(userID, guildID))
      data = await db.getOne<User_Interface>('users', {guildID: guildID, userID: userID})
    }
    return [res, Block_res, data]
  }

  private async Economy_Update(channel: TextChannel | NewsChannel, username: string, [data, res]: [User_Interface, Guild_Interface], language: Language): Promise<void> {
    data.Economy.xp += res.Economy.xp
    data.Economy.money += res.Economy.money
    data.messages++
    const xp_add = res.Economy.upXP * data.Economy.level
    if (data.Economy.xp >= xp_add) {
      data.Economy.xp -= xp_add
      data.Economy.level += 1
      await channel.send(new MessageEmbed({
        description: language.events.message.level_up.translate({
          name: username,
          level: data.Economy.level
        })
      }))
    }
  }

  private set_cool_down(authorID: string, time: number): void {
    this.client.db.cool_downs.set(authorID, Date.now() + time)
    setTimeout(
        () => this.client.db.cool_downs.delete(authorID),
        time
    )
  }

  private check_bump(channel: TextChannel | NewsChannel, embed: MessageEmbed, authorID: string, content: string): void {
    const message_embed = (bump: string) => {
      return channel.send('<@&852657879533092905>\n', new MessageEmbed().setDescription(`**Time to bump ${bump}**`))
    }
    if (authorID === '705876500175519856' && embed?.title === ':AHD_yes: Bumping Completed') {
      setTimeout(() => {
        return message_embed('*bump')
      }, 7200000)
    } else if (authorID === '212681528730189824' && embed?.title === 'Bumped!') {
      setTimeout(() => {
        return message_embed('dlm!bump')
      }, 28800000)
    } else if (authorID === '478290034773196810' && embed?.description === 'Support Bump Central on Patreon to keep it running. AUTOBUMP IS BACK') {
      setTimeout(() => {
        return message_embed('-bump')
      }, 3000000)
    } else if (authorID === '415773861486002186' && content === ':success: END\'s community & support has been bumped') {
      setTimeout(() => {
        return message_embed('d=bump')
      }, 1800000)
    } else if (authorID === '481810078031282176' && embed?.author?.name === 'Server Bumped') {
      setTimeout(() => {
        return message_embed('sm!bump')
      }, 1200000)
    } else if (authorID === '777851498297688065' && embed?.title === ':hahaok: Bumping your server...!') {
      setTimeout(() => {
        return message_embed('ob!bump')
      }, 3600000)
    } else if (authorID === '302050872383242240' && embed?.title === 'DISBOARD: The Public Server List') {
      setTimeout(() => {
        return message_embed('d!bump')
      }, 7200000)
    } else return;
  }

  private async language(preferredLocale: string): Promise<Language> {
    return await import(`@languages/${preferredLocale.slice(0, 2) || 'en'}`)
  }

}
