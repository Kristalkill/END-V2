import { PermissionResolvable } from 'discord.js'

export interface Config {
    token: string
    dataURL: string
    defaultPerms: PermissionResolvable
}
