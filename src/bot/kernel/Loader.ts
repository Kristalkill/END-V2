import { readdirSync } from 'fs'
import * as path from 'path'
import Event from '@classes/Event'
import Command from '@classes/Command'
import Client from './Client'

export default class Loader {
  public constructor (private client: Client) {
  }

  get directory (): string {
    return `${path.dirname(require.main.filename)}${path.sep}`
  }

  public async load_Events (): Promise<void> {
    const events = readdirSync(`${this.directory}events/client`).filter(file => file.endsWith('js'))
    for (const value of events) {
      const File = await import(`${this.directory}events/client/${value}`)
      const event: Event = new File.default(this.client)
      const { name, type, emitter, run } = event
      this.client.events.set(name, event);
      (emitter as any)[type](name, (...args: []) => run(...args))
    }
  }

  public async load_Commands (): Promise<void> {
    for (const module of readdirSync(`${this.directory}commands/`)) {
      const Commands = readdirSync(`${this.directory}commands/${module}/`).filter((file) => file.endsWith('.js'))
      for (const commandFile of Commands) {
        const { name } = path.parse(commandFile)
        if (['fun'].includes(name)) {
          const ModuleCommands: Command = await import(`${this.directory}Commands/${module}/${commandFile}`)
          for (const [name, command_class] of Object.entries(ModuleCommands)) {
            const command = new command_class(this.client)
            command.basic.name = name
            command.basic.category ??= module
            this.client.commands.set(command.basic.name, command)
          }
        } else {
          const File = await import(`${this.directory}commands/${module}/${commandFile}`)
          const command: Command = new File.default(this.client)
          command.basic.name ??= path.parse(commandFile).name
          command.basic.category ??= module
          this.client.commands.set(command.basic.name, command)
        }
      }
    }
  }

  async load (): Promise<void> {
    await this.load_Commands()
    await this.load_Events()
  }
}
