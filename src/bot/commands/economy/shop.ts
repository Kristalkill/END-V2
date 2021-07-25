import Command from '@classes/Command'
import { Message, MessageEmbed, Snowflake } from 'discord.js'

export default class shop extends Command {
  async run (message: Message, [sub_command, role_args, count]: string[]): Promise<void | Message> {
    const role_id = (await this.Role(message, role_args))?.id
    sub_command = sub_command?.toLowerCase()
    const number: number = parseInt(count)
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
      no_available,
      provide_role
    } = this.language.commands.shop.parameters
    const shop: Record<Snowflake, number> = message.guild.settings.Economy.shop || {}
    if (['add', 'delete', 'buy'].includes(sub_command)) {
      if (['add', 'delete'].includes(sub_command)) {
        if (message.member.hasPermission('ADMINISTRATOR') === false) {
          await this.client.embed.error(this.language.basically.no_perms.translate({ perms: 'ADMINISTRATOR' }), message)
          return null
        }
        if (!role_id) {
          await this.client.embed.error(provide_role, message)
          return null
        }
        if (sub_command === 'add') {
          if (!number || number < 0 || number > 1000000) {
            await this.client.embed.error(min_price, message)
            return null
          } else if (role_id in shop) {
            await this.client.embed.error(already_store, message)
            return null
          } else if (message.guild.me.roles.highest.position < message.guild.roles.cache.get(role_id).position) {
            await this.client.embed.error('This role have a more permission', message)
            return null
          }
          shop[role_id] = number
          await this.client.embed.okay(add_store, message)
        } else {
          if (role_id in shop) {
            shop[role_id] = undefined
            delete shop[role_id]
            await this.client.embed.okay(role_removed, message)
          } else {
            await this.client.embed.error(no_in_store, message)
            return null
          }
        }
        message.guild.settings.Economy.shop = shop
        await this.client.db.save('guilds', message.guild.settings)
      } else if (sub_command === 'buy') {
        if (role_id in shop) {
          if (message.member.roles.cache.has(role_id)) {
            await this.client.embed.error(you_have, message)
            return null
          } else if (shop[role_id] > message.member.options.Economy.money) {
            await this.client.embed.error(this.language.basically.no_money, message)
            return null
          }
          await message.guild.member(message.author).roles.add(role_id)
          message.member.options.Economy.money -= shop[role_id]
          await this.client.embed.okay(add_you, message)
        } else {
          await this.client.embed.error(no_available, message)
          return null
        }
      }
    } else {
      const embed = new MessageEmbed().setTitle(store)
      let text = ''
      if (Object.keys(shop).length > 0) {
        let i = 1
        for (const [value, key] of Object.entries(shop)) {
          text += `**${i++}**.${message.guild.roles.cache.get(value)} - ${key}$\n`
        }
      } else text = none
      await message.channel.send(embed.setDescription(text))
      return null
    }
  }
}
