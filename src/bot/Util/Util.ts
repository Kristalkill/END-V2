
export default class Util {
  public trimArray (arr: string[], maxLen = 10): string[] | undefined {
    let array
    if (arr.length > maxLen) {
      const len = arr.length - maxLen
      array = arr.slice(0, maxLen)
      array.push(`${len} more...`)
    }
    return array
  }

  public formatBytes (bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
  }
  public removeDuplicates<T> (arr: []): T[] {
    return [...new Set(arr)]
  }

  public abbreviateNumber (number: number, digits = 2): string {
    let expK = Math.floor(Math.log10(Math.abs(number)) / 3)
    let scaled = number / Math.pow(1000, expK)
    if (Math.abs(Number(scaled.toFixed(digits))) >= 1000) {
      scaled /= 1000
      expK += 1
    }
    const SI_SYMBOLS = 'apμm KМBTКQ'
    const BASE0_OFFSET = SI_SYMBOLS.indexOf(' ')
    if (expK + BASE0_OFFSET >= SI_SYMBOLS.length) {
      expK = SI_SYMBOLS.length - 1 - BASE0_OFFSET
      scaled = number / Math.pow(1000, expK)
    } else if (expK + BASE0_OFFSET < 0) return '0'
    return (
      scaled.toFixed(digits).replace(/(\.|(\..*?))0+$/, '$2') +
            SI_SYMBOLS[expK + BASE0_OFFSET].trim()
    )
  }

  public formatDate (date: Date, language?: string): string {
    const data = new Date(date)
    return data.toLocaleString(language || 'en', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  public formatArray(array: ("CREATE_INSTANT_INVITE" | "KICK_MEMBERS" | "BAN_MEMBERS" | "ADMINISTRATOR" | "MANAGE_CHANNELS" | "MANAGE_GUILD" | "ADD_REACTIONS" | "VIEW_AUDIT_LOG" | "PRIORITY_SPEAKER" | "STREAM" | "VIEW_CHANNEL" | "SEND_MESSAGES" | "SEND_TTS_MESSAGES" | "MANAGE_MESSAGES" | "EMBED_LINKS" | "ATTACH_FILES" | "READ_MESSAGE_HISTORY" | "MENTION_EVERYONE" | "USE_EXTERNAL_EMOJIS" | "VIEW_GUILD_INSIGHTS" | "CONNECT" | "SPEAK" | "MUTE_MEMBERS" | "DEAFEN_MEMBERS" | "MOVE_MEMBERS" | "USE_VAD" | "CHANGE_NICKNAME" | "MANAGE_NICKNAMES" | "MANAGE_ROLES" | "MANAGE_WEBHOOKS" | "MANAGE_EMOJIS")[] | undefined, type?: string): string[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Intl.ListFormat('en-US', {
      style: 'short',
      type: type || 'conjunction'
    }).format(array)
  }

  public randomize (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
  }

  public toNum (text: string): number {
    return parseInt(text?.toString().replace(/[^\d]/g, ''), 10)
  }
}
