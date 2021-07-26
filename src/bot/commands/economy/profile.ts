import Command from '@classes/Command'
import {Activity, Message, MessageEmbed} from 'discord.js'

export default class profile extends Command {
    public settings = {
      author: true
    }

    public async run ({guild, channel, mentions, author, member }: Message, [user_args]: string[]): Promise<Message> {
      try {
        const { reputation, types, embed, devices } = this.language.commands.profile.parameters
        const {user, joinedAt, roles} = (await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user_args)) || member
        if (this.stop) return null
        const statuses: { [key: string]: string } = {
          online: '<a:online:709844735119851610>',
          dnd: '<a:dnd:709844760491196576>',
          idle: '<a:snow:709844747145052321>',
          offline: '<a:offline:709844724311392296>'
        }
        const devices_obj:{[key:string]:string} = {
          desktop: devices.pc,
          web: devices.web,
          mobile: devices.mobile
        }
        let devicesText = ' '
        Object.keys(user.presence.clientStatus).forEach(dev => {
          devicesText += `\n${devices_obj[dev]}`
        })
        const flags: { [key: string]: string } = {
          DISCORD_EMPLOYEE: '<:Staff:709858516390641745>',
          DISCORD_PARTNER: '<:Partner:709854788463886399>',
          HYPESQUAD_EVENTS: '<:HSEvents:709854801004986428>',
          BUGHUNTER_LEVEL_1: '<:BugHunter:709854729013821452>',
          HOUSE_BRAVERY: '<:HSBravery:709854778787758111>',
          HOUSE_BRILLIANCE: '<:HSBrilliance:709858505506553976> ',
          HOUSE_BALANCE: '<:HSBalance:709854768000008202>',
          EARLY_SUPPORTER: '<:EarlySupporter:709854757702861303',
          BUGHUNTER_LEVEL_2: '<:BugHunter2:709854743199219872>',
          VERIFIED_DEVELOPER: '<:coder:709854816725106859>'
        }
        const user_flags = user.flags.toArray()?.map(flag => `${flags[flag]}`) || types.null
        let activity
        if (user.presence.activities.length > 0) {
          const obj: { [key: string]: string } = {
            PLAYING: types.play,
            STREAMING: types.stream,
            LISTENING: types.listen,
            WATCHING: types.looks
          }
          activity = user.presence.activities
            .map((a: Activity) => {
              let str: string
              if (a.type === 'CUSTOM_STATUS' && a.state) str = ` ${a.state} `
              else {
                str = obj[a.type]
                if (a.name) str += `  ${a.name} `
                if (a.details) str += `-  ${a.details} `
                if (a.state) str += `  ${a.state} `
                if (a.url) str += `  ${a.url}`
              }
              return str
            })
            .join('\n')
        } else activity = types.null
        const { Economy: { rep, level, xp, money }, warn } = await this.get_data(guild.id, user.id)
        let reputation_text
        if (rep <= -30) {
          reputation_text = reputation.satan
        } else if (rep <= -5) {
          reputation_text = reputation.devil
        } else if (rep <= -1) {
          reputation_text = reputation.hypocrite
        } else if (rep <= 2) {
          reputation_text = reputation.neutral
        } else if (rep <= 9) {
          reputation_text = reputation.kind
        } else if (rep <= 29) {
          reputation_text = reputation.servant
        } else {
          reputation_text = reputation.angel
        }
        const pages = new Map()
        pages.set(1, new MessageEmbed({
          title: `**${user.username}**`,
          thumbnail: {
            url: user.displayAvatarURL({ dynamic: true })
          },
          footer: {
            text: this.language.basically.pages.translate({
              pages: 2,
              page: 1
            })
          },
          color: 0xff5500,
          fields: [{
            name: embed.about,
            value: embed.about_text.translate({
              activity,
              ftext: user_flags,
              statuses: statuses[user.presence.status],
              devicesText: devicesText,
              createdAt: this.client.utils.formatDate(user.createdAt),
              joinedAt: this.client.utils.formatDate(joinedAt)
            })
          },
          {
            name: embed.account,
            value: embed.account_text.translate({
              money: this.client.utils.abbreviateNumber(money),
              level: level,
              xp: `${xp}/${
                                this.guild.Economy.upXP * level
                            }`,
              leftxp:
                                this.guild.Economy.upXP * level - xp,
              warn: warn,
              reputation: `${rep}|${reputation_text}`
            }),
            inline: true
          }]
        }))
        const profile_2 = new MessageEmbed({
          title: `**🏅 ${embed.roles}**`,
          thumbnail: {
            url: user.displayAvatarURL({ dynamic: true })
          },
          footer: {
            text: this.language.basically.pages.translate({
              pages: 2,
              page: 2
            })
          },
          color: 0xff5500
        })
          .setColor('RANDOM')
        if (roles.cache.size > 0) {
          roles.cache
            .sort((a, b) => b.position - a.position)
            .filter((role) => role.id !== guild.id)
            .map((role) => profile_2.addField('** **', `${role}`))
        } else {
          profile_2.setDescription(embed.no_have)
        }
        pages.set(2, profile_2)

        await this.paginate(channel, guild, author, pages, [
          'arrow_left:756545499586101288',
          'smart_button:756545499460272311',
          'arrow_right:756545499393294368'
        ])
        return;
      } catch (err: any) {
        console.log(err)
      }
    }
}
