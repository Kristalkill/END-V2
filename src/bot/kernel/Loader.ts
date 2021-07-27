import { readdirSync } from 'fs'
import * as path from 'path'
import Event from '@classes/Event'
import Command from '@classes/Command'
import Client from './Client'

export default class Loader {
  public constructor(private client: Client) {}

  private static get directory(): string {
    return `${path.dirname(require.main?.filename || '')}${path.sep}`
  }

  public async load_Events(): Promise<void> {
    const events = readdirSync(`${Loader.directory}events/client`).filter(file => file.endsWith('js'))
    for (const value of events) {
      const file = await import(`${Loader.directory}events/client/${value}`)
      // eslint-disable-next-line new-cap
      const event: Event = new file.default(this.client)
      const {name, type, emitter, run} = event
      this.client.events.set(name, event);
      (emitter as any)[type](name, (...args: []) => run(...args))
    }
  }

  public async load_Commands(): Promise<void> {
    for (const module of readdirSync(`${Loader.directory}commands/`)) {
      const Commands = readdirSync(`${Loader.directory}commands/${module}/`).filter((file) => file.endsWith('.js'))
      for (const commandFile of Commands) {
        const {name} = path.parse(commandFile)
        if (['fun'].includes(name)) {
          const ModuleCommands: { [name: string]: any } = await import(`${Loader.directory}commands/${module}/${commandFile}`)
          for (const [name, Command_class] of Object.entries(ModuleCommands)) {
            const command: Command = new Command_class(this.client)
            command.basic.name = name
            command.basic.category ??= module
            this.client.commands.set(command.basic.name, command)
          }
        } else {
          const File = await import(`${Loader.directory}commands/${module}/${commandFile}`)
          // eslint-disable-next-line new-cap
          const command: Command = new File.default(this.client)
          command.basic.name ??= path.parse(commandFile).name
          command.basic.category ??= module
          this.client.commands.set(command.basic.name, command)
        }
      }
    }
  }

  public async load(): Promise<void> {
    await this.load_Commands()
    await this.load_Events()
  }
}
