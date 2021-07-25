import { Message } from 'discord.js'
import Command from '../Command'

export abstract class ImageCommand extends Command {
    abstract getImage(): Promise<string>

    abstract getSuccessMessage(): string

    run = async (message: Message): Promise<void> => {
      await this.embed.fun(this.getSuccessMessage(), message, await this.getImage())
    }
}

export abstract class RoleCommand extends Command {
    abstract getImage(): Promise<string>

    abstract getSuccessMessage(): string

    run = async (message: Message, [user]: [string | null]): Promise<void> => {
      const member = await this.member(message, user) || message.member
      if (!this.stop) return
      await this.embed.fun(`${message.author} ${this.getSuccessMessage()} ${member}`, message, await this.getImage())
    }
}
