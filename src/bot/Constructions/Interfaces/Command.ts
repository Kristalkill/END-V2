import { Message, PermissionResolvable } from 'discord.js'
import Client from '../../kernel/Client'
import Embed from '../Classes/Embed'
import Language from '../../languages/Language'

export interface Command_Permissions {
    bot: PermissionResolvable
    user: PermissionResolvable
}

export interface Command_Settings {
    community?: boolean;
    nsfw?: boolean;
    author?: boolean;
    no_bots?: boolean;
    premium?: boolean
}

export interface Command_Basic {
    name?: string,
    aliases: Array<string>,
    category?: string
}

export interface Command_Interface {
    language: Language;
    permissions: Command_Permissions
    args?: number
    stop?: boolean;
    readonly client: Client;
    embed: Embed;
    settings: Command_Settings;
    basic: Command_Basic
    run(message: Message, args: string[]): Promise<command_return>

}
export type command_return = Error | undefined | Message
