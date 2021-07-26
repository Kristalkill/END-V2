import {Message} from 'discord.js'

import Command from '../Command'

export abstract class ImageCommand extends Command {
    public async run ({channel}: Message):Promise<Message | Error | undefined> {
        return await this.embed.fun(this.getSuccessMessage(), channel, await this.getImage())
    }
    protected abstract getImage(): Promise<string>
    protected abstract getSuccessMessage(): string
}

export abstract class RoleCommand extends Command {
    public async run({author, channel, guild, mentions, member}: Message, [user]: string[]):Promise<Message | Error | undefined> {
        const _member = await this.member({authorID: author.id , channel: channel, guild: guild, mentions: mentions.users}, user) || member
        if (!this.stop) return;
        return await this.embed.fun(`${author} ${this.getSuccessMessage()} ${_member}`, channel, await this.getImage())
    }
    protected abstract getImage(): Promise<string>
    protected abstract getSuccessMessage(): string
}
