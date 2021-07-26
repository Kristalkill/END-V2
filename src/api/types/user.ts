/** A discord user who has authorized your app to have access to their data. */
export default class User {
    /** The user's discord username. */
    public username: string;
    /** The user's locale. */
    public locale: string
    /** Whether the user has enabled 2-factor authentication. */
    public isMFAEnabled: boolean;
    /** The user's discriminator (e.g. '0001'). */
    public discriminator: string;
    /** The user's unique discord ID. */
    public id: string;
    /** The user's E-Mail ID. */
    public emailId: string;
    /** Whether the user's E-Mail ID has been verified. */
    public emailVerified: boolean;
    /** The user's profile's flags. */
    public userFlags: string[];
    /** The user's avatar hash. */
    public avatarHash: string;
    /** The premium subscription type. */
    public premiumType: string;
    /** Whether the user is a discord bot. */
    public bot: boolean;
    /** Get the URL of a user's display avatar. */
    public readonly displayAvatarURL: string;
    /** Tag of the user (e.g. ADAMJR#0001) */
    public readonly tag: string;

    public constructor ({
      username,
      locale,
      mfa_enabled,
      discriminator,
      id, email, verified, avatar, premium_type, bot, flags
    }: User_Constructor) {
      this.username = username
      this.locale = locale
      this.isMFAEnabled = mfa_enabled
      this.discriminator = parseInt(discriminator, 10).toString().padStart(4, '0')
      this.id = id
      this.emailId = email || ''
      this.emailVerified = verified || false
      this.avatarHash = avatar || ''
      this.userFlags = []
      this.premiumType = premium_type === 0 ? 'None' : premium_type === 1 ? 'Nitro Classic' : 'Nitro'
      this.bot = bot
      this.displayAvatarURL = this.avatarURL({ dynamic: true, size: 256 })
      this.tag = `${this.username}#${this.discriminator}`

      this.buildFlags(flags)
    }

    /** The timestamp of the creation of the user's account. */
    public get createdTimestamp (): number {
      return parseInt((BigInt(this.id) >> BigInt(22)).toString(), 10) + 1420070400000
    }

    /** The time of creation of the user's account. */
    public get createdAt (): Date {
      return new Date(this.createdTimestamp)
    }

    /** Get the URL of a user's avatar, with options. */
    public avatarURL (options: AvatarOptions = { size: 512 }): string {
      const extension = (this.avatarHash?.startsWith('a_') && options.dynamic) ? 'gif' : 'png'

      return `https://cdn.discordapp.com/${this.avatarHash ? '' : 'embed/'}avatars/${
            this.avatarHash ? `${this.id}/${this.avatarHash}` : parseInt(this.discriminator, 10) % 5
        }.${(this.avatarHash) ? extension : 'png'}?size=${options.size}`
    }

    private buildFlags (flags: number) {
      if ((flags & 1) === 1) { this.userFlags.push('Discord Employee') }
      if ((flags & 2) === 2) { this.userFlags.push('Discord Partner') }
      if ((flags & 4) === 4) { this.userFlags.push('HypeSquad Events') }
      if ((flags & 8) === 8) { this.userFlags.push('Bug Hunter Level 1') }
      if ((flags & 64) === 64) { this.userFlags.push('HypeSquad House of Bravery') } else if ((flags & 128) === 128) { this.userFlags.push('HypeSquad House of Brilliance') } else if ((flags & 256) === 256) { this.userFlags.push('HypeSquad House of Balance') }
      if ((flags & 512) === 512) { this.userFlags.push('Early Supporter') }
      if ((flags & 1024) === 1024) { this.userFlags.push('Team User') }
      if ((flags & 4096) === 4096) { this.userFlags.push('System') }
      if ((flags & 16384) === 16384) { this.userFlags.push('Bug Hunter Level 2') }
      if ((flags & 131072) === 131072) { this.userFlags.push('Verified Bot Developer') }
    }
}

export interface AvatarOptions {
    dynamic?: boolean;
    size?: number;
}

interface User_Constructor {
    username: string,
    locale: string,
    mfa_enabled: boolean,
    flags: 0,
    avatar: null,
    discriminator: string,
    id: string,
    email: undefined,
    verified: undefined,
    premium_type: 0,
    bot: false
}
