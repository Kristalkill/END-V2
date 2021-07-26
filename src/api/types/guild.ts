import { Guild_Interface } from '@interfaces/MongoDB'

const permissionConstants = {
  1: 'CREATE_INSTANT_INVITE',
  2: 'KICK_MEMBERS',
  4: 'BAN_MEMBERS',
  8: 'ADMINISTRATOR',
  0x10: 'MANAGE_CHANNELS',
  0x20: 'MANAGE_GUILD',
  0x40: 'ADD_REACTION',
  0x80: 'VIEW_AUDIT_LOG',
  0x400: 'VIEW_CHANNEL',
  0x800: 'SEND_MESSAGES',
  0x1000: 'SEND_TTS_MESSAGES',
  0x2000: 'MANAGE_MESSAGES',
  0x4000: 'EMBED_LINKS',
  0x8000: 'ATTACH_FILES',
  0x10000: 'READ_MESSAGES_HISTORY',
  0x20000: 'MENTION_EVERYONE',
  0x40000: 'USE_EXTERNAL_EMOJIS',
  0x100000: 'CONNECT',
  0x200000: 'SPEAK',
  0x400000: 'MUTE_MEMBERS',
  0x800000: 'MANAGE_NICKNAMES',
  0x1000000: 'MANAGE_ROLES',
  0x2000000: 'MANAGE_WEBHOOKS',
  0x4000000: 'MANAGE_EMOJIS'
}

export default class Guild {
    private static parsePermissions (perms: number) {
        const p = []
        // eslint-disable-next-line prefer-const
        for (let [number, string] of Object.entries(permissionConstants)) {
            if ((parseInt(number, 10) & perms) === perms) {
                p.push(string)
            }
        }
        return p
    }
    /** The guild's unique discord ID. */
    public readonly id: string;
    /** Name of the guild. */
    public readonly name: string;
    /**  The guild's icon hash. */
    public readonly iconHash: string;
    /** A list of the discord-enabled features of the guild. */
    public readonly features: string[]
        /** Whether the authorized user is the guild's owner. */;

    public readonly isOwner: boolean;
    /** A list of permissions that the authorized user has in this guild. */
    public readonly permissions: string[];

    public db: Guild_Interface | undefined

    public icon: string;
    public hasbot = false;

    public constructor ({ id, name, icon, features = [], owner = false, permissions = 0 }: Guild_Constructor) {
      this.id = id
      this.name = name
      this.iconHash = icon
      this.features = features
      this.isOwner = owner
      this.permissions = Guild.parsePermissions(permissions)
      this.icon  = this.iconUrl(icon)
    }

    /** The timestamp of creation of the user's account. */
    public get createdTimestamp (): number {
      return parseInt((BigInt(this.id) >> BigInt(22)).toString(), 10) + 1420070400000
    }

    /** The time of creation of the user's account. */
    public get createdAt (): Date {
      return new Date(this.createdTimestamp)
    }
    public iconUrl (iconHash: string, size = 512): string {
        return iconHash
            ? `https://cdn.discordapp.com/icons/${this.id}/${iconHash}.${
                iconHash.startsWith('a_') ? 'gif' : 'png'}?size=${size}`
            : 'https://i.imgur.com/LvroChs.png'
    }
}

export interface Guild_Constructor {
    id: string,
    name: string,
    icon: string,
    features: string[],
    owner: false,
    permissions: 0,
    db?: Guild_Interface
}
