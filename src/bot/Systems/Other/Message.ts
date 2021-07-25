import { DMChannel, Message, MessageEmbed, MessageReaction, TextChannel } from 'discord.js'
import Client from '@kernel/Client'
import { Block_Interface, Guild_Interface, User_Interface } from '@interfaces/MongoDB'
import Language from '../../languages/Language'
import { humanizeDuration } from '../../index'
import Command from '@classes/Command'
import { Guild_basic, User_basic } from '@util/Base Values/MongoDB'

interface Usage {
    _id?: any,
    name: string,
    count: number
}

export default class {
  constructor (private client: Client) {
  }

  async inviteCheck (message: Message): Promise<boolean> {
    if (
      message.guild.settings.Moderation.auto === true &&
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

  async get_prefix (message: Message): Promise<string> {
    return [
            `<@${message.guild.me.id}>`,
            `<@!${message.guild.me.id}>`,
            `${message.guild.settings.prefix}`
    ].find((prefix) => message.content.toLowerCase().startsWith(prefix.toLowerCase())) || ''
  }

  async database_check (message: Message): Promise<[Guild_Interface, Block_Interface, User_Interface]> {
    const { db } = this.client
    let res = await db.getOne<Guild_Interface>('guilds', { guildID: message.guild.id })
    const Block_res = await db.getOne<Block_Interface>('blocks', { id: message.author.id })
    let data = await db.getOne<User_Interface>('users', { guildID: message.guild.id, userID: message.author.id })
    if (!res) {
      await db.insert_one<Guild_Interface>('guilds', Guild_basic(message.guild.id, message.guild.ownerID, message.guild.preferredLocale))
      res = await db.getOne<Guild_Interface>('guilds', { guildID: message.guild.id })
    }
    if (!data) {
      await db.insert_one<User_Interface>('users', User_basic(message.author.id, message.guild.id))
      data = await db.getOne<User_Interface>('users', { guildID: message.guild.id, userID: message.author.id })
    }
    return [res, Block_res, data]
  }

  async Economy_Update (message: Message, data: User_Interface, res: Guild_Interface, language: Language): Promise<void> {
    data.Economy.xp += res.Economy.xp
    data.Economy.money += res.Economy.money
    data.messages++
    const xp_add = res.Economy.upXP * data.Economy.level
    if (data.Economy.xp >= xp_add) {
      data.Economy.xp -= xp_add
      data.Economy.level += 1
      await message.channel.send(new MessageEmbed({
        description: language.events.message.level_up.translate({
          name: message.author.username,
          level: data.Economy.level
        })
      }))
    }
  }

  cool_down (message: Message, time: number): void {
    this.client.db.cool_downs.set(message.author.id, Date.now() + time)
    setTimeout(
      () => this.client.db.cool_downs.delete(message.author.id),
      time
    )
  }

  check_bump (message: Message): void {
    const embed = message.embeds[0]
    const message_embed = (bump: string) => {
      return message.channel.send('<@&852657879533092905>\n', new MessageEmbed().setDescription(`**Time to bump ${bump}**`))
    }
    if (message.author.id === '705876500175519856' && embed?.title === ':AHD_yes: Bumping Completed') {
      setTimeout(() => {
        return message_embed('*bump')
      }, 7200000)
    } else if (message.author.id === '212681528730189824' && embed?.title === 'Bumped!') {
      setTimeout(() => {
        return message_embed('dlm!bump')
      }, 28800000)
    } else if (message.author.id === '478290034773196810' && embed?.description === 'Support Bump Central on Patreon to keep it running. AUTOBUMP IS BACK') {
      setTimeout(() => {
        return message_embed('-bump')
      }, 3000000)
    } else if (message.author.id === '415773861486002186' && message.content === ':success: END\'s community & support has been bumped') {
      setTimeout(() => {
        return message_embed('d=bump')
      }, 1800000)
    } else if (message.author.id === '481810078031282176' && embed?.author.name === 'Server Bumped') {
      setTimeout(() => {
        return message_embed('sm!bump')
      }, 1200000)
    } else if (message.author.id === '777851498297688065' && embed?.title === ':hahaok: Bumping your server...!') {
      setTimeout(() => {
        return message_embed('ob!bump')
      }, 3600000)
    } else if (message.author.id === '302050872383242240' && embed?.title === 'DISBOARD: The Public Server List') {
      setTimeout(() => {
        return message_embed('d!bump')
      }, 7200000)
    }
  }

  async language (preferredLocale: string): Promise<Language> {
    return await import(`@languages/${preferredLocale.slice(0, 2) || 'en'}`)
  }

  async reaction_on_message (message: Message): Promise<void | Message | MessageReaction> {
    await this.check_bump(message)
    if (!message || message.channel.type === 'dm' || message.author.bot) return null
    const { db } = this.client
    const [res, Block_res, data] = await this.database_check(message)
    if (data && res) {
      const language: Language = await this.language(res.language)
      message.guild.settings = res
      /* if (await this.inviteCheck(message)) return; */
      message.member.options = data
      if (!message.guild.me.hasPermission(['SEND_MESSAGES'])) return message.guild.owner.send(new MessageEmbed().setDescription(language.events.message.give_basic_law))
      /* if (
                !db.boxescoldown.has(message.guild.id) &&
                res.options.boxes === true
            ) {
                await this.client.utils.systems.Boxes.spawn_random_box(message);
            } */
      const prefix = await this.get_prefix(message)
      const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g)
      const command: Command = this.client.commands.find((c: Command) =>
        c.basic.name === cmd.toLowerCase() || c.basic.aliases.includes(cmd.toLowerCase())
      )
      if (command && prefix) {
        if (Block_res) return await message.react('733299144311177257')
        await this.Economy_Update(message, data, res, language)
        const [bot_permission, user_permission] = this.client.utils.managePerms(message, command.permissions)
        const cool_down = db.cool_downs.get(message.author.id)
        if (cool_down) {
          return await this.client.embed.error(language.events.message.slow_mode.translate({
            time: humanizeDuration.humanize(cool_down - Date.now(), {
              round: true,
              language: res.language
            })
          }), message)
        }
        if (this.client.owners.includes(message.author.id) === false) {
          const { nsfw, premium } = command.settings
          if (nsfw === true && message.channel.nsfw === false) await this.client.embed.error(language.events.message.only_nsfw, message)
          if (command.settings.public === false) return
          if (premium === true) {
            if (res._premium > Date.now() || data.time._premium > Date.now()) {
              await this.cool_down(message, 1500)
            } else {
              await this.cool_down(message, 5000)
              return await this.client.embed.error('This command only for premium guilds or users', message)
            }
          }
          if (user_permission) {
            return await this.client.embed.error(language.events.message.no_enough_laws.translate({
              need: user_permission,
              user: `${message.member} you`
            }), message)
          }
        }
        if (bot_permission) {
          return await this.client.embed.error(language.events.message.no_enough_laws.translate({
            need: bot_permission,
            user: 'i'
          }), message)
        }
        command.language = language
        command.run(message, args).catch(error => {
          (this.client.channels.cache.get('851080532665958447') as TextChannel).send(new MessageEmbed({
            description: error.toString()
          }))
        })
        let command_usage: Usage = await db.getOne<Usage>('commands', { name: command.basic.name })
        if (!command_usage) {
          command_usage = await db.insert_one<Usage>('commands', { name: command.basic.name, count: 0 })
        }
        command_usage.count++
        await db.save('commands', command_usage)
        await db.save('guilds', res)
        await db.save('users', data)
      } else if (message.mentions.users.has(message.guild.me.id) === true) {
        return await message.channel.send(
          new MessageEmbed().setTitle(
                    `${language.events.message.prefix} ${res.prefix}`
          )
        )
      }
    }
  }
}
