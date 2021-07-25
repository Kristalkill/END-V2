import Command from '@classes/Command'
import { Message } from 'discord.js'

export default class Reload extends Command {
    settings = {
      category: 'development',
      public: false
    }

    async run (message: Message, [command_name]: string[]): Promise<void | Message> {
      const cmd = command_name.toLowerCase()
      const command: Command = this.client.commands.find((c: Command) =>
        c?.basic.name === cmd.toLowerCase() || c?.basic.aliases.includes(cmd.toLowerCase())
      )
      if (!command) return message.reply('Нету такой комманды')
      delete require.cache[require.resolve(`../${command.basic.category}/${command.basic.name}.js`)]
      const File = await import(`../${command.basic.category}/${command.basic.name}.js`)
      const command_reload: Command = new File.default(this.client)
      command_reload.basic.name = command.basic.name
      command_reload.basic.category = command.basic.category
      await this.client.commands.set(command_reload.basic.name, command_reload)
      return message.channel.send(`${command_reload.basic.name} перезагружена`)
    }
}
