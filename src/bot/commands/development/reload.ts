import Command from '@classes/Command'
import { Message } from 'discord.js'
import {Command_Interface, command_return} from "@interfaces/Command";

export default class Reload extends Command {
    public settings = {
      category: 'development',
      community: false
    }

    public async run ({channel}: Message, [command_name]: string[]): Promise<command_return> {
      const cmd = command_name?.toLowerCase()
      const command: Command | undefined = this.client.commands.find((command: Command_Interface) =>
          (command.basic.name === cmd || command.basic.aliases?.includes(cmd))
      )
      if (!command) return channel.send('Нету такой комманды')
      const {category,name} = command.basic
      delete require.cache[require.resolve(`../${category}/${name}.js`)]
      const File = await import(`../${category}/${name}.js`)
        // eslint-disable-next-line new-cap
      const command_reload: Command = new File.default(this.client)
      command_reload.basic.name = name
      command_reload.basic.category = category

      return channel.send(`${command_reload.basic.name} перезагружена`)
    }
}
