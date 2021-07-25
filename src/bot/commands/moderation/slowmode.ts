import Command from '@classes/Command'
import { Message } from 'discord.js'
import ms from 'ms'
import { humanizeDuration } from '../../index'

export default class SlowMode extends Command {
  async run (message: Message, [time]: string[]): Promise<void | Message> {
    const { no_time, max_slow, set_time, only_text } = this.language.commands.slow_mode.parameters
    if (message.channel.type === 'text') {
      if (!time) return this.embed.error(no_time, message)
      const slow_mode = ms(time) || ['disable', 'false', 'off', 'выключить', '0'].includes(time) ? 0 : 5000
      if (slow_mode / 1000 > 21600) return this.embed.error(max_slow, message)
      await message.channel.setRateLimitPerUser(slow_mode / 1000)
      if (slow_mode === 0) {
        return this.embed.okay(set_time.translate({
          channel: message.channel,
          args: 'disabled'
        }), message)
      }
      return this.embed.okay(set_time.translate({
        channel: message.channel,
        args: humanizeDuration.humanize(slow_mode, {
          round: true,
          language: 'en'
        })
      }), message)
    } else return this.embed.error(only_text, message)
  }
}
