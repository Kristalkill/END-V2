import Command from '@classes/Command'
import {Message, MessageEmbed, Snowflake} from 'discord.js'

export default class shop extends Command {
  public async run ({guild, channel, mentions, author, member}: Message, [sub, role_args, count]: string[]): Promise<Message> {
    const sub_command = sub?.toLowerCase() || ''
    const number: number = parseInt(count, 10)
    const {
      add_store,
      already_store,
      min_price,
      role_removed,
      no_in_store,
      none,
      store,
      you_have,
      add_you,
      no_available
    } = this.language.commands.shop.parameters
    const shop: Record<Snowflake, number> = this.guild.Economy.shop || {}
    if (['add', 'delete', 'buy'].includes(sub_command) === true) {
      const role_id = (await this.Role(guild,mentions.roles,channel, role_args))?.id
      if(this.stop === true)return;
      const role_includes = role_id in shop
      if (['add', 'delete'].includes(sub_command)  === true) {
        if (member.hasPermission('ADMINISTRATOR') === false) return await this.client.embed.error(this.language.basically.no_perms.translate({perms: 'ADMINISTRATOR'}), channel)
        if (sub_command === 'add') {
          if (!number || number < 0 || number > 1000000) return await this.client.embed.error(min_price, channel)
          else if (role_includes) return this.client.embed.error(already_store, channel)
          else if (guild.me.roles.highest.position < guild.roles.cache.get(role_id).position) return await this.client.embed.error('This role have a more permission', channel)
          shop[role_id] = number
          await this.client.embed.okay(add_store, channel)
        } else {
          if (role_includes) {
            shop[role_id] = undefined
            delete shop[role_id]
            await this.client.embed.okay(role_removed, channel)
          } else return await this.client.embed.error(no_in_store, channel)
        }
        this.guild.Economy.shop = shop
        await this.client.db.save('guilds', this.guild)
        return;
      } else if (sub_command === 'buy') {
        if (role_includes) {
          if (member.roles.cache.has(role_id)) return await this.client.embed.error(you_have, channel)
          else if (shop[role_id] > this.user.Economy.money) return await this.client.embed.error(this.language.basically.no_money, channel)
          await guild.member(author).roles.add(role_id)
          this.user.Economy.money -= shop[role_id]
          await this.client.embed.okay(add_you, channel)
        } else return await this.client.embed.error(no_available, channel)
      }
    } else {
      const embed = new MessageEmbed().setTitle(store)
      let text = ''
      if (Object.keys(shop).length > 0) {
        let i = 1
        for (const [value, key] of Object.entries(shop)) {
          text += `**${i++}**.${guild.roles.cache.get(value)} - ${key}$\n`
        }
      } else text = none
      return await channel.send(embed.setDescription(text))
    }
  }
}
